import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subscription } from 'rxjs';
import { Hostel } from '../../interfaces/hostel';

@Component({
  selector: 'app-hostel-base',
  template: '',
  styles: [
  ]
})
export class HostelBaseComponent implements OnInit {
  public filterHostel: Hostel[];
  public displayHostels: Hostel[];

  public currentPage: number;
  public pageSize = 10;
  public sub$: Subscription;

  public currentUser$: Observable<any>;
  public selectedHostel: Hostel;
  public dateSearching;

  constructor(
  ) { }

  ngOnInit(): void {

  }

  // function
  toDetailHostel(id, router: Router): void {
    window.open(`http://localhost:4200/hostel/detail/${id}`, '_blank');
  }

  filterHostelsByPage(hostels, page): void {
    this.currentPage = page;
    this.displayHostels = hostels.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
  }

    // date
    filterDateList(date: Date): boolean {
      const checkDate = moment(date);
      const dateRangeFilter =  JSON.parse(localStorage.getItem('filterDate'));
      const isContains = dateRangeFilter.every(dateRange => !checkDate.isBetween(dateRange.fromDate, dateRange.toDate, undefined, '[]'));
      return isContains;
    }
}
