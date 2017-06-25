// capture scroll event
// determine when 70% of container has been scrolled
// determine up or down scroll
// figure out page to request
// perform request with page as argument
// display data
let page = 1;
const scrollElem = document.getElementById('scroll');
const sroll$ = Rx.Observable
.fromEvent(scrollElem,'scroll')
.map( e => ({ 
    scrollHeight: e.target.scrollHeight,
    scrollTop: e.target.scrollTop,
    clientHeight: e.target.clientHeight
  }))
.pairwise()
.filter( points => {
    // is scrolling down
    return isScrollingDown(points) && isScrollExpectedPercent(points[1],70);
})
.switchMap(() => {
    return fetchNextPage(++page)
})
.subscribe( data => {
    // add captured data to list
    console.log('=== new page ====',data);
    var old = $('#scroll').html();
    $('#scroll').html( old + data );
});

function isScrollingDown(points){
    return points[0].scrollTop < points[1].scrollTop;
}

function fetchNextPage(page){
    return Rx.Observable.of(`content Page ${page} `);
}

function isScrollExpectedPercent(position, percent){
  console.log('scroll pos', position.scrollTop/ position.clientHeight);
  return ((position.scrollTop + position.clientHeight) / position.scrollHeight) > (percent/100)
};