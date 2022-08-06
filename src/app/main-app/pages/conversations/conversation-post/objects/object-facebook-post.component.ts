import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ListLiveCampaignComponent } from 'src/app/main-app/shared/list-live-campaign/list-live-campaign.component';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'object-facebook-post',
  templateUrl: './object-facebook-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectFacebookPostComponent  implements OnInit, OnChanges {

  @Input() item?: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];
  @Input() availableCampaigns!: LiveCampaignModel[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  mdbFbPost!: MDB_Facebook_Mapping_PostDto;
  currentLiveCampaign!: LiveCampaignModel;
  indClickTag: string = '';

  constructor(private liveCampaignService: LiveCampaignService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(this.item) {
        this.mdbFbPost = this.item.Data as MDB_Facebook_Mapping_PostDto;
    }
  }

  showModalLiveCampaign(item: ChatomniObjectsItemDto) {
    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: ListLiveCampaignComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        post: item
      }
    });
  }

  selectPost(item: ChatomniObjectsItemDto) {
      this.selectPostItemEvent.emit(item);
  }

  openTag(id: string) {
    this.indClickTag = id;
  }

  closeTag(): void {
    this.indClickTag = '';
  }

  prepareLiveCampaignModel(liveCampaignModel: LiveCampaignModel, fbPostModel:MDB_Facebook_Mapping_PostDto, isDelete?:boolean){
    return {
      action: isDelete ? "cancel" : "update",
      model: {
        Id: liveCampaignModel.Id,
        IsActive: liveCampaignModel.IsActive,
        Name: liveCampaignModel.Name,
        Note: liveCampaignModel.Note,
        DateCreated: new Date().toISOString(),
        Facebook_LiveId: liveCampaignModel.Facebook_LiveId,
        Facebook_UserId: liveCampaignModel.Facebook_UserId,
        Facebook_UserName: liveCampaignModel.Facebook_UserName,
        Facebook_UserAvatar: liveCampaignModel.Facebook_UserAvatar || "",
        Facebook_Post: {
          created_time: new Date(liveCampaignModel.DateCreated).toISOString(),
          facebook_id: liveCampaignModel.Facebook_LiveId,
          from:{
            id: liveCampaignModel.Facebook_UserId,
            name: liveCampaignModel.Facebook_UserName,
            picture: liveCampaignModel.Facebook_UserAvatar || "",
          },
          full_picture: "",
          message: fbPostModel.message,
          picture: liveCampaignModel.Facebook_UserAvatar || "",
          source: "",
        }
      }
    }
  }

  addNewCampaign() {
    if(this.currentLiveCampaign){
      let model = this.prepareLiveCampaignModel(this.currentLiveCampaign, <MDB_Facebook_Mapping_PostDto>this.item?.Data);
      
      this.liveCampaignService.updateLiveCampaignPost(this.currentLiveCampaign.Id, model).pipe(takeUntil(this.destroy$)).subscribe(res => {
          if(res.value){
            (<MDB_Facebook_Mapping_PostDto>this.item?.Data).live_campaign_id = this.currentLiveCampaign.Id;
            (<MDB_Facebook_Mapping_PostDto>this.item?.Data).live_campaign = {
              name: this.currentLiveCampaign.Name,
              note: this.currentLiveCampaign.Note
            }
            this.cdr.markForCheck();
            this.message.success('Cập nhật chiến dịch thành công');
          }
      },
      err=>{
        this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
      })

      this.indClickTag = '';
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
