import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoadingStatusService } from '../loading-status.service';
import { UserAuthentication } from '../user-authentication.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loadingStatus: LoadingStatusService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        LoadingStatusService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loadingStatus = TestBed.get(LoadingStatusService);
        router = TestBed.get(Router);
      });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should trigger loading on loading service', () => {
      spyOn(loadingStatus, 'startLoading');
      component.login();

      expect(loadingStatus.startLoading).toHaveBeenCalled();
      expect(loadingStatus.startLoading).toHaveBeenCalledTimes(1);
    });
    it('should set loggedIn status to true', (done) => {
      component.login();
      setTimeout(() => {
        expect(UserAuthentication.loggedIn).toBeTruthy();
        done();
      }, 500);
    });
    it('should navigate to dashboard', (done) => {
      component.login();
      setTimeout(() => {
        expect(router.navigate).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([ 'dashboard' ]);
        done();
      }, 500);
    });
  });
});
