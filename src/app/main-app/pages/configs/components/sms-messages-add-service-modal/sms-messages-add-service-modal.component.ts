import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-sms-messages-add-service-modal',
  templateUrl: './sms-messages-add-service-modal.component.html',
  styleUrls: ['./sms-messages-add-service-modal.component.scss']
})
export class SMSMessagesAddServiceModalComponent implements OnInit {
  SMSServiceData:Array<TDSSafeAny> = [];
  responseData:Array<TDSSafeAny> = [];
  partnerData:Array<TDSSafeAny> = [];
  serviceData:Array<TDSSafeAny> = [];

  serviceForm!: FormGroup;

  constructor(private modal: TDSModalRef, private formBuilder: FormBuilder) { 
    this.serviceForm = this.formBuilder.group({
      partner: new FormControl('', [Validators.required]),
      apiKey: new FormControl('', [Validators.required]),
      secretKey: new FormControl('', [Validators.required]),
      service: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.SMSServiceData = [
      {
        id:1,
        partner:'ESMS',
        services:[
          {
            id:1,
            name:'Dịch vụ Internet'
          },
          {
            id:2,
            name:'Gửi tin nhắn SMS'
          },
        ]
      },
      {
        id:2,
        partner:'SpeedSMS',
        services:[
          {
            id:1,
            name:'Gửi bằng đầu số ngẫu nhiên'
          },
          {
            id:2,
            name:'Tin nhắn gửi bằng brandname'
          },
          {
            id:3,
            name:'Tin nhắn gửi bằng brandname mặc định (Verify hoặc Notify)'
          },
          {
            id:4,
            name:'Tin nhắn gửi bằng app android'
          },
        ]
      }
    ];

    this.getAllPartner();
  }

  getAllPartner(){
    this.partnerData = [
      {
        id:1,
        partner:'ESMS',
      },
      {
        id:2,
        partner:'SpeedSMS',
      },
    ];
  }

  getServices(partnerId:number){
    let item = this.SMSServiceData.find(f=>f.id === partnerId);
    
    if(item){
      this.serviceData = item.services
    }
  }

  onselectPartner(id:TDSSafeAny){
    this.serviceForm.controls.service.reset('');
    this.getServices(id);
  }

  onSubmit() {
      if (!this.serviceForm.invalid) {
        this.modal.destroy(this.responseData);
      }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
