import { Subject } from 'rxjs';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'tpage-upload-images',
  templateUrl: './tpage-upload-images.component.html',
  styleUrls: ['./tpage-upload-images.component.scss']
})
export class TpageUploadImagesComponent implements OnInit, OnDestroy, OnChanges {
  @Input() size:number = 112;
  @Input() showName:boolean = true;
  @Input() showPopUpModal: boolean = true;
  @Input() inputImages:Array<TDSSafeAny> = [];
  @Input() productInput: boolean = false;
  @Input() useProductModel: boolean = false;
  @Input() allowUpload: boolean = true;
  @Output() getResult = new EventEmitter<Array<TDSSafeAny>>();

  private destroy$ = new Subject<void>();

  imageList:Array<TDSSafeAny> = [];


  constructor(
    private sharedService: SharedService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    if(this.inputImages.length > 0){
      this.imageList = this.formatNoneProductModel(this.inputImages);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.inputImages.length > 0){
      this.imageList = this.formatNoneProductModel(this.inputImages);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSelectFile(item: TDSSafeAny) {
    if(item.target.files && item.target.files[0]){
      let file = item.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let url = reader.result as string;
        let base64 = url.split(",")[1];
        let model = {
          Base64: base64,
          Name: file.name
        }

        this.sharedService.uploadImage(model).pipe(takeUntil(this.destroy$)).subscribe(
          (res:TDSSafeAny)=>{
            if (res) {
              let outputModel = {
                type: file.type,
                name: file.name,
                url: res,
                isPopup:false
              };
              this.imageList.push(outputModel);
              let result = this.formatProductModel(this.imageList);
              this.getResult.emit(result);
            } else {
              this.message.error("Không upload được file lớn hơn 3Mb");
            }
          },
          (err)=>{
            this.message.error("Upload thất bại");
          }
        )
      }
    }
  }

  removeImage(index:number){
    this.imageList.splice(index,1);
    this.getResult.emit(this.imageList);
  }

  formatProductModel(data:Array<TDSSafeAny>){
    if(this.useProductModel){
      let lstImg:Array<TDSSafeAny> = [];
      data.forEach(img => {
        lstImg.push({
          MineType: img.type,
          Name: img.name,
          ResModel: 'product.template',
          Type: 'url',
          Url: img.url
        })
      });
      return lstImg;
    }
    return data;
  }

  formatNoneProductModel(data:Array<TDSSafeAny>){
    let lstImg:Array<TDSSafeAny> = [];
    if(this.useProductModel){
      data.forEach(img => {
        lstImg.push({
          type: img.MineType,
          name: img.Name,
          url: img.Url,
          isPopup: false
        })
      });
    }else{
      data.forEach(img => {
        lstImg.push({
          type: img.type,
          name: img.name,
          url: img.url,
          isPopup: false
        })
      });
    }

    return lstImg;
  }
}
