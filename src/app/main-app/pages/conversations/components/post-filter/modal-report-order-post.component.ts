import { TDSModalRef } from 'tmt-tang-ui';
import { TDSMessageService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { pipe, Subject } from 'rxjs';
import { OnChanges, SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { FacebookPostService } from 'src/app/main-app/services/facebook-post.service';
import { TBotRequestCallbackFailedDTO } from 'src/app/main-app/dto/configs/post/order-config.dto';

@Component({
  selector: 'modal-report-order-post',
  templateUrl: './modal-report-order-post.component.html'
})
export class ModalReportOrderPostComponent implements OnInit{

  @Input() postId!: string;

  isLoading: boolean = false;
  lstReport: TBotRequestCallbackFailedDTO[] = [];

  constructor(
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private facebookPostService: FacebookPostService
  ) { }

  ngOnInit(): void {
    this.loadReportOrderPost(this.postId)
  }

  loadReportOrderPost(postId: string) {
    this.isLoading = true;
    this.facebookPostService.getReport(postId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.lstReport = res;
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }


  onCannel() {
    this.modalRef.destroy(null);
  }
}
