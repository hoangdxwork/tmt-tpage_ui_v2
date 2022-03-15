import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-info-user',
  templateUrl: './info-user.component.html',
  styleUrls: ['./info-user.component.scss']
})
export class InfoUserComponent implements OnInit {

  @Output() itemIsInfo = new EventEmitter<boolean>();
  @Output() formUser = new EventEmitter<NgForm>();
  @Input() isChangeInfo = false
  
  isInfo = true
  form = {
    name: 'Nguyễn Văn A',
    phone: '0321479652',
    email: 'nguyenvana@gmail.com'
  };
  constructor() { }

  ngOnInit(): void {
  }

  chooseInfo(){
    this.isInfo = true
    this.itemIsInfo.emit(true)
  }
  choosePass(){
    this.isInfo = false
    this.itemIsInfo.emit(false)
  }

  onSubmit(form: NgForm){
    console.log(form)
    this.formUser.emit(form)
  }
}
