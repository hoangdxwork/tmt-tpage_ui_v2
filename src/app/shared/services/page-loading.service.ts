import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export class PageLoadingService {
  private loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public readonly loading = this.loading$.asObservable()
  constructor() { }

  show() {
    this.toggle(true);
  }
  hidden() {
    this.toggle(false);
  }
  toggle(flag: boolean) {
    this.loading$.next(flag);
  }
 
}
