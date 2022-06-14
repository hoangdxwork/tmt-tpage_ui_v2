import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { MDBAttachmentDTO, MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { AttachmentService } from 'src/app/main-app/services/attachment.server';
import { ModalAddCollectionComponent } from '../modal-add-collection/modal-add-collection.component';
import { ModalAddAttachmentCollectionComponent } from '../modal-add-attachment-collection/modal-add-attachment-collection.component';
import { ModalListCollectionComponent } from '../modal-list-collection/modal-list-collection.component';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTabChangeEvent } from 'tds-ui/tabs';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-image-store',
  templateUrl: './modal-image-store.component.html',
  styleUrls: ['./modal-image-store.component.scss']
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

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private attachmentDataFacade: AttachmentDataFacade,
    private message: TDSMessageService,
    private attachmentService: AttachmentService,
    private sharedService: SharedService,
    private viewContainerRef: ViewContainerRef
  ) { }

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

  checkValue(item: any) {
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

  onSearch(event: any) {
    let text =  event?.target.value;
    if(this.tabIndex === 0) {
      this.getAttachment(text);
    }
    else if(this.tabIndex === 1) {
      this.getCollection(text);
    }
  }

  selectChange(event: TDSTabChangeEvent) {
    console.log(event);
  }

  getAttachment(text: string) {
    if(TDSHelperString.hasValueString(text)) {
      this.isLoading = true;
      this.attachmentService.getAll(text)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.lstAll = res;
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
    }, error => {
      let message = JSON.parse(error?.Message);
      this.message.error(`${message?.message}`);
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
  }

  onCancel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.checkAllAttachment(false);
    this.checkAllCollection(false);
  }
}
