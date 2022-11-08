import { ModalListPostComponent } from './../../pages/conversations/components/modal-list-post/modal-list-post.component';
import { GetAllFacebookPostDTO } from './../../dto/live-campaign/getall-facebook-post.dto';
import { LiveCampaignModel } from './../../dto/live-campaign/odata-live-campaign-model.dto';
import { ChatomniObjectsItemDto } from './../../dto/conversation-all/chatomni/chatomni-objects.dto';
import { PrepareUpdateFacebookByLiveCampaign } from './../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { ObjectFacebookPostEvent } from './../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignPostComponent } from './../../pages/conversations/conversation-post/live-campaign-post/live-campaign-post.component';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs';
import { LiveCampaignDTO } from './../../dto/live-campaign/odata-live-campaign.dto';
import { LiveCampaignService } from './../../services/live-campaign.service';
import { ReportLiveCampaignDTO, OverviewReportDTO } from './../../dto/live-campaign/report-livecampain-overview.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { Message } from '@core/consts/message.const';
import { EditLiveCampaignPostComponent } from '../edit-livecampaign-post/edit-livecampaign-post.component';

@Component({
  selector: 'overview-live-campaign',
  templateUrl: './overview-live-campaign.component.html',
  providers : [TDSDestroyService]
})

export class OverviewLiveCampaignComponent implements OnInit {

  @Input() liveCampaignId!: string;
  @Input() data!: ChatomniObjectsItemDto;
  @Input() isNoPost!: boolean;

  isLoading: boolean = false;
  indClickStatus:string = '';
  currentQuantity:number = 0;

  dataLiveCampaign!: LiveCampaignDTO;
  dataOverviewReport!: OverviewReportDTO;
  facebookPosts: GetAllFacebookPostDTO[] = [];

  constructor(private modelRef: TDSModalRef,
    private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign
    ) { }

  ngOnInit(): void {
    if(this.liveCampaignId) {
      this.loadData();
    }
  }

  onCannel() {
    this.modelRef.destroy(null);
  }

  loadData() {
    this.loadOverviewReport(this.liveCampaignId);
    this.loadLiveCampaign(this.liveCampaignId);
    this.loadFacebookPost(this.liveCampaignId);
  }

  loadLiveCampaign(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.dataLiveCampaign = {...res};

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
          this.cdr.markForCheck();
        }
      });
  }

  loadOverviewReport (id: string) {
    this.isLoading = true;
    this.liveCampaignService.overviewReport(id).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
          this.dataOverviewReport = {...res};

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Tải dữ liệu thất bại');
          this.cdr.markForCheck();
        }
      });
  }

  loadFacebookPost(id: string) {
    this.isLoading = true;
    this.liveCampaignService.getAllFacebookPost(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: res => {
        if(res) {
          this.facebookPosts = [...res];
        }

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
       this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
        this.cdr.markForCheck();
    }
    })
  }

  removeLiveCampaign(){
    let id = this.liveCampaignId;
    let exist = this.data && id == this.data.LiveCampaignId;
    if(!exist) {
        return;
    }

    let currentLiveCampaign = {...this.dataLiveCampaign} as LiveCampaignModel

    this.modalService.info({
      title: 'Xóa chiến dịch live',
      content: `Bạn có chắc muốn xóa chiến dịch <span class="text-info-500 font-semibold">${this.dataLiveCampaign.Name}</span>`,
      onOk: () => {
          let model = {...this.prepareUpdateFacebookByLiveCampaign.prepareUpdateFbLiveCampaign(this.data, currentLiveCampaign, 'cancel')};
          this.isLoading = true;

          this.liveCampaignService.updateFacebookByLiveCampaign(id, model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.data.LiveCampaignId = null as any;
                this.data.LiveCampaign = null as any;

                // TODO cập nhật ở conversation-post-v2, object-facebook-post, conversation-post-view
                this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.emit(this.data);

                this.isLoading = false;
                this.message.success('Bỏ chọn chiến dịch thành công');
                this.modelRef.destroy(null);

                this.cdr.detectChanges();
            },
            error: (error: any) => {
                this.isLoading = false;
                this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
                this.cdr.detectChanges();
            }
          });
      },
      okText: "Xác nhận",
      cancelText: "Hủy bỏ"
    })
  }

  showModelEditLiveCampaign(id: any) {
    if(!id) {
      this.message.info(Message.SelectOneLine);
      return;
    }

    const modal = this.modalService.create({
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
            // TODO: cập nhật object-facebook-post
            this.loadOverviewReport(this.liveCampaignId);
            this.loadLiveCampaign(this.liveCampaignId);

            this.cdr.detectChanges();
        }
      }
    })
  }

  showModalChangeLiveCampaign() {
    const modal = this.modalService.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        data: this.data
      }
    })

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (id: any) => {
        if(id) {
          this.liveCampaignId = id;
          this.loadData();
        }
      }
    })
  }

  showModalLstPost () {
    if(this.facebookPosts.length > 0){
      const modal = this.modalService.create({
        title: `Danh sách bài viết (${this.facebookPosts.length})`,
        content: ModalListPostComponent,
        size: "xl",
        viewContainerRef: this.viewContainerRef,
        componentParams:{
          facebookPosts: this.facebookPosts
        }
      })
    }
  }
}
