import { TDSModalService } from 'tmt-tang-ui';
import { TDSMessageService, TDSTabChangeEvent, TDSHelperString, TDSUploadFile } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AttachmentDataFacade } from 'src/app/main-app/services/facades/attachment-data.facade';
import { TACheckboxChange, TDSModalRef } from 'tmt-tang-ui';
import { Message } from 'src/app/lib/consts/message.const';
import { AttachmentService } from 'src/app/main-app/services/attachment.server';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { MDBAttachmentDTO, MDBCollectionDTO } from 'src/app/main-app/dto/attachment/attachment.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { ModalAddCollectionComponent } from '../modal-add-collection/modal-add-collection.component';

@Component({
  selector: 'app-modal-image-store',
  templateUrl: './modal-image-store.component.html',
  styleUrls: ['./modal-image-store.component.scss']
})
export class ModalImageStoreComponent implements OnInit {
  inputValue?: string;

  listImage=[
    {
      id: '1',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '2',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: true,
    },
    {
      id: '3',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '4',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },
    {
      id: '5',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '6',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: false,
    },
    {
      id: '7',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '8',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },
    {
      id: '5',
      image:'/assets/images/conversation/imageAll-1.svg',
      choose: false,
    },
    {
      id: '6',
      image:'/assets/images/conversation/imageAll-2.svg',
      choose: false,
    },
    {
      id: '7',
      image:'/assets/images/conversation/imageAll-3.svg',
      choose: false,
    },
    {
      id: '8',
      image:'/assets/images/conversation/imageAll-4.svg',
      choose: false,
    },

  ]

  listCollect = [
    {
      id:'1',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: true,
    },
    {
      id:'2',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'3',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'4',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'5',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'6',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'7',
      image1: '/assets/images/conversation/imageCollection-7.svg',
      image2: '/assets/images/conversation/imageCollection-8.svg',
      image3: '/assets/images/conversation/imageCollection-9.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'8',
      image1: '/assets/images/conversation/imageCollection-4.svg',
      image2: '/assets/images/conversation/imageCollection-5.svg',
      image3: '/assets/images/conversation/imageCollection-6.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
    {
      id:'9',
      image1: '/assets/images/conversation/imageCollection-1.svg',
      image2: '/assets/images/conversation/imageCollection-2.svg',
      image3: '/assets/images/conversation/imageCollection-3.svg',
      soLuong: 12,
      name:'Bộ sưu tập thời trang thu đông',
      choose: false,
    },
  ]

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

  checkAll(event: boolean) {
    this.lstAll$.subscribe(res => {
      res.Items.forEach((x:any) => {
        x["Select"] = event;
      });

      this.numberSelect = !event ? 0 : res.Items.length;
    });
  }

  removeAttachment(id: string) {
    this.attachmentDataFacade.removeAttachment([id]).subscribe(res => {
      this.message.success(Message.Upload.RemoveImageSuccess);
    });
  }

  removeAttachmentChecked() {
    this.lstAll$.subscribe(res => {
      res.Items.forEach((x:any) => {
        if(x["Select"]) {
          this.removeAttachment(x.id);
          this.numberSelect--;
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
    this.lstColl$.subscribe(res => {
      res.forEach((x:any) => {
        if(x["Select"]) {
          this.removeCollection(x.id);
          this.numberSelectColl--;
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
    formData.append("files", file, file.name);

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
      title: 'Tạo bộ sưu tập',
      content: ModalAddCollectionComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
      }
    });
  }

  onCancel() {
    this.modalRef.destroy(null);
  }
}
