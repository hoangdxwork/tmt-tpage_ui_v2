import { CreateQuickReplyDTO } from './../../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSMessageService } from 'tmt-tang-ui';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { TDSModalRef, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-add-quick-reply',
  templateUrl: './modal-add-quick-reply.component.html'
})
export class ModalAddQuickReplyComponent implements OnInit {
  _form!: FormGroup;
  modelDefault!: CreateQuickReplyDTO;
  destroy$ = new Subject();

  constructor(
    private modal: TDSModalRef,
    private fb: FormBuilder,
    private quickReplyService: QuickReplyService,
    private message: TDSMessageService,
  ) {
    this.createForm();
   }

  ngOnInit(): void {
    this.modelDefault = {
      SubjectHtml: '',
      BodyHtml: '',
      Active: false,
    }
  }

  createForm(){
    this._form = this.fb.group({
      active: new FormControl(false),
      bodyHtml: new FormControl(''),
      subjectHtml: new FormControl('',[Validators.required]),
    })
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){
    if(this._form.invalid){
      return
    }
    let model = this.prepareModel();
    this.quickReplyService.insert(model).pipe(takeUntil(this.destroy$))
      .subscribe(res=>{
        this.message.success('Thêm trả lời nhanh thành công');
        this.quickReplyService.addDataActive(res);
        this.modal.destroy(res);
      }, err=>{
        this.message.error(err.error? err.error.message: 'Thêm trả lời nhanh thất bại');
      })
  }

  prepareModel(){
    let formModel = this._form.value;
    if(formModel.subjectHtml){
      this.modelDefault.SubjectHtml = formModel.subjectHtml;
    }
    if(formModel.bodyHtml) {
      this.modelDefault.BodyHtml = formModel.bodyHtml;
    }
    if(formModel.active) {
      this.modelDefault.Active = formModel.active;
    }
    return this.modelDefault
  }
}
