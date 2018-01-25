import { HeroesComponent } from './heroes.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { FormsModule } from '@angular/forms';
import { Hero } from '../hero';

let MockHero: Hero = <Hero>{id: 1, name: 'Superman'};
let MockHero2: Hero = <Hero>{id: 2, name: 'IronMan'};
let MockHeroesArray: Array<Hero> = [ MockHero, MockHero2 ];
let MockEvent: any = {
  stopPropagation: function () {
    return;
  }
};
describe('Component: HeroSearch', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: HeroService;
  let heroSearchComponent: HeroesComponent;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        }
      ],
      declarations: [
        HeroesComponent,
        HeroDetailComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroesComponent);
        heroSearchComponent = fixture.componentInstance;
        heroService = TestBed.get(HeroService);
        router = TestBed.get(Router);
      });
  }));
  describe('Functional: ', () => {
    it('should call getHeroes and set heroes to the returned object', (done) => {
      spyOn(heroService, 'getHeroes').and.callFake(() => {
        return Promise.resolve(MockHeroesArray);
      });

      heroSearchComponent.getHeroes().then(() => {
        expect(heroService.getHeroes).toHaveBeenCalled();
        expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
        expect(heroSearchComponent.heroes).toBe(MockHeroesArray);
        done();
      });
    });

    it('should call getHeroes and set heroes to the returned object', (done) => {
      const errorMsg = 'Some error';
      spyOn(heroService, 'getHeroes').and.callFake(() => {
        return Promise.reject(errorMsg);
      });
      heroSearchComponent.getHeroes().then(() => {
        expect(heroService.getHeroes).toHaveBeenCalled();
        expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
        expect(heroSearchComponent.error).toBe(errorMsg);
        done();
      });
    });

    it('should call deleteHeroes and delete hero from hero\'s array and set selected to ' +
      'null when the hero passed was the selected hero', (done) => {
      const errorMsg = 'Some error';
      spyOn(heroService, 'delete').and.callFake(() => {
        return Promise.resolve(errorMsg);
      });
      heroSearchComponent.heroes = MockHeroesArray;
      heroSearchComponent.selectedHero = MockHero;
      heroSearchComponent.deleteHero(MockHero, MockEvent).then(() => {
        expect(heroService.delete).toHaveBeenCalled();
        expect(heroService.delete).toHaveBeenCalledTimes(1);
        expect(heroService.delete).toHaveBeenCalledWith(MockHero);
        expect(heroSearchComponent.heroes).toEqual([ MockHero2 ]);
        expect(heroSearchComponent.selectedHero).toBeNull();
        done();
      });
    });

    it('should call deleteHeroes and delete hero from hero\'s array and not set selected to ' +
      'null when the hero passed was different than selected hero', (done) => {
      const errorMsg = 'Some error';
      spyOn(heroService, 'delete').and.callFake(() => {
        return Promise.resolve(errorMsg);
      });
      heroSearchComponent.heroes = MockHeroesArray;
      heroSearchComponent.selectedHero = MockHero2;
      heroSearchComponent.deleteHero(MockHero, MockEvent).then(() => {
        expect(heroService.delete).toHaveBeenCalled();
        expect(heroService.delete).toHaveBeenCalledTimes(1);
        expect(heroService.delete).toHaveBeenCalledWith(MockHero);
        expect(heroSearchComponent.heroes).toEqual([ MockHero2 ]);
        expect(heroSearchComponent.selectedHero).toBe(MockHero2);
        done();
      });
    });

    it('should catch if an error is thrown at delete', (done) => {
      const errorMsg = 'some error';
      heroSearchComponent.heroes = MockHeroesArray;
      spyOn(heroService, 'delete').and.callFake(() => {
        return Promise.reject(errorMsg);
      });

      heroSearchComponent.deleteHero(MockHero, MockEvent).then(() => {
        expect(heroService.delete).toHaveBeenCalled();
        expect(heroService.delete).toHaveBeenCalledTimes(1);
        expect(heroService.delete).toHaveBeenCalledWith(MockHero);
        expect(heroSearchComponent.heroes).toEqual(MockHeroesArray);
        expect(heroSearchComponent.error).toBe(errorMsg);
        done();
      });
    });

    it('should switch to add hero mode and clear selected hero when addHero is called', () => {
      expect(heroSearchComponent.addingHero).toBeFalsy();
      heroSearchComponent.selectedHero = MockHero;

      heroSearchComponent.addHero();

      expect(heroSearchComponent.addingHero).toBeTruthy();
      expect(heroSearchComponent.selectedHero).toBeNull();
    });


    it('should expect not to ball getHeroes when savedHero is null', () => {
      spyOn(heroSearchComponent, 'getHeroes');
      heroSearchComponent.addingHero = true;
      expect(heroSearchComponent.addingHero).toBeTruthy();

      heroSearchComponent.close(null);
      expect(heroSearchComponent.addingHero).toBeFalsy();
      expect(heroSearchComponent.getHeroes).not.toHaveBeenCalled();
    });

    it('should switch from add hero mode', () => {
      spyOn(heroSearchComponent, 'getHeroes');
      heroSearchComponent.addingHero = true;
      expect(heroSearchComponent.addingHero).toBeTruthy();

      heroSearchComponent.close(MockHero);

      expect(heroSearchComponent.addingHero).toBeFalsy();
      expect(heroSearchComponent.getHeroes).toHaveBeenCalled();
      expect(heroSearchComponent.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('should initialize and call getHeroes', () => {
      spyOn(heroSearchComponent, 'getHeroes');

      heroSearchComponent.ngOnInit();

      expect(heroSearchComponent.getHeroes).toHaveBeenCalled();
      expect(heroSearchComponent.getHeroes).toHaveBeenCalledTimes(1);
    });

    it('should set selected hero to the hero passed to onSelect', () => {
      heroSearchComponent.onSelect(MockHero);

      expect(heroSearchComponent.selectedHero).toBe(MockHero);
      expect(heroSearchComponent.addingHero).toBeFalsy();
    });

    it('should navigate to detail page for hero based on selected hero id', () => {
      heroSearchComponent.selectedHero = MockHero;

      heroSearchComponent.gotoDetail();

      expect(router.navigate).toHaveBeenCalledWith([ '/detail', MockHero.id ]);
    });
  });

  describe('Presentation:', () => {
    let heroesElement;
    beforeEach(() => {
      fixture.componentInstance.heroes = MockHeroesArray;
      fixture.detectChanges();
    });
    it('should have 2 hero-element\'s when heroes is populated', () => {
      heroesElement = fixture.nativeElement;
      expect(heroesElement.querySelectorAll('.hero-element').length).toBe(MockHeroesArray.length);
    });
    it('add the selected class to the selected hero and not other heroes', () => {
      heroesElement = fixture.nativeElement;
      spyOn(fixture.componentInstance, 'onSelect').and.callThrough();

      heroesElement.querySelectorAll('.hero-element')[ 0 ].click();

      fixture.detectChanges();
      let updatedElement = fixture.nativeElement;
      expect(fixture.componentInstance.onSelect).toHaveBeenCalled();
      expect(fixture.componentInstance.onSelect).toHaveBeenCalledTimes(1);
      expect(updatedElement.querySelectorAll('.hero-element')[ 0 ].parentNode.classList).toContain('selected');
      expect(updatedElement.querySelectorAll('.hero-element')[ 1 ].parentNode.classList).not.toContain('selected');
    });

    it('deleted the selected hero and not other heroes', () => {
      heroesElement = fixture.nativeElement;
      spyOn(fixture.componentInstance, 'deleteHero').and.callFake((hero: Hero, $event: any) => {
        fixture.componentInstance.heroes.splice(fixture.componentInstance.heroes.indexOf(hero), 1);
      });

      heroesElement.querySelectorAll('.hero-element')[ 0 ].parentElement.querySelectorAll('.delete-button')[ 0 ].click();

      expect(fixture.componentInstance.heroes.length).toBe(1);
      fixture.detectChanges();
      let updatedElement = fixture.nativeElement;
      expect(fixture.componentInstance.deleteHero).toHaveBeenCalled();
      expect(fixture.componentInstance.deleteHero).toHaveBeenCalledTimes(1);
      expect(fixture.componentInstance.deleteHero).toHaveBeenCalledWith(MockHero, jasmine.anything());
      expect(updatedElement.querySelectorAll('.hero-element').length).toBe(1);
    });

    it('should display the error message when an error is set', () => {
      heroesElement = fixture.nativeElement;
      expect(heroesElement.querySelectorAll('.error').length).toBe(0);

      fixture.componentInstance.error = 'something happened';

      fixture.detectChanges();
      let updatedElement = fixture.nativeElement;
      expect(updatedElement.querySelectorAll('.error').length).toBe(1);
    });

  });
});
