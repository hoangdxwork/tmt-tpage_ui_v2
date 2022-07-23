import { RestSMSService } from './../../../../services/sms.service';
import { number } from 'echarts';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { CRMActivityCampaignService } from './../../../../services/crm-activity-campaign.service';
import { Message } from './../../../../../lib/consts/message.const';
import { QuickReplyDTO } from './../../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { Observable, Subject } from 'rxjs';
import { ModalSampleMessageComponent } from '../modal-sample-message/modal-sample-message.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { CRMgenerateMessagePartnersDTO, SendMessageFacebookDTO } from 'src/app/main-app/dto/crm-activity-campaign/generate-message-partners.dto';
import { CRMGenerateMessageByPhoneDTO, RestSMSDTO, SendMessageSMSDTO } from 'src/app/main-app/dto/sms/sms.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-send-message',
  templateUrl: './modal-send-message.component.html'
})
export class ModalSendMessageComponent implements OnInit {

  @Input() partnerIds: TDSSafeAny[] = []

  formSendMessageFacebook!: FormGroup
  formSendMessageSMS!: FormGroup
  isTableSendMessageFacebook = false
  isTableSendMessageSMS = false
  isSendMessageFacebook = true
  isSendMessageSMS = false
  indexTab = 0
  isLoading: boolean = false;

  setOfCheckedTag= new Set<string>();
  listTagText = ["{partner.name}","{partner.code}","{partner.phone}","{partner.address}"]
  selectSMS!: number;
  listSendMessageFacebook!: CRMgenerateMessagePartnersDTO[];
  listSendMessageSMS!: CRMGenerateMessageByPhoneDTO[];
  currentSMS: RestSMSDTO[] = [];
  modelSendSMS: SendMessageSMSDTO = {
    ApiKey: '',
    ApiUrl: '',
    CustomProperties: '',
    Provider: '',
    Datas: []
  };
  modelSendMessageFacebook: SendMessageFacebookDTO = {
    Name: '',
    MailTemplateBody: '',
    Details: []
  }

  private destroy$ = new Subject<void>();


  tagCustomers: TDSSafeAny = [
    { text: "Tên KH", value: "{partner.name}" },
    { text: "Mã KH", value: "{partner.code}" },
    { text: "Điện thoại KH", value: "{partner.phone}" },
    { text: "Địa chỉ KH", value: "{partner.address}" },
  ];
  constructor(private modal: TDSModalRef,
    private fb: FormBuilder,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private CRMActivityCampaignService: CRMActivityCampaignService,
    private restSMSService: RestSMSService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.getRestSMS();
  }
  getRestSMS() {
    this.restSMSService.get().pipe(takeUntil(this.destroy$)).subscribe((res: RestSMSDTO[]) => {
      this.currentSMS = res
    })
  }

  createForm() {
    this.formSendMessageFacebook = this.fb.group({
      title: new FormControl('', Validators.required),
      content: new FormControl('', Validators.required)
    })
    this.formSendMessageSMS = this.fb.group({
      content: new FormControl('', Validators.required),
    })
  }

  resetForm() {
    this.formSendMessageFacebook.controls.title.setValue("");
    this.formSendMessageFacebook.controls.content.setValue("");
    this.formSendMessageSMS.controls.content.setValue("");
  }

  addTagContentFB(value: string) {
    this.formSendMessageFacebook.controls.content.setValue(this.formSendMessageFacebook.value?.content + value);
    if(!this.setOfCheckedTag.has(value))
      this.setOfCheckedTag.add(value)
  }

  addTagContentSMS(value: string) {
    this.formSendMessageSMS.controls.content.setValue(this.formSendMessageSMS.value?.content + value);
    if(!this.setOfCheckedTag.has(value))
      this.setOfCheckedTag.add(value)
  }

  cancel() {
    if (this.indexTab == 0) {
      this.isTableSendMessageFacebook = false
    }
    else if (this.indexTab == 1) {
      this.isTableSendMessageSMS = false
    }
  }

  close() {
    this.modal.destroy(null);
  }

  // xử lý gửi tin nhắn facebook

