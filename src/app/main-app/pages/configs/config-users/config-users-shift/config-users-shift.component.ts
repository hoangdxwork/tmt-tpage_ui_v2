import { ModalListShiftComponent } from './../../components/modal-list-shift/modal-list-shift.component';
import { TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-users-shift',
  templateUrl: './config-users-shift.component.html',
  styleUrls: ['./config-users-shift.component.scss']
})
export class ConfigUsersShiftComponent implements OnInit {

  visible: boolean = false;
  indClickTag = -1
  isChooseWeek = -1
  isChooseDayOfWeek= -1

  
  listDataWeek = [
    {id: 0, week: 12, date: '21/03', dayOfWeek: 'Thứ 2'},
    {id: 1, week: 12, date: '22/03', dayOfWeek: 'Thứ 3'},
    {id: 2, week: 12, date: '23/03', dayOfWeek: 'Thứ 4'},
    {id: 3, week: 12, date: '24/03', dayOfWeek: 'Thứ 5'},
    {id: 4, week: 12, date: '25/03', dayOfWeek: 'Thứ 6'},
    {id: 5, week: 12, date: '26/03', dayOfWeek: 'Thứ 7'},
    {id: 6, week: 12, date: '27/03', dayOfWeek: 'Chủ nhật'},
  ]
  public modelTags = [];
  listOfDataUser = [
    {id:1, name: 'Jacob Jones', week: 12, dataTags:[
      {idTag: 1, idDayOfWeek: 0, name: 'Ca sáng'}, 
      {idTag: 2 ,idDayOfWeek: 0, name: 'Ca chiều'}, 
      {idTag: 3 ,idDayOfWeek: 0, name: 'Tăng ca'},
      {idTag: 4 ,idDayOfWeek: 1, name: 'test'},
    ]},
    {id:2, name: 'Guy Hawkins',week: 12, dataTags:[
      {idTag: 4 , idDayOfWeek: 1 , name: 'test'},
    ]},
    {id:3, name: 'Theresa Webb', dataTags:[]},
    {id:4, name: 'Esther Howard', dataTags:[]},
    {id:5, name: 'Robert Fox', dataTags:[]},
    {id:6, name: 'Wade Warren', dataTags:[]},
    {id:7, name: 'Jenny Wilson', dataTags:[]},
    {id:8, name: 'Marvin McKinney', dataTags:[]},
    {id:9, name: 'Darrell Steward', dataTags:[]},
    {id:10, name: 'Kristin Watson', dataTags:[]},
    {id:11, name: 'Tester 1', dataTags:[]},
    {id:12, name: 'Tester 2', dataTags:[]},
  ]
  lstDataTag = [
    {id: 1 , name: 'Ca sáng'},
    {id: 2 , name: 'Ca chiều'},
    {id: 3 , name: 'Tăng ca'},
    
  ]
  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.visible = false;
}

apply(): void {
    this.visible = false;
}

change(value: boolean): void {
    console.log(value);
}

openTag(id: number,week: number, dayOfWeek: number) {
  this.indClickTag = id;
  this.isChooseWeek = week;
  this.isChooseDayOfWeek = dayOfWeek;
}

closeTag() {
  this.indClickTag = -1;
  this.modelTags = [];
}
assignTags(id: number){
 
}

showModalListShift(){
  const modal = this.modalService.create({
    title: 'Danh sách ca làm việc',
    content: ModalListShiftComponent,
    size: "lg",
    viewContainerRef: this.viewContainerRef,
  });
  modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
  modal.afterClose.subscribe(result => {
    console.log('[afterClose] The result is:', result);
    if (TDSHelperObject.hasValue(result)) {
      
    }
  });
}
}
