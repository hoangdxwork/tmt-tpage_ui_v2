import { ReportLiveCampaignDTO } from './../../../../dto/live-campaign/report-livecampain-overview.dto';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ChatomniObjectsItemDto } from './../../../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from '../../../../dto/live-campaign/odata-live-campaign-model.dto';
import { OverviewLiveCampaignComponent } from './../../../../shared/overview-live-campaign/overview-live-campaign.component';
import { AddLiveCampaignPostComponent } from '../../../../shared/add-live-campaign/add-livecampaign-post.component';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { PrepareUpdateFacebookByLiveCampaign } from '@app/handler-v2/conversation-post/prepare-facebook-post.handler';
import { ObjectFacebookPostEvent } from '@app/handler-v2/conversation-post/object-facebook-post.event';
import { SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { SortEnum } from '@core/enum';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'live-campaign-post',
  templateUrl: './live-campaign-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class LiveCampaignPostComponent implements OnInit, OnChanges{

  @Input() data!: ChatomniObjectsItemDto;

  lstOfData: Array<LiveCampaignModel> = [];
  currentLiveCampaign: any;

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
    let id = this.data?.LiveCampaignId as string;
    if(TDSHelperString.hasValueString(id)) {
      this.loadById(id);
    }
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes['data'] && !changes['data'].firstChange) {
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
          this.cdRef.detectChanges();
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
      content: AddLiveCampaignPostComponent,
      size: "xl",
      bodyStyle: {
        padding: '0px',
      },
      viewContainerRef: this.viewContainerRef
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
            this.currentLiveCampaign = res;

            // TODO: cập nhật object-facebook-post
            this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(res);
            this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);
            this.loadData();
        }
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
      content: AddLiveCampaignPostComponent,
      size: "xl",
      bodyStyle: {
        padding: '0px',
      },
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        id: id
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res) {
            this.currentLiveCampaign = res;

            // TODO: cập nhật object-facebook-post
            this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(res);
            this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);
        }
      }
    })
  }

  removeLiveCampaign(){
    let id = this.currentLiveCampaign?.Id;
    if(id && Guid.isGuid(id)) {

      this.modal.success({
        title: 'Xóa chiến dịch live',
        content: `Bạn có chắc muốn xóa chiến dịch <span class="text-info-500 font-semibold">${this.currentLiveCampaign.Name}</span>`,
        onOk: () => {
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
                  this.message.success('Bỏ chọn chiến dịch thành công');
                  this.cdRef.detectChanges();
              },
              error: (error: any) => {
                  this.isLoading = false;
                  this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
                  this.cdRef.detectChanges();
              }
            });
        },
        okText: "Xác nhận",
        cancelText: "Hủy bỏ"
      })
    }
  }

  showModelCopyLiveCampaign(id?: string) {
    if(!id) {
        this.message.info(Message.SelectOneLine);
        return;
    }

    const modal = this.modal.create({
      title: 'Sao chép chiến dịch',
      content: AddLiveCampaignPostComponent,
      size: "xl",
      bodyStyle: {
        padding: '0px',
      },
      viewContainerRef: this.viewContainerRef,
      componentParams:{
          id: id,
          isCopy: true
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if(res) {
          this.loadData();
      }
    })
  }

  showModelOverViewLiveCampaign(id?: string, name?: string) {
    if(!id) {
        this.message.info(Message.SelectOneLine);
        return;
    }

    this.isLoading = true;
    this.liveCampaignService.getReport(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.modal.create({
          title: `${name}`,
          content: OverviewLiveCampaignComponent,
          size: "xl",
          bodyStyle: {
            padding: '0px',
          },
          viewContainerRef: this.viewContainerRef,
          componentParams:{
            liveCampaignId: this.currentLiveCampaign?.Id,
            lstOfData: res as ReportLiveCampaignDTO
          }
        });

        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Không tải được dữ liệu thống kê');
        this.cdRef.detectChanges();
      }
    })
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  onSave() {
    let id = this.currentLiveCampaign?.Id;
    if(id && Guid.isGuid(id)) {
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
}
