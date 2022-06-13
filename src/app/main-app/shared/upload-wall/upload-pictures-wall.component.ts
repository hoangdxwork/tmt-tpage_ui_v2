
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TDSHelperArray, TDSMessageService, TDSUploadFile } from 'tmt-tang-ui';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject } from 'rxjs';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

@Component({
    selector: 'upload-pictures-wall',
    templateUrl: './upload-pictures-wall.component.html',
})

export class UploadPicturesWallComponent implements OnInit, OnChanges, OnDestroy {

    destroy$ = new Subject<void>();
    @Input() data!: string[];
    @Input() isArray!: boolean;
    @Input() size: number = 112;
    @Input() isAvatar!:boolean
    @Output() onLoadImage = new EventEmitter();
    @Output() getResult = new EventEmitter<string>();

    fileList: TDSUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;
    isUploading: boolean = false;

    constructor(private msg: TDSMessageService,
      private sharedService: SharedService,
      private cdr: ChangeDetectorRef
      ) { }

    ngOnInit(): void {
      this.fileList = [];
      if(TDSHelperArray.hasListValue(this.data)) {
        let dataModel: any = [];
        this.data.map((x: any, i: number) => {
          dataModel.push({
            uid: `${i}`,
            name: x,
            status: 'done',
            url: x,
            size: undefined
          })
        });
        this.fileList = [...dataModel];
      }
    }

    handlePreview = async (file: TDSUploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj!);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
      this.cdr.markForCheck();
    };

    handleUpload = (item: any): any => {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('files', item.file as any, item.file.name);
      formData.append('id', '0000000000000051');

      let dataModel = this.fileList as any[];
      return this.sharedService.saveImageV2(formData).subscribe((res: any) => {

        if(res){
          let x = {
            uid: res[0].eTag,
            name: res[0].url,
            status: 'done',
            url: res[0].urlImageProxy,
            size: res[0].size
          } as any;
          dataModel.push({...x});
          this.fileList = [...dataModel];
          this.isUploading = false;
          this.emitFile();
          this.getResult.emit(x.url);
        }
      }, error => {
        let message = JSON.parse(error.Message);
        this.msg.error(`${message.message}`);
        this.fileList = [...dataModel];
        this.isUploading = false;
      });
    }

    handleRemove = (file: TDSUploadFile):any => {
      return new Observable(res => {
        let items = this.fileList.filter(x => !(x.url === file.url));
        this.fileList = items;
        this.emitFile();
        res.next();
        res.complete();
      })
    }

    removeImage(file:TDSUploadFile){
      let items = this.fileList.filter(x => !(x.url === file.url));
      this.fileList = items;
      this.emitFile();
    }

    emitFile(){
      let data = {
        isArray: this.isArray,
        files: [...this.fileList]
      } as any;
      this.onLoadImage.emit(data);
    }

    handleDownload = (file: TDSUploadFile): any => {
      window.open(file.response.url);
    }

    ngOnChanges(changes: SimpleChanges) {
      if(changes['data'] && !changes['data'].firstChange){
        if(TDSHelperArray.hasListValue(this.data) && this.isArray) {
          let dataModel: any = [];
          this.data.map((x: any, i: number) => {
            let y ={
              uid: `${i}`,
              name: x,
              status: 'done',
              url: x,
              size: undefined
            };
          dataModel.push({...y});
          this.fileList = [...dataModel];
          });
        }
      }
    }

    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
    }
}


