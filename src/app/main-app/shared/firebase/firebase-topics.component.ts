import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { QuickReplyService } from '../../services/quick-reply.service';
import { ModalAddQuickReplyComponent } from '../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { Component, OnInit, ViewContainerRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { TDSMessageService } from 'tds-ui/message';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { FireBaseTopicDto } from '@app/dto/firebase/topics.dto';
import { AccountJournalService } from '@app/services/account-journal.service';
import { TagService } from '@app/services/tag.service';

@Component({
  selector: 'firebase-topics',
  templateUrl: './firebase-topics.component.html',
})

export class FirebaseTopicsComponent implements OnInit {

    topics: FireBaseTopicDto[] = [];

    constructor(private message: TDSMessageService,
      private tagService: TagService,
      private firebaseRegisterService: FirebaseRegisterService){
    }

    ngOnInit(){
      this.loadTopics();
      this.loadRegisterTopics();
      this.tagService.get().subscribe()
    }

    loadTopics() {
      this.firebaseRegisterService.topics().subscribe((res: any) => {})
    }

    loadRegisterTopics() {
      let model = {
        TopicIds: ["Partner:Created"]
      }

      this.firebaseRegisterService.registerTopics(model).subscribe(res => {})
    }

}
