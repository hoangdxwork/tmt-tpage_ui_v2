import { ModalRenameAttachmentComponent } from './../modal-rename-attachment/modal-rename-attachment.component';
import { finalize } from 'rxjs/operators';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { ModalSelectAttachmentComponent } from '../modal-select-attachment/modal-select-attachment.component';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSUploadChangeParam, TDSUploadFile } from 'tds-ui/upload';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';

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
    private modal: TDSModalService ) { }

  ngOnInit(): void {
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: any) {
    if(file.type?.includes('image')){
      const reader = new FileReader();
      reader.readAsDataURL(file);
      let size = file?.size? (file?.size / 1048576).toFixed(2) : 0;
      if(size > 5){
        this.message.error('Chỉ tải ảnh có dung lượng tối đa 5Mb');
        return
      }
      reader.onload = () => {
        this.lstData.push({
          Url: reader.result,
          Name: file.name,
          File: file
        });
      };
    }else{
      this.message.error('Chỉ nhận upload ảnh');
    }
  }

  handleChange(info: TDSUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      
    }
    if (info.file.status === 'done') {
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
      let files = this.lstData.filter(x => {
        if(x.File) return x;
      }).map(x => x.File);

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

  showModalRenameAttachment(index:number, id: string, data:TDSSafeAny, type?: string){
    const modal = this.modal.create({
      title: 'Đổi tên',
      content: ModalRenameAttachmentComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        attachmentIds: id,
        data: data,
        type: type? type: 'attachment'
      }
    });
    modal.afterClose.subscribe(result=>{
      if(TDSHelperString.hasValueString(result)){
        this.lstData[index].Name = result;
      }
    })
  }

  removeAttachment(index: number) {
    this.lstData.splice(index, 1);
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

}
