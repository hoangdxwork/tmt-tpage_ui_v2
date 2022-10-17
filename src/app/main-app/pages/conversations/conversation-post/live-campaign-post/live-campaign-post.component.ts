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
import { AddLivecampaignPostV2Component } from '@app/shared/add-livecampaign-postv2/add-livecampaign-postv2.component';
import { EditLiveCampaignPostComponent } from '@app/shared/edit-livecampaign-post/edit-livecampaign-post.component';

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
  pageIndex = 0;
  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  isLoadingNextdata: boolean = false;
  innerText: string = '';
  count: number = 0;

  constructor(private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private liveCampaignService: LiveCampaignService,
    private fbPostHandler: FaceBookPostItemHandler,
    private viewContainerRef: ViewContainerRef,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign,
    private modal: TDSModalService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {
    let id = this.data?.LiveCampaignId as string;
    if(id) {
      this.loadById(id);
    }
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['data'] && !changes['data'].firstChange) {
        let id = this.currentLiveCampaign.Id as string;
        if(id) {
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
      },
      error: (error: any) => {
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    })
  }

  loadData() {
    this.isLoading = true;
    this.liveCampaignService.getAvailablesV2(this.pageIndex, this.pageSize, this.innerText).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];

          this.count = res['@odata.count'];
          this.lstOfData = [...res.value];

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(`${error.error.message}` || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    })
  }

  onSelectItem(item: LiveCampaignModel) {
    this.currentLiveCampaign = null as any;
    this.currentLiveCampaign = item as any;
  }

  onSearch(event: TDSSafeAny) {
    this.innerText = event?.value;
    this.pageIndex = 0;
    if(TDSHelperString.hasValueString(this.innerText)) {
        this.innerText = TDSHelperString.stripSpecialChars(this.innerText.toLocaleLowerCase()).trim();
    }
    this.loadData();
  }

  showModelCreateLiveCampaign() {
    const modal = this.modal.create({
      title: 'Tạo mới chiến dịch',
      content: AddLivecampaignPostV2Component,
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
            this.data = this.fbPostHandler.updateLiveCampaignPost(this.data, res);

            this.innerText = '';
            this.pageIndex = 0;
            this.loadData();
            this.cdRef.detectChanges();
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
      content: EditLiveCampaignPostComponent,
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
            this.cdRef.detectChanges();
        }
      }
    })
  }

  removeLiveCampaign(){
    let id = this.currentLiveCampaign?.Id;
    let exist = this.data && id == this.data.LiveCampaignId;
    if(!exist) {
        this.currentLiveCampaign = null;
        return;
    }

    this.modal.info({
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

  showModelCopyLiveCampaign(id?: string) {
    if(!id) {
        this.message.info(Message.SelectOneLine);
        return;
    }

    const modal = this.modal.create({
      title: 'Sao chép chiến dịch',
      content: AddLivecampaignPostV2Component,
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

  trackByIndex(_: number, data: any): number {
    return data.Id;
  }

  vsEnd(event: any) {
    if(this.isLoading) {
        return;
    }

    let exisData = this.lstOfData && this.lstOfData.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
      const vsEnd = Number(this.lstOfData.length - 1) == Number(event.endIndex) && this.pageIndex >= 0 && Number(this.lstOfData.length) < this.count;
      if(vsEnd) {
          this.nextData();
      }
    }
  }

  nextData() {
    this.isLoadingNextdata = true;

    if(this.pageIndex == 0) {
        this.pageIndex = 1;
    }

    this.pageIndex += 1;
    this.liveCampaignService.getAvailablesV2(this.pageIndex, this.pageSize, this.innerText).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(res && res.value) {
            this.lstOfData = [...this.lstOfData, ...res.value];
          }
          this.isLoadingNextdata = false;
          this.cdRef.detectChanges();
      },
      error: (error: any) => {
        this.isLoadingNextdata = false;
        this.message.error(`${error?.error?.message}`)
      }
    })
  }
}
