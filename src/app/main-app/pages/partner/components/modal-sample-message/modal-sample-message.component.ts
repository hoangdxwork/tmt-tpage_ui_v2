import { ODataQuickReplyDTO, QuickReplyDTO } from './../../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuickReplyService } from './../../../../services/quick-reply.service';
import { Component, OnInit, Input } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-modal-sample-message',
  templateUrl: './modal-sample-message.component.html'
})
export class ModalSampleMessageComponent implements OnInit {

  listSampleMessage!: QuickReplyDTO[];
  count!: number;
  pageSize: number = 20;
  private destroy$ = new Subject<void>();
  constructor(
    private modal: TDSModalRef,
    private quickReplyService: QuickReplyService,
    ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.quickReplyService.getOnlyActive().pipe(takeUntil(this.destroy$)).subscribe((res:ODataQuickReplyDTO)=>{
      if(res){
        this.listSampleMessage = [...res.value]
        this.count = res['@odata.count'] as number;
      }

    })
  }

  selectQuickReply(data: QuickReplyDTO){
    if(data){
      this.modal.destroy(data)
    }
  }

  cancel(){
    this.modal.destroy(null)
  }
}
