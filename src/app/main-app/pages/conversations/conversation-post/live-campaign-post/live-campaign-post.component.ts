import { ReportLiveCampaignDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ChatomniObjectsItemDto } from './../../../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from '../../../../dto/live-campaign/odata-live-campaign-model.dto';
import { OverviewLiveCampaignComponent } from './../../../../shared/overview-live-campaign/overview-live-campaign.component';
import { AddLiveCampaignComponent } from './../../../../shared/add-live-campaign/add-live-campaign.component';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil, finalize } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PrepareUpdateFacebookByLiveCampaign } from '@app/handler-v2/conversation-post/prepare-facebook-post.handler';
import { ObjectFacebookPostEvent } from '@app/handler-v2/conversation-post/object-facebook-post.event';
import { SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { SortEnum } from '@core/enum';

@Component({
  selector: 'live-campaign-post',
  templateUrl: './live-campaign-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class LiveCampaignPostComponent implements OnInit, OnChanges{

  @Input() data!: ChatomniObjectsItemDto;

  lstOfData: Array<LiveCampaignModel> = [];
  currentLiveCampaign!: any;

  isLoading: boolean = false;
  pageSize = 20;
  pageIndex = 1;
  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private liveCampaignService: LiveCampaignService,
    private fbPostHandler: FaceBookPostItemHandler,
    private viewContainerRef: ViewContainerRef,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign,
    private modal: TDSModalService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    if(this.data.LiveCampaign) {
      this.currentLiveCampaign = this.data.LiveCampaign;
    }

    let id = this.data?.LiveCampaignId as string;
    if(TDSHelperString.hasValueString(id)) {
      this.loadById(id);
    }
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['data'] && !changes['data'].firstChange) {
        if(this.data.LiveCampaign) {
          this.currentLiveCampaign = { ...changes['data'].currentValue};
        }

        let id = this.currentLiveCampaign.Id as string;
        if(TDSHelperString.hasValueString(id)) {
          this.loadById(id);
        }
        this.loadData();
      }
  }

  loadById(id: string): void {
    this.liveCampaignService.getById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.currentLiveCampaign = res;
      }
    })
  }

  loadData(text?: string) {
    this.isLoading = true;
    this.liveCampaignService.getAvailables(text).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            delete res['@odata.context'];
            this.lstOfData = [...res.value];

            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (error: any) => {
            this.isLoading = false;
            this.cdRef.detectChanges();
        }
    })
  }

  onSelectItem(item: LiveCampaignModel) {
      this.currentLiveCampaign = null as any;
      this.currentLiveCampaign = item as any;
  }

  onSearch(event: TDSSafeAny) {
      this.loadData(event.value);
  }

  showModelCreateLiveCampaign() {
    const modal = this.modal.create({
      title: 'Tạo mới chiến dịch',
      content: AddLiveCampaignComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      if(TDSHelperObject.hasValue(res)) {
          this.currentLiveCampaign = res;
          this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(res);
          this.loadData();
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
        this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(res);
        this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);
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

          // TODO cập nhật ở conversation-post-v2, object-facebook-post, conversation-post-view
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

          // TODO cập nhật ở conversation-post-v2, object-facebook-post, conversation-post-view
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
