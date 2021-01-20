import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class HeaderComponent implements OnInit {
  public user$: Observable<any>;

  constructor(
    private config: ConfigService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    this.config.changeSearchType(1);
    if (localStorage.getItem('user')) {
      this.auth.getCurrentUser();
    }

    this.user$ = this.auth.currentUser$;
  }

  search(): void {
    this.config.changeSearchType(1);
    this.router.navigate(['/']);
  }

  searchByMap(): void {
    this.config.changeSearchType(2);
    this.router.navigate(['/']);
  }

  postHostel(): void {
    this.router.navigate(['hostel', 'post']);
  }

  toLogin(): void {
    this.router.navigate(['login']);
  }

  toRegister(): void {
    this.router.navigate(['register']);
  }

  logout(): void {
    this.auth.logout();
  }
}
