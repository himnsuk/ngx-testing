import { HeroDetailComponent } from './hero-detail.component';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';
import { MockBackend } from '@angular/http/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Hero } from '../hero';
import { Observable } from 'rxjs';

let MockHero: Hero = <Hero>{id: 1, name: 'Superman'};

describe('Component: HeroDetail', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let heroService: HeroService;
  let heroDetailComponent: HeroDetailComponent;
  let activatedRoute: ActivatedRoute;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        }
      ],
      declarations: [
        HeroDetailComponent
      ],
      imports: [
        FormsModule,
        RouterTestingModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroDetailComponent);
        heroDetailComponent = fixture.componentInstance;
        heroService = TestBed.get(HeroService);
        activatedRoute = TestBed.get(ActivatedRoute);
      });
  }));

  describe('Functional: ', () => {
    it('should call emit with hero when goBack is called with a hero', () => {
      heroDetailComponent.hero = MockHero;
      spyOn(heroDetailComponent.close, 'emit');
      spyOn(window.history, 'back');

      heroDetailComponent.goBack(MockHero);

      expect(heroDetailComponent.close.emit).toHaveBeenCalled();
      expect(heroDetailComponent.close.emit).toHaveBeenCalledWith(MockHero);
      expect(heroDetailComponent.close.emit).toHaveBeenCalledTimes(1);
      expect(window.history.back).not.toHaveBeenCalled();
    });

    it('should emit close without saved hero when goBack is called directly', () => {
      spyOn(heroDetailComponent.close, 'emit');
      spyOn(window.history, 'back');

      heroDetailComponent.goBack();

      expect(heroDetailComponent.close.emit).toHaveBeenCalled();
      expect(heroDetailComponent.close.emit).toHaveBeenCalledTimes(1);
      expect(window.history.back).not.toHaveBeenCalled();
    });

    it('should attempt to save the hero when save is called and navigate to hero when save successful', (done) => {
      heroDetailComponent.hero = MockHero;
      spyOn(heroDetailComponent, 'goBack');
      spyOn(heroService, 'save').and.callFake(() => {
        return Promise.resolve(MockHero);
      });

      heroDetailComponent.save().then(() => {
        expect(heroService.save).toHaveBeenCalled();
        expect(heroService.save).toHaveBeenCalledTimes(1);
        expect(heroService.save).toHaveBeenCalledWith(MockHero);
        expect(heroDetailComponent.hero).toEqual(MockHero);
        expect(heroDetailComponent.goBack).toHaveBeenCalled();
        expect(heroDetailComponent.goBack).toHaveBeenCalledTimes(1);
        expect(heroDetailComponent.goBack).toHaveBeenCalledWith(MockHero);
        done();
      });
    });

    it('should attempt to save the hero when save is called and display error when save errors', (done) => {
      heroDetailComponent.hero = MockHero;
      const errorMsg = 'Some Error';
      spyOn(heroDetailComponent, 'goBack');
      spyOn(heroService, 'save').and.callFake(() => {
        return Promise.reject(errorMsg);
      });

      heroDetailComponent.save().then(() => {
        expect(heroService.save).toHaveBeenCalled();
        expect(heroService.save).toHaveBeenCalledTimes(1);
        expect(heroService.save).toHaveBeenCalledWith(MockHero);
        expect(heroDetailComponent.hero).toEqual(MockHero);
        expect(heroDetailComponent.goBack).not.toHaveBeenCalled();
        expect(heroDetailComponent.error).toBe(errorMsg);
        done();
      });
    });

    it('should emit close without saved hero when goBack is called directly and go back when navigated is true', () => {
      heroDetailComponent.navigated = true;
      spyOn(heroDetailComponent.close, 'emit');
      spyOn(window.history, 'back');

      heroDetailComponent.goBack();

      expect(heroDetailComponent.close.emit).toHaveBeenCalled();
      expect(heroDetailComponent.close.emit).toHaveBeenCalledTimes(1);
      expect(window.history.back).toHaveBeenCalled();
      expect(window.history.back).toHaveBeenCalledTimes(1);
    });

    it('should create a new hero and set navigated false when initialized without route id param', () => {
      expect(heroDetailComponent.hero).not.toBeDefined();

      heroDetailComponent.ngOnInit();

      expect(heroDetailComponent.navigated).toBeFalsy();
      expect(heroDetailComponent.hero).toEqual(new Hero());
    });

    it('should set the hero to the hero for the id and set navigated false when initialized with route id param', () => {
      expect(heroDetailComponent.hero).not.toBeDefined();
      activatedRoute.params = Observable.of({'id': 1});
      spyOn(heroService, 'getHero').and.callFake(() => {
        return {
          then: function (callback) {
            return callback(MockHero);
          }
        };
      });

      heroDetailComponent.ngOnInit();

      expect(heroDetailComponent.navigated).toBeTruthy();
      expect(heroDetailComponent.hero).toEqual(MockHero);
    });
  });
});
