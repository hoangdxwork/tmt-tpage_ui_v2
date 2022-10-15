import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-import-product-livecampaign',
  templateUrl: './import-product-livecampaign.component.html',
  providers: [TDSDestroyService]
})
export class ImportProductLivecampaignComponent implements OnInit {

  base64textString!: string;
  urlSampleUrl!: string;
  fileName!:string;
  isUpdate: boolean = false;
  messageError: any[] = [];
  lstOrder: any = [];

  isLoading: boolean = false;

  constructor(private liveCampaignService: LiveCampaignService,
    private modalRef: TDSModalRef,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    ) { }

  ngOnInit(): void {
    this.urlSampleUrl = this.liveCampaignService.urlSampleProductLiveCampaign();
  }

  openUrlSample() {
    window.open(this.urlSampleUrl, '_self');
  }

  onClose() {
    this.modalRef.destroy(null);
  }

  onSave(): any {
    let that = this;
    if(!TDSHelperString.hasValueString(that.base64textString)) {
      return  that.message.error('Vui lòng chọn file');
    }

    this.isLoading = true;
    let model = { file: that.base64textString };

    that.liveCampaignService.importProductLivecampaign(model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          if(res) {
              if(TDSHelperArray.hasListValue(res?.errors)) {
                that.messageError = res.errors;
                that.isUpdate = true;
              }
              that.lstOrder = res.datas;
          }
      }, 
      error: error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
      }
    })
  }

  handleFileInput(event: any) {
    var files = event.target.files;
    var file = files[0];

    if (files && file) {
      let reader = new FileReader();
      this.fileName = file.name;

      reader.onload = this.handleReaderBtoa.bind(this);
      reader.readAsBinaryString(file);

      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  handleReaderBtoa(readerEvt: any) {
    let binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }
}
