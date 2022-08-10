import { ChatomniDataItemDto, ExtrasObjectDto } from './../../../../dto/conversation-all/chatomni/chatomni-data.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { ModalPostComponent } from './../../../../pages/conversations/components/modal-post/modal-post.component';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Router } from '@angular/router';
import { CRMTeamType } from './../../../../dto/team/chatomni-channel.dto';
import { ChatomniDataTShopPostDto } from './../../../../dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { Facebook_Graph_Post } from './../../../../dto/conversation-all/chatomni/chatomni-facebook-post.dto';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'conversation-infopost-item',
  templateUrl: './conversation-infopost-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})
export class ConversationInfopostItemComponent implements OnInit, OnChanges {

  @Input() team!: CRMTeamDTO;
  @Input() typeNumber!: number;
  @Input() data! : ExtrasObjectDto;
  @Input() item!: ChatomniDataItemDto;

  dataFacebook!: Facebook_Graph_Post;
  dataTshop!: ChatomniDataTShopPostDto;

  postPictureError: any[] = [];

  constructor(
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService,
    private destroy$: TDSDestroyService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.team.Type == CRMTeamType._Facebook && this.typeNumber == 12){
      this.dataFacebook = this.data.Data as Facebook_Graph_Post;
    }else if(this.team.Type == CRMTeamType._TShop && this.typeNumber == 91) {
      this.dataTshop = this.data.Data as ChatomniDataTShopPostDto
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
        data: this.dataFacebook,
        objectId: this.data.ObjectId
      }
    });
  }

  openPost(item: ChatomniDataItemDto, type: any) {
    if (type === 'post' && item.ObjectId) {
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
