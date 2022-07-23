import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderService } from './../../services/fast-sale-order.service';
import { finalize } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { Message } from 'src/app/lib/consts/message.const';
import { GenerateMessageDTO } from '../../dto/conversation/inner.dto';
import { GenerateMessageTypeEnum, SendCRMActivityCampaignDTO } from '../../dto/conversation/message.dto';
import { MailTemplateUpdateDTO } from '../../dto/mailtemplate/mail-template.dto';
import { CRMActivityCampaignService } from '../../services/crm-activity-campaign.service';
import { CRMTeamService } from '../../services/crm-team.service';
import { MailTemplateService } from '../../services/mail-template.service';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

export enum Tabs {
  List = 0,
  Send = 1,
  Add = 2
}

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
})

export class SendMessageComponent implements OnInit {

  @Input() messageType: GenerateMessageTypeEnum = GenerateMessageTypeEnum.Default;
  @Input() orderIds: string[] = [];
  @Input() selectedUsers: any;
  @Input() inBillExpand!:boolean;

  lstMessage: Array<QuickReplyDTO> = [];
  messages: Array<TDSSafeAny> = [];
  messageContent: TDSSafeAny[] = [];
  messageSelect: TDSSafeAny;
  messagePreview: string = '...';
  indexClick: number = -1;
  isLoading: boolean = false;
  currentTeam: TDSSafeAny;
  currentTab: Tabs = Tabs.List;
  keyFilterMail: string = '';
  formAddTemplate!: FormGroup;
  readonly typeId: string = "Messenger";

  @ViewChild('innerText') innerText!: ElementRef;
  private destroy$ = new Subject<void>();

  constructor( private fb: FormBuilder,
    private mailTemplateService: MailTemplateService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private crmActivityCampaignService: CRMActivityCampaignService,
    private fastSaleOrderService: FastSaleOrderService,
    private modal: TDSModalRef,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService) {
      this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
    });
  }

  getTabs() {
    return Tabs;
  }

  createForm() {
    this.formAddTemplate = this.fb.group({
      Name: ["", Validators.required],
      BodyPlain: ["", Validators.required]
    });
  }

  loadData() {
    this.isLoading = true;
    this.mailTemplateService.get().pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
          this.lstMessage = [...res.value];
          this.messages = [...res.value];
    }, error => {
      this.message.error(`${error?.error?.message}`);
    });
  }

  searchMail(){
    let text = this.keyFilterMail
    if(!TDSHelperString.hasValueString(text)) {
      this.lstMessage = this.messages;
    } else {
      text = TDSHelperString.stripSpecialChars(text.trim());

      let data = this.messages.filter((x: any) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1) ||
      (x.BodyPlain && TDSHelperString.stripSpecialChars(x.BodyPlain.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(text.toLowerCase())) !== -1));

      this.lstMessage =  [...data];
    }
  }

  onAddTemplate() {
    this.currentTab = Tabs.Add;
  }

  onBack() {
    this.currentTab = Tabs.List;
  }

  onMessage(item: any) {
    this.isLoading = true;
    this.currentTab = Tabs.Send;
    this.messageSelect = item;

    let model: GenerateMessageDTO = {
      Template: this.messageSelect,
    };

    if(this.messageType == GenerateMessageTypeEnum.Order) {
      model.OrderIds = this.orderIds;
      this.saleOnline_OrderService.previewMessages(model).pipe(takeUntil(this.destroy$))
        .pipe(finalize(()=>{this.isLoading = false}))
        .subscribe((res: TDSSafeAny) => {
          this.messageContent = res;
        },err=>{
          this.message.error(err.error? err.error.message : 'có lỗi xảy ra')
        });
    }

    if(this.messageType == GenerateMessageTypeEnum.Bill){
      model.SaleIds = this.selectedUsers;
      model.model = {
        SaleIds: model.SaleIds,
        Template: this.messageSelect
      }

      delete model.SaleIds;
      delete model.Template;

      this.fastSaleOrderService.generateMessages(model).pipe(takeUntil(this.destroy$))
        .pipe(finalize(()=>{this.isLoading = false})) .subscribe((res) => {
          this.messageContent = res.value;
        }, err => {
          this.message.error(err.error? err.error.message : 'có lỗi xảy ra')
      });
    }
  }

  onRemove(index: number){
    this.messageContent.splice(index,1);
  }

  onSendMessage() {
    let details = this.messageContent.map((x) => {
      return {
        CRMTeam: x.CRMTeam,
        CRMTeamId: x.CRMTeamId,
        Facebook_ASId: x.FacebookId || x.FacebookASId,
        Facebook_CommentId: x.Facebook_CommentId,
        Facebook_PostId: x.Facebook_PostId,
        Facebook_UserId: x.FacebookId,
        Facebook_UserName: x.FacebookName,
        MatchingId: x.MatchingId,
        Message: x.Content,
        PartnerId: x.PartnerId,
        TypeId: "Message",
      }
    });

    let stringDate = format(new Date(), 'dd/MM/yyyy');

    const model: SendCRMActivityCampaignDTO = {
      CRMTeamId: this.currentTeam?.Id,
      Details: details,
      Note: stringDate,
      MailTemplateId: this.messageSelect.Id,
    };

    if(this.messageType == GenerateMessageTypeEnum.Order){
      this.crmActivityCampaignService.saveOrderCampaign(JSON.stringify(model)).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.message.info('Tin nhắn đã vào hàng đợi để gửi');
          this.onCancel();
      },err => {
          this.message.error(err.error? err.error.message : 'Gửi tin nhắn thất bại')
      });
    }

    if(this.messageType == GenerateMessageTypeEnum.Bill){
      this.crmActivityCampaignService.saveBillCampaign(JSON.stringify(model)).pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {
          this.message.info('Tin nhắn đã vào hàng đợi để gửi');
          this.onCancel();
        },err=>{
          this.message.error(err.error? err.error.message:'Gửi tin nhắn thất bại')
      });
    }
  }

  onSave(type?: string) {
    let name = this.formAddTemplate.controls.Name.value as string;
    let bodyPlain = this.formAddTemplate.controls.BodyPlain.value as string;

    if (!name || !name.trim() || !bodyPlain || !bodyPlain.trim()) {
      this.message.error(Message.Template.EmptyContent);
      return;
    }

    let model: MailTemplateUpdateDTO = {
      Name: name,
      BodyPlain: bodyPlain,
      TypeId: this.typeId,
      Active: true,
    };

    this.mailTemplateService.insert(model, "Active").subscribe(res => {
      delete res['@odata.context'];
      delete res['@odata.type'];
      delete res['WritedById'];
      delete res['CreatedById'];
      delete res['CreatedById'];
      delete res['IRModelId'];
      delete res['LastUpdated'];
      delete res['MailServerId'];
      delete res['EventDatas'];

      this.lstMessage.unshift(res);
      this.message.success(Message.InsertSuccess);

      if(!TDSHelperString.hasValueString(type)) {
        this.currentTab = Tabs.List;
      }
      else {
        this.onMessage(res);
      }
      this.createForm();
    },err=>{
      this.message.error(err.error.message? err.error.message: 'Thêm tin nhắn thất bại')
    });
  }

  onPreview(message: string, index:number){
    this.messagePreview = message
    this.indexClick = index;
  }

  onSaveAndUse() {
    this.onSave();
  }

  onCancel() {
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
