import { CRMTagDTO } from '../../../../dto/crm-tag/odata-crmtag.dto';
import { CRMTagService } from '../../../../services/crm-tag.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-config-conversation-tags-create-data-modal',
  templateUrl: './config-conversation-tags-create-data-modal.component.html'
})
export class ConfigConversationTagsCreateDataModalComponent implements OnInit {
  public createForm!: FormGroup;
  palette:Array<string> = [];
  result:TDSSafeAny;

  constructor(
      private modal: TDSModalRef,
      private formBuilder: FormBuilder,
      private message: TDSMessageService,
      private crmService: CRMTagService
      ) {
        this.createForm = this.formBuilder.group({
          name: new FormControl('', [Validators.required]),
          color: new FormControl('', [Validators.required]),
          status: new FormControl(true),
      });
      }

  ngOnInit(): void {
      this.loadData();
  }

  public hasError = (controlName: string, errorName: string) => {     
      return this.createForm.controls[controlName].hasError(errorName);
  }

  loadData(){
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
  }

  onChangeColor(value:string){
    this.createForm.controls.color.setValue(value);
  }

  onChangeStatus(){
    this.createForm.controls.status.setValue(!this.createForm.value.status);
  }

  addNewColor(){
    
  }

  onSubmit() {
      if (!this.createForm.invalid) {
          this.result = {
              Name:this.createForm.value.name,
              ColorClassName:this.createForm.value.color,
              IsDeleted: !this.createForm.value.status,
          }
          
          this.crmService.insert(this.result).subscribe(
            (res)=>{
              this.message.success('Thêm thành công');
              this.modal.destroy(this.result);
            },
            (err)=>{
                this.message.error(err.error.message);
            }
          );
      }
  }

  cancel() {
      this.modal.destroy(null);
  }

  save() {
      this.onSubmit();
  }
}
