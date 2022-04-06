import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class PassportComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCsrfToken();
  }
}
