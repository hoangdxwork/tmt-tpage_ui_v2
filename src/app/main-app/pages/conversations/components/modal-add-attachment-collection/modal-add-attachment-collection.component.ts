import { Component, Input, OnInit } from '@angular/core';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSHelperObject } from 'tds-ui/shared/utility';

@Component({
  selector: 'modal-add-attachment-collection',
  templateUrl: './modal-add-attachment-collection.component.html'
})
export class ModalAddAttachmentCollectionComponent implements OnInit {

  @Input() attachmentIds: Array<string | undefined> = [];
  @Input() collectionId?: string;

  isLoading: boolean = false;
  public lstData$!: Observable<MDBCollectionDTO[]>;
  select!: MDBCollectionDTO;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private attachmentDataFacade: AttachmentDataFacade
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lstData$ = this.attachmentDataFacade.makeCollection().pipe(map(res => {
      if(res && res[0]) {
        this.select = res[0];
      }
      return res;
    }));
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      if(this.attachmentIds && !this.collectionId) {
        this.attachmentDataFacade.addInnerByAttachment(this.select.id, this.attachmentIds).subscribe(res => {
          this.message.success(Message.InsertSuccess);
          this.onCancel();
        }, error => {
          this.message.error(`${error?.Message || JSON.stringify(error)}`);
        });
      }
      else if(this.attachmentIds && this.collectionId) {
        this.attachmentDataFacade.addInnerByCollection(this.select.id, this.collectionId, this.attachmentIds).subscribe(res => {
          this.message.success(Message.InsertSuccess);
          this.onCancel();;
        }, error => {
          this.message.error(`${error?.Message || JSON.stringify(error)}`);
        });
      }
    }
  }

  isCheckValue(): number {
    if(!TDSHelperObject.hasValue(this.select)) {
      this.message.error(Message.Upload.CollectionEmpty);
      return 0;
    }

    return 1;
  }

  onCancel() {
    this.modalRef.destroy(null);
  }


}
