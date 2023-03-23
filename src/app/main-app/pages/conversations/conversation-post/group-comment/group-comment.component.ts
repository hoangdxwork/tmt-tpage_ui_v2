import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { FacebookPostDTO, FacebookPostItem } from '@app/dto/facebook-post/facebook-post.dto';
import { GroupCommentsService } from '@app/services/group-comment.service';
import { TIDictionary } from '@core/dto';
import { take } from 'lodash';
import { Observable, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'group-comment',
  templateUrl: './group-comment.component.html'
})
export class GroupCommentComponent implements OnInit {
  @Input() data!: ChatomniObjectsItemDto;

  dictActiveComment: {[key: string] : boolean } = {};
  activeNote: boolean = false;
  isLoading: boolean = false;
  dataComment!: FacebookPostDTO | any;

  pageSize = 10000;
  pageIndex = 1;

  constructor(
    private groupCommentsService: GroupCommentsService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {
    this.loadDataGroupComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["data"] && !changes["data"].firstChange) {
      this.dataComment = null;
      this.dictActiveComment = {};

      this.data = { ...changes["data"].currentValue };
      this.loadDataGroupComments();
    }

    if (changes["innerText"] && !changes["innerText"].firstChange && TDSHelperString.isString(changes["innerText"].currentValue)) {
      this.loadDataGroupComments();
    }
  }

  showComment(item: any) {
    this.dictActiveComment = {};
    this.dictActiveComment[item] = true;
  }

  trackByIndex(i: any) {
    return i;
  }

  loadDataGroupComments() {
    this.isLoading = true;
    let params = `page=${this.pageIndex}&limit=${this.pageSize}`;

    this.groupCommentsService.getGroupComments(this.data.ObjectId, params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: FacebookPostDTO) => {
        this.dataComment = res;
        this.isLoading = false;
      }, error: (err: any) => {
        this.message.error(`${err?.error?.message}` ? `${err?.error?.message}` : "Load dữ liệu thất bại!");
        this.isLoading = false;
      }
    })
  }

  addNote() {
    // if (Number(index) >=0 && this.contentMessageChild && this.contentMessageChild._results[Number(index)] && this.contentMessageChild._results[Number(index)].nativeElement && this.contentMessageChild._results[Number(index)].nativeElement.outerText){
    //   model.value = this.contentMessageChild._results[Number(index)].nativeElement.outerText;
    // } else {
    //   model.value = value;
    // }
  }

}
