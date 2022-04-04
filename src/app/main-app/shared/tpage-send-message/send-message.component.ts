import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService, TDSModalRef, TDSSafeAny, TDSHelperString } from 'tmt-tang-ui';
import { GenerateMessageDTO, GenerateMessageFromDTO } from '../../dto/conversation/inner.dto';
import { GenerateMessageTypeEnum, SendCRMActivityCampaignDTO } from '../../dto/conversation/message.dto';
import { MailTemplateDTO, MailTemplateUpdateDTO } from '../../dto/mailtemplate/mail-template.dto';
import { CRMActivityCampaignService } from '../../services/crm-activity-campaign.service';
import { CRMTeamService } from '../../services/crm-team.service';
import { MailTemplateService } from '../../services/mail-template.service';
import { SaleOnline_OrderService } from '../../services/sale-online-order.service';

export enum Tabs {
  List = 0,
  Send = 1,
  Add = 2
}

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html'
})
export class SendMessageComponent implements OnInit {

  @Input() messageType: GenerateMessageTypeEnum = GenerateMessageTypeEnum.Default;
  @Input() orderIds: string[] = [];

  lstMessage: Array<TDSSafeAny> = [];

  messageContent: TDSSafeAny[] = [];
  messageSelect: TDSSafeAny;

  currentTeam: TDSSafeAny;
  currentTab: Tabs = Tabs.List;

  formAddTemplate!: FormGroup;

  readonly typeId: string = "Messenger";

  constructor(
    private fb: FormBuilder,
    private mailTemplateService: MailTemplateService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private crmActivityCampaignService: CRMActivityCampaignService,
    private modal: TDSModalRef,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.loadData();

    this.crmTeamService.onChangeTeam().subscribe(res => {
      this.currentTeam = res;
    });
  }

  getTabs() {
    return Tabs;
  }

  createForm() {
    this.formAddTemplate = this.fb.group({
      Name: ["", Validators.required],
      BodyPlain: [""],
    });
  }

  loadData() {
    this.mailTemplateService.getFilter('Active').subscribe(res => {
      this.lstMessage = res.value;
    });
  }

  onSearch(event: TDSSafeAny) {

  }

  onAddTemplate() {
    this.currentTab = Tabs.Add;
  }

  onBack() {
    this.currentTab = Tabs.List;
  }

  onMessage(item: any) {
    this.currentTab = Tabs.Send;
    this.messageSelect = item;

    let model: GenerateMessageDTO = {
      template: item,
    };

    if(this.messageType == GenerateMessageTypeEnum.Order) {
      model.orderIds = this.orderIds;

      this.saleOnline_OrderService.previewMessages(model).subscribe((res: TDSSafeAny) => {
        this.messageContent = res;
      });
    }
  }

  onSendMessage() {
    let details = this.messageContent.map((x) => {
      return {
        CRMTeam: x.CRMTeam,
        CRMTeamId: x.CRMTeamId,
        Facebook_ASId: x.FacebookASId,
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

    this.crmActivityCampaignService.saveOrderCampaign(JSON.stringify(model)).subscribe((res: any) => {
      this.message.success(Message.Message.SendSuccess);
      this.onCancel();
    });

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
      this.lstMessage.unshift(res);
      this.message.success(Message.InsertSuccess);

      if(!TDSHelperString.hasValueString(type)) {
        this.currentTab = Tabs.List;
      }
      else {
        this.onMessage(res);
      }

    });
  }

  onSaveAndUse() {
    this.onSave();
  }

  onCancel() {
    this.modal.destroy(null);
  }

}
