import { ReportLiveCampaignDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { EventEmitter, OnChanges } from '@angular/core';
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
import { PrepareUpdateFacebookByLiveCampaign } from '@app/handler-v2/conversation-post/prepare-facebook-post.handler';
import { ObjectFacebookPostEvent } from '@app/handler-v2/conversation-post/object-facebook-post.event';

@Component({
  selector: 'live-campaign-post',
  templateUrl: './live-campaign-post.component.html',
  providers: [ TDSDestroyService ]
})

export class LiveCampaignPostComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;
  @Input() lstOfData: Array<LiveCampaignModel> = [];
  @Input() currentLiveCampaign!: LiveCampaignModel;

  @Output() getCurrentLiveCampaign$: EventEmitter<LiveCampaignModel> = new EventEmitter<LiveCampaignModel>();

  lstFilter!: Array<LiveCampaignModel>;
  isLoading: boolean = false;
  pageSize = 30;
  pageIndex = 1;

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private liveCampaignService: LiveCampaignService,
    private fbPostHandler: FaceBookPostItemHandler,
    private viewContainerRef: ViewContainerRef,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign,
    private modal: TDSModalService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
  }

  onSelectItem(item: LiveCampaignModel) {
      this.currentLiveCampaign = null as any;
      this.currentLiveCampaign = item;
  }

  onSearch(event: TDSSafeAny) {
    let text = event.value;
    if(TDSHelperString.hasValueString(text)){
        this.lstFilter = this.lstOfData.filter(f=> f.Name?.toLowerCase().includes(text.toLowerCase()) || f.NameNoSign?.toLowerCase().includes(text.toLowerCase()));
    } else {
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
        this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);

        this.lstOfData.map(data => {
          if(data.Id == res.Id){
            data = res;
          }
        })
      }
    })
  }

  removeLiveCampaign(){
    let id = this.currentLiveCampaign.Id;
    let model = {...this.prepareUpdateFacebookByLiveCampaign.prepareUpdateFbLiveCampaign(this.data, this.currentLiveCampaign, 'cancel')};

    this.isLoading = true;
    this.liveCampaignService.updateFacebookByLiveCampaign(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.currentLiveCampaign = null as any;

          this.data.LiveCampaignId = null as any;
          this.data.LiveCampaign = null as any;

          // TODO cập nhật ở conversation-post-v2, object-facebook-post
          this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.emit(this.data);

          this.isLoading = false;
          this.message.success('Xóa chiến dịch thành công')
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi')
      }
    });
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
        this.message.error(err?.error?.message || 'Không tải được dữ liệu thống kê');
      })
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  onSave() {
    let id = this.currentLiveCampaign.Id;
    let model = {...this.prepareUpdateFacebookByLiveCampaign.prepareUpdateFbLiveCampaign(this.data, this.currentLiveCampaign, 'update')};

    this.isLoading = true;
    this.liveCampaignService.updateFacebookByLiveCampaign(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          this.data.LiveCampaignId = this.currentLiveCampaign.Id;
          this.data.LiveCampaign = {
              Id: this.currentLiveCampaign.Id,
              Name:this.currentLiveCampaign.Name,
              Note: this.currentLiveCampaign.Note
          };

          // TODO cập nhật ở conversation-post-v2, object-facebook-post
          this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(this.data);

          this.isLoading = false;
          this.message.success('Cập nhật chiến dịch thành công');
          this.onCannel();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi')
      }
    });
  }
}
