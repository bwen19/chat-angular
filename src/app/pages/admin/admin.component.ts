import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less'],
})
export class AdminComponent implements OnInit {
  selectedItem!: string;

  constructor() {}

  ngOnInit(): void {
    this.selectedItem = '';
  }
}
