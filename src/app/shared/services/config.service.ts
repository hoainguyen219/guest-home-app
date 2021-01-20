import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  searchType$: ReplaySubject<number> = new ReplaySubject<number>();
  contactMessage$: Subject<{}> = new  Subject<{}>();


  constructor(
    private router: Router
  ) { }

  changeSearchType(type: number): void {
    this.searchType$.next(type);
  }

  contactToUser(userId): void {
    this.contactMessage$.next({userId});
  }
}
