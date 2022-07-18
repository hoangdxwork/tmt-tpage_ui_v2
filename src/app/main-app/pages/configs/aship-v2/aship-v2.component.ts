import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralConfigService } from 'src/app/main-app/services/general-config.service';
import { AutoInteractionDTO, GeneralConfigUpdateDTO, ShippingStatuesDTO } from 'src/app/main-app/dto/configs/general-config.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Subject, takeUntil, finalize } from 'rxjs';
import { BaseHelper } from 'src/app/main-app/shared/helper/base.helper';

@Component({
  selector: 'aship-v2',
  templateUrl: './aship-v2.component.html'
})

export class AshipV2Component implements OnInit, OnDestroy {

  _form!: FormGroup;
  private destroy$ = new Subject<void>();
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
    private message: TDSMessageService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({

    })
  }

  updateForm(data: AutoInteractionDTO) {
    this._form.patchValue(data);
  }

  ngOnInit(): void {
    this.loadData();

  }

  loadData() {

  }

  onSave(){
    let model = this.prepareModel();
  }

  prepareModel() {

  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}
