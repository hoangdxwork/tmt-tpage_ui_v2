import { ConversationPostEvent } from '@app/handler-v2/conversation-post/conversation-post.event';
import { TDSModalRef } from 'tds-ui/modal';
import { ChatomniReplyCommentModelDto } from './../../../../dto/conversation-all/chatomni/chatomni-comment.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { CRMTeamDTO } from './../../../../dto/team/team.dto';
import { ChatomniCommentService } from './../../../../services/chatomni-service/chatomni-comment.service';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
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
  @Input() lstVariants!: ReportLiveCampaignDetailDTO[];

  comment: string = '';
  currentTeam!: CRMTeamDTO | null;
  heightText: number = 100;
  isLoading: boolean = false;

  constructor(private chatomniCommentService: ChatomniCommentService,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private conversationPostEvent: ConversationPostEvent) { }

  ngOnInit(): void {
    if(this.data && this.data.ProductId) {
      this.comment = this.setInnerText(this.data);
    }

    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.currentTeam = res;
      }
    });
  }

  setInnerText(value: ReportLiveCampaignDetailDTO) {
    let msg = '';
    if(value && value.ProductName) {
      msg = msg + `Tên sản phẩm: ${value.ProductNameGet || value.ProductName}`
    }

    if(this.orderTags && this.orderTags[value.ProductId + '_' + value.UOMId] && this.orderTags[value.ProductId + '_' + value.UOMId].length > 0) {
      let tags =  this.orderTags[value.ProductId + '_' + value.UOMId].toString();
      tags = TDSHelperString.replaceAll(tags, ",", ", ");
      msg = msg + `\nMã chốt đơn: ${tags}`;
      msg = msg + `\nGiá bán: ${value.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đồng/${value.UOMName}`;
    }

    return msg;
  }

  onSend() {
    if(this.isLoading) return;

    if(!TDSHelperString.hasValueString(this.comment)) {
      this.message.error("Vui lòng nhập nội dung bình luận");
      return;
    }

    let model = this.prepareModelComment(this.comment);
    this.isLoading = true;
    this.chatomniCommentService.commentHandle(this.currentTeam!.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any[]) => {

        if(res && res.length > 0) {
          this.conversationPostEvent.onChangeReplyCommentPost$.emit(res);
        }

        this.onClose();
        this.message.success('Thao tác thành công');
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        this.message.error(error?.error?.message);
      }
    })
  }

  onInputVariants() {
    this.lstVariants.map(x => {
      this.comment = `${this.comment}\n\n${this.setInnerText(x)}`;
    })

    this.onChangeComment(this.comment);
    this.lstVariants = [];
  }

  onClose() {
    this.modalRef.destroy();
  }

  prepareModelComment(message: string): any {
    const model = {} as any;
    model.Message = message;
    model.ObjectId = this.objectId;

    return model;
  }

  onChangeComment(event: TDSSafeAny) {
      if(!TDSHelperString.hasValueString(event)) {
        this.heightText = 100;
        return;
      }

      let newHeight = this.calcHeight(event);
      if(newHeight < 100 || newHeight > 300) return;
      this.heightText = newHeight;
  }

  calcHeight(value: string) {
      let numberOfLineBreaks = (value.match(/\n/g) || []).length;
      // min-height + lines x line-height + padding + border
      let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;

      this.heightText = newHeight;
      return newHeight;
  }
}
