import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs/operators';
import { ProductTemplateService } from '../../../../services/product-template.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
    selector: 'create-uom-modal',
    templateUrl: './create-uom-modal.component.html',
    providers: [TDSDestroyService]
})
export class CreateUOMModalComponent implements OnInit {
    @Input() type!: string;

    _form!: FormGroup;
    name!: string;
    isLoading: boolean = false;

    constructor(
        private modal: TDSModalRef,
        private message: TDSMessageService,
        private productTemplate: ProductTemplateService,
        private fb: FormBuilder,
        private destroy$: TDSDestroyService
    ) {
        this.initForm();
    }

    ngOnInit(): void {
        switch(this.type) {
            case 'producer':
                this.name = 'nhà sản xuất';
                break;
            case 'importer':
                this.name = 'nhà nhập khẩu';
                break;
            case 'distributor':
                this.name = 'nhà phân phối';
                break;
        }
    }

    initForm() {
        this._form = this.fb.group({
            Address: [null],
            Code: [null],
            Email: [null],
            Name: [null, Validators.required],
            Note: [null],
            Phone: [null],
            Type: [null]
        });
    }

    onCancel() {
        this.modal.destroy(null);
    }

    onSave() {
        if (!this._form.controls["Name"].value) {
            this.message.error(`Vui lòng nhập tên ${this.name}`);
            return;
        }

        this.isLoading = true;
        let model = this._form.value;
        model.Type = this.type;

        this.productTemplate.insertPartnerExt(model).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {

                if(!res) return;
                delete res["@odata.context"];
                this.isLoading = false;
                
                this.message.success('Thêm thành công');
                this.modal.destroy(res);
            },
            error: (err) => {
                this.isLoading = false;
                this.message.error(err.error.message || 'Thêm thất bại');
            }
        })
    }
}
