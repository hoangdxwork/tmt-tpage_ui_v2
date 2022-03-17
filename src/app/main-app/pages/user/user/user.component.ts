import { Component, OnInit, ViewChild } from '@angular/core';
import { InfoUserComponent } from './info-user/info-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  typeChoose = 'user';
  // Biến của trang cá nhân
  isInfoUser = true
  isPassUser = false
  isChangeInfoUser = false
  isCancelUser = false
  // Biến của trang gói cước
  isInfoData = true
  isExtendData = false
  isUpgradeData = false
  isInfoDataPayment = false
  // Biến của trang thông báo
  constructor() { }

  ngOnInit(): void {
  }

  changeType(type: string){
    this.typeChoose = type;
  }

  // Các hàm của trang User
  outputChooseItemUser(item: boolean){
    this.isInfoUser= item
    this.isPassUser = !this.isInfoUser
  }
  changeInfoUser(){
    this.isChangeInfoUser = true;
    this.isCancelUser = false;
  }
  cancelChangeUser(){
    this.isChangeInfoUser = false;
    this.isCancelUser = true;
  }

  
  @ViewChild('pageUser') pageUser!: InfoUserComponent;
  onSumitInfoUser(){
    this.isChangeInfoUser = false;
    this.pageUser.onSubmitUser()
  }
  onSumitPassword(){
    this.pageUser.submitPassword()
  }
  // Các hàm của trang gói cước
  chooseUpgradeData(){
    this.isUpgradeData = true
    this.isInfoData = false
  }
  outputBackInfoDataFromUpgrade(event: boolean){
    if(event){
      this.isUpgradeData = false
      this.isInfoData = true
    }
  }
  chooseExtendData(){
    this.isExtendData = true
    this.isInfoData = false
  }
  outputBackInfoDataFromExtend(event: boolean){
    if(event){
      this.isExtendData = false
      this.isInfoData = true
    }
  }
  outputNextInfoDataPayment(event: boolean){
    if(event){
      this.isExtendData = false
      this.isInfoDataPayment = true
    }
  }
  outputBackPageExtendData(event: boolean){
    if(event){
      this.isExtendData = true
      this.isInfoDataPayment = false
    }
  }
}
