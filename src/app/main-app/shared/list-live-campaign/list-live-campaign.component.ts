import { TDSDestroyService } from 'tds-ui/core/services';
import { ReportLiveCampaignDTO } from './../../dto/live-campaign/report-livecampain-overview.dto';
import { Observable, takeUntil } from 'rxjs';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { FacebookPostItem, From } from '../../dto/facebook-post/facebook-post.dto';
import { SaleOnlineFacebookFromDTO, SaleOnlineFacebookPostDTO } from '../../dto/saleonlineorder/sale-online-order.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { ODataLiveCampaignService } from '../../services/mock-odata/odata-live-campaign.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { addDays } from 'date-fns';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { finalize } from 'rxjs/operators';
import { AddLiveCampaignComponent } from '../add-live-campaign/add-live-campaign.component';
import { OverviewLiveCampaignComponent } from '../overview-live-campaign/overview-live-campaign.component';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'list-live-campaign',
  templateUrl: './list-live-campaign.component.html',
  providers: [TDSDestroyService]
})
export class ListLiveCampaignComponent implements OnInit {

  @Input() post!: any; //ChatomniObjectsItemDto

  filterObj: any = {
    status: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<any> = [];

  currentLiveCampaign?: any;
  isLoading: boolean = false;
  pageSize = 30;
  pageIndex = 1;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private oDataLiveCampaignService: ODataLiveCampaignService,
    private liveCampaignService: LiveCampaignService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private modal: TDSModalService
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {

  }

  getCurrentLiveCampaign(liveCampaignId: string | undefined) {
    if(TDSHelperString.hasValueString(liveCampaignId)) {
      let find = this.lstOfData.find(x => x.Id === liveCampaignId);
      this.currentLiveCampaign = find;
    }
  }

  onSelectLiveCampaign(liveCampaign: any) {
    this.currentLiveCampaign = ({...liveCampaign}) as any;
  }

  onSearch(event: TDSSafeAny) {
    this.filterObj.searchText =  event?.target.value;
    this.loadData(this.pageSize, this.pageIndex);
  }


  onSave() {
    // let facebookPost = this.prepareFacebookPost();
    // let model =  this.prepareModel(facebookPost);

    // let data = {} as any;
    // data.action = 'update';
    // data.model = model;

    // this.liveCampaignService.updateLiveCampaignPost(this.currentLiveCampaign?.Id, data).subscribe(res => {
    //   this.message.success(Message.UpdatedSuccess);
    //   this.updateLiveCampaignPost();
    // }, error => {
    //   this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
    // });
  }

  updateLiveCampaignPost() {
    this.post.live_campaign_id = this.currentLiveCampaign?.Id;
    this.post.live_campaign = {};
    this.post.live_campaign.id = this.currentLiveCampaign?.Id;
    this.post.live_campaign.name = this.currentLiveCampaign?.Name;
    this.post.live_campaign.note = this.currentLiveCampaign?.Note;
  }

  prepareModel(facebookPost: SaleOnlineFacebookPostDTO) {
    let result = {} as any;

    result.Facebook_Post = facebookPost;
    result.DateCreated = new Date();
    result.Facebook_LiveId = this.post.fbid;
    result.Facebook_Post = facebookPost;
    result.Facebook_UserAvatar = "";
    result.Facebook_UserId = this.post.account_id;
    result.Facebook_UserName  =this.post.from.name;
    result.IsActive = true;
    result.Id = this.currentLiveCampaign?.Id;
    result.Name = this.currentLiveCampaign?.Name;
    result.Note = this.currentLiveCampaign?.Note;

    return result;
  }

  prepareFacebookPost() {
    let itemPost = ({...this.post}) as FacebookPostItem;

    let picture_url = itemPost.from.picture.data.url;

    let model = {} as SaleOnlineFacebookPostDTO;
    model.from = {} as SaleOnlineFacebookFromDTO;

    model.created_time = itemPost.DateCreated;
    model.facebook_id = itemPost.fbid;
    model.from.picture = picture_url;
    itemPost.from.id = itemPost.from.id || itemPost.account_id;
    model.full_picture = "";
    model.message = itemPost.message;
    model.picture = "";
    model.source = "";
    model.source = "";

    return model;
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
        // Add live campaign vào dữ liệu
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
        // Add live campaign vào dữ liệu
      }
    })
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
        // Add live campaign vào dữ liệu
      }
    })
  }

  showModelOverViewLiveCampaign(id?: string, name?: string) {
    if(!id) {
      this.message.info(Message.SelectOneLine);
      return;
    }

    this.liveCampaignService.getReport(id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe(res => {
        this.modal.create({
          title: `${name}`,
          content: OverviewLiveCampaignComponent,
          size: "xl",
          viewContainerRef: this.viewContainerRef,
          componentParams:{
            lstOfData: res as ReportLiveCampaignDTO
          }
        });
      },
      err => {
        this.message.error(err?.error?.message || 'Không tải được dữ liệu thống kế');
      })
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

}
