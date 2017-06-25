import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Message } from './message.model';

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

    changeName(newName:string){
        this.socket.emit('rename', {
            text : newName
        })
    }

    getStatusChange(): Observable<Message>{
        return new Observable( observer => {
            this.socket.on('renamed', (data) => {
                observer.next( data );
            })
        })
    }

    getUsers(): Observable<string[]>{
        return new Observable( observer => {
            this.socket.on('users', (data) => {
                observer.next( data.users );
            })
        })
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