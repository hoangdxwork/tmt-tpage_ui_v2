import { TDSTabChangeEvent } from 'tds-ui/tabs';
import { AutoLabelConfigComponent } from './label-config/auto-label-config.component';
import { AutoReplyConfigComponent } from './reply-config/auto-reply-config.component';
import { PostHiddenCommentConfigComponent } from './hidden-comment-config/post-hidden-comment-config.component';
import { PostOrderInteractionConfigComponent } from './interaction-config/post-order-interaction-config.component';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { PostOrderConfigComponent } from './order-config/post-order-config.component';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { Component, Input, ViewChild, ChangeDetectionStrategy } from "@angular/core";
import { ChatomniObjectsItemDto } from '@app/dto/conversation-all/chatomni/chatomni-objects.dto';

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
  @Input() date!: string;

  selectedIndex: number = 0;

  constructor(private modalRef: TDSModalRef,
    private modalService: TDSModalService){ }

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
    switch(this.selectedIndex){
      case 0:
        return this.postOrderConfig.onCannel();
      case 1:
        return this.postOrderInteractionConfig.onCannel();
      case 2:
        return this.postHiddenCommentConfig.onCannel();
      case 3:
        return this.autoReplyConfig.onCannel();
      case 4:
        return this.autoLabelConfig.onCannel();
    }
    return
  }

  onSelectChange(event: TDSTabChangeEvent) {debugger
    // if(this.selectedIndex == 0) {
    //   if(!this.postOrderConfig.prepareCheckDrity()) {
    //     this.modalService.info({
    //       title: 'Thông báo',
    //       content: 'Cấu hình chốt đơn đã thay đổi nhưng chưa được lưu, bạn có muốn lưu không?',
    //       onOk: () => {
    //         this.postOrderConfig.onSave();
    //       },
    //       onCancel:()=>{
    //         this.selectedIndex = Number(event?.index);
    //       },
    //       okText:"Lưu",
    //       cancelText:"Bỏ qua",
    //       confirmViewType: "compact",
    //     });
    //   } else {
    //     this.selectedIndex = Number(event?.index);
    //   }
    // }
  }

  onTabClick() {debugger
    if(this.selectedIndex == 0) {
      if(!this.postOrderConfig.prepareCheckDrity()) {
        this.modalService.info({
          title: 'Thông báo',
          content: 'Cấu hình chốt đơn đã thay đổi nhưng chưa được lưu, bạn có muốn lưu không?',
          onOk: () => {
            this.postOrderConfig.onSave();
          },
          onCancel:()=>{
            this.selectedIndex = 0;
          },
          okText:"Lưu",
          cancelText:"Bỏ qua",
          confirmViewType: "compact",
        });
      } else {
        this.selectedIndex = 1;
      }
    }
  }
}
