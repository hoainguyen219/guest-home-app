import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { Hostel } from 'src/app/shared/interfaces/hostel';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { HostelService } from 'src/app/shared/services/hostel.service';
declare var $: any;
@Component({
  selector: 'app-hostel-detail',
  templateUrl: './hostel-detail.component.html',
  styles: ['::ng-deep .cdk-overlay-container{  z-index: 1200 !important}']
})
export class HostelDetailComponent implements OnInit {
  public hostelDetail: Hostel;
  public range: FormGroup;
  public currentUser;
  public schedule$: Observable<any>;
  public sub$: Subscription;
  public dateSearching;
  public selectedHostel;
  constructor(
    private hostel: HostelService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private config: ConfigService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser$.value;
    const id = this.activatedRoute.snapshot.params.id;
    this.hostel.getHostels({}, id).subscribe(
      hostel => {
        this.hostelDetail = hostel;
      }
    );
    this.range = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });

  }

  contactUser(hostel): void {
    this.config.contactToUser(hostel.postBy);
  }

  filterDateList(date: Date): boolean {
    const checkDate = moment(date);
    if (localStorage.getItem('filterDate')) {
      const dateRangeFilter =  JSON.parse(localStorage.getItem('filterDate'));
      const isContains = dateRangeFilter.every(dateRange => !checkDate.isBetween(dateRange.fromDate, dateRange.toDate, undefined, '[]'));
      return isContains;
    }
    return true;
  }

  changeToDate(date) {
    this.dateSearching = {
      fromDate: this.range.value.start,
      toDate: this.range.value.end
    };
    this.dateSearching.dateDiff = moment(this.dateSearching.toDate).diff(moment(this.dateSearching.fromDate), 'days') + 1;
  }

  openBookingForm(hostel): void {
    this.selectedHostel = hostel;
    const dateRangeFilter = this.selectedHostel.schedule.map(schedule => {
      return {
        fromDate: moment(schedule.fromDate),
        toDate: moment(schedule.toDate)
      };
    });
    localStorage.setItem('filterDate', JSON.stringify(dateRangeFilter));
    if (localStorage.getItem('dateSelected')) {
      console.log(localStorage.getItem('dateSelected'));
      this.dateSearching = JSON.parse(localStorage.getItem('dateSelected'));
    } else {
      this.dateSearching = this.hostel.dateTime;
    }
    this.dateSearching.dateDiff = moment(this.dateSearching.toDate).diff(moment(this.dateSearching.fromDate), 'days') + 1;
    this.range.get('start').patchValue(this.dateSearching.fromDate);
    this.range.get('end').patchValue(this.dateSearching.toDate);
    this.range.updateValueAndValidity();

    const modalOptions = {
      keyboard: true,
    };

    console.log(this.range.value);
    $('#modalBooking').modal(modalOptions);
  }

  booking(hostel: Hostel): void {
    this.range.markAllAsTouched();
    if (this.range.invalid) {
      return;
    }
    const params = {
      userId: this.auth.currentUser$.value.user_id,
      fromDate: moment(this.range.value.start).format('YYYY-MM-DD'),
      toDate: moment(this.range.value.to).format('YYYY-MM-DD'),
      postId: hostel.postId,
    };

    this.sub$ = this.hostel.bookHostel(params).subscribe(
      val => {
        console.log('đặt phòng thành công');
        $('#modalBooking').modal('hide');
        localStorage.removeItem('filterDate');
        this.toastr.success('Quý khách đã đặt phòng thành công.', 'Thành công', {
          timeOut: 1500,
        });
      },
      err => {
        console.log('lỗi đặt phòng:', err);
        if (err.status === 400) {
          this.toastr.error('Phòng này đã được đặt trong khoảng thời gian bạn chọn.', 'Lỗi', {
            timeOut: 1500,
          });
        }
      }
    );
  }

  ngOnDestroy() {
    localStorage.removeItem('filterDate');
  }
}
