import { ModalSendMessageComponent } from './../modal-send-message/modal-send-message.component';
import { TDSModalRef, TDSModalService } from 'tmt-tang-ui';
import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';

@Component({
  selector: 'app-modal-birthday-partner',
  templateUrl: './modal-birthday-partner.component.html',
  styleUrls: ['./modal-birthday-partner.component.scss']
})

export class ModalBirthdayPartnerComponent implements OnInit {

    @Input() data: any = [];

    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<number>();

    times: any = [
        {text: 'Hôm nay', value: 'day'},
        {text: 'Tuần này', value: 'week'},
        {text: 'Tháng này', value: 'month'}
    ];

    currentTime: any = {text: 'Hôm nay', value: 'day'};

    constructor(private modal: TDSModalRef,
        private excelExportService: ExcelExportService,
        private partnerService: PartnerService,
        private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnInit(): void {
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(value: boolean): void {
        this.data.forEach((item: any) => this.updateCheckedSet(item.Id, value));
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        this.checked = this.data.every((item: any)  => this.setOfCheckedId.has(item.Id));
        this.indeterminate = this.data.some((item: any)  => this.setOfCheckedId.has(item.Id)) && !this.checked;
    }

    cancel() {
      this.modal.destroy(null);
    }

    selectTime(time: any) {
      this.currentTime = time;
      this.partnerService.getPartnerBirthday(time.value).subscribe((res: any) => {
          this.data = res;
      })
    }

    exportExcel() {
        let type = this.currentTime.value;
        this.excelExportService.exportGet(`/Partner/ExcelPartnerBirthDay?type=${type}`, `sinh-nhat-khach-hang`);
    }

    showModalSendMessage() {
        let ids: any = [...this.setOfCheckedId];
        this.modalService.create({
          title: 'Gửi tin nhắn tới khách hàng',
          content: ModalSendMessageComponent,
          size: "lg",
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            partnerIds: ids
          }
        });
      }

}
