import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AccountJournalDTO } from 'src/app/main-app/dto/account/account.dto';
import { AccountJournalService } from 'src/app/main-app/services/account-journal.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-batch-refund',
  templateUrl: './modal-batch-refund.component.html',
})
export class ModalBatchRefundComponent implements OnInit {

  @Input() ids!: any[];

  private _destroy = new Subject<void>();
  listUser: TDSSafeAny[] = [];
  listAcJournal: AccountJournalDTO[] = [];
  AcJournalCurrent!: AccountJournalDTO;
  payment: boolean = false;
  isLoading: boolean = false;

  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private accJournalService: AccountJournalService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.accJournalService.getWithCompanyPayment().pipe(takeUntil(this._destroy)).subscribe(res => {
      this.listAcJournal = [...res.value];
      this.AcJournalCurrent = this.listAcJournal.filter((x) => x.Type == 'cash')[0]
    });
    let model = {
      ids: this.ids,
    }
    this.isLoading = true;
    this.fastSaleOrderService.getFastSaleOrderIds(model).pipe(finalize(() => this.isLoading = false), takeUntil(this._destroy)).subscribe(res => {
      this.listUser = [...res.value];
    }, err => {
      return this.message.error(err.error.message ?? 'Không tải được dữ liệu');
    })
  }

  onCancel() {
    this.modal.destroy(null);
  }

  onSave() {
    if (this.listUser.length == 0) {
      this.message.error("Vui lòng chọn ít nhất một hóa đơn");
      this.modal.destroy(null)
      return;
    }

    let ids = this.listUser.map(x => x.Id);
    let model = {
      ids: ids,
      payment_check: this.payment,
      payment_status: Number(this.AcJournalCurrent.Id),
    }
    this.fastSaleOrderService.actionBatchRefund(model).subscribe(res => {
      this.message.success("Tạo trả hàng thành công");
      this.modal.destroy(null);
    },err=>{
      this.message.error(err?.error?err.error.message:'đã có lỗi xảy ra');
      this.modal.destroy(null);
    });

  }

  onRefresh(): void {
    this.loadData();
  }

  removeUser(index: any) {
    this.listUser.splice(index, 1);
  }

}
