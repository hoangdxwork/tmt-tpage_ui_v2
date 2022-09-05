import { CreateQuickReplyDTO } from './../../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { Validators } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';

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
      active: new FormControl(true),
      bodyHtml: new FormControl(''),
      subjectHtml: new FormControl('',[Validators.required]),
    })
  }

  cancel(){
    this.modal.destroy(null)
  }

  onSave(){
    if(this._form.controls.subjectHtml.invalid){
      this.message.warning('Vui lòng nhập tên mẫu')
      return
    }

    let model = this.prepareModel();
    this.quickReplyService.insert(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.message.success('Thêm trả lời nhanh thành công');
        delete res['@odata.context'];
        delete res['@odata.type'];
        delete res['WritedById'];
        delete res['CreatedById'];
        delete res['CreatedById'];
        delete res['IRModelId'];
        delete res['LastUpdated'];
        delete res['MailServerId'];
        delete res['EventDatas'];

        this.quickReplyService.lstDataActive = [];
        this.modal.destroy(res);
      },
      error: (error: any) => {
        this.message.error(error.error.message || 'Thêm trả lời nhanh thất bại');
      }
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
