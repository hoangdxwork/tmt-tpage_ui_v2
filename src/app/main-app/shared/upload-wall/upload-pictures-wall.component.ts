
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TDSHelperArray, TDSMessageService, TDSUploadFile } from 'tmt-tang-ui';
import { takeUntil } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';
import { Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';

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

    destroy$ = new Subject();

    @Input() data!: any[];
    @Input() isArray: boolean = false;
    @Output() onLoadImage = new EventEmitter();

    fileList: TDSUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;

    constructor(private msg: TDSMessageService,
      private sharedService: SharedService) { }

    ngOnInit(): void {
      if(TDSHelperArray.hasListValue(this.data)) {
        this.data.map((x: any, i: number) => {
          this.fileList.push({
            uid: `${i}`,
            name: x,
            status: 'done',
            url: x
          })
        })
      }
    }

    handlePreview = async (file: TDSUploadFile) => {
      if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj!);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    };

    handleUpload = (item: any) => {
      const formData = new FormData();
      formData.append('files', item.file as any, item.file.name);
      formData.append('id', '0000000000000051');

      return this.sharedService.saveImageV2(formData)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {

          if(Message.Upload.Success) {
            this.fileList.push({
              uid: `${this.data.length + 1}`,
              name: res[0].url,
              status: 'done',
              url: res[0].urlImageProxy
            });
          }

          let datas: any[] = [];
          this.fileList.map((a: any) => {
            let model = {
              MineType: [null],
              Name: [null],
              ResModel: ['product.product'],
              Type: ['url'],
              Url: [null]
            }
            datas.push(model);
          });

          this.onLoadImage.emit(datas);
      }, error => {
          let message = JSON.parse(error.Message);
          this.msg.error(`${message.message}`);
      });
    }

    handleDownload=(file: TDSUploadFile)=>{
        window.open(file.response.url);
    }

    ngOnChanges(changes: SimpleChanges) {
      // if(changes["data"] && !changes["data"].firstChange) {
      //   (this.data as any) =  changes["data"].currentValue  as TDSUploadFile[];
      //   this.fileList = this.data;debugger
      // }
    }

    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
    }
}


