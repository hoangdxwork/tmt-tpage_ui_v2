import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { FacebookPostDTO, FacebookPostItem } from '@app/dto/facebook-post/facebook-post.dto';
import { PartnerTimeStampItemDto } from '@app/dto/partner/partner-timestamp.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { ChatomniCommentFacade } from '@app/services/chatomni-facade/chatomni-comment.facade';
import { GroupCommentsService } from '@app/services/group-comment.service';
import { TIDictionary } from '@core/dto';
import { take } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'group-comment',
  templateUrl: './group-comment.component.html'
})
export class GroupCommentComponent implements OnInit {
  @Input() dataComment!: FacebookPostDTO | any;

  dictActiveComment: {[key: string] : boolean } = {};
  activeNote: boolean = false;
  isLoading: boolean = false;
  // dataComment!: FacebookPostDTO | any;

  pageSize = 10000;
  pageIndex = 1;

  constructor(

  ) { }

  ngOnInit(): void {

  }

  showComment(item: any) {
    this.dictActiveComment = {};
    this.dictActiveComment[item] = true;
  }

  trackByIndex(i: any) {
    return i;
  }

  addNote(event: any) {
    // if(event && event.target && this.quickOrderModel) {
    //   let value = event.target.value;
    //   this.quickOrderModel.Note = value;
    // }
  }

}
