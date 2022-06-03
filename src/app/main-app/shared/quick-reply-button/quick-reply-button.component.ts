import { PartnerService } from './../../services/partner.service';
import { QuickReplyDTO } from './../../dto/quick-reply.dto.ts/quick-reply.dto';
import { QuickReplyService } from './../../services/quick-reply.service';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { TDSModalService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'quick-reply-button',
  templateUrl: './quick-reply-button.component.html',
})
export class QuickReplyButtonComponent implements OnInit {
  @Output() onQuickReplySelected = new EventEmitter<any>();

  isVisibleReply: boolean = false;
  quickReplies: Array<QuickReplyDTO> = [];

  destroy$ = new Subject();

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private quickReplyService: QuickReplyService,
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.quickReplyService.dataActive$
    .pipe(takeUntil(this.destroy$))
    .pipe(finalize( ()=>{ }))
    .subscribe(res => {
      if(res) {
        let local = localStorage.getItem('arrOBJQuickReply')
          // let getArr = JSON.parse(local) || {};
          this.quickReplies = [...res.value]
      }
    });
  }

  showModalAddQuickReply() {
    this.modalService.create({
      title: 'Thêm mới trả lời nhanh',
      content: ModalAddQuickReplyComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {}
    });
  }

}
