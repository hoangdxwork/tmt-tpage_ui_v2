import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { isThisSecond } from 'date-fns';
import { TDSHelperObject, TDSModalService } from 'tmt-tang-ui';
import { ActiveMatchingItem } from '../../dto/conversation-all/conversation-all.dto';
import { CRMTeamDTO } from '../../dto/team/team.dto';
import { ModalImageStoreComponent } from '../../pages/conversations/components/modal-image-store/modal-image-store.component';

@Component({
  selector: 'tds-conversations',
  templateUrl: './tds-conversations.component.html',
  host: {  class: "w-full h-full overflow-hidden flex flex-col" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TDSConversationsComponent implements OnInit, OnChanges {

  @Input() tdsHeader?: string | TemplateRef<void>;
  @Input() data!: ActiveMatchingItem;
  @Input() psid!: string;
  @Input() type!: string;
  @Input() team!: CRMTeamDTO;
  @Output() onLoadMiniChat = new EventEmitter();
  inputValue?: string;
  isLoadingChat: boolean = false;

  constructor(private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  }

  showImageStore(): void {
  }

  loadEmojiMart(event: any) {

  }

  ngOnChanges(changes: SimpleChanges) {
  }


}
