import { TDSModalRef, TDSHelperArray, TDSMessageService } from 'tmt-tang-ui';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { MDBAttachmentDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'modal-select-attachment',
  templateUrl: './modal-select-attachment.component.html'
})
export class ModalSelectAttachmentComponent implements OnInit {

  @Output() onSelect = new EventEmitter<MDBAttachmentDTO[]>();

  public lstAll$!: Observable<PagedList2<MDBAttachmentDTO>>;
  public numberSelect: number = 0;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private attachmentDataFacade: AttachmentDataFacade
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lstAll$ = this.attachmentDataFacade.makeAttachment().pipe(map(res => {
      if(res && res.Items) {
        this.numberSelect = res.Items.filter(x => x["SelectAddInner"]).length;
      }
      console.log(res);
      return res;
    }));
  }

  checkValue(item: any) {
    this.numberSelect = item["SelectAddInner"] ? this.numberSelect + 1 : this.numberSelect - 1;
  }

  checkAll(event: boolean) {
    this.lstAll$.subscribe(res => {
      res.Items.forEach((x:any) => {
        x["SelectAddInner"] = event;
      });

      this.numberSelect = !event ? 0 : res.Items.length;
    });
  }

  onSave() {
    this.lstAll$.subscribe(res => {
      if(!TDSHelperArray.hasListValue(res?.Items)) {
        this.message.error(Message.SelectOneLine);
        return;
      }

      let result = res.Items.filter(x => x["SelectAddInner"]);

      if(!TDSHelperArray.hasListValue(result)) {
        this.message.error(Message.SelectOneLine);
        return;
      }

      this.onSelect.emit(result);
      this.message.success(Message.Upload.SelectAttachmentSuccess)
      this.onCancel();
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
