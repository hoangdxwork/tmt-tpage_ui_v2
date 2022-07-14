import { InnerAttachmentDTO } from './../../../../dto/attachment/attachment.dto';
import { ModalRenameAttachmentComponent } from './../modal-rename-attachment/modal-rename-attachment.component';
import { ChangeDetectorRef, OnDestroy, ViewContainerRef } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { Observable, Subject } from 'rxjs';
import { MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { AttachmentService } from 'src/app/main-app/services/attachment.service';
import { Message } from 'src/app/lib/consts/message.const';
import { ModalAddAttachmentCollectionComponent } from '../modal-add-attachment-collection/modal-add-attachment-collection.component';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'modal-list-collection',
  templateUrl: './modal-list-collection.component.html'
})
export class ModalListCollectionComponent implements OnInit, OnDestroy {

  @Input() collectionId!: string;

  lstData$!: Observable<MDBCollectionDTO | undefined>;
  lstDataSearch?: MDBCollectionDTO;
  numberSelect: number = 0;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  fileList: TDSUploadFile[] = [];
  searchText: string = '';
  firstLoad: boolean = true;

  constructor(private cdRef: ChangeDetectorRef,
    private attachmentDataFacade: AttachmentDataFacade,
    private message: TDSMessageService,
    private attachmentService: AttachmentService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef) { }

  ngOnInit(): void {
    this.loadCollection(this.collectionId);
  }

  loadCollection(collectionId: string) {
    this.isLoading = true;
    this.lstData$ = this.attachmentDataFacade.getInner(collectionId)
      .pipe(map(res => {
        if(res?.Attachments) {
          if(this.firstLoad){
            res.Attachments.forEach(x => {if(x.Select) delete x['Select']})
            this.firstLoad = false;
          }
          this.numberSelect = res.Attachments.filter(x => x.Select).length;
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
        return res;
      }));
  }

  remove(id: string, isChecked: boolean | undefined) {
    this.attachmentDataFacade.removeInners(this.collectionId, [id]).subscribe(res => {
      this.message.success(Message.DeleteSuccess);
      isChecked && (this.numberSelect--);
    });
  }

  removeChecked() {
    this.lstData$.subscribe(res => {
      if(res) {
        let ids: string[] = res.Attachments.filter(x =>
          x["Select"]
        ).map(x => x.id);

        if(ids && ids.length > 0) {
          this.attachmentDataFacade.removeInners(this.collectionId, ids).subscribe(res => {
            this.message.success(Message.DeleteSuccess);
            this.numberSelect = 0;
          });
        }
        else {
          this.message.error(Message.SelectOneLine);
        }
      }
    });
  }

  checkValue(item: any) {
    this.numberSelect = item["Select"] ? this.numberSelect + 1 : this.numberSelect - 1;
  }

  selectAttachment(item: any) {
    item["Select"] = item["Select"] ? false : true;
    this.numberSelect = item["Select"] ? this.numberSelect + 1 : this.numberSelect - 1;
  }

  checkAll(event: boolean) {
    this.lstData$.subscribe(res => {
      if(res?.Attachments) {
        res.Attachments.forEach(x => {
          x.Select = event;
        });

        this.numberSelect = !event ? 0 : res.Attachments.length;
      }
    });
  }

  onSearch() {
    let text = this.searchText;

    let textLowerCase = text.toLowerCase();

    this.lstData$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.lstDataSearch = Object.assign({}, res);

      if(res?.Attachments) {
        let filterSearch = res.Attachments.filter(x => x.Name.toLowerCase().indexOf(textLowerCase) !== -1);

        if(TDSHelperArray.hasListValue(filterSearch)) {
          this.lstDataSearch && (this.lstDataSearch.Attachments = filterSearch);
        }
        else {
          this.lstDataSearch = undefined;
        }
      }
    });
  }

  showModalRenameAttachment(id: string, data:InnerAttachmentDTO, type?: string){
    const modal = this.modal.create({
      title: 'Đổi tên',
      content: ModalRenameAttachmentComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        attachmentIds: this.collectionId,
        data: data,
        idInner: id,
        type: type
      }
    });
  }


  showModalAddAttachmentCollection(id: string) {
    const modal = this.modal.create({
      title: 'Thêm vào bộ sưu tập khác',
      content: ModalAddAttachmentCollectionComponent,
      size: 'md',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        attachmentIds: [id],
        collectionId: this.collectionId
      }
    });
  }

  beforeUpload = (file: TDSUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    this.handleUpload(file);
    return false;
  };

  handleUpload(file: TDSUploadFile) {
    let formData: any = new FormData();
    formData.append("files", file as any, file.name);
    formData.append('id', '0000000000000051');
    let size = file?.size? (file?.size / 1048576).toFixed(2) : 0;
    if(size > 5){
      this.message.error('Chỉ tải ảnh có dung lượng tối đa 5Mb');
      return
    }

    this.isLoading =  true;
    return this.attachmentService.addAttachment(this.collectionId, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        this.attachmentDataFacade.insertInner(this.collectionId, res);
        this.message.success(Message.Upload.Success);
        this.cdRef.markForCheck();
      }, error => {
        this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
      });
  }

  onSend(){
    let urls = [];
    this.lstData$.subscribe(res => {
      if(res){
        urls = res.Attachments.filter(x => x["Select"] == true).map( x => x.Url);

        if(!urls || urls.length < 1) {
          this.message.info("Chưa có ảnh nào được chọn!");
          return;
        }
        this.modalRef.destroy(urls);
      }
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
