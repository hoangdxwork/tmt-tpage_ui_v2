import { AutoLabelConfigComponent } from './label-config/auto-label-config.component';
import { AutoReplyConfigComponent } from './reply-config/auto-reply-config.component';
import { PostHiddenCommentConfigComponent } from './hidden-comment-config/post-hidden-comment-config.component';
import { PostOrderInteractionConfigComponent } from './interaction-config/post-order-interaction-config.component';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { PostOrderConfigComponent } from './order-config/post-order-config.component';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign.dto';

@Component({
  selector: 'config-post-outlet',
  templateUrl: './config-post-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ConfigPostOutletComponent  {

  @ViewChild(PostOrderConfigComponent ) postOrderConfig !: TDSSafeAny;
  @ViewChild(PostOrderInteractionConfigComponent ) postOrderInteractionConfig !: TDSSafeAny;
  @ViewChild(PostHiddenCommentConfigComponent ) postHiddenCommentConfig !: TDSSafeAny;
  @ViewChild(AutoReplyConfigComponent ) autoReplyConfig !: TDSSafeAny;
  @ViewChild(AutoLabelConfigComponent ) autoLabelConfig !: TDSSafeAny;

  @Input() data!: ChatomniObjectsItemDto;
  @Input() currentLiveCampaign?:LiveCampaignModel;

  selectedIndex: number = 0;

  constructor(private modalRef: TDSModalRef){
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
    return
  }
  onCannel(){
    this.modalRef.destroy(null);
  }
}
