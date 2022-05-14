import { Subject } from 'rxjs';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { takeUntil } from 'rxjs/operators';
import { TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tpage-upload-avatar',
  templateUrl: './tpage-upload-avatar.component.html',
  styleUrls: ['./tpage-upload-avatar.component.scss']
})

export class TpageUploadAvatarComponent implements OnInit, AfterViewInit , OnDestroy {

  @Input() size:number = 112;
  @Input() imageUrl:string = '';
  @Input() shape: 'square'|'circle' = 'square';
  @Input() isAvatar: boolean = false;
  @Output() getResult = new EventEmitter<string>();
  @Output() getBase64 = new EventEmitter<TDSSafeAny>();

  private destroy$ = new Subject<void>();

  constructor(
    private sharedService: SharedService,
    private message: TDSMessageService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
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
              this.imageUrl = res;
              this.getBase64.emit(base64);
              this.getResult.emit(res);
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
}
