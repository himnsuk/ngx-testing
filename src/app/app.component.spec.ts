import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingStatusService } from './loading-status.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('App: ng2-testing-demo', () => {
  let loadingStatus: LoadingStatusService;
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingStatusService
      ],
      declarations: [
        AppComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        loadingStatus = TestBed.get(LoadingStatusService);
        fixture.detectChanges();
      });
  }));

  describe('updates loading status for app when status service updates', () => {
    it('sets loading to true when loading status observable updates', () => {
      expect(component.isLoading).toBeFalsy();

      loadingStatus.startLoading();

      expect(component.isLoading).toBeTruthy();
    });
  });
});
