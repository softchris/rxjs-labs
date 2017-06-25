## build your own auto complete + infinite scroll

### auto complete

This task is about creating an auto complete function.

The auto complete per say operates in three different steps:

- collect user input
- do ajax call 
- build list based on response

The first point has more steps than that though. You can have two different approaches here

- do ajax call has soon as 3 or more characters have been entered
- do ajax call once the user has stopped typing for x miliseconds

#### Suggested approach

Try to perform this task in steps, suggestly these:

- listen to keyup events from an input
- dig out the value you need (HINT map() )
- perform ajax call based on input ( HINT switchMap )

#### Helpful code

code for listening to keyup event

```
const elem = document.getElementById('input');
Rx.Observable.fromEvent(elem,'keyup')
```



The below code helps you to search wikipedia

```
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
```



### infinite scroll

This task is about keep loading data if the user is scrolling downwards. 

#### Suggested approach

Try splitting up the task in parts like this:

- capture scroll events
- determine if we are scrolling up or down
- determine wether we scrolled enough

#### Helpful code

**app.js**

```javascript
const elem = document.getElementById('scroll');
Rx.Observable.fromEvent(elem,'scroll')
```

**index.html**

```Html
<html>
    <body>
        <input type="text" placeholder="no debounce">
        <input type="text" id="2" placeholder="using debounce">
        <div id="list">

        </div>

        <div id="scroll" 
            style="overflow: scroll;
            height: 100px;
            width:100px;
            border:solid 2px;">
            RxJs is awesome. It lets you combine different async types. This means we get rich composition thanks to Observables and operators.
        </div>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://unpkg.com/rxjs/bundles/Rx.min.js"></script>
        <script src="app.js"></script>
    </body>
</html>
```



## 