import { CheckConversationData, CheckConversationDTO } from './../../../../dto/partner/check-conversation.dto';
import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActiveMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { DraftMessageService } from 'src/app/main-app/services/conversation/draft-message.service';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ConversationEventFacade } from 'src/app/main-app/services/facades/conversation-event.facade';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSMessageService } from 'tmt-tang-ui';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConversationService } from 'src/app/main-app/services/conversation/conversation.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';

@Component({
    selector: 'conversation-partner',
    templateUrl: './conversation-partner.component.html',
})

export class ConversationPartnerComponent extends TpageBaseComponent implements OnInit, OnChanges {

  @Input() data!: ActiveMatchingItem;
  @Input() team!: CRMTeamDTO;

  _form!: FormGroup;
  dataMatching!: ActiveMatchingItem;
  objRevenue: any;
  noteData: any = { items: [] };
  destroy$ = new Subject();

  constructor(private message: TDSMessageService,
      private draftMessageService: DraftMessageService,
      private conversationEventFacade: ConversationEventFacade,
      private conversationService: ConversationService,
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
    //TODO load dữ liệu lần đầu, khi change matching sẽ đi vào onChanges
    if(this.data && this.data?.psid == this.paramsUrl?.psid && this.team?.Id == this.paramsUrl?.teamId) {
        this.loadData(this.data);
    }
  }

  updateForm(data: CheckConversationData){
    if(data?.Id) {
        this._form.controls['FacebookASIds'].setValue(data.Facebook_ASUserId);
        this._form.patchValue(data);
    }
  }

  //TODO: xử lý thêm note
  addNote(): any {
  }

  loadNotes(page_id: string, psid: string){
    this.noteData = { items: [] };
    this.conversationService.getNotes(page_id, psid).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.noteData.items = [...this.noteData.items, ...res.Items];
    }, error => {
        this.message.error('Load ghi chú khách hàng đã xảy ra lỗi');
    })
  }

  removeNote(id: any, index: number) {
    this.conversationService.deleteNote(id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.noteData.items[index].id === id) {
        this.noteData.items.splice(index, 1);
      }
      this.message.success("Thao tác thành công");
    }, error => {
      this.message.error('Xóa ghi chú khách hàng đã xảy ra lỗi');
    });
  }

  loadPartnerRevenue(id: number){
    this.partnerService.getPartnerRevenueById(id).pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
          this.objRevenue = res;
    }, error => {
      this.message.error('Load doanh thu khách hàng đã xảy ra lỗi');
    });
  }

  loadBill(id: string) {
  }

  loadData(data: ActiveMatchingItem) {
    if(data?.page_id && data?.psid) {
      this.loadNotes(data?.page_id, data?.psid);
    }
    if(data?.partner && (data?.partner_id ||data?.partner?.id)) {
      let id = data?.partner_id || data?.partner?.id;
      this.loadPartnerRevenue(id);
    }
    if(data?.page_id && data?.psid) {
        let page_id =data?.page_id;
        let psid = data?.psid;

        this.partnerService.checkConversation(page_id, psid).pipe(takeUntil(this.destroy$))
          .subscribe((res: CheckConversationDTO) => {
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

  //Dữ liệu khi change crmmatching xử lý tại đây
  ngOnChanges(changes: SimpleChanges): void {
    //TODO: click change component
    if(!changes["data"]?.firstChange) {
      this.data = changes["data"].currentValue || {};
      this.loadData(this.data);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
