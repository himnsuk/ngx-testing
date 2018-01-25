import { TestBed, fakeAsync, inject, ComponentFixture, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { routes } from './app-routing.module';
import { UserAuthentication } from './user-authentication.service';
import { Component, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ShellComponent } from './shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroService } from './hero.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { LoadingStatusService } from './loading-status.service';
import { LoginComponent } from './login/login.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

describe('app-routing module', () => {
  describe('passing guard', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ AppRoutingTestingModule ],
        providers: [
          HeroService,
          {
            provide: UserAuthentication, useValue: {
            canActivate: () => {
              return true;
            }
          }
          }
        ]
      });
    });
    it('allows access to dashboard', fakeAsync(inject([ Router, Location ], (router: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      router.resetConfig(routes);
      router.navigate([ 'dashboard' ]);
      advance(fixture);
      expect(location.path()).toEqual('/dashboard');
    })));
    it('allows access to detail with ID', fakeAsync(inject([ Router, Location ], (router: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      router.resetConfig(routes);
      router.navigate([ 'detail', '123' ]);
      advance(fixture);
      expect(location.path()).toEqual('/detail/123');
    })));
    it('allows access to heroes', fakeAsync(inject([ Router, Location ], (router: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      router.resetConfig(routes);
      router.navigate([ 'heroes' ]);
      advance(fixture);
      expect(location.path()).toEqual('/heroes');
    })));
  });
  describe('failing guard', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ AppRoutingTestingModule ],
        providers: [
          HeroService,
          LoadingStatusService,
          UserAuthentication
        ]
      });
    });
    it('blocks access to dashboard', fakeAsync(inject([ Router, Location ], (r: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      r.resetConfig(routes);
      r.navigate([ 'dashboard' ]);
      advance(fixture);
      expect(location.path()).toEqual('/login');
    })));
    it('blocks access to detail', fakeAsync(inject([ Router, Location ], (r: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      r.resetConfig(routes);
      r.navigate([ 'detail', '123' ]);
      advance(fixture);
      expect(location.path()).toEqual('/login');
    })));
    it('blocks access to heroes', fakeAsync(inject([ Router, Location ], (r: Router, location: Location) => {
      const fixture = TestBed.createComponent(RootComponent);
      r.resetConfig(routes);
      r.navigate([ 'heroes' ]);
      advance(fixture);
      expect(location.path()).toEqual('/login');
    })));
  });
});

@Component({selector: 'app-simple-cmp', template: `simple`})
class SimpleComponent {
}

@Component({selector: 'app-root-cmp', template: `<router-outlet></router-outlet>`})
class RootComponent {
}

function advance(fixture: ComponentFixture<any>): void {
  tick();
  fixture.detectChanges();
}

@NgModule({
  imports: [ RouterTestingModule, CommonModule, RouterTestingModule.withRoutes([ {
    path: 'simple',
    component: SimpleComponent
  } ]) ],
  entryComponents: [
    SimpleComponent,
    RootComponent,
    DashboardComponent,
    ShellComponent,
    HeroDetailComponent,
    HeroesComponent,
    LoginComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [
    MockBackend,
    BaseRequestOptions,
    {
      provide: Http,
      useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
      deps: [ MockBackend, BaseRequestOptions ]
    }
  ],
  exports: [
    SimpleComponent,
    RootComponent
  ],
  declarations: [
    ShellComponent, DashboardComponent, LoginComponent, HeroesComponent, HeroDetailComponent,
    SimpleComponent,
    RootComponent
  ]
})
class AppRoutingTestingModule {
}
