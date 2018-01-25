import { HeroSearchComponent } from './hero-search.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HeroSearchService } from '../hero-search.service';
import { Hero } from '../hero';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

let MockHeroArray = <Array<Hero>>[
  {
    id: 1,
    name: 'Superman'
  },
  {
    id: 2,
    name: 'Batman'
  },
  {
    id: 3,
    name: 'IronMan'
  },
  {
    id: 4,
    name: 'Thor'
  }
];

describe('Component: HeroSearch', () => {
  let fixture: ComponentFixture<HeroSearchComponent>;
  let heroSearchService: HeroSearchService;
  let heroSearchComponent: HeroSearchComponent;
  let router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HeroSearchService, useValue: {
          search: () => {
            return Observable.of(MockHeroArray);
          }
        }
        },
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        }
      ],
      declarations: [
        HeroSearchComponent
      ],
      imports: [
        RouterTestingModule
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HeroSearchComponent);
        heroSearchComponent = fixture.componentInstance;
        router = TestBed.get(Router);
        heroSearchService = TestBed.get(HeroSearchService);
      });
  }));
  describe('Functional', () => {
    it('should update the searchTerms observable with the searched value when called', () => {
      let myTerm = 'some search term';
      spyOn(heroSearchComponent.searchTerms, 'next');
      heroSearchComponent.search(myTerm);
      expect(heroSearchComponent.searchTerms.next).toHaveBeenCalled();
      expect(heroSearchComponent.searchTerms.next).toHaveBeenCalledTimes(1);
      expect(heroSearchComponent.searchTerms.next).toHaveBeenCalledWith(myTerm);
    });
    it('should navigate to the detail page for the hero.id of the hero passed in.', () => {
      spyOn(router, 'navigate');
      heroSearchComponent.gotoDetail(MockHeroArray[ 0 ]);
      expect(router.navigate).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith([ '/detail', MockHeroArray[ 0 ].id ]);
    });
  });
  describe('Structural', () => {
    it('should have 4 heroes in the results when heroes attribute has 4 in the array', () => {
      spyOn(fixture.componentInstance, 'ngOnInit').and.callFake(() => {
      });
      fixture.componentInstance.heroes = Observable.of(MockHeroArray);
      fixture.detectChanges();
      const renderedElement = fixture.nativeElement;
      expect(renderedElement.querySelectorAll('.search-result').length).toBe(MockHeroArray.length);
    });
  });
});
