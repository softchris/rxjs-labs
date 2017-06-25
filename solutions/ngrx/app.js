var Rx = require('rxjs/Rx');

class Dispatcher extends Rx.Subject{
  dispatch(value) {
    this.next(value);
  }
}

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
       //pre-middleware?
    
      /*
         Scan is a reduce over time. In the previous lesson we compared reduce to a                snowball rolling downhill, accumulating mass (or calculated value). Scan can be          thought of similarly, except the hill has no certain end. The accumulator (in            this case, state) will continue to collect until destroyed. This makes it the            ideal operator for managing application state.
       */
       .scan((state, action) => this.reducer(state, action), initialState)
    
       //post-middleware? 
       .subscribe(state => super.next(state));
  }

  dispatch(value){
    this.dispatcher.dispatch(value);  
  }

  next(value){
    this.dispatcher.dispatch(value);
  }

  select(prop) {
    return this.map( state => state[prop]);
  }
}

const combineReducers = reducers => (state = {}, action) => {
  return Object.keys(reducers).reduce((nextState, key) => {
    nextState[key] = reducers[key](state[key], action);
    return nextState;
  }, {});
};

//Add a few basic reducers
const person = (state = {}, action) => {
  switch(action.type){
    case 'ADD_INFO':
      return Object.assign({}, state, action.payload)
    default:
      return state;
  }
}

const hoursWorked = (state = 0, action) => {
  switch(action.type){
    case 'ADD_HOUR':
      return state + 1;
    case 'SUBTRACT_HOUR':
      return state - 1;
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

//this is handled behind the scenes with @ngrx/store provideStore
const appReducer = combineReducers({person, hoursWorked, inventory : inventoryReducer});

//create our store and dependencies
const dispatcher = new Dispatcher();
const store = new Store(dispatcher, appReducer, {hoursWorked: 10});
store
.select('person') 
.subscribe( data => {
  console.log('PERSON', data);
})

const subscriber = store.subscribe(val => console.log('VALUE FROM STORE:', val));

//dispatch a few actions
dispatcher.dispatch({
  type: 'ADD_INFO', 
  payload: {
    name: 'Brian', 
    message: 'Exploring Reduce!'
  }
});
dispatcher.dispatch({
  type: 'ADD_INFO', 
  payload: {
    goal: 'Build your own ngrx'
  }
});

dispatcher.dispatch({
  type: 'ADD_INV', 
  payload: {
    name : 'potion'
  }
});

dispatcher.dispatch({
  type: 'ADD_INV', 
  payload: {
    name : 'sword'
  }
});
