import { TDSSafeAny } from 'tmt-tang-ui';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-overview',
  templateUrl: './config-overview.component.html',
  styleUrls: ['./config-overview.component.scss']
})
export class ConfigOverviewComponent implements OnInit {
  shippingUnitForm!:FormControl;
  repositoryForm!:FormControl;
  asynRepositoryForm!:FormControl;
  asynCustomerForm!:FormControl;
  btnTitleForm1!:FormControl;
  btnTitleForm2!:FormControl;
  deliveryStatus!:FormControl;

  shippingUnitList:TDSSafeAny[] = [];
  repoList:TDSSafeAny[] = [];
  asynRepoList:TDSSafeAny[] = [];
  asynCustomerList:TDSSafeAny[] = [];
  deliveryStatusList:TDSSafeAny[] = [];

  enableOverview1!:boolean;
  enableOverview2!:boolean;
  enableOverview3!:boolean;
  enableOverview4!:boolean;
  enableAutoReaction1!:boolean;
  enableAutoReaction2!:boolean;
  enableAutoReaction3!:boolean;
  enableAutoReaction4!:boolean;
  enableAutoReaction5!:boolean;

  areaText1:string = '';
  areaText2:string = '';
  areaText3:string = '';

  constructor() { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.shippingUnitList = [
      {
        id:1,
        name:'Ahamove'
      },
      {
        id:2,
        name:'Grab'
      },
    ];
    this.repoList = [
      {
        id:1,
        name:'Kho 1'
      },
      {
        id:2,
        name:'Kho 2'
      },
    ];
    this.asynRepoList = [
      {
        id:0,
        name:'Tất cả'
      },
      {
        id:1,
        name:'Kho 1'
      },
      {
        id:2,
        name:'Kho 2'
      },
    ];
    this.asynCustomerList = [
      {
        id:1,
        name:'KH 1'
      },
      {
        id:2,
        name:'KH 2'
      },
    ];
  
    this.deliveryStatusList = [
      {
        id:1,
        name:'Đang giao hàng'
      },
      {
        id:2,
        name:'Đã xác nhận'
      },
      {
        id:3,
        name:'Đã giao hàng'
      },
      {
        id:4,
        name:'Đã hủy'
      }
    ];

    this.enableOverview1 = true;
    this.enableOverview2 = true;
    this.enableOverview3 = true;
    this.enableOverview4 = true;
    this.enableAutoReaction1 = true;
    this.enableAutoReaction2 = true;
    this.enableAutoReaction3 = true;
    this.enableAutoReaction4 = true;
    this.enableAutoReaction5 = true;


    this.shippingUnitForm = new FormControl(this.shippingUnitList[0],Validators.required);
    this.repositoryForm = new FormControl('',Validators.required);
    this.asynRepositoryForm = new FormControl(this.asynRepoList[0],Validators.required);
    this.asynCustomerForm = new FormControl('',Validators.required);
    this.btnTitleForm1 = new FormControl('Giỏ hàng',Validators.required);
    this.btnTitleForm2 = new FormControl('Đồng ý',Validators.required);
    this.deliveryStatus = new FormControl([1,2],Validators.required);

    this.areaText1 = 'Xin chào {partner.name}, bạn đã đặt hàng trên live {order.live_title} thành công.\n{order.comment}\n{order.product}\nTổng tiền trong đơn: {order.total_amount}';
    this.areaText2 = 'Xin chào {partner.name}, hoá đơn có mã {bill.code} đã được tạo.\n{bill.details}\n{bill.note}\n{shipping.details}';
    this.areaText3 = 'Xin chào {partner.name}, hoá đơn có mã {bill.code} đã được cập nhật trạng thái giao hàng.\n{shipping.details}';
  }

  // switch event
  onChangeOverviewSwitch1(value:boolean){
    this.enableOverview1 = value;
  }

  onChangeOverviewSwitch2(value:boolean){
    this.enableOverview2 = value;
  }

  onChangeOverviewSwitch3(value:boolean){
    this.enableOverview3 = value;
  }

  onChangeOverviewSwitch4(value:boolean){
    this.enableOverview4 = value;
  }

  onChangeAutoReactSwitch1(value:boolean){
    this.enableAutoReaction1 = value;
  }

  onChangeAutoReactSwitch2(value:boolean){
    this.enableAutoReaction2 = value;
  }

  onChangeAutoReactSwitch3(value:boolean){
    this.enableAutoReaction3 = value;
  }

  onChangeAutoReactSwitch4(value:boolean){
    this.enableAutoReaction4 = value;
  }

  onChangeAutoReactSwitch5(value:boolean){
    this.enableAutoReaction5 = value;
  }

  // select event
  onSelectShippingUnit(data:TDSSafeAny){
    
  }

  onSelectRepository(data:TDSSafeAny){
    
  }

  onSelectAsynRepository(data:TDSSafeAny){
    
  }

  onSelectAsynCustomer(data:TDSSafeAny){
    
  }

  onSelectStatus(data:TDSSafeAny){
    
  }

  // input event
  onInputTitle1(event:TDSSafeAny){
    
  }

  onInputTitle2(event:TDSSafeAny){

  }

  //  button event
  onAsynRepository(event:TDSSafeAny){
    
  }

  onAsynCustomer(event:TDSSafeAny){

  }

  onSaveChangeOverview(event:TDSSafeAny){
    
  }

  onSaveChangeAutoReact(event:TDSSafeAny){
    
  }

  onCancelOverview(event:TDSSafeAny){
    
  }

  onCancelAutoReact(event:TDSSafeAny){
    
  }

  // area event
  onAreaForm1(data:string){

  }

  onAreaForm2(data:string){
    
  }

  onAreaForm3(data:string){
    
  }
}
