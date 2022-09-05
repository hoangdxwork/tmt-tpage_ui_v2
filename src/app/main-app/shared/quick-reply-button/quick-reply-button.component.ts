import { PartnerService } from './../../services/partner.service';
import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { QuickReplyService } from './../../services/quick-reply.service';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'quick-reply-button',
  templateUrl: './quick-reply-button.component.html',
})
export class QuickReplyButtonComponent implements OnInit {
  @Output() onQuickReplySelected = new EventEmitter<any>();

  isVisibleReply: boolean = false;
  quickReplies: Array<QuickReplyDTO> = [];
  lstquickReplyDefault!: Array<QuickReplyDTO>
  objQuickReply: TDSSafeAny = {};
  partner: TDSSafeAny;
  keyFilterMail: string = '';

  destroy$ = new Subject();

  constructor(
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private quickReplyService: QuickReplyService,
    private partnerService: PartnerService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.partnerService.onLoadOrderFromTabPartner$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.partner = res;
      }
    });

    this.quickReplyService.setDataActive();
    this.quickReplyService.getDataActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if (res) {
          let getArr = JSON.parse(localStorage.getItem('arrOBJQuickReply') || '{}');
          this.quickReplies = res?.sort((a: TDSSafeAny, b: TDSSafeAny) => {
              if (getArr != null) {
                return (getArr[b.Id] || { TotalView: 0 }).TotalView - (getArr[a.Id] || { TotalView: 0 }).TotalView;
              } else
              return
          });

          this.lstquickReplyDefault = this.quickReplies;
        }
      },
      error: (error: any) => {
          this.message.error(error?.error.message || 'Load trả lời nhanh thất bại');
      }
    });
  }

  showModalAddQuickReply() {
    this.isVisibleReply = false;
    let modal = this.modalService.create({
      title: 'Thêm mới trả lời nhanh',
      centered: true,
      content: ModalAddQuickReplyComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {}
    });
    modal.afterClose.subscribe(result=>{
      console.log(result)
    })
  }

  changeVisible(event: boolean){
    if(!event){
      this.searchMail();
    }
  }

  setTextquickReply(item: QuickReplyDTO) {
    let getArr = JSON.parse(localStorage.getItem('arrOBJQuickReply') || '{}');
    if (getArr === null) {
      this.objQuickReply[item.Id] = {
        TotalView: 1,
        LastViewDate: new Date(),
      };
      localStorage.setItem('arrOBJQuickReply', JSON.stringify(this.objQuickReply));
    } else {
      let findIndex = getArr[item.Id];
      if (findIndex === undefined) {
        getArr[item.Id] = {
          TotalView: 1,
          LastViewDate: new Date()
        };
      } else {
        findIndex.TotalView = findIndex.TotalView + 1;
        findIndex.LastViewDate = new Date();
      }

      localStorage.setItem('arrOBJQuickReply', JSON.stringify(getArr));
    }

    this.onQuickReplySelected.emit(item);
    this.isVisibleReply = false;

  }

  searchMail(){
    let data = this.lstquickReplyDefault;
    let key = this.keyFilterMail;
    if (TDSHelperString.hasValueString(key)) {
      key = TDSHelperString.stripSpecialChars(key.trim());
    }
    data = data.filter((x) =>
      (x.Name && TDSHelperString.stripSpecialChars(x.Name.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1) ||
      (x.BodyPlain && TDSHelperString.stripSpecialChars(x.BodyPlain.toLowerCase()).indexOf(TDSHelperString.stripSpecialChars(key.toLowerCase())) !== -1))
    this.quickReplies = data
  }

}
