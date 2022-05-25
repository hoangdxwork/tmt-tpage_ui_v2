import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TDSModalRef, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { AddShiftDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'app-modal-add-shift',
  templateUrl: './modal-add-shift.component.html'
})
export class ModalAddShiftComponent implements OnInit {

  formAddShift!: FormGroup;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modal: TDSModalRef,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formAddShift = this.fb.group({
      Name: [null, [Validators.required]],
      FromHour: [null, [Validators.required]],
      ToHour: [null, [Validators.required]],
    });
  }

  onSubmitAddShift(){
    let model = this.prepareModel();

    this.isLoading = true;
    this.applicationUserService.addShifts(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.modal.destroy(true);
        this.message.success(Message.InsertSuccess);
      }, error => {
        if(error?.error?.message) this.message.error(error?.error?.message);
        else this.message.error(Message.ErrorOccurred);
      });
  }

  prepareModel() {
    let formValue = this.formAddShift.value;

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

    let model: AddShiftDTO = {
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
