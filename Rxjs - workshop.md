# Rxjs workshop

## build your own ngrx

### Step 1 Basics

Reducers, Dispatcher, Subject + Light implementation of Store

### Step 2 

Scan operator, updated store implementation = everything works

### Step 3 

Projection

#### Step 4 middleware



store implementation

reducer

Middleware

Select - slicing state with map

managing updates

## build a chat application with sockets

## build your own auto complete, infinite scroll

## build your own Siri

Premise :

Someone built a speech API app in jquery and with promises. You know there is a better way with Angular 2 and Rxjs. Your job is to improve said app. Let's first look at how to synthesize speech and capture audio.

Wrap observable:

```
asyncFunction(){
  return Rx.Observable.create((observer) => {)
     let a = 3;
     setTimeout(() => {
       a = 4;
       observer.next(a);
     },2000)
  });
}

asyncFunction().subscribe( data => console.log(data) )
```

Capture audio:

```
const speech = new webkitSpeechRecognition(); 
speech.onresult = (e) => { 
   speech.stop();
   console.log(e.results[0][0].transcript);
}; 

speech.start(); 
```

Synthesize speech:

```
const utterance = new SpeechSynthesisUtterance(text); 
utterance.onend = (e) => { 
// you might want to halt operations 'onend' has happened 
}; 
speechSynthesis.speak(utterance);
```

1) Objective I - translate to Observables and and Angular 2 app.

Suggested output:

> what is my favourite colour?
>
> **blue**

2) Objective II - Give it a memory function

> what is my favourite colour?
>
> **I don't know the answer, can you tell me?**
>
> yes
>
> **Go ahead**
>
> blue
>
> **I saved your answer, ask me again**

old code ( in jQuery and Promises ):

