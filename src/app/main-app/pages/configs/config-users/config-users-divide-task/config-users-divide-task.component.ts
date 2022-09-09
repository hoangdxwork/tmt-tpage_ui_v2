import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'app-config-users-divide-task',
  templateUrl: './config-users-divide-task.component.html',
  host: {
    class: 'w-full h-full flex'
  }
})
export class ConfigUsersDivideTaskComponent implements OnInit {

  public contactOptionsTask = [
    { id: 1, name: '5 phút' },
    { id: 2, name: '10 phút' },
    { id: 3, name: 'Khác' },
  ]
  persondisplayWith!: FormControl;

  formDivideTag!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formDivideTag = this.formBuilder.group({
      AssignOnShift: [true],
      AssignOnAccount: [true],
      AssignOnActive: [true],
      AssignOnAutomation: [true],
      AssignTime: [null]
    });
  }

  onSave() {
    this.message.info(Message.FunctionNotWorking);
  }

}
