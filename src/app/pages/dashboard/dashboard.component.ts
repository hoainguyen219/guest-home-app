import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HostelBaseComponent } from 'src/app/shared/components/hostel-base/hostel-base.component';
import { DashboardService } from '../../shared/services/dashboard.service';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent extends HostelBaseComponent implements OnInit {
  public dashboard$: Observable<any>;
  public sub$: Subscription;
  public totalCities;
  public totalPosts;
  public selectedHostel;
  public dashboardList$: BehaviorSubject<any> = new BehaviorSubject<any>(true);
  constructor(
    private dashboard: DashboardService,
    private toastr: ToastrService,
    private router: Router
  ) {
    super();
    this.dashboard$ = this.dashboardList$.pipe(
      switchMap(() => this.dashboard.getAdmin())
    );
  }

  ngOnInit(): void {
    this.dashboard.getStatistic().subscribe(
      val => {
        this.totalCities = val.cities;
        this.totalPosts = val.totalPost;
      }
    );
  }

  confirmHostel(dashboard): void {
    const params = {
      postId: dashboard.post_id
    };

    this.sub$ =  this.dashboard.confirmDashboard(params).subscribe(
      val => {
        console.log(val);
        this.toastr.success('Duyệt bản tin thành công');
        this.dashboardList$.next(true);
      }
    );
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
        this.dashboardList$.next(true);
      }
    );
  }

}
