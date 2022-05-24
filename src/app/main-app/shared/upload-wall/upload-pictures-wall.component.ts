
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TDSHelperArray, TDSMessageService, TDSUploadFile } from 'tmt-tang-ui';
import { filter } from 'rxjs/operators';
import { SharedService } from '../../services/shared.service';
import { Observable, Subject } from 'rxjs';
import { HttpResponse } from '@microsoft/signalr';
import da from 'date-fns/esm/locale/da/index.js';

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
    @Input() data: any[] = [];
    @Input() isArray!: boolean;
    @Output() onLoadImage = new EventEmitter();

    fileList: TDSUploadFile[] = [];
    previewImage: string | undefined = '';
    previewVisible = false;

    constructor(private msg: TDSMessageService,
      private sharedService: SharedService) { }

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
    };

    handleUpload = (item: any): any => {
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
          this.emitFile();
        }
      }, error => {
        let message = JSON.parse(error.Message);
        this.msg.error(`${message.message}`);
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
    }

    ngOnDestroy(){
      this.destroy$.next();
      this.destroy$.complete();
    }
}


