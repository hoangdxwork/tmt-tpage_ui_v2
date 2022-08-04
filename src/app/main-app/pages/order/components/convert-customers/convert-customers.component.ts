import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-convert-customers',
  templateUrl: './convert-customers.component.html',
})
export class ConvertCustomersComponent implements OnInit {
  @Input() x: any;
  @Input() y: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.x);
    console.log(this.y);
  }

}
