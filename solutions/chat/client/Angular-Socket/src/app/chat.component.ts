import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Message } from './message.model';

@Component({
    selector: 'chat',
    styleUrls: ['./chat.component.css'],
    template: `
        <h3 style="float:right">User: {{from}} <span *ngIf="!from">-</span> </h3>
        <h4>Messages: </h4>
        <div *ngFor="let message of messages" class="message" >
         <strong>From: {{ message.from }}</strong> <br>
         Message : {{ message.text }} <br>
        
        </div>
        <div class="username">
            <input [(ngModel)]="newName" placeholder="username" />   
            <button (click)="changeName()" >Change name</button> 
        </div>
        <div class="input">
            <input [(ngModel)]="message" placeholder="message" />
            <button (click)="sendMessage()" >Send</button> <br> <br>
        </div>
        
            <i class="status">Status: {{status}}</i> <br>
            <h4>Active users: </h4>
            <div class="user" *ngFor="let user of users">
                {{user}}
            </div>
        
        
    `
})
export class ChatComponent implements OnInit, OnDestroy{
    message:string;
    messages = [];
    connection:Subscription;
    from:string;
    status:string;
    users:string[];
    newName:string;

    constructor(private chatService:ChatService){

    }

    ngOnInit(){
        this.connection = this.chatService
        .getMessages()
        .subscribe( message => {
            this.messages.push( message );
        });

        this.chatService
        .getStatusChange()
        .subscribe( data => {
            this.status = data.text;
            console.log('Status changed')
        })

        this.chatService
        .getUsers()
        .subscribe( data => {
            this.users = data;
        } )
    }

    ngOnDestroy(){
        this.connection.unsubscribe();
    }

    changeName(){
        this.chatService.changeName( this.newName );
        this.from = this.newName;
    }

    sendMessage(){
        this.chatService.sendMessage( this.message, this.from );
        this.message = '';
    }
}