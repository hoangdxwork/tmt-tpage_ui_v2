import { ReportLiveCampaignDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { PrepareFacebookPostHandler } from './../../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { EventEmitter } from '@angular/core';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from './../../../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from './../../../../dto/live-campaign/odata-live-campaign.dto';
import { OverviewLiveCampaignComponent } from './../../../../shared/overview-live-campaign/overview-live-campaign.component';
import { AddLiveCampaignComponent } from './../../../../shared/add-live-campaign/add-live-campaign.component';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil, finalize } from 'rxjs';
import { Component, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'live-campaign-post',
  templateUrl: './live-campaign-post.component.html',
  providers: [ TDSDestroyService ]
})

export class LiveCampaignPostComponent implements OnInit {

  @Input() post!: ChatomniObjectsItemDto;
  @Input() currentLiveCampaign?: LiveCampaignModel;
  @Input() lstOfData: Array<LiveCampaignModel> = [];
  @Output() getCurrentLiveCampaign$: EventEmitter<any> = new EventEmitter<any>();

  lstFilter!: Array<LiveCampaignModel>;
  isLoading: boolean = false;
  pageSize = 30;
  pageIndex = 1;

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService,
    private fbPostHandler: FaceBookPostItemHandler,
    private prepareHandler: PrepareFacebookPostHandler,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
  }

  onSelectLiveCampaign(liveCampaign: LiveCampaignModel) {
    this.currentLiveCampaign = {...liveCampaign};
  }

  onSearch(event: TDSSafeAny) {
    let text = event.value;
    if(TDSHelperString.hasValueString(text)){
      this.lstFilter = this.lstOfData.filter(f=> f.Name?.toLowerCase().includes(text.toLowerCase()) || f.NameNoSign?.toLowerCase().includes(text.toLowerCase()));
    }else{
      this.lstFilter = this.lstOfData;
    }
  }

  showModelCreateLiveCampaign() {
    const modal = this.modal.create({
      title: 'Tạo mới chiến dịch',
      content: AddLiveCampaignComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
      }
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      if(TDSHelperObject.hasValue(res)) {
        this.lstOfData.push(res);
      }
    })
  }

  showModelEditLiveCampaign(id?: string) {
    if(!id) {
      this.message.info(Message.SelectOneLine);
      return;
    }

    const modal = this.modal.create({
      title: 'Chỉnh sửa chiến dịch',
      content: AddLiveCampaignComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        id: id
      }
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      if(TDSHelperObject.hasValue(res)) {
        this.currentLiveCampaign = res;
        this.post.Data = this.fbPostHandler.updateLiveCampaignPost(res, (<MDB_Facebook_Mapping_PostDto> this.post.Data));

        this.lstOfData.map(data => {
          if(data.Id == res.Id){
            data = res;
          }
        })
      }
    })
  }

  removeLiveCampaign(){
    delete this.currentLiveCampaign;
  }

  showModelCopyLiveCampaign(id?: string) {
    if(!id) {
      this.message.info(Message.SelectOneLine);
      return;
    }

    const modal = this.modal.create({
      title: 'Sao chép chiến dịch',
      content: AddLiveCampaignComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        id: id,
        isCopy: true
      }
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      if(TDSHelperObject.hasValue(res)) {
        this.lstOfData.push(res);
      }
    })
  }

  showModelOverViewLiveCampaign(id?: string, name?: string) {
    if(!id) {
      this.message.info(Message.SelectOneLine);
      return;
    }

    this.isLoading = true;

    this.liveCampaignService.getReport(id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe(res => {
        this.modal.create({
          title: `${name}`,
          content: OverviewLiveCampaignComponent,
          size: "xl",
          viewContainerRef: this.viewContainerRef,
          componentParams:{
            liveCampaignId: this.currentLiveCampaign?.Id,
            lstOfData: res as ReportLiveCampaignDTO
          }
        });
      },
      err => {
        this.message.error(err?.error?.message || 'Không tải được dữ liệu thống kế');
      })
  }

  onSave() {
    let data = this.prepareHandler.prepareModel((<MDB_Facebook_Mapping_PostDto> this.post?.Data), this.currentLiveCampaign);
    let liveCampaignId = this.currentLiveCampaign?.Id || (<MDB_Facebook_Mapping_PostDto> this.post?.Data)?.live_campaign_id;
    
    this.liveCampaignService.updateLiveCampaignPost(liveCampaignId, data).pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.message.success(Message.UpdatedSuccess);

      this.post.Data = this.fbPostHandler.updateLiveCampaignPost(res, (<MDB_Facebook_Mapping_PostDto> this.post.Data));
      this.getCurrentLiveCampaign$.emit(this.currentLiveCampaign);
      this.modalRef.destroy(null);

    }, error => {
      this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
    });
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
