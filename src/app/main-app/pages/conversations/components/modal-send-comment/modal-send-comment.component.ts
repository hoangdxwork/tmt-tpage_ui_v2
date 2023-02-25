import { TDSModalRef } from 'tds-ui/modal';
import { ChatomniReplyCommentModelDto } from './../../../../dto/conversation-all/chatomni/chatomni-comment.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { CRMTeamDTO } from './../../../../dto/team/team.dto';
import { ChatomniCommentService } from './../../../../services/chatomni-service/chatomni-comment.service';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { ReportLiveCampaignDetailDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-send-comment',
  templateUrl: './modal-send-comment.component.html',
  providers: [TDSDestroyService]
})
export class ModalSendCommentComponent implements OnInit {
  @Input() data !: ReportLiveCampaignDetailDTO;
  @Input() orderTags : { [key: string] : string[] } = {};
  @Input() objectId !: string;

  innerText!: string
  isLoading: boolean = false;
  currentTeam!: CRMTeamDTO | null;

  constructor(private chatomniCommentService: ChatomniCommentService,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef) { }

  ngOnInit(): void {
    this.innerText = this.setinnerText();
    
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.currentTeam = res;
      }
    });
  }

  setinnerText() {
    let mess = '';
    if(this.data && this.data.ProductName) {
      mess = mess + `Tên sản phẩm là: ${this.data.ProductNameGet || this.data.ProductName}`
    }
    if(this.orderTags && this.orderTags[this.data.ProductId + '_' + this.data.UOMId] && this.orderTags[this.data.ProductId + '_' + this.data.UOMId].length > 0) {
      let tags =  this.orderTags[this.data.ProductId + '_' + this.data.UOMId].toString();
      tags = TDSHelperString.replaceAll(tags, ",", ", ");
      mess = mess + `\nMã chốt đơn là: ${tags}`
    }

    return mess;
  }

  checkIncludes(event: TDSSafeAny) {{

  }}
  
  onSend() {
    let model = this.prepareModelComment(this.innerText);
    this.chatomniCommentService.commentHandle(this.currentTeam!.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.onClose();
      },
      error: error => {
        this.message.error(error?.error?.message);
      }
    })
  }

  onClose() {
    this.modalRef.destroy();
  }

  prepareModelComment(message: string): any {
    const model = {} as any;
    model.Message = message;
    model.ObjectId = this.objectId

    return model;
  }
}
