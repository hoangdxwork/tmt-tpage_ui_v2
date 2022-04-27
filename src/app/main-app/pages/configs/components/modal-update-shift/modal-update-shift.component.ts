import { TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { finalize } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { AddShiftDTO, ShiftDTO } from 'src/app/main-app/dto/account/application-user.dto';

@Component({
  selector: 'app-modal-update-shift',
  templateUrl: './modal-update-shift.component.html',
  styleUrls: ['./modal-update-shift.component.scss']
})
export class ModalUpdateShiftComponent implements OnInit {

  @Input() shiftId!: string;

  isLoading = false;
  formUpdateShift!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadShift();
  }

  createForm(){
    this.formUpdateShift = this.fb.group({
      Name: [null, [Validators.required]],
      FromHour: [null, [Validators.required]],
      ToHour: [null, [Validators.required]],
    });
  }

  updateForm(value: ShiftDTO) {
    let formControls = this.formUpdateShift.controls;

    let startTime = Number(value.FromHour.substring(0,2));
    let minutesStart = Number(value.FromHour.substring(3));
    let endTime = Number(value.ToHour.substring(0,2));
    let minutesEnd = Number(value.ToHour.substring(3));

    formControls.Name.setValue(value.Name);
    formControls.FromHour.setValue(new Date(2000, 2, 10, startTime, minutesStart));
    formControls.ToHour.setValue(new Date(2000, 2, 10, endTime, minutesEnd));
  }

  loadShift() {
    this.isLoading = true;
    this.applicationUserService.getShiftById(this.shiftId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.updateForm(res);
      });
  }

  onSubmitAddShift(){
    let model = this.prepareModel();

    this.isLoading = true;
    this.applicationUserService.updateShifts(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.modal.destroy(true);
        this.message.success(Message.UpdatedSuccess);
      }, error => {
        if(error?.error?.message) this.message.error(error?.error?.message);
        else this.message.error(Message.ErrorOccurred);
      });
  }

  prepareModel() {
    let formValue = this.formUpdateShift.value;

    let startTime = formValue.FromHour.getHours();
    let minutesStart = formValue.FromHour.getMinutes();
    let startEnd = formValue.ToHour.getHours();
    let minutesEnd = formValue.ToHour.getMinutes();

    if (minutesStart < 10) {
      minutesStart = `0${minutesStart}`;
    }
    if (minutesEnd < 10) {
      minutesEnd = `0${minutesEnd}`;
    }
    if (startTime < 10) {
      startTime = `0${startTime}`;
    }
    if (startEnd < 10) {
      startEnd = `0${startEnd}`;
    }

    let fromHours = `${startTime}h${minutesStart}`;
    let toHours = `${startEnd}h${minutesEnd}`;

    let model: ShiftDTO = {
      Id: this.shiftId,
      Name: formValue.Name,
      FromHour: fromHours,
      ToHour: toHours
    }

    return model;
  }

  cancel() {
    this.modal.destroy(null);
  }

  save() {
      this.onSubmitAddShift();
  }

}
