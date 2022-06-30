import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { MDBAttachmentDTO, MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { AttachmentService } from 'src/app/main-app/services/attachment.service';
import { ModalAddCollectionComponent } from '../modal-add-collection/modal-add-collection.component';
import { ModalAddAttachmentCollectionComponent } from '../modal-add-attachment-collection/modal-add-attachment-collection.component';
import { ModalListCollectionComponent } from '../modal-list-collection/modal-list-collection.component';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTabChangeEvent } from 'tds-ui/tabs';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-image-store',
  templateUrl: './modal-image-store.component.html'
})
export class ModalImageStoreComponent implements OnInit, OnDestroy {
  inputValue?: string;

  public lstAll$!: Observable<PagedList2<MDBAttachmentDTO>>;
  public lstColl$!: Observable<MDBCollectionDTO[]>;

  lstAll!: PagedList2<MDBAttachmentDTO> | undefined;
  lstColl!: MDBCollectionDTO[];

  numberSelect: number = 0;
  numberSelectColl: number = 0;

  isLoading: boolean = false;
  tabIndex: number = 0;

  fileList: TDSUploadFile[] = [];
  searchText: string = '';

  constructor(private cdRef: ChangeDetectorRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private attachmentDataFacade: AttachmentDataFacade,
    private message: TDSMessageService,
    private attachmentService: AttachmentService,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.lstAll$ = this.attachmentDataFacade.makeAttachment().pipe(map(res => {
      if(res && res.Items) {
        this.numberSelect = res.Items.filter((x: any) => x["Select"]).length;
      }
      return res;
    }));

    this.lstColl$ = this.attachmentDataFacade.makeCollection().pipe(map(res => {
      this.numberSelectColl = res.filter((x: any) => x["Select"]).length;
      return res;
    }));
  }

  nextData() {
    if(!this.isLoading) {
      this.isLoading = true;
      this.attachmentDataFacade.getNextPage().pipe(finalize(()=>{ this.isLoading = false })).subscribe(res => {
      }, error => {
        this.message.error(error.message? error.error.message : 'Load dữ liệu thất bại');
      });
    }
  }

  checkValue(item: any) {
    this.numberSelect = item["Select"] ? this.numberSelect + 1 : this.numberSelect - 1;
  }

  selectAttachment(item: any) {
    item["Select"] = item["Select"] ? false : true;
    this.numberSelect = item["Select"] ? this.numberSelect + 1 : this.numberSelect - 1;
  }

  checkValueCollection(item: any) {
    this.numberSelectColl = item["Select"] ? this.numberSelectColl + 1 : this.numberSelectColl - 1;
  }

  checkAllAttachment(event: boolean) {
    this.lstAll$.subscribe(res => {
      res.Items.forEach((x:any) => {
        x["Select"] = event;
      });

      this.numberSelect = !event ? 0 : res.Items.length;
    });
  }

  checkAllCollection(event: boolean) {
    this.lstColl$.subscribe(res => {
      res.forEach((x:any) => {
        x["Select"] = event;
      });

      this.numberSelectColl = !event ? 0 : res.length;
    });
  }

  removeAttachment(id: string) {
    this.attachmentDataFacade.removeAttachment([id]).subscribe(res => {
      this.message.success(Message.Upload.RemoveImageSuccess);
    });
  }

  removeAttachmentChecked() {
    let isEmpty = false;
    this.lstAll$.subscribe(res => {
      res.Items.forEach((x:any, index: number) => {
        if(x["Select"]) {
          isEmpty = true;
          this.removeAttachment(x.id);
          this.numberSelect--;
        }

        if(index == res.Items.length - 1 && !isEmpty) {
          this.message.error(Message.SelectOneLine);
        }
      });
    });
  }

  removeCollection(id: string) {
    this.attachmentDataFacade.removeCollection(id).subscribe(res => {
      this.message.success(Message.Upload.RemoveCollectionSuccess);
    });
  }

  removeCollectionChecked() {
    let isEmpty = false;
    this.lstColl$.subscribe(res => {
      res.forEach((x:any, index: number) => {
        if(x["Select"]) {
          isEmpty = true;
          this.removeCollection(x.id);
          this.numberSelectColl--;
        }

        if(index == res.length - 1 && !isEmpty) {
          this.message.error(Message.SelectOneLine);
        }
      });
    });
  }

  onSearch() {
    let text = this.searchText;
    if(this.tabIndex === 0) {
      this.getAttachment(text);
    }
    else if(this.tabIndex === 1) {
      this.getCollection(text);
    }
  }

  selectChange(event: TDSTabChangeEvent) {
  }

  getAttachment(text: string) {
    if(TDSHelperString.hasValueString(text)) {
      this.isLoading = true;
      this.attachmentService.getAll(text)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.lstAll = res;
        },err => {
          this.message.error(err.error? err.error.message: 'Có lỗi xảy ra')
        });
    }
    else {
      delete this.lstAll;
    }
  }

  getCollection(text: string) {
    if(TDSHelperString.hasValueString(text)) {
      this.isLoading = true;
      this.attachmentService.getCollection(text)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.lstColl = res.Items;
        },err => {
          this.message.error(err.error? err.error.message: 'Có lỗi xảy ra')
        });
    }
    else {
      this.lstAll = undefined;
    }
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

    return this.attachmentService.add(formData).subscribe((res: any) => {
      this.attachmentDataFacade.addAttachment(res);
      this.message.success(Message.Upload.Success);
      this.cdRef.markForCheck();
    }, error => {
      this.message.error(error.Message ? error.Message : 'Upload xảy ra lỗi');
    });
  }

  showModalAddCollection() {
    const modal = this.modal.create({
      title: 'Tạo mới bộ sưu tập',
      content: ModalAddCollectionComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });
  }

  showModalAddAttachmentCollection() {
    this.lstAll$.subscribe(res => {
      let ids = res.Items.filter(x => x.Select).map(x => x.id);

      const modal = this.modal.create({
        title: 'Thêm vào bộ sưu tập khác',
        content: ModalAddAttachmentCollectionComponent,
        size: 'md',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          attachmentIds: ids,
        }
      });
    });

  }

  showModalListCollection(id: any, name: string) {
    const modal = this.modal.create({
      title: `Bộ sưu tập ${name}`,
      content: ModalListCollectionComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        collectionId: id
      }
    });
    modal.afterClose.subscribe(result=>{
      if(result)
      this.modalRef.destroy(result);
    })
  }

  onSend(){
    let urls = [];
    if(this.lstAll) {
      urls = this.lstAll.Items.filter((x : TDSSafeAny) =>
        x["Select"] == true
      ).map((x : TDSSafeAny)=> x.Url);

      if(!urls || urls.length < 1) {
        this.message.info("Chưa có ảnh nào được chọn!");
        return;
      }

      this.modalRef.destroy(urls);

      delete this.lstAll;
    }
    else {
      this.lstAll$.subscribe(res => {
        urls = res.Items.filter(x =>
          x["Select"] == true
        ).map( x => x.Url);

        if(!urls || urls.length < 1) {
          this.message.info("Chưa có ảnh nào được chọn!");
          return;
        }
        this.modalRef.destroy(urls);
      });
    }
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.checkAllAttachment(false);
    this.checkAllCollection(false);
  }
}
