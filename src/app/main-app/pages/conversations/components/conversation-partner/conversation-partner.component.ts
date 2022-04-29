import { CheckConversationData, CheckConversationDTO } from './../../../../dto/partner/check-conversation.dto';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSHelperString, TDSMessageService } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
})

export class ConversationPartnerComponent extends TpageBaseComponent implements OnInit, OnChanges {

  _form!: FormGroup;
  @Input() data!: ActiveMatchingItem;
  dataMatching!: ActiveMatchingItem;
  objRevenue: any;

  destroy$ = new Subject();

  constructor(private message: TDSMessageService,
      private draftMessageService: DraftMessageService,
      private conversationEventFacade: ConversationEventFacade,
      private partnerService: PartnerService,
      public crmService: CRMTeamService,
      private cdr: ChangeDetectorRef,
      private fb: FormBuilder,
      public activatedRoute: ActivatedRoute,
      public router: Router) {
        super(crmService, activatedRoute, router);
        this.createForm();
  }

  createForm(){
    this._form = this.fb.group({
        Id: [null],
        StatusText: [null],
        Name: [null],
        Phone: [null],
        PhoneReport: [null],
        Email: [null],
        Comment: [null],
        Street: [null],
        FacebookASIds: [null],
        FacebookId: [null],
        City: [null],
        District: [null],
        Ward: [null],
        Address: [null]
    });
  }

  onInit(): void {
    if(this.data) {
    }
  }

  updateForm(data: CheckConversationData){
    if(data?.Id) {
      this._form.controls['FacebookASIds'].setValue(data.Facebook_ASUserId);
      this._form.patchValue(data);
    }
  }

  loadNotes(page_id: string, psid: string){
  }

  loadPartnerRevenue(id: number){
    this.partnerService.getPartnerRevenueById(id)
      .pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.objRevenue = res;
    })
  }

  loadBill(id: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["data"] && !changes["data"].firstChange) {
        this.data = changes["data"].currentValue || {};

        if(this.data?.page_id && this.data?.psid) {
          this.loadNotes(this.data?.page_id, this.data?.psid);
        }

        if(this.data?.partner && (this.data?.partner_id || this.data?.partner?.id)) {
          let id = this.data?.partner_id || this.data?.partner?.id;
          this.loadPartnerRevenue(id);
        }

        if(this.data?.page_id && this.data?.psid) {
            let page_id = this.data?.page_id;
            let psid = this.data?.psid;

            this.partnerService.checkConversation(page_id, psid)
              .pipe(takeUntil(this.destroy$)).subscribe((res: CheckConversationDTO) => {
                  if(res?.Data && res?.Success) {
                    res.Data.Name = res?.Data.Name || this.data.name;
                    res.Data.Facebook_ASUserId = res?.Data.Facebook_ASUserId || this.data.psid;
                    res.Data.Phone = res?.Data.Phone || this.data.phone;
                    res.Data.Street = res?.Data.Street || this.data.address;

                    // this.loadBill(res.Data.Id);
                    this.updateForm(res.Data);
                  }
              }, error => {
                this.message.error('Check conversation đã xảy ra lỗi!');
            })
        }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
