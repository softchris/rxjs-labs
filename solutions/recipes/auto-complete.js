// capture keyup
//filter
// do ajax
// build list

let input = document.querySelector('input');

let stream$ = Rx.Observable.fromEvent(input, 'keyup')
.map( (ev) => {
    return ev.target.value;
})
.filter( text => {
    return text.length >= 3;
})
.distinctUntilChanged()
.switchMap( x => {
    // dod ajax
    return Rx.Observable.of(['test','test2','test3']);
});

stream$.subscribe( data => {
    console.log(data);
    var result = data
        .map( x => `<div>${x}</div>` )
        .reduce( (acc,curr) => acc + curr );

    $('#list').html(result); 
});

// or when it waits til you stop typing
let input2 = document.getElementById("2");

let stream2$ = Rx.Observable.fromEvent(input2, 'keyup')
.map( (ev) => {
    return ev.target.value;
})
.filter( text => {
    return text.length >= 3;
})
.debounceTime(2000)
.distinctUntilChanged()
.switchMap( x => {
    // dod ajax
    return Rx.Observable.from(searchWikipedia(x));
})
.map( result => {
    var content = '';
    result[1].forEach( (x,i) => {
        content += `<div>${x} : <a href="${result[3][i]}">link</a>`
    })

    return {
       'searchKey' : result[0],
        content : content

    }
});

stream2$.subscribe( data => {
    console.log(data);
    $('#list').html(data.content); 
})


function searchWikipedia (term) {
    return $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'opensearch',
        format: 'json',
        search: term
      }
    }).promise();
  }

// if you want to use some other source
  function getGithubInfo(user){
      $.ajax({
        url: `https://api.github.com/users/${user}/repos`,
        jsonp: true,
        method: "GET",
        dataType: "json",
        success: function(res) {
            console.log(res)
        }
    });
  }
