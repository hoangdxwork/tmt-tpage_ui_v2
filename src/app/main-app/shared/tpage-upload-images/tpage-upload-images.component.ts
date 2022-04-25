import { Subject } from 'rxjs';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tpage-upload-images',
  templateUrl: './tpage-upload-images.component.html',
  styleUrls: ['./tpage-upload-images.component.scss']
})
export class TpageUploadImagesComponent implements OnInit, OnDestroy {
  @Input() size:number = 112;
  @Output() getResult = new EventEmitter<Array<string>>();

  private destroy$ = new Subject<void>();

  imageList:Array<string> = [];

  constructor(
    private sharedService: SharedService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
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
              this.imageList.push(res);
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
