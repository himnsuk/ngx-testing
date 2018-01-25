import { HeroSearchService } from './hero-search.service';
import { TestBed, inject } from '@angular/core/testing';
import { BaseRequestOptions, Http, RequestMethod, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Hero } from './hero';

let MockHero: Hero = <Hero>{id: 1, name: 'Superman'};
let MockHero2: Hero = <Hero>{id: 2, name: 'IronMan'};
let MockHeroesArray: Array<Hero> = [ MockHero, MockHero2 ];

describe('Service: HeroSearch', () => {
  let mockBackend: MockBackend;
  let heroSearchService: HeroSearchService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeroSearchService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        }
      ]
    });
  });

  beforeEach(inject([ MockBackend, Http ],
    (mb: MockBackend, http: Http) => {
      mockBackend = mb;
      heroSearchService = new HeroSearchService(http);
    }));

  it('should exist', () => {
    expect(heroSearchService).toBeTruthy();
  });

  it('should return observable with hero array', (done) => {
    let searchTerm = 'some term';
    mockBackend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.method).toEqual(RequestMethod.Get);
      expect(connection.request.url).toEqual('app/heroes/?name=some term');
      connection.mockRespond(new Response(new ResponseOptions({
        body: {data: MockHeroesArray}
      })));
    });
    heroSearchService.search(searchTerm).subscribe(result => {
      expect(result).toEqual(MockHeroesArray);
      done();
    });
  });
});
