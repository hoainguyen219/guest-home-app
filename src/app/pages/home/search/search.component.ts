import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { HostelBaseComponent } from 'src/app/shared/components/hostel-base/hostel-base.component';
import { Hostel } from 'src/app/shared/interfaces/hostel';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { HostelService } from 'src/app/shared/services/hostel.service';

declare var $: any;
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: ['::ng-deep .cdk-overlay-container{  z-index: 1200 !important}']
})
export class SearchComponent extends HostelBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input() hostels: Hostel[];

  // filter;
  public utilies: string[] = [];
  public priceType: string;
  public range: FormGroup;
  constructor(
    private router: Router,
    private auth: AuthService,
    private hostel: HostelService,
    private toastr: ToastrService,
    readonly formBuilder: FormBuilder,
    private config: ConfigService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.hostels?.currentValue) {
      this.currentPage = 0;
      this.priceType = '';
      this.utilies = [];
      this.filterHostel = this.hostels;
      this.filterHostelsByPage(this.filterHostel, this.currentPage);
    }
  }

  ngOnInit(): void {
    this.currentPage = 0;
    this.currentUser$ = this.auth.currentUser$;
    this.range = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  getScheduleListById(postId) {
    this.hostel.getScheduleListById({postId}).subscribe(
      val => {
        const dateRangeFilter = val.map(schedule => {
          return {
            fromDate: moment(schedule.fromDate),
            toDate: moment(schedule.toDate)
          };
        });
        localStorage.setItem('filterDate', JSON.stringify(dateRangeFilter));
      }
    );
  }

  async openBookingForm(hostel) {
    await this.getScheduleListById(hostel.postId);
    this.dateSearching = this.hostel.dateTime;
    this.range.get('start').patchValue(moment(this.dateSearching.fromDate));
    this.range.get('end').patchValue(moment(this.dateSearching.toDate));
    this.dateSearching.dateDiff = moment(this.dateSearching.toDate).diff(moment(this.dateSearching.fromDate), 'days') + 1;
    this.selectedHostel = hostel;
    const modalOptions = {
      keyboard: true,
    };
    $('#modalBooking').modal(modalOptions);
  }

  booking(hostel: Hostel): void {
    const params = {
      userId: this.auth.currentUser$.value.user_id,
      fromDate: moment(this.range.value.fromDate).format('YYYY-MM-DD'),
      toDate: moment(this.range.value.toDate).format('YYYY-MM-DD'),
      postId: hostel.postId,
    };
    this.sub$ = this.hostel.bookHostel(params).subscribe(
      val => {
        console.log('đặt phòng thành công');
        $('#modalBooking').modal('hide');
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

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }


  // Filter theo dữ liệu
  filterHostelsByUtilies(utility): void {
    const index = this.utilies.indexOf(utility);
    if (index > -1) {
      this.utilies.splice(index, 1);
    } else {
      this.utilies.push(utility);
    }
    this.filterHostelData();
  }

  filterHostelsByPrice(type): void {
    this.priceType = type;
    this.filterHostelData();
  }

  filterHostelData(): void {
    let hostels = this.hostels;

    if (this.utilies) {
      hostels = hostels.filter(hostel => this.utilies.every(ultility => hostel[ultility] === 1));
    }

    if (this.priceType) {
      switch (this.priceType) {
        case 'low':
          hostels.sort((hostelA, hostelB) => hostelA.price - hostelB.price);
          break;
        case 'high':
          hostels.sort((hostelA, hostelB) => hostelB.price - hostelA.price);
          break;
        default:
          break;
      }
    }

    this.filterHostel = hostels;
    this.filterHostelsByPage(this.filterHostel, 0);
  }

  changePages(page): void {
    this.filterHostelsByPage(this.filterHostel, page.pageIndex);
  }

  contactUser(hostel) {
    this.config.contactToUser(hostel.postBy);
  }

  changeToDate(date) {
    this.dateSearching = {
      fromDate: this.range.value.start,
      toDate: this.range.value.end
    };
    this.dateSearching.dateDiff = moment(this.dateSearching.toDate).diff(moment(this.dateSearching.fromDate), 'days');
  }
}
