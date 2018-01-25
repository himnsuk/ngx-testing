import { TestBed } from '@angular/core/testing';
import { LoadingStatusService } from './loading-status.service';

describe('LoadingStatusService', () => {
  let loadingStatus: LoadingStatusService;
  let status: boolean;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ LoadingStatusService ]
    });
  });
  beforeEach(() => {
    loadingStatus = new LoadingStatusService();
    loadingStatus.isLoading$.subscribe((newStatus: boolean) => {
      status = newStatus;
    });
  });
  it('should create', () => {
    expect(loadingStatus).toBeTruthy();
  });

  it('should set loading to true when startLoading is called', () => {
    expect(status).toBeFalsy();

    loadingStatus.startLoading();

    expect(status).toBeTruthy();
  });

  it('should set loading to false when stopLoading is called', () => {
    loadingStatus._isLoading.next(true);

    expect(status).toBeTruthy();

    loadingStatus.stopLoading();

    expect(status).toBeFalsy();
  });
});
