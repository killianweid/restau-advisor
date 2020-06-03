import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {
  public loading: boolean = false;
  public loadingSubject = new Subject<boolean>();


  public emitLoading(): void {
    this.loadingSubject.next(this.loading);
  }

  public startLoading(): void {
    console.log("start loading");
    this.loading = true;
    this.emitLoading();
  }

  public stopLoading(): void {
    console.log("stop loading");
    this.loading = false;
    this.emitLoading();
  }
}
