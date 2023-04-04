import { takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { SessionParamsService } from './../../../services/session-params.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataItemDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { ModalPostComponent } from '@app/pages/conversations/components/modal-post/modal-post.component';
import { SharesDetailModalComponent } from '../shares-detail-modal/shares-detail-modal.component';
import { SharedService } from '@app/services/shared.service';
import { GetSharedDto } from '@app/dto/conversation/post/get-shared.dto';

@Component({
  selector: 'extras-conversation-item',
  templateUrl: './extras-conversation-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})

export class ExtrasConversationItemComponent implements OnInit, OnChanges {

  @Input() team!: CRMTeamDTO;
  @Input() typeNumber!: number;
  @Input() data! : ChatomniObjectsItemDto;
  @Input() item!: ChatomniDataItemDto;

  postPictureError: any[] = [];

  constructor(private router: Router,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private sharedService: SharedService,
    private destroy$: TDSDestroyService,
    private sessionParamsService: SessionParamsService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.team.Type == CRMTeamType._Facebook && this.typeNumber == 12){
    }else if(this.team.Type == CRMTeamType._TShop && this.typeNumber == 91) {
    }
  }

  ngOnInit(): void {
  }

  openModalPost(item: ChatomniDataItemDto) {
    this.modalService.create({
      title: 'Bài viết tổng quan',
      content: ModalPostComponent,
      size: "xl",
      bodyStyle: { padding : '0px'},
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        data: this.data,
        objectId: this.data.ObjectId,
        currentTeam: this.team
      }
    });
  }

  openModalShare() {
    if(this.team && this.team.Type ==  CRMTeamType._Facebook) {
      let objectId = this.data.ObjectId;
      if(!objectId) {
        this.message.error('Không tìm thấy ObjectId');
        return;
      }

      let teamId = this.team.Id;
      if(!teamId) {
        this.message.error('Không tìm thấy TeamId');
        return;
      }

      let uid = this.team.ChannelId || this.team.Facebook_ASUserId;
      if(!uid) {
        this.message.error('Không tìm thấy uid');
        return;
      }

      this.sharedService.fbGetShareds(uid, objectId, teamId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: GetSharedDto[]) => {
          if(res && res.length > 0) {
            this.data.CountReaction = res.length || 0;

            this.modalService.create({
              title: 'Số lượt share',
              content: SharesDetailModalComponent,
              size: "xl",
              bodyStyle: { padding : '0px'},
              viewContainerRef: this.viewContainerRef,
              componentParams:{
                lstShared: res,
                objectId: objectId,
                team: this.team
              }
            });
          } else {
            this.message.info('Không có lượt chia sẻ nào');
          }
        },
        error: (error: any) => {
          this.message.error(error?.error?.message);
        }
      })
    }
  }
  openPost(item: ChatomniDataItemDto, type: any) {
    if (type === 'post' && item.ObjectId) {
        this.sessionParamsService.setSessionStoragePostId(item);
        this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.ObjectId}`);
    }
  }

  errorPostPicture(item: ChatomniDataItemDto) {
    this.postPictureError.push(item?.ObjectId);
  }

  checkPostPictureError(item: ChatomniDataItemDto) {
    return this.postPictureError.find(f => f == item?.ObjectId);
  }
}
