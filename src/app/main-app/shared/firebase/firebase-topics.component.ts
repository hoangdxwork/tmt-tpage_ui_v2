import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { QuickReplyService } from '../../services/quick-reply.service';
import { ModalAddQuickReplyComponent } from '../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSDestroyService } from 'tds-ui/core/services';

@Component({
  selector: 'firebase-topics',
  templateUrl: './firebase-topics.component.html',
  providers: [TDSDestroyService]
})

export class FirebaseTopicsComponent {

}
