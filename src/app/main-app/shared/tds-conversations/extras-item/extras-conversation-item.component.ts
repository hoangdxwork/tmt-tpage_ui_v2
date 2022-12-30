import { debounceTime } from 'rxjs/operators';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { ChatomniObjectsItemDto, MDB_Facebook_Mapping_PostDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { ChatomniDataItemDto } from '@app/dto/conversation-all/chatomni/chatomni-data.dto';
import { ChatomniDataTShopPostDto } from '@app/dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { ModalPostComponent } from '@app/pages/conversations/components/modal-post/modal-post.component';
import { ChatomniObjectService } from '@app/services/chatomni-service/chatomni-object.service';
import { SessionParamsDto } from '@app/pages/conversations/conversation-post/conversation-post.component';
import { TDSHelperString } from 'tds-ui/shared/utility';

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
    private chatomniObjectService: ChatomniObjectService,
    private destroy$: TDSDestroyService) { }

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

  openPost(item: ChatomniDataItemDto, type: any) {
    if (type === 'post' && item.ObjectId) {
        this.setSessionStoragePostId(item);
        this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.ObjectId}`);
    }
  }

  setSessionStoragePostId(item: ChatomniDataItemDto ): any {
    const _keyCache = this.chatomniObjectService._keycache_params_postid;
    let data: SessionParamsDto = {
      ObjectId: item.ObjectId,
      ParentId: '',
    }

    if(item && item.Data && item.Data.parent && item.Data.parent.id && item.Data.parent.id != item.ObjectId) {
      data.ParentId = item.Data.parent.id;
    }

    sessionStorage.setItem(_keyCache, JSON.stringify(data));
  }

  errorPostPicture(item: ChatomniDataItemDto) {
    this.postPictureError.push(item?.ObjectId);
  }

  checkPostPictureError(item: ChatomniDataItemDto) {
    return this.postPictureError.find(f => f == item?.ObjectId);
  }
}
