
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject, finalize } from 'rxjs';
import { TDSUploadFile } from 'tds-ui/upload';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { WallPicturesDTO } from '../../dto/attachment/wall-pictures.dto';

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
    @Output() getBase64 = new EventEmitter<any>();

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
      if(TDSHelperArray.isArray(this.data)) {
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
      return this.sharedService.saveImageV2(formData).pipe(finalize(()=>{ this.isUploading = false })).subscribe((res: any) => {
        
        if(res){
          let x = {
            uid: res[0].eTag,
            name: res[0].url,
            status: 'done',
            url: res[0].urlImageProxy,
            size: res[0].size
          } as WallPicturesDTO;
          dataModel.push({...x});
          this.fileList = [...dataModel];
          this.emitFile();
          this.getResult.emit(x.url);
          this.getBase64.emit(this.handleGetBase64(item.file));
        }
      }, error => {
        this.msg.error(error.Message ? error.Message:'Upload xảy ra lỗi');
        this.fileList = [...dataModel];
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

    handleGetBase64 = async (file: any) =>{
      return await getBase64(file);
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


