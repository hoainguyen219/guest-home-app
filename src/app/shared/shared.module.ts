import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { ErrorComponent } from './components/error/error.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HostelBaseComponent } from './components/hostel-base/hostel-base.component';
import { NoneAutocompleteDirective } from './directives/none-autocomplete.directive';
import { OnlyNumberDirective } from './directives/only-number.directive';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    NoneAutocompleteDirective,
    OnlyNumberDirective,
    HostelBaseComponent,
    ChatComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
    ErrorComponent,
    HeaderComponent,
    FooterComponent,
    NoneAutocompleteDirective,
    OnlyNumberDirective,
    ChatComponent
  ]
})
export class SharedModule { }
