import { TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Observable } from 'rxjs';
import { TDSModalRef, TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { LiveCampaignService } from '../../services/live-campaign.service';
import { SaleOnline_LiveCampaignDTO, UpdateFacebookLiveCampaignDTO } from '../../dto/live-campaign/live-campaign.dto';
import { FacebookPostItem, From } from '../../dto/facebook-post/facebook-post.dto';
import { SaleOnlineFacebookFromDTO, SaleOnlineFacebookPostDTO } from '../../dto/saleonlineorder/sale-online-order.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { FilterLiveCampaignDTO, OdataLiveCampaignService } from '../../services/mock-odata/odata-live-campaign.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { addDays } from 'date-fns';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { finalize } from 'rxjs/operators';
import { AddLiveCampaignComponent } from '../add-live-campaign/add-live-campaign.component';

@Component({
  selector: 'list-live-campaign',
  templateUrl: './list-live-campaign.component.html'
})
export class ListLiveCampaignComponent implements OnInit {

  @Input() post!: FacebookPostItem;

  filterObj: FilterLiveCampaignDTO = {
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

  lstOfData: Array<SaleOnline_LiveCampaignDTO> = [];

  currentLiveCampaign?: SaleOnline_LiveCampaignDTO;
  isLoading: boolean = false;
  pageSize = 30;
  pageIndex = 1;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private odataLiveCampaignService: OdataLiveCampaignService,
    private liveCampaignService: LiveCampaignService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService
  ) { }

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataLiveCampaignService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
        // this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;
        console.log(this.lstOfData);
    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.odataLiveCampaignService
        .get(params)
        .pipe(finalize(() => this.isLoading = false ));
  }

  onSelectLiveCampaign(liveCampaign: SaleOnline_LiveCampaignDTO) {
    this.currentLiveCampaign = ({...liveCampaign}) as SaleOnline_LiveCampaignDTO;
  }

  onSearch(event: TDSSafeAny) {
    this.filterObj.searchText =  event?.target.value;
    this.loadData(this.pageSize, this.pageIndex);
  }


  onSave() {
    let facebookPost = this.prepareFacebookPost();
    let model =  this.prepareModel(facebookPost);

    let data = {} as UpdateFacebookLiveCampaignDTO;
    data.action = 'update';
    data.model = model;

    this.liveCampaignService.updateLiveCampaignPost(this.currentLiveCampaign?.Id, data).subscribe(res => {
      this.message.success(Message.UpdatedSuccess);
      this.updateLiveCampaignPost();
    }, error => {
      this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
    });
  }

  updateLiveCampaignPost() {
    this.post.live_campaign_id = this.currentLiveCampaign?.Id;
    this.post.live_campaign = {};
    this.post.live_campaign.id = this.currentLiveCampaign?.Id;
    this.post.live_campaign.name = this.currentLiveCampaign?.Name;
    this.post.live_campaign.note = this.currentLiveCampaign?.Note;
  }

  prepareModel(facebookPost: SaleOnlineFacebookPostDTO) {
    let result = {} as SaleOnline_LiveCampaignDTO;

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
        // post: item
      }
    });

    modal.componentInstance?.onSuccess.subscribe(res => {
      if(TDSHelperObject.hasValue(res)) {
        // Add live campaign vào dữ liệu
      }
    })
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

}
