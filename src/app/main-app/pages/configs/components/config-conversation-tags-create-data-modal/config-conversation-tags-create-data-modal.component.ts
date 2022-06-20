import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { TDSModalService } from 'tds-ui/modal';
import { CRMTagService } from '../../../../services/crm-tag.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-config-conversation-tags-create-data-modal',
  templateUrl: './config-conversation-tags-create-data-modal.component.html'
})
export class ConfigConversationTagsCreateDataModalComponent implements OnInit {
  @Input() isEdit!: string;
  public _form!: FormGroup;
  palette: Array<string> = [];
  isForce!: boolean;
  private destroy$ = new Subject<void>();

  constructor(
    private modal: TDSModalRef,
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private crmService: CRMTagService,
    private modalService:TDSModalService,
  ) {
    this._form = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      color: new FormControl('', [Validators.required]),
      status: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }
  change(){
    console.log(this._form)
  }
  public hasError = (controlName: string, errorName: string) => {
    return this._form.controls[controlName].hasError(errorName);
  }

  updateForm(data : TDSSafeAny) {
    if (data) {
      this._form.controls.name.setValue(data.Name);
      this._form.controls.color.setValue(data.ColorClassName);
      this._form.controls.status.setValue(!data.IsDeleted);
    }
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
      '#DDE2E9',
    ];
    this.crmService.getById(this.isEdit).pipe(takeUntil(this.destroy$))
    .subscribe(res=>{
      delete res['@odata.context'];
      this.updateForm(res)
    })
  }

  onChangeColor(value: string) {
    this._form.controls.color.setValue(value);
  }

  onChangeStatus() {
    this._form.controls.status.setValue(!this._form.value.status);
  }

  addNewColor() {

  }

  onSubmit() {
    let model = this.prepareModel();
    if (this._form.invalid) {
      return
    }
    if (this.isEdit) {
      this.crmService.update(this.isEdit,model,this.isForce).subscribe(
        (res)=>{
            this.message.success('Cập nhật thành công');
            this.modal.destroy(model);
        },
        (err)=>{
            this.confirmForceUpdate(model, err.error.message);
        }
    );
    } else {
      this.crmService.insert(model).subscribe(
        (res) => {
          this.message.success('Thêm thành công');
          this.modal.destroy(model);
        },
        (err) => {
          this.message.error(err.error?err.error.message:'Thêm thất bại');
        }
      );
    }
  }

  prepareModel() {
    let formModel = this._form.value;
    let modelDefault = {
      Name: formModel.name? formModel.name:'' as string,
      ColorClassName: formModel.color? formModel.color: '' as string,
      IsDeleted: !formModel.status as boolean,
    }
    return modelDefault
  }

  confirmForceUpdate(model:TDSSafeAny, message: string){
    this.modalService.warning({
        title: 'Warning',
        content: message,
        size:'sm',
        onOk: () => {
          this.isForce = true;
          this.crmService.update(this.isEdit,model,this.isForce).subscribe(
              (res)=>{
                  this.message.success('Cập nhật thành công');
                  this.modal.destroy(model);
              },
              (err)=>{
                  this.message.error(err.error ? err.error.message :'Cập nhật thất bại');
                  this.modal.destroy(null);
              }
          );
        },
        onCancel:()=>{},
        okText:"Tiếp tục",
        cancelText:"Hủy",
    });
}
  cancel() {
    this.modal.destroy(null);
  }

  save() {
    this.onSubmit();
  }
}
