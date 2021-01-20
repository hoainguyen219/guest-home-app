import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: []
})
export class RegisterComponent implements OnInit {
  public formDangKy: FormGroup;
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {
    console.log('d');

    this.formDangKy = this.formBuilder.group({
      full_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      account: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      re_password: ['', [Validators.required]]
    }, {
      validators: this.matchPassword,
    });
    console.log('khoitaojform:', this.formDangKy);
  }

  ngOnInit(): void {

  }

  matchPassword(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('re_password').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('re_password').setErrors({ NoPassswordMatch: true });
    } else {
      control.get('re_password').setErrors(null);
    }

  }

  register() {
    this.formDangKy.markAllAsTouched();
    if (this.formDangKy.invalid) {
      console.log(this.formDangKy.controls);

      return;
    }
    const params =  {
      full_name: this.formDangKy.value.full_name,
      phone_number: this.formDangKy.value.phone_number,
      email: this.formDangKy.value.email,
      account: this.formDangKy.value.account,
      password: this.formDangKy.value.password
    };

    this.auth.registerUser(params).subscribe(
      val => {
        this.toastr.success('Quý khách đã đăng ký thành công');
        this.router.navigate(['/login']);
      },
      err => {
        if (err.status === 400) {
          this.toastr.error('Tên tài khoản đã được sử dụng');
        } else {
          this.toastr.error('Hệ thống bị gián đoạn vui lòng thử lại sau');
        }
      }
    );

  }

  get formControls() {
    return this.formDangKy.controls;
  }
}
