import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { HostelDetailComponent } from './hostel-detail/hostel-detail.component';
import { HostelFormComponent } from './hostel-form/hostel-form.component';
import { HostelComponent } from './hostel.component';
import { ListPostComponent } from './list-post/list-post.component';

const routes: Routes = [
  {
    path: '',
    component: HostelComponent,
    children: [
      {
        path: 'detail/:id',
        component: HostelDetailComponent
      },
      {
        path: 'post',
        component: HostelFormComponent,
        data: {
          isPost: true
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'edit',
        component: HostelFormComponent,
        data: {
          isPost: false
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'posted',
        component: ListPostComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class HostelRoutingModule { }
