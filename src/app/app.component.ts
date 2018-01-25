import { Component } from '@angular/core';
import { LoadingStatusService } from './loading-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  isLoading = false;

  constructor(private loadingStatusService: LoadingStatusService) {
    loadingStatusService.isLoading$.subscribe((loadingStatus: boolean) => {
      this.isLoading = loadingStatus;
    });
  }
}
