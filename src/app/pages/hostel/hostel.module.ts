import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from 'src/app/shared/shared.module';
import { HostelDetailComponent } from './hostel-detail/hostel-detail.component';
import { HostelFormComponent } from './hostel-form/hostel-form.component';
import { HostelRoutingModule } from './hostel-routing.module';
import { HostelComponent } from './hostel.component';
import { ListPostComponent } from './list-post/list-post.component';
@NgModule({
  declarations: [
    HostelDetailComponent,
    HostelFormComponent,
    HostelComponent,
    ListPostComponent,
  ],
  imports: [
    CommonModule,
    HostelRoutingModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatMomentDateModule,
    MatNativeDateModule,
    SharedModule
  ],
  // exports: [
  //   HostelDetailComponent,
  //   HostelFormComponent
  // ]
})
export class HostelModule { }
