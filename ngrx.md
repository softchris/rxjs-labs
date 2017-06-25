## build your own ngrx

ngrx is an implementation of Redux using RxJS.

It consists of different core concepts such as `Reducer`, `Dispatcher`, `Subject` and `Store`.

**NOTE:** The idea with this workshop lab is not to figure out how to solve it but more code along and understand how ngrx operates under the surface. Hopefully it gives some insights to the nature of Redux/ngrx

#### Suggested approach

- implement a `Reducer`, `Dispatcher`, `Subject` and a basic `Store`.
- add `scan()` operator to the store and test that everything works
- add projection using the `map()` operator

#### Helpful code

**Example dispatcher**

```javascript
class Dispatcher extends Rx.Subject {
    dispatch( obj ){
        this.next(obj)
    }
};

module.exports = Dispatcher;

let dispatcher = new Dispatcher();
dispatcher.dispatch('nobody listens');

dispatcher.subscribe( (data) => console.log('dispatched', data) );

dispatcher.dispatch(1);
```

**Example reducer**

```
//reduce() function on values
const arr = [1,2,3];
const total = arr.reduce( (acc,curr) => {
    return acc + curr
})

console.log('total', total);

// reduce() function on object
const personInfo = [{name: 'Joe'}, {age: 31}, {birthday: '1/1/1985'}];

const fullPerson = personInfo.reduce((accumulator, current) => {
 return Object.assign({}, accumulator, current)
});

// //Redux-Style Reducer
const personReducer = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INFO':
      return Object.assign({}, state, action.payload)
    default:
      return state;
  }
}
```

**Example store**

Using a BehaviourSubject for our store we are able to remember the last state. So if a new subscriber joins later it is able to pick up on that value.

```javascript
class Store extends Rx.BehaviorSubject {
    constructor(initialState){
        super(initialState);
    }
}

let store = new Store();

// but not this
store.next(-1);

// will remember the last thing that happened
store.next(0);
console.log('current value', store.getValue());

let sub1 = store.subscribe((data) => console.log(data));


store.next(1);
let sub2 = store.subscribe((data) => console.log(data));
```

#### Adding a scan operator - TLDR;

Here comes a lengthy explanation of `scan()` operator and the `combineReducers()` function. It's lengthy because the latter is key in understanding how we can write different reducer functions but make everything work together.

To be able to have a functioning store we need to go back to the concept of reducing our state. Using a reducer will be able to do that. But we need a way to apply the reducer so it sticks. Let's look at the past code:

```
// reduce() function on object
const personInfo = [{name: 'Joe'}, {age: 31}, {birthday: '1/1/1985'}];

const fullPerson = personInfo.reduce((accumulator, current) => {
 return Object.assign({}, accumulator, current)
});

const personReducer = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INFO':
      return Object.assign({}, state, action.payload)
    default:
      return state;
  }
}

// and combining the two we get:
const fullPerson2 = personInfo.reduce((accumulator, current) => {
 return personReducer( accumulator, { type : 'ADD_INFO', payload : current } )
});
```

 The `scan()` operator does the same thing as call a `reduce()` but we can use it on a subject.

```
subject.scan( (state, action) => reducer(state, action), initialState )
```

So essentially this means we can call our subject like so:

```
let initialState = {}
let subject = new Rx.Subject(initialState);

let stream$ = subject.scan((state, action) => personReducer(state, action), initialState);
stream$.subscribe((data) => console.log('store',data));

subject.next({ type : 'ADD_INFO', payload : { name : 'chris' } })
```

This will give us:

```
{ name : 'chris' }
```

This however isn't really scalable, note that we are using `personReducer`.  What if we want to add several reducers to our store. We need a way to combine them:

```
const personReducer = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INFO':
      return Object.assign({}, state, action.payload)
    default:
      return state;
  }
}

const listReducer = ( state = [], action) => {
  switch(action.type) {
    case 'ADD':
    	return [ ...state, Object.assign({}, action.payload)  ];
    default:
    	return state;
  }
}

let combined = combineReducers( { person : personReducer, list : listReducer } );

```

if we use `combined` as argument like this:

```
let stream$ = subject.scan((state, action) => combined(state, action), initialState);
```

then the idea is that the proper action should be invoked when we call 'ADD_INFO' or 'ADD'. What we know from looking at the usage of `combined` is that it's used as a function:

```
combined(state, action)
```

with two arguments, i.e `combineReducers` must produce a function so let's start sketching at that function:

```
function combineReducers(reducers){  // reducers = {}
	return function(state,action){
      
	}
} 
```

