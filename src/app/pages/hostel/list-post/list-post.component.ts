import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HostelBaseComponent } from 'src/app/shared/components/hostel-base/hostel-base.component';
import { Hostel } from 'src/app/shared/interfaces/hostel';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DashboardService } from 'src/app/shared/services/dashboard.service';
import { HostelService } from 'src/app/shared/services/hostel.service';

declare var $: any;
@Component({
  selector: 'app-list-post',
  templateUrl: './list-post.component.html',
  styles: [
  ]
})
export class ListPostComponent extends HostelBaseComponent implements OnInit {

  public hostels;
  public selectedHostel;
  // filter;
  public utilies: string[] = [];
  public priceType: string;
  public schedule$: Observable<any>;

  constructor(
    private router: Router,
    private auth: AuthService,
    private hostel: HostelService,
    private toastr: ToastrService,
    private dashboard: DashboardService,

  ) {
    super();
  }

  ngOnInit(): void {
    this.getListPost();
  }

  getListPost() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.sub$ = this.hostel.getPostListByUserId(user.user_id).subscribe(
      (hostel: Hostel) => {
        this.hostels = hostel;
        this.currentPage = 0;
        this.filterHostel = this.hostels;
        this.filterHostelsByPage(this.filterHostel, this.currentPage);
        console.log(this.displayHostels);
      }
    );
    this.schedule$ = this.hostel.manageSchedule({userId: user.user_id});
  }

  toEditHostel(dashboard): void {
    this.router.navigate(['hostel/edit'], {
      queryParams:  {
        postId: dashboard.post_id
      }
    });
  }

  deleteHostels(dashboard): void {
    this.selectedHostel = dashboard;
    $('#modalDeleteHostel').modal();
  }

  cfDelete(): void {
    const params = {
      postId: this.selectedHostel.post_id
    };

    this.sub$ =  this.dashboard.deleteDashboard(params).subscribe(
      val => {
        console.log(val);
        $('#modalDeleteHostel').modal('hide');
        this.toastr.success('Xóa bản tin thành công');
        this.getListPost();
      }
    );
  }

  changePages(page): void {
    this.filterHostelsByPage(this.filterHostel, page.pageIndex);
  }


  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
    }
  }
}
