import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {LoadingScreenService} from "../../services/loading-screen.service";

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements OnInit, OnDestroy {

  public loading: boolean;
  private loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingScreenService) { }

  public ngOnInit(): void {
    this.loadingSubscription = this.loadingScreenService.loadingSubject.subscribe(
      (loading:boolean) => this.loading = loading
    );
    this.loadingScreenService.emitLoading();
  }

  public ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

}
