import { HeroService } from './hero.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Hero } from './hero';
import { Observable } from 'rxjs';

let MockHero: Hero = <Hero>{id: 1, name: 'Superman'};
let MockHero2: Hero = <Hero>{id: 2, name: 'IronMan'};
let MockHeroesArray: Array<Hero> = [ MockHero, MockHero2 ];
let mockBackend: MockBackend;
let heroService: HeroService;
let setup = (httpMock) => {
  TestBed.configureTestingModule({
    providers: [
      HeroService,
      MockBackend,
      BaseRequestOptions,
      {
        provide: Http,
        useFactory: (backend: MockBackend, options: BaseRequestOptions) => new httpMock(backend, options),
        deps: [ MockBackend, BaseRequestOptions ]
      }
    ]
  });
  inject([ MockBackend, Http ],
    (mb: MockBackend, http: Http) => {
      mockBackend = mb;
      heroService = new HeroService(http);
    })();
};

describe('Service: Hero', () => {
  it('should call handle error from the promise when getHeroes fails', (done) => {
    setup(MockFailedGetHeroesHttp);
    spyOn(heroService, 'handleError');

    heroService.getHeroes().then(() => {
      expect(heroService.handleError).toHaveBeenCalled();
      done();
    });
  });

  it('should return the heroes array from the promise when getHeroes succeeds', (done) => {
    setup(MockSuccessGetHeroesHttp);
    spyOn(heroService, 'handleError');

    heroService.getHeroes().then((heroes) => {
      expect(heroService.handleError).not.toHaveBeenCalled();
      expect(heroes).toEqual(MockHeroesArray);
      done();
    });
  });

  it('should return the hero based on passed in id from the promise when it succeeds', (done) => {
    setup(MockSuccessGetHeroesHttp);

    heroService.getHero(MockHero.id).then((hero) => {
      expect(hero).toEqual(MockHero);
      done();
    });
  });
});

class MockFailedGetHeroesHttp extends Http {
  constructor(backend, options) {
    super(backend, options);
  }

  get() {
    return Observable.throw('error');
  }
}

class MockSuccessGetHeroesHttp extends Http {
  constructor(backend, options) {
    super(backend, options);
  }

  get() {
    return Observable.from([ new Response(new ResponseOptions({body: {data: MockHeroesArray}})) ]);
  }
}
