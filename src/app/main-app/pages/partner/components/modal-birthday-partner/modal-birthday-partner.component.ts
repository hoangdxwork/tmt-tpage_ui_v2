import { PartnerBirthdayDTO } from './../../../../dto/partner/partner-birthday.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ModalSendMessageComponent } from './../modal-send-message/modal-send-message.component';
import { Component, Input, OnInit, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-modal-birthday-partner',
  templateUrl: './modal-birthday-partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class ModalBirthdayPartnerComponent implements OnInit {
    @Input() lstData: PartnerBirthdayDTO[] = [];

    isProcessing: boolean = false;

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
        private destroy$: TDSDestroyService
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
        this.lstData.forEach((item: any) => this.updateCheckedSet(item.Id, value));
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        this.checked = this.lstData.every((item: any)  => this.setOfCheckedId.has(item.Id));
        this.indeterminate = this.lstData.some((item: any)  => this.setOfCheckedId.has(item.Id)) && !this.checked;
    }

    cancel() {
      this.modal.destroy(null);
    }

    selectTime(time: any) {
      this.currentTime = time;
      this.partnerService.getPartnerBirthday(time.value).subscribe((res: any) => {
          this.lstData = res;
      })
    }

    exportExcel() {
      if (this.isProcessing) { return; }

      let type = this.currentTime.value;
      this.excelExportService.exportGet(`/Partner/ExcelPartnerBirthDay?type=${type}`, `sinh-nhat-khach-hang`)
        .pipe(finalize(() => this.isProcessing = false), takeUntil(this.destroy$))
        .subscribe();
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
