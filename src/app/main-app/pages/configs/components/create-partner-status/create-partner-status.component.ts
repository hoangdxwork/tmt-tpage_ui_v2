import { Component, Input, OnInit } from '@angular/core';
import { TDSDestroyService } from 'tds-ui/core/services';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { PartnerStatusDTO } from '@app/dto/partner/partner-status.dto';
import { PartnerService } from '@app/services/partner.service';

@Component({
  selector: 'app-create-partner-status',
  templateUrl: './create-partner-status.component.html',
  providers: [TDSDestroyService],
})
export class CreatePartnerStatusComponent implements OnInit {
  @Input() data!: PartnerStatusDTO;

  partnerStatus!: FormGroup;
  palette: Array<string> = [];

  public hasError = (controlName: string, errorName: string) => {
    return this.partnerStatus.controls[controlName].hasError(errorName);
  }

  constructor(
    private modal: TDSModalRef,
    private formBuilder: FormBuilder,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private partnerService: PartnerService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  createForm() {
    this.partnerStatus = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      code: new FormControl('', [Validators.required]),
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

    this.updateForm(this.data);
  }

  updateForm(data: PartnerStatusDTO) {
    if (data) {
      this.partnerStatus.controls.code.setValue(data.Code);
      this.partnerStatus.controls.name.setValue(data.Name);
    }
  }

  onChangeColor(value: string) {
    this.partnerStatus.controls.code.setValue(value);
  }

  onSubmit() {
    let modelInsert = this.prepareModelInsert();
    let modelUpdate = this.prepareModelUpdate();

    if (this.partnerStatus.value.name == '') {
      this.message.error('Vui lòng nhập tên thẻ!');
      return
    }

    if (this.partnerStatus.value.code == '') {
      this.message.error('Vui lòng chọn màu!');
      return
    }

    if (this.data) {
      this.partnerService.updatePartnerStatusExtra(modelUpdate).pipe(takeUntil(this.destroy$)).subscribe(
        (res) => {
          this.message.success('Cập nhật thành công !');
          this.modal.destroy(res);
        },
        (err) => {
          this.message.error('Cập nhật thất bại !');
        }
      );
    } else {
      this.partnerService.insertPartnerStatusExtra(modelInsert).pipe(takeUntil(this.destroy$)).subscribe(
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
    let formModel = this.partnerStatus.value;

    let modelInsert = {
      Name: formModel.name ? formModel.name : '' as string,
      Code: formModel.code ? formModel.code : '' as string,
    }
    return modelInsert
  }

  prepareModelUpdate() {
    let formModel = this.partnerStatus.value;

    let modelUpdate = {
      Id: this.data?.Id,
      Name: formModel.name ? formModel.name : '' as string,
      Code: formModel.code ? formModel.code : '' as string,
    }
    return modelUpdate
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.onSubmit();
  }

}
