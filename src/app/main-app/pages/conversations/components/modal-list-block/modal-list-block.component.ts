import { TDSMessageService, TDSModalRef, TDSModalService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { TDSHelperArray } from 'tmt-tang-ui';
import { Component, Input, OnInit } from '@angular/core';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { MDBPhoneReportDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'modal-list-block',
  templateUrl: './modal-list-block.component.html',
  styleUrls: ['./modal-list-block.component.scss']
})
export class ModalListBlockComponent implements OnInit {

  @Input() phone!: string;
  @Input() psid!: string;
  @Input() accessToken!: string;
  @Input() facebookName!: string;
  @Input() isReport: boolean = false;

  data!: MDBPhoneReportDTO;
  isLoading: boolean = false;

  constructor(
    private crmMatchingService: CRMMatchingService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private modal: TDSModalService
  ) { }

  ngOnInit(): void {

  }

  loadData() {
    this.crmMatchingService.getHistoryReportPhone(this.phone).subscribe(res => {
      this.data = res;
    });
  }

  onUnReportPhone() {
    this.modal.error({
      title: 'Bỏ chặn số điện thoại',
      content: 'Bạn có chắc muốn bỏ chặn số điện thoại này.',
      onOk: () => {
        this.unReportPhone();
      },
      onCancel: () => { },
      okText: "Xác nhận",
      cancelText: "Đóng",
      // confirmViewType:"compact"
    });
  }

  onReportPhone() {

  }

  unReportPhone() {
    this.isLoading = true;
    this.crmMatchingService.unReportPhone(this.phone)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.Partner.UnReportSuccess);
      }, error => {
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
