import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeroService } from '../hero.service';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { Hero } from '../hero';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let MockHero: Hero = <Hero>{id: 1, name: 'Superman'};
let MockHero2: Hero = <Hero>{id: 2, name: 'Iron Man'};
let MockHero3: Hero = <Hero>{id: 3, name: 'Thor'};
let MockHero4: Hero = <Hero>{id: 4, name: 'Hulk'};
let MockHero5: Hero = <Hero>{id: 5, name: 'Spiderman'};
let MockHeroesArray: Array<Hero> = [ MockHero, MockHero2, MockHero3, MockHero4, MockHero5 ];
describe('Component: HeroSearch', () => {
  let elementFixture: ComponentFixture<DashboardComponent>;
  let heroService: HeroService;
  let dashboardComponent: DashboardComponent;
  let router: Router;
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
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ],
      declarations: [
        DashboardComponent
      ],
      imports: [
        FormsModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents()
      .then(() => {
        elementFixture = TestBed.createComponent(DashboardComponent);
        dashboardComponent = elementFixture.componentInstance;
        heroService = TestBed.get(HeroService);
        router = TestBed.get(Router);
      });
  }));
  describe('Functional: ', () => {
    it('should go to link for hero based on hero.id passed in', () => {
      dashboardComponent.gotoDetail(MockHero);

      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([ '/detail', MockHero.id ]);
    });

    it('should display 4 heroes when getHeroes returns more than 4', () => {
      spyOn(heroService, 'getHeroes').and.callFake(() => {
        return {
          then: function (callback) {
            return callback(MockHeroesArray);
          }
        };
      });

      dashboardComponent.ngOnInit();

      expect(heroService.getHeroes).toHaveBeenCalled();
      expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
      expect(dashboardComponent.heroes.length).toBe(4);
    });

    it('should display one less than count of heroes returned when getHeroes returns less than 4', () => {
      let expectedHeroArray = [ MockHero, MockHero2 ];
      spyOn(heroService, 'getHeroes').and.callFake(() => {
        return {
          then: function (callback) {
            return callback(expectedHeroArray);
          }
        };
      });

      dashboardComponent.ngOnInit();

      expect(heroService.getHeroes).toHaveBeenCalled();
      expect(heroService.getHeroes).toHaveBeenCalledTimes(1);
      expect(dashboardComponent.heroes.length).toBe(expectedHeroArray.length - 1);
    });

  });
});