we probably want the inner function to invoke all reducers and apply one result after another. When we apply one result after another that means we are reducing everything into one result example:

```
//reducing
{ a: 3 }
{ b : 2 }
//result
{ a: 3, b : 2 }
```

we however know that our reducers should have unique action names so if someone calls 'ADD' we know it's the list reducer they mean to invoke. As we now know a little bit more on the inner nature of the inner function we can add the following to it:

```
function combineReducers(reducers){  // reducers = {}
	return function(state,action){
      Object.keys(reducers).reduce( acc, curr ) {
        acc[curr] = reducers[curr](state[curr],action); 
        return acc;
      },{})
	}
} 
```

Ok, that was a lot at once, lets go through it, step by step.

```
Object.keys(reducers).reduce( acc, curr ) {
        acc[curr] = reducers[curr](state[curr],action); 
        return acc;
},{})
```

We call reducer on a list looking like this `{ person : personReducer, list : listReducer }`.

```
acc[curr] = reducers[curr](state[curr],action)
```

Our reduce starts with a start value of `{}` that we add to by calling:

```
reducers[curr](state[curr],action)
```

`reducers[curr]` is like calling `reducers['person']` which is a function aka our `personReducer`.

we then invoke said function with parameters `state[curr]` and `action`. Imagine we had called our reducer manually like this:

```
personReducer(currentState, action) // currentState = {}, action = { type : 'type', payload : {} }
```

Given an example input of:

```
personReducer({}, { type : 'ADD_INFO', payload : { name : 'chris' } })
```

this will ensure that 

```
acc[curr] = reducers[curr](state[curr],action);
```

is assigned `{ person : { name : 'chris' }, list : [] }` with above input example. 

**NOTE:** all reducers are invoked, if the action.type matches a reducer we get something back other than the default value and because we call it with action 'ADD_INFO' we get ` { name : 'chris' }` merged in. But because there is no matching action for our listReducer it responds with default value `[]`.

#### Code so far with scan operator

Setting up `Dispatcher`, `Store`, `Reducers` and `combineReducers` function.

```
class Dispatcher extends Rx.Subject{
  dispatch(value) {
    this.next(value);
  }
}

const combineReducers = reducers => (state = {}, action) => {
  return Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](state[key], action);
    return nextState;
  }, {});
};

class Store extends Rx.BehaviorSubject{
  constructor(
    dispatcher,
    reducer,
    initialState = {}
  ){
    super(initialState);
    this.reducer = reducer;
    this.dispatcher = dispatcher;

    this.dispatcher 
       .scan((state, action) => this.reducer(state, action), initialState)
       .subscribe(state => super.next(state));
  }

  dispatch(value){
    this.dispatcher.dispatch(value);  
  }

   next(value){
     this.dispatcher.dispatch(value);
   }
}

// reducers
const personReducer = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INFO':
      return Object.assign({}, state, action.payload)
    default:
      return state;
  }
}

const inventoryReducer = ( state = [], action ) => {
    switch(action.type) {
        case 'ADD_INV':
            return [
                ...state,
                Object.assign({},action.payload)
            ]
        default:
            return state;
    }
}


```

Creating the store and dispatch the first data

```
const appReducer = combineReducers({
   person : personReducer, 
   inventory : inventoryReducer
});

const dispatcher = new Dispatcher();
const store = new Store(dispatcher, appReducer, { inventory: [{ name : 'potion'}] });
const subscriber = store.subscribe(val => console.log('FROM STORE', val));

// dispatch
dispatcher.dispatch({
  type: 'ADD_INV', 
  payload: {
    name : 'potion'
  }
});

dispatcher.dispatch({
  type: 'ADD_INFO', 
  payload: {
    goal: 'Build your own ngrx'
  }
});
```



#### Adding projection

Adding projection is the same as accessing part of the state or `slice of state`. Becuae our state is an object `{}`, accessing part of it should be as easy as doing something like this:

```
// given state
const state = { name : 'Yoda', age : 999 }
// accessing state
state['name']  // Yoda
```

This is almost true. Remember our Store is a BehaviourSubject and thereby we use operator to access any state or part of it. The operator that allows us to access part of the state is the projection operator `map()`. 

Lets add that piece of functionality to the store:

```
class Store extends Rx.BehaviorSubject{
  // omitted the rest for brevity
  select( prop ) {
    this.map( state => state[prop] )
  }
}
```

And to listen to that `slice of state`.

You just type:

```
store
.select('person')
.subscribe( data => console.log('PERSON', person));
```



