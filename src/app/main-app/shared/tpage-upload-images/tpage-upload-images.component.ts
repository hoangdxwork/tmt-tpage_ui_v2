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
  @Input() inputImages:Array<TDSSafeAny> = [];
  @Input() productInput: boolean = false;
  @Output() getResult = new EventEmitter<Array<TDSSafeAny>>();

  private destroy$ = new Subject<void>();

  imageList:Array<TDSSafeAny> = [];


  constructor(
    private sharedService: SharedService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    if(this.inputImages.length > 0){
      this.imageList = this.inputImages;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.imageList = this.inputImages;
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
                url: res
              };
              this.imageList.push(outputModel);
              this.getResult.emit(this.imageList);
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
}
