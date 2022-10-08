import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { orderStatusDTO } from '@app/dto/order/order-status.dto';
import { SaleOnline_OrderService } from '@app/services/sale-online-order.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-create-order-status',
  templateUrl: './create-order-status.component.html',
  providers: [TDSDestroyService],
})
export class CreateOrderStatusComponent implements OnInit {
  @Input() data!: orderStatusDTO;

  orderStatus!: FormGroup;
  palette: Array<string> = [];

  constructor(
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private formBuilder: FormBuilder,
    private destroy$: TDSDestroyService,
    private saleOnlineOrderService: SaleOnline_OrderService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  createForm() {
    this.orderStatus = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      styleCss: new FormControl('', [Validators.required]),
    });
  }

  loadData() {
    this.palette = [
      '#B5076B',
      '#A70000',
      '#F33240',
      '#FF8900',
      '#FFC400',
      '#28A745',
      '#00875A',
      '#0C9AB2',
      '#2684FF',
      '#034A93',
      '#5243AA',
      '#42526E',
      '#6B7280',
      '#858F9B',
      '#929DAA',
      '#A1ACB8',
      '#CDD3DB',
      '#D2D8E0',
      '#DDE2E9'
    ];

    // this.updateForm(this.data);
  }

  onSubmit() {
    let modelInsert = this.prepareModelInsert();

    if (this.orderStatus.value.name == '') {
      this.message.error('Vui lòng nhập tên thẻ!');
      return
    }

    if (this.orderStatus.value.styleCss == '') {
      this.message.error('Vui lòng chọn màu!');
      return
    }

    if (this.data) {
      return
      // this.partnerService.updatePartnerStatusExtra(modelUpdate).pipe(takeUntil(this.destroy$)).subscribe(
      //   (res) => {
      //     this.message.success('Cập nhật thành công !');
      //     this.modal.destroy(res);
      //   },
      //   (err) => {
      //     this.message.error('Cập nhật thất bại !');
      //   }
      // );
    } else {
      this.saleOnlineOrderService.insertOrderStatusExtra(modelInsert).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.message.success('Thêm thành công !');
          this.modal.destroy(res)
        },
        (err) => {
          this.message.error('Thêm thất bại !');
        }
      );
    }
  }

  prepareModelInsert() {
    let formModel = this.orderStatus.value;

    let modelInsert = {
      Name: formModel.name ? formModel.name : '' as string,
      StyleCSS: formModel.styleCss ? formModel.styleCss : '' as string,
    }
    return modelInsert
  }

  onChangeColor(value: string) {
    this.orderStatus.controls.styleCss.setValue(value);
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.onSubmit();
  }


}
