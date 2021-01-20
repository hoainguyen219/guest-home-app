import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  public formDangNhap: FormGroup;
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.formDangNhap = this.formBuilder.group({
      username: ['', [Validators.required]],
      pass: ['', [Validators.required]]
    });
  }

  login(): void {
    this.formDangNhap.markAllAsTouched();

    if (this.formDangNhap.invalid) {
      console.log(this.formDangNhap.controls);

      return;
    }

    const form = this.formDangNhap.value;
    const params = {
      username: form.username,
      password: form.pass
    };

    this.auth.login(params).subscribe(
      res => {
        if (res) {
          const user = JSON.stringify(res);
          this.auth.setCurrentUser(user);
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Vui lòng kiểm tra lại dữ liệu đăng nhập');
        }
      },
      err => {
        this.toastr.error('Tài khoản hoặc mật khẩu đăng nhập không đúng.');
        console.log('lỗi đăng nhập:', err);
      }
    );

  }

  get formControls() {
    return this.formDangNhap.controls;
  }
}
