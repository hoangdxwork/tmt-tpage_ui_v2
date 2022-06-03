import { TDSHelperObject, TDSMessageService, TDSModalRef, TDSModalService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { TDSHelperArray } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { MDBPhoneReportDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { ModalBlockPhoneComponent } from '../modal-block-phone/modal-block-phone.component';

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

  @Output() changeReportPartner = new EventEmitter<boolean>();

  data!: MDBPhoneReportDTO;
  isLoading: boolean = false;

  constructor(
    private crmMatchingService: CRMMatchingService,
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private crmTeamService: CRMTeamService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.crmMatchingService.getHistoryReportPhone(this.phone)
      .pipe(finalize(() => this.isLoading = false ))
      .subscribe(res => {
        this.data = res;
        if(TDSHelperArray.hasListValue(res?.reasons)) {
          this.isReport = true;
        }
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
    let phone = this.phone;

    const modal = this.modal.create({
      title: '',
      content: ModalBlockPhoneComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'md',
      componentParams: {
        phone: phone
      }
    });

    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.changeReport(true);
        this.loadData();
      }
    });
  }

  unReportPhone() {
    this.isLoading = true;
    this.crmMatchingService.unReportPhone(this.phone)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.changeReport(false);
        this.message.success(Message.Partner.UnReportSuccess);
      }, error => {
        this.message.error(`${error?.error?.message}` || JSON.stringify(error));
      });
  }

  editReason(index: number) {
    this.message.info(Message.FunctionNotWorking);
  }

  removeReason(index: number) {
    this.message.info(Message.FunctionNotWorking);
  }

  onCancel() {
    this.modalRef.destroy();
  }

  changeReport(value: boolean) {
    this.isReport = value;
    this.changeReportPartner.emit(value);
  }

}
