import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {
  private _loading: boolean = false;
  public loadingStatus:  Subject<boolean> = new Subject<boolean>();
  private startTime = Date;
  private endTime = Date;



  get loading():boolean {
    return this._loading;
  }

  public emitLoading(): void {
    this.loadingStatus.next(this.loading);
  }

  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  public startLoading(): void {
    this._loading = true;
  }

  public stopLoading(): void {
    this._loading = false;
  }
}