  setStepFacebook() {
    if (this.indexTab == 0) {
      if (!this.formSendMessageFacebook.valid) {
        if(!this.formSendMessageFacebook.controls.title.valid) {
          this.message.error('Tiêu đề không được bỏ trống')
          return;
        }
        if(!this.formSendMessageFacebook.controls.content.valid) {
          this.message.error('Nội dung không được bỏ trống')
          return;
        }
      } else {
        this.isLoading = true;
        this.isTableSendMessageFacebook = true
        let model = JSON.stringify({
          Ids: this.partnerIds,
          Message: this.formSendMessageFacebook.value?.content,
        });
        this.CRMActivityCampaignService.generateMessagePartners(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.listSendMessageFacebook = Object.values(res)
          this.isLoading = false;
        }, err => {
          this.message.error('Đã có lỗi xảy ra!')
          this.isLoading = false;
        })
      }
    }

  }
  sendMessageFacebook() {
    this.isLoading = true;
    let model = this.prepareModelFacebook();
    if (!model){
      this.isLoading = false;
      return
    }
    if (!model.Name || !model.MailTemplateBody) {
      this.message.error('Không tìm thấy tiêu đề, nội dung tin nhắn!');
      this.isLoading = false;
      return
    }
    if (model.Details.length == 0 ) {
      this.message.error('Không tìm thấy facebook Khách hàng!');
      this.isLoading = false;
      return
    }
    let data = JSON.stringify(model)
    this.CRMActivityCampaignService.insertOdata(data).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.modal.destroy('sms');
      this.message.success('Thao tác thành công!')
      this.isLoading = false;
    }, err => {
      this.message.error('Thao tác thất bại!')
      this.isLoading = false;
    })
  }

  prepareModelFacebook() {
    let formModel = this.formSendMessageFacebook.value
    if (formModel.title) {
      this.modelSendMessageFacebook.Name = formModel.title;
    }
    if (formModel.content) {
      this.modelSendMessageFacebook.MailTemplateBody = formModel.content;
    }
    if (this.listSendMessageFacebook) {
      this.listSendMessageFacebook.forEach(el => {
        let modelDetail = {
          CRMTeamId: el.Teams[0].Id,
          Facebook_PSId: el.Teams[0].psid,
          Message: el.Message
        }
        this.modelSendMessageFacebook.Details.push(modelDetail)
      })
    }

    return this.modelSendMessageFacebook
  }

  // xử lý gửi tin nhắn SMS

  setStepSMS() {
    if (this.indexTab == 1) {
      if (!this.formSendMessageSMS.valid) {
        this.message.error('Nội dung không được bỏ trống')
        return;
      } else {
        this.isLoading = true;
        this.isTableSendMessageSMS = true
        let model = JSON.stringify({
          Ids: this.partnerIds,
          Message: this.formSendMessageSMS.value?.content,
        });
        this.restSMSService.generateMessageByPhone(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          this.listSendMessageSMS = Object.values(res)
          this.isLoading = false;
        }, err => {
          this.message.error('Đã có lỗi xảy ra!')
          this.isLoading = false;
        })
      }
    }
  }

  prepareModelSMS() {
    let formModel = this.formSendMessageSMS.value
    if (formModel.content) {
      this.modelSendSMS.Datas = this.listSendMessageSMS
    }
    let model = this.currentSMS.find(x => x.Id == this.selectSMS)
    if (model) {
      this.modelSendSMS.Provider = model.Provider;
      this.modelSendSMS.ApiKey = model.ApiKey;
      this.modelSendSMS.CustomProperties = model.CustomProperties;
      this.modelSendSMS.ApiUrl = model.ApiUrl;
    }

    return this.modelSendSMS
  }

  sendMessageSMS() {
    this.isLoading = true;
    let model = this.prepareModelSMS();
    if (!model){
      this.isLoading = false;
      return
    }
    if (!model.Provider) {
      this.isLoading = false;
      this.message.error('Không tìm thấy dịch vụ tin nhắn!');
      return
    }
    if (model.Datas.length == 0) {
      this.isLoading = false;
      this.message.error('Không tìm thấy thông tin khách hàng!');
      return
    }
    let data = JSON.stringify(model)
    this.restSMSService.sendMessageSMS(data).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.modal.destroy('sms');
      this.message.success('Thao tác thành công!')
      this.isLoading = false;
    }, err => {
      this.message.error('Thao tác thất bại!')
      this.isLoading = false;
    })
  }


  // Modal tin nhắn mẫu
  showModalSampleMessage(key: string) {
    const modal = this.modalService.create({
      title: 'Danh sách mẫu tin nhắn',
      centered: true,
      content: ModalSampleMessageComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {

      }
    });
    modal.afterOpen.subscribe();
    modal.afterClose.subscribe((result: QuickReplyDTO) => {
      if (TDSHelperObject.hasValue(result)) {
        if (key == 'facebook') {
          this.formSendMessageFacebook.controls.title.setValue(result.Name);
          this.formSendMessageFacebook.controls.content.setValue(result.BodyPlain);
          this.checkIncludes(this.formSendMessageFacebook.value.content);
        }
        if (key == 'SMS') {
          this.formSendMessageSMS.controls.content.setValue(result.BodyPlain);
          this.checkIncludes( this.formSendMessageSMS.value.content);
        }
      }
    });
  }

  changeTab(ev: TDSSafeAny) {
    this.indexTab = ev.index;
    this.isTableSendMessageFacebook = false;
    this.isTableSendMessageSMS = false;
    this.setOfCheckedTag= new Set<string>();
    this.resetForm();
  }

  checkIncludes(ev: TDSSafeAny){
    let value = (ev && ev.value)? ev.value:(TDSHelperString.hasValueString(ev)?ev:'')
    if(TDSHelperString.hasValueString(value)){
      this.listTagText.forEach(element => {
        if(!value.includes(element) && this.setOfCheckedTag.has(element)){
          this.setOfCheckedTag.delete(element)
        }
        if(value.includes(element) && !this.setOfCheckedTag.has(element)){
          this.setOfCheckedTag.add(element)
        }
      });
    }
  }

}
