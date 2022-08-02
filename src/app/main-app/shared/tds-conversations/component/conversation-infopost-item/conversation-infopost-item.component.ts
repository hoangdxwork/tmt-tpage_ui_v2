import { TDSModalService } from 'tds-ui/modal';
import { ModalPostComponent } from './../../../../pages/conversations/components/modal-post/modal-post.component';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { Router } from '@angular/router';
import { ChatomniMessageDetail, ExtrasObjectDto, ChatomniMessageDTO } from './../../../../dto/conversation-all/chatomni/chatomni-message.dto';
import { CRMTeamType } from './../../../../dto/team/chatomni-channel.dto';
import { ChatomniDataTShopPostDto } from './../../../../dto/conversation-all/chatomni/chatomni-tshop-post.dto';
import { Facebook_Graph_Post } from './../../../../dto/conversation-all/chatomni/chatomni-facebook-post.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { Component, OnInit, ChangeDetectionStrategy, Input, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'conversation-infopost-item',
  templateUrl: './conversation-infopost-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationInfopostItemComponent implements OnInit {

  @Input() team!: CRMTeamDTO;
  @Input() typeNumber!: number;
  @Input() data! : ExtrasObjectDto;
  @Input() item!: ChatomniMessageDetail;

  dataFacebook!: Facebook_Graph_Post;
  dataTshop!: ChatomniDataTShopPostDto;

  dataSource$!: Observable<ChatomniMessageDTO>;
  postPictureError: any[] = [];

  constructor(
    private router: Router,
    private viewContainerRef: ViewContainerRef,
    private modalService: TDSModalService
  ) { }

  ngOnInit(): void {
    if(this.team.Type == CRMTeamType._Facebook && this.typeNumber == 12){
      this.dataFacebook = this.data.Data as Facebook_Graph_Post;
    }else if(this.team.Type == CRMTeamType._TShop && this.typeNumber == 91) {
      this.dataTshop = this.data.Data as ChatomniDataTShopPostDto
    }
  }

  openModalPost(item: ChatomniMessageDetail) {
    let data: TDSSafeAny;
    this.dataSource$!.subscribe((res: any) => {
      data = res.extras.posts[item.ObjectId];
    });
    this.modalService.create({
      title: 'Bài viết tổng quan',
      content: ModalPostComponent,
      size: "xl",
      bodyStyle: { padding : '0px'},
      viewContainerRef: this.viewContainerRef,
      componentParams:{
        data: data
      }
    });
  }

  openPost(item: ChatomniMessageDetail, type: any) {
    if (type === 'post' && item.ObjectId) {
      this.router.navigateByUrl(`/conversation/post?teamId=${this.team.Id}&type=post&post_id=${item.ObjectId}`);
    }
  }


  errorPostPicture(item: ChatomniMessageDetail) {
    this.postPictureError.push(item?.ObjectId);
  }

  checkPostPictureError(item: ChatomniMessageDetail) {
    return this.postPictureError.find(f => f == item?.ObjectId);
  }
}
