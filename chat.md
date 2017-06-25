# build a chat application with sockets and rxjs

A chat application normally needs two parts. A server and a client(s).

#### Suggested approach

- create a client and server
- Ensure you have a connection up and running and that you can send message to the server

#### Things to implement

be able to send a message for all to see

list all messages

list all users in the chatroom

EXTRA, if you have time implement private messages

### Helpful code

#### The chat server

**index.js**

```
var express = require('express');
var app = express();
var http = require('http').Server(app);
//io
var io = require('socket.io')(http);

io.on('connection', (socket) => {
    socket.on('add-message', (message) => {
        io.emit('message', {
            type : 'new-message',
            text : message.text,
            from : message.from
        });
    })
});

http.listen(5000, () => {
    console.log('started at port 5000');
})
```

**package.json**

```
{
  "name": "node-chatserver",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start" : "node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.15.3",
    "socket.io": "^2.0.2"
  }
}
```

#### The client

The above gives the server code. To start creating the client code start by scaffolding a new Angular 4.x project

```
ng new AngularChatClient
```

in it's package.json and dependencies array enter the following:

```
"socket.io-client": "^2.0.2"
```

then do

```
npm install
```

Now create the following files `chatService.ts` and `chat.component.ts`

**chatService.ts**

```
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

export class ChatService{
    private url ='http://localhost:5000';
    private socket;

    constructor(){
        this.socket = io(this.url);
    }

    sendMessage(message, from){
        this.socket.emit('add-message',{
            text : message,
            from : from
        });
    }

    getMessages(){
        let observable = new Observable( observer => {
            
            this.socket.on('message', (data) => {
                observer.next( data );
            });

            return () => {
                this.socket.disconnect();
            }
        })

        return observable;
    }
}
```

What we can see here is that this

```
this.socket = io(this.url);
```

establishes connection with socket.io and the `getMessages()` method wraps the socket in an Observable.

To send messages we do:

```
this.socket.emit('add-message',{
   text : message,
   from : from
});
```

To recive messages we do:

```
this.socket.on('message', (data) => {
  //do something with data
});
```



