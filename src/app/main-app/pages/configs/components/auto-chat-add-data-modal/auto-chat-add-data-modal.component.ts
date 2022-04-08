import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSMessageService, TDSSafeAny, TDSUploadChangeParam, TDSModalRef } from 'tmt-tang-ui';
import { filter } from 'rxjs/operators';

export interface TDSMessageFormData{
  name:string,
  shortcut:string,
  status:boolean,
  media?:{
    image:string,
    mediaChannels?:Array<string>
  },
  content?:{
    title:string,
    text:string,
  },
  button?:Array<{
    text:string,
    type:string,
    payLoad:string
  }>
};

@Component({
  selector: 'app-auto-chat-add-data-modal',
  templateUrl: './auto-chat-add-data-modal.component.html',
  styleUrls: ['./auto-chat-add-data-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class AutoChatAddDataModalComponent implements OnInit{
  @Input() data: TDSSafeAny;

  nameTagList: Array<string> = [];
  contentTagList: Array<TDSSafeAny> = [];
  MessageFormList: Array<TDSSafeAny> = [];
  MessageFormData!: TDSMessageFormData;
  messageForm = '';
  messageStructurePart = 1;
  uploadUrl = 'https://tshop.tpos.dev/api/v1/app-products/upload-defaultimage';
  buttonTypeList: Array<string> = [
    'submit',
    'reset',
  ]
  mediaChannelList: Array<TDSSafeAny> = [
    {
      id:1,
      name:'page 1'
    },
    {
      id:2,
      name:'page 2'
    },
    {
      id:3,
      name:'page 3'
    },
  ]
  radioValue = '1';
  currentBreadcrumb = 0;
  status = false;
  imageURL = '';

  createForm!: FormGroup ;
  createMessageForm!: FormGroup;
  mediaForm! :FormControl;

  buttonFormList: Array<FormGroup> = [];

  constructor(private modal: TDSModalRef,private formBuilder: FormBuilder, private msg: TDSMessageService, private http: HttpClient) { 
    this.createForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      shortcut: new FormControl('',[Validators.required]),
    });

    this.createMessageForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      text: new FormControl(''),
    });

    this.buttonFormList = [
      this.formBuilder.group({
        text: new FormControl('', [Validators.required]),
        type: new FormControl('',[Validators.required]),
        payLoad: new FormControl('',[Validators.required]),
      })
    ]

    this.mediaForm = new FormControl([],[Validators.required]);
  }

  ngOnInit(): void {
    this.loadData();
    this.messageForm = this.MessageFormList[0].name ?? '';
    this.MessageFormData = {
      name:'',
      shortcut:'',
      status:false
    }
  }

  loadData(){
    this.nameTagList = [
      'Mã đơn hàng',
      'Mã vận đơn',
      'Mã đặt hàng'
    ];

    this.contentTagList = [
      {
        name:'Khách hàng',
        data:[
          'Tên KH',
          'Mã KH',
          'Điện thoại KH',
          'Địa chỉ KH',
          'Công nợ KH'
        ]
      },
      {
        name:'Đơn hàng',
        data:[
          'Tên ĐH',
          'Mã ĐH'
        ]
      },
      {
        name:'Đặt hàng',
        data:[
          'Tên KH',
          'Mã KH',
          'Tên ĐH',
          'Mã ĐH',
          'Địa chỉ KH'
        ]
      },
    ];

    this.MessageFormList = [
      {
        id:1,
        name:'Mẫu chung'
      },
      {
        id:2,
        name:'Mẫu nút'
      },
      {
        id:3,
        name:'Mẫu phương tiện'
      }
    ];
  }

  onResetMessageFrom(){
    this.createMessageForm.value.title = '';
    this.createMessageForm.value.text = '';
    this.mediaForm.reset([]);

    this.buttonFormList = [
      this.formBuilder.group({
        text: new FormControl('', [Validators.required]),
        type: new FormControl('',[Validators.required]),
        payLoad: new FormControl('',[Validators.required]),
      })
    ]
  }

  onChangeRadio(){
    this.onResetMessageFrom();
  }

  onChangeMessageForm(data:TDSSafeAny){
    this.messageForm = data;
    this.messageStructurePart = 1;
    this.onResetMessageFrom();
  }

  onCloseActionButton(i:number){
    this.buttonFormList.splice(i,1);
  }

  addActionButton(){
    this.buttonFormList.push(
      this.formBuilder.group({
        text: new FormControl('', [Validators.required]),
        type: new FormControl('',[Validators.required]),
        payLoad: new FormControl('',[Validators.required]),
      })
    )
  }

  onInputMessageTitle(event:TDSSafeAny){

  }

  onInputMessageContent(event:TDSSafeAny){
    
  }

  onChangeStructurePart(i:number){
    this.messageStructurePart = i;
  }

  onChangeTagName(index:number){
    this.createForm.value.name = this.nameTagList[index];
  }

  addTagToContent(listIndex:number,dataIndex:number){
    //add tag to content
    this.createMessageForm.value.text = this.createMessageForm.value.text.concat('{',this.contentTagList[listIndex].data[dataIndex],'}');
  }

  handleChange(info: TDSUploadChangeParam): void {
    // if (info.file.status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    // }
    if (info.file.status === 'done') {
        this.msg.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
        this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  handleUpload = (item: any) => {
    const formData = new FormData();
    
    formData.append('mediaFile', item.file as any, item.file.name);
    formData.append('id', '0000000000000051');

    const req = new HttpRequest('POST', this.uploadUrl, formData);
    return this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (res:TDSSafeAny) => {   
            if(res && res.body)
            {
                const data = res.body;
                item.file.url = data.mediaUrl;
            }
            item.onSuccess(item.file);
        },
        (err) => {
            item.onError({statusText:err.error?.error?.details}, item.file);
        }
    )
  }

  getMessageFormIndex(name:string){
    return this.MessageFormList.findIndex(f=>f.name === name)
  }

  enableSubmit(){
    switch(this.radioValue){
      case '1':{
        return !this.createForm.valid
      }
      case '2':{
        if(this.getMessageFormIndex(this.messageForm) == 0){
          return !this.createForm.valid || !this.createMessageForm.valid || !this.isValidButton(this.buttonFormList)
        }
        if(this.getMessageFormIndex(this.messageForm) == 1){
          return !this.createForm.valid || !this.isValidButton(this.buttonFormList)
        }
        if(this.getMessageFormIndex(this.messageForm) == 2){
          return !this.createForm.valid || !this.isValidButton(this.buttonFormList) || !this.mediaForm.valid
        }
      }
    }
    return false;
  }

  isValidButton(list:FormGroup[]){
    let result = true;
    if(list.length > 0){
      list.forEach(form => {
        if(!form.valid){
          result = false;
        }
      });
      console.log(result)
      return result
    }else{
      return false;
    }
  }

  onSubmit() {
    if (!this.createForm.invalid) {
      let buttonList:TDSSafeAny[] = [];
      let mediaList:TDSSafeAny[] = [];

      this.buttonFormList.forEach(butonForm => {
        if(butonForm.value.text !== ''){
          buttonList.push(
            {
              text: butonForm.value.text,
              type: butonForm.value.type,
              payLoad: butonForm.value.payLoad
            }
          );
        }
      });

      let mediaForm = this.mediaForm.value as Array<TDSSafeAny>;
      mediaForm.forEach(value => {
        let item = this.mediaChannelList.find(f=>f.id == value);
        mediaList.push(item);
      });

      this.MessageFormData = Object.assign(this.MessageFormData,{
        name: this.createForm.value.name,
        shortcut: this.createForm.value.shortcut,
        status: this.status,
        media:{
          image: this.imageURL,
          mediaChannels: mediaList
        },
        content:{
          title: this.createMessageForm.value.title,
          text: this.createMessageForm.value.text
        },
        button: buttonList
      });

      this.modal.destroy(this.MessageFormData);
      console.log(this.MessageFormData)
    }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}