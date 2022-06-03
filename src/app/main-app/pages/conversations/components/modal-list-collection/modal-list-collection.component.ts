import { TDSModalRef } from 'tmt-tang-ui';
import { TDSModalService } from 'tmt-tang-ui';
import { OnDestroy, ViewContainerRef } from '@angular/core';
import { TDSHelperArray, TDSUploadFile, TDSMessageService } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { map, finalize, takeUntil } from 'rxjs/operators';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { Observable, Subject } from 'rxjs';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { MDBAttachmentDTO, MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { AttachmentService } from 'src/app/main-app/services/attachment.server';
import { Message } from 'src/app/lib/consts/message.const';
import { ModalAddAttachmentCollectionComponent } from '../modal-add-attachment-collection/modal-add-attachment-collection.component';

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

  constructor(
    private attachmentDataFacade: AttachmentDataFacade,
    private message: TDSMessageService,
    private attachmentService: AttachmentService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private modalRef: TDSModalRef
  ) { }

  ngOnInit(): void {
    this.loadCollection(this.collectionId);
  }

  loadCollection(collectionId: string) {
    this.isLoading = true;
    this.lstData$ = this.attachmentDataFacade.getInner(collectionId)
      .pipe((finalize(() => this.isLoading = false)))
      .pipe(map(res => {
        if(res?.Attachments) {
          this.numberSelect = res.Attachments.filter(x => x.Select).length;
        }

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

  onSearch(event: any) {
    let text =  event?.target.value;

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

    this.isLoading =  true;
    return this.attachmentService.addAttachment(this.collectionId, formData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: any) => {
        this.attachmentDataFacade.insertInner(this.collectionId, res);
        this.message.success(Message.Upload.Success);
      }, error => {
        let message = JSON.parse(error?.Message);
        this.message.error(`${message?.message}`);
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
