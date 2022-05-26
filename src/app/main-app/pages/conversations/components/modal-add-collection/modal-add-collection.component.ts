import { TDSModalService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { TDSMessageService, TDSHelperString, TDSHelperArray } from 'tmt-tang-ui';
import { TDSSafeAny, TDSUploadChangeParam } from 'tmt-tang-ui';
import { TDSModalRef, TDSUploadFile } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { ModalSelectAttachmentComponent } from '../modal-select-attachment/modal-select-attachment.component';

@Component({
  selector: 'modal-add-collection',
  templateUrl: './modal-add-collection.component.html'
})
export class ModalAddCollectionComponent implements OnInit {

  fileList: TDSUploadFile[] = [];
  lstData: TDSSafeAny[] = [];

  name: string = '';
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private attachmentDataFacade: AttachmentDataFacade,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService
  ) { }

  ngOnInit(): void {
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: any) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.lstData.push({
        Url: reader.result,
        Name: file.name,
        File: file
      });
    };
  }

  remove(url: string) {

  }

  handleChange(info: TDSUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      debugger;
      // this.mes.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} file upload failed.`);
    }
  }

  handleDownload=(file: TDSUploadFile)=>{
    window.open(file.response.url);
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      this.isLoading = true;

      let files = this.lstData.map(x => x.File);

      let attachments = this.lstData.filter(x => {
        if(x.id) return x;
      });

      this.attachmentDataFacade.createAttachment(this.name, files, attachments)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.message.success(Message.InsertSuccess);
          this.onCancel();
        }, error => {
          this.message.error(`${error?.error?.message}` || JSON.stringify(error));
        });
    }
  }

  isCheckValue(): number {
    if(!TDSHelperString.hasValueString(this.name)) {
      this.message.error(Message.Upload.NameEmpty);
      return 0;
    }

    return 1;
  }

  showModalSelectAttachment() {
    const modal = this.modal.create({
      title: 'Hình ảnh có sẵn',
      content: ModalSelectAttachmentComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });

    modal.componentInstance?.onSelect.subscribe(res => {
      this.lstData = [...this.lstData, ...res];
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
