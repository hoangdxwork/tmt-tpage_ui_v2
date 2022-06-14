import { CRMTagDTO } from '../../../../dto/crm-tag/odata-crmtag.dto';
import { CRMTagService } from '../../../../services/crm-tag.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
    selector: 'app-config-conversation-tags-edit-data-modal',
    templateUrl: './config-conversation-tags-edit-data-modal.component.html',
    host: {
        class: "flex w-full"
    }
})
export class ConfigConversationTagsEditDataModalComponent implements OnInit {
    @Input() data!:CRMTagDTO;

    public editForm: FormGroup = new FormGroup({}) ;
    palette:Array<string> = [];
    result:TDSSafeAny;
    isForce:boolean = false;

    constructor(
        private modal: TDSModalRef,
        private confirmModal:TDSModalService,
        private formBuilder: FormBuilder,
        private message: TDSMessageService,
        private crmService: CRMTagService
        ) {}

    ngOnInit(): void {
        this.loadData();
        this.editForm = this.formBuilder.group({
            name: new FormControl(this.data.Name, [Validators.required]),
            color: new FormControl(this.data.ColorClassName, [Validators.required]),
        });
    }

    public hasError = (controlName: string, errorName: string) => {
        return this.editForm.controls[controlName].hasError(errorName);
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
        this.editForm.value.color = value
    }

    addNewColor(){

    }

    confirmForceUpdate(){
        this.confirmModal.warning({
            title: 'Warning',
            content: 'Màu đã được sử dụng. bạn có muốn tiếp tục?',
            size:'sm',
            onOk: () => {
                this.isForce = true;
                this.crmService.update(this.data.Id,this.result,this.isForce).subscribe(
                    (res)=>{
                        this.message.success('Cập nhật thành công');
                        this.modal.destroy(this.result);
                    },
                    (err)=>{
                        this.message.error('Cập nhật thất bại');
                        this.modal.destroy(null);
                    }
                );
            },
            onCancel:()=>{},
            okText:"Tiếp tục",
            cancelText:"Hủy",
        });
    }

    onSubmit() {
        if (!this.editForm.invalid) {
            this.result = {
                Id: this.data.Id,
                Icon: this.data.Icon,
                IsDeleted: this.data.IsDeleted,
                DateCreated: this.data.DateCreated,
                Name:this.editForm.value.name,
                ColorClassName:this.editForm.value.color
            }

            this.crmService.update(this.data.Id,this.result,this.isForce).subscribe(
                (res)=>{
                    this.message.success('Cập nhật thành công');
                    this.modal.destroy(this.result);
                },
                (err)=>{
                    this.confirmForceUpdate();
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
