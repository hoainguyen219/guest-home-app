import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HostelBaseComponent } from 'src/app/shared/components/hostel-base/hostel-base.component';
import { HostelService } from 'src/app/shared/services/hostel.service';


declare const $;
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styles: [
  ]
})
export class ScheduleComponent extends HostelBaseComponent implements OnInit, OnChanges {
  public hostels: any;
  public selectedHostel: any;

  public hostelRating: number;
  public userRating: number;
  public reviews;
  public user;
  constructor(
    private hostel: HostelService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.hostels) {
      console.log('d');
    }
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getSchedule();

  }

  getSchedule(): void {
    this.sub$ = this.hostel.getScheduleByUserId(this.user.user_id).subscribe(
      (hostel: any) => {
        this.hostels = hostel.map(h => {
          return {
            ...h,
            htotalReview: h?.reviews ? Number((h?.reviews[0]?.totalScore / h?.reviews[0]?.totalReview).toFixed(2)) : 0,
            htotalReview1: h?.reviews ? Number((h?.reviews[0]?.totalScore1 / h?.reviews[0]?.totalReview1).toFixed(2)) : 0
          };
        });
        this.currentPage = 0;
        this.filterHostel = this.hostels;
        this.filterHostelsByPage(this.filterHostel, this.currentPage);
      }
    );
  }

  // event đánh giá
  rating(schedule): void {
    const { Id } = schedule;
    const params = {
      scheduleId: schedule.Id,
      score: this.hostelRating,
      score1: this.userRating
    };

    this.hostel.ratingSchedule(params).subscribe(
      val => {
        this.toastr.success('Quý khách đã đánh giá thành công');
        this.getSchedule();
      },
      err => {
        this.toastr.error('Hệ thống xảy ra lỗi vui lòng thử lại sau');
      },
      () => {
        $('#modalRating').modal('hide');
      }
    );
  }

  changePages(page): void {
    this.filterHostelsByPage(this.filterHostel, page.pageIndex);
  }

  openRatingForm(hostel): void {
    if (hostel.isRated && hostel.isRated.length > 0) {
      this.hostelRating = hostel.isRated[0].Rating;
      this.userRating = hostel.isRated[0].Rating1;
    } else {
      this.hostelRating = 0;
      this.userRating = 0;
    }

    this.selectedHostel = hostel;
    $('#modalRating').modal();
  }
}
