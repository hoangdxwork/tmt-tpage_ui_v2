import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-users-divide-task',
  templateUrl: './config-users-divide-task.component.html',
  styleUrls: ['./config-users-divide-task.component.scss']
})
export class ConfigUsersDivideTaskComponent implements OnInit {

  public contactOptionsTask = [
    { id: 1, name: 'Chọn thời gian' },
    { id: 2, name: '5 phút' },
    { id: 3, name: '10 phút' },
    { id: 4, name: 'Khác' },
]
persondisplayWith!: FormControl

  constructor() { }

  ngOnInit(): void {
    this.persondisplayWith = new FormControl(1);
  }

}
