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
  public modelTags = [];
  listOfDataUser = [
    {id:1, name: 'Jacob Jones', dataTags:[{id: 1 , name: 'Ca sáng'}, {id: 2 , name: 'Ca chiều'}, {id: 3 , name: 'Tăng ca'},]},
    {id:2, name: 'Guy Hawkins' , dataTags:[{id: 4 , name: 'test'},]},
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

openTag(id: number) {
  this.indClickTag = id;
}

closeTag() {
  this.indClickTag = -1;
  this.modelTags = [];
}
assignTags(id: number){
  var index = this.listOfDataUser.findIndex(x=>x.id == id)
  this.listOfDataUser[index].dataTags = this.modelTags
  this.modelTags = []
  this.indClickTag = -1;
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
