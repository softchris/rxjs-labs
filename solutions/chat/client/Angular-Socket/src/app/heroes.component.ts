import { Component } from '@angular/core';

@Component({
    selector : 'heroes',
    template : `
        <div *ngFor="let hero of heroes" >
            {{ hero.name }}
        </div>
    `
})
export class HeroesComponent {
    heroes:Hero[];

    constructor(){
        this.heroes = [
            { name : 'Luke' }
        ];
    }
}

class Hero{
    constructor(public name:string){}
}