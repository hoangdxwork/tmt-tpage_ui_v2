import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { MDBAttachmentDTO } from './../../../../dto/attachment/attachment.dto';
import { Subject, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { AttachmentDataFacade } from './../../../../services/facades/attachment-data.facade';
import { TDSModalRef } from 'tds-ui/modal';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-rename-attachment',
  templateUrl: './modal-rename-attachment.component.html'
})
export class ModalRenameAttachmentComponent implements OnInit {

  @Input() attachmentIds!: string;
  @Input() data!: TDSSafeAny;
  @Input() idInner!: string;
  @Input() type: string = 'attachment';
  @Output() onUpdateNameNewColl = new EventEmitter<any>();


  nameAttachment!:string;
  private destroy$ = new Subject<void>();

  constructor(
    private modal : TDSModalRef,
    private attachmentDataFacade: AttachmentDataFacade,
    private message: TDSMessageService,

  ) { }

  ngOnInit(): void {
    if(this.data) 
    this.nameAttachment = this.data.Name;
  }

  onSave(){
    if(!TDSHelperString.hasValueString(this.nameAttachment)){
      this.message.warning('Vui lòng nhập tên');
      return
    }
    if(this.type == 'attachment'){
      this.updateNameAttachment(this.attachmentIds, this.nameAttachment);
    }else if(this.type == 'collection'){
      this.updateNameCollection(this.attachmentIds, this.nameAttachment);
    } else if(this.type == "inner") {
      this.updateNameInner(this.attachmentIds, this.idInner, this.nameAttachment);
    }else if(this.type == "new_coll") {
      this.updateNameNewColl();
  }
  }

  updateNameAttachment(id: string, name: string) {
    this.attachmentDataFacade.updateNameAttachment(id, name).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
      this.message.success("Cập nhật tên thành công");
      this.modal.destroy(res);
    }, err=>{
      this.message.error(err?.error ? err.error.message: 'Cập nhật tên thất bại');
    });
  }

  updateNameCollection(id: string, name: string) {
    this.attachmentDataFacade.updateNameCollection(id, name).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
      this.message.success("Cập nhật tên thành công");
      this.modal.destroy(res);
    },err=>{
      this.message.error(err?.error ? err.error.message: 'Cập nhật tên thất bại');
    });
  }

  updateNameInner(id: string, innerId :string, name: string) {
    this.attachmentDataFacade.updateNameInner(id, innerId, name).pipe(takeUntil(this.destroy$))
      .subscribe(res => {
      this.message.success("Cập nhật tên thành công");
      this.modal.destroy(res);
    },err=>{
      this.message.error(err?.error ? err.error.message: 'Cập nhật tên thất bại');
    });
  }

  updateNameNewColl() {
    this.message.success("Cập nhật tên thành công");
    this.modal.destroy(this.nameAttachment);
  }

  onCancel(){
    this.modal.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
