import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TDSTabChangeEvent } from 'tds-ui/tabs';
import { AutoLabelConfigComponent } from './label-config/auto-label-config.component';
import { AutoReplyConfigComponent } from './reply-config/auto-reply-config.component';
import { PostHiddenCommentConfigComponent } from './hidden-comment-config/post-hidden-comment-config.component';
import { PostOrderInteractionConfigComponent } from './interaction-config/post-order-interaction-config.component';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { PostOrderConfigComponent } from './order-config/post-order-config.component';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, OnInit, ViewChild} from "@angular/core";
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

@Component({
  selector: 'config-post-outlet',
  templateUrl: './config-post-outlet.component.html',
  providers: [TDSDestroyService]
})

export class ConfigPostOutletComponent implements OnInit {

  @ViewChild(PostOrderConfigComponent) postOrderConfig!: TDSSafeAny;
  @ViewChild(PostOrderInteractionConfigComponent) postOrderInteractionConfig!: TDSSafeAny;
  @ViewChild(PostHiddenCommentConfigComponent) postHiddenCommentConfig!: TDSSafeAny;
  @ViewChild(AutoReplyConfigComponent) autoReplyConfig!: TDSSafeAny;
  @ViewChild(AutoLabelConfigComponent) autoLabelConfig!: TDSSafeAny;

  @Input() data!: ChatomniObjectsItemDto;

  selectedIndex: number = 0;
  selectedIndexChanged: number = 0;
  isDisable: boolean = false;

  constructor(private modalRef: TDSModalRef,
    private facebookPostService: FacebookPostService,
    private destroy$: TDSDestroyService){ }

  ngOnInit(): void {
    this.eventEmitter();
  }

  eventEmitter() {
    this.facebookPostService.onChangeDisable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: boolean) => {
        this.isDisable = res;
      }
    })
  }

  onSave(){
    switch(this.selectedIndex){
      case 0:
        return this.postOrderConfig.onSave();
      case 1:
        return this.postOrderInteractionConfig.onSave();
      case 2:
        return this.postHiddenCommentConfig.onSave();
      case 3:
        return this.autoReplyConfig.onSave();
      case 4:
        return this.autoLabelConfig.onSave();
    }
    return;
  }

  onCancel(){
    switch(this.selectedIndex){
      case 0:
        return this.postOrderConfig.onCancel();
      case 1:
        return this.postOrderInteractionConfig.onCancel();
      case 2:
        return this.postHiddenCommentConfig.onCancel();
      case 3:
        return this.autoReplyConfig.onCancel();
      case 4:
        return this.autoLabelConfig.onCancel();
    }
    return;
  }

  onSelectChange(event: TDSTabChangeEvent) {
    if(this.selectedIndex != 0 && this.selectedIndexChanged == 0) {
      this.postOrderConfig.onCheckSelectChange();
    }

    this.selectedIndexChanged = Number(event.index);
  }
}
