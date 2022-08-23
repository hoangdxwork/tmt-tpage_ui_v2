import { PrepareUpdateFacebookByLiveCampaign } from './../../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { FaceBookPostItemHandler } from './../../../../handler-v2/conversation-post/facebook-post-item.handler';
import { ObjectFacebookPostEvent } from './../../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignPostComponent } from './../live-campaign-post/live-campaign-post.component';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { LiveCampaignService } from './../../../../services/live-campaign.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'object-facebook-post',
  templateUrl: './object-facebook-post.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ObjectFacebookPostComponent  implements OnInit, OnChanges {

  @Input() item!: ChatomniObjectsItemDto;
  @Input() currentPost?: ChatomniObjectsItemDto;
  @Input() postChilds!: any[];
  @Input() lstOfLiveCampaign!: LiveCampaignModel[];

  @Output() selectPostItemEvent: EventEmitter<any> = new EventEmitter<any>();

  currentLiveCampaign!: LiveCampaignModel;
  indClickTag: string = '';

  constructor(private liveCampaignService: LiveCampaignService,
    private modal: TDSModalService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
    private objectFacebookPostEvent: ObjectFacebookPostEvent,
    private prepareUpdateFacebookByLiveCampaign: PrepareUpdateFacebookByLiveCampaign,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    if(this.item && this.item.LiveCampaign) {
        this.currentLiveCampaign = {
            Id: this.item.LiveCampaignId,
            Name: this.item.LiveCampaign?.Name,
            Note: this.item.LiveCampaign?.Note
        } as any;
    }

    this.eventEmitter();
  }

  eventEmitter() {
    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniObjectsItemDto) => {
          this.currentLiveCampaign = null as any;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["item"] && !changes["item"].firstChange) {
        this.item = {...changes["item"].currentValue};

        if(this.item && this.item.LiveCampaign) {
            this.currentLiveCampaign = {
                Id: this.item.LiveCampaignId,
                Name: this.item.LiveCampaign?.Name,
                Note: this.item.LiveCampaign?.Note
            } as any;
        }
    }
  }

  showModalLiveCampaign(data: ChatomniObjectsItemDto) {
    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
          data: data,
          currentLiveCampaign: this.currentLiveCampaign,
          lstOfData: this.lstOfLiveCampaign
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
    if(!this.item.LiveCampaign && this.currentLiveCampaign) {
        this.currentLiveCampaign = null as any;

        this.item.LiveCampaignId = null as any;
        this.item.LiveCampaign = null as any;
    }
  }

  onChangeLiveCampaign(item: LiveCampaignModel) {
    if(item) {
        this.currentLiveCampaign = item;
    }
  }

  updateFacebookByLiveCampaign() {
    if(this.currentLiveCampaign) {

        let id = this.currentLiveCampaign.Id;
        let model = {...this.prepareUpdateFacebookByLiveCampaign.prepareUpdateFbLiveCampaign(this.item, this.currentLiveCampaign, 'update')};

        this.liveCampaignService.updateFacebookByLiveCampaign(id, model).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              if(res && res.value) {

                  // TODO: gán lại cho item object hiện tại
                  this.item.LiveCampaignId = this.currentLiveCampaign.Id;
                  this.item.LiveCampaign = {
                      Id: this.currentLiveCampaign.Id,
                      Name:this.currentLiveCampaign.Name,
                      Note: this.currentLiveCampaign.Note
                  }

                  // TODO: đẩy qua conversation-post-v2, conversation-post-view-v3
                  this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.emit(this.item);
                  this.indClickTag = '';
                  this.message.success('Cập nhật chiến dịch thành công');
              }

              this.cdRef.markForCheck();
          },
          error: (err: any) => {
              this.indClickTag = '';
              this.message.error(err?.error?.message || 'Cập nhật chiến dịch thất bại');
          }
        })
    }
  }
}
