import { PrepareUpdateFacebookByLiveCampaign } from './../../../../handler-v2/conversation-post/prepare-facebook-post.handler';
import { ObjectFacebookPostEvent } from './../../../../handler-v2/conversation-post/object-facebook-post.event';
import { LiveCampaignPostComponent } from './../live-campaign-post/live-campaign-post.component';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
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

  currentLiveCampaign!: any;
  indClickTag: string = '';
  selectedId!: string;

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
        this.currentLiveCampaign = this.item.LiveCampaign as any;
    }
    this.eventEmitter();
  }

  eventEmitter() {
    this.objectFacebookPostEvent.changeDeleteLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.currentLiveCampaign = null as any;
      }
    })

    this.objectFacebookPostEvent.changeUpdateLiveCampaignFromObject$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.currentLiveCampaign = res;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["item"] && !changes["item"].firstChange) {
        this.item = {...changes["item"].currentValue};

        if(this.item && this.item.LiveCampaign) {
          this.currentLiveCampaign = this.item.LiveCampaign as any;
        }

      this.cdRef.detectChanges();
    }

    if(changes["currentPost"] && !changes["currentPost"].firstChange) {
      this.currentPost = {...changes["currentPost"].currentValue};

      this.cdRef.detectChanges();
    }

    if(changes["postChilds"] && !changes["postChilds"].firstChange) {
      this.postChilds = [...changes["postChilds"].currentValue];

      this.cdRef.detectChanges();
    }
  }

  showModalLiveCampaign(data?: ChatomniObjectsItemDto) {

    const modal = this.modal.create({
      title: 'Chiến dịch',
      content: LiveCampaignPostComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams:{
          data: data
      }
    });
  }

  selectPost(item: ChatomniObjectsItemDto) {
    this.selectedId = item.Id
    this.selectPostItemEvent.emit(item);
  }

  openTag(item: any) {
    this.indClickTag = item.Id;
    this.showModalLiveCampaign(this.item);
  }


  closeTag(): void {
    this.indClickTag = '';
    if(!this.item.LiveCampaign && this.currentLiveCampaign) {
        this.currentLiveCampaign = null as any;
        this.item.LiveCampaignId = null as any;
        this.item.LiveCampaign = null as any;
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

                  // TODO: đẩy qua conversation-post-v2, conversation-post-view
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
