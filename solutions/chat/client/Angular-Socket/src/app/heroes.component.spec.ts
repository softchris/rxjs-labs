import { TestBed, async } from '@angular/core/testing';

import { HeroesComponent } from './heroes.component';

beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent
      ],
    }).compileComponents();
}));

describe('heroes component',() => {

    //testing if component can be created
    it('should create heroes component', async(() => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const heroes = fixture.debugElement.componentInstance;
        expect(heroes).toBeTruthy();
    }));  

    // test if property exists
    it(`should have heroes property`, async(() => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const heroes = fixture.debugElement.componentInstance;
        expect(heroes.heroes).toBeTruthy();
    }));

    // test if property holds anticipated elements
    it(`should have heroes property`, async(() => {
        const fixture = TestBed.createComponent(HeroesComponent);
        const heroes = fixture.debugElement.componentInstance;
        expect(heroes.heroes.length).toEqual(1);
    }));
})
