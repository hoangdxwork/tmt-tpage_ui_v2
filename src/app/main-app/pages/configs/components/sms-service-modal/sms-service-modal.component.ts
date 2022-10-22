import { takeUntil } from 'rxjs/operators';
import { Subject, pipe } from 'rxjs';
import { CategorySMSDTO, customPropertiesSMSDTO } from '../../../../dto/sms/sms.dto';
import { RestSMSService } from '../../../../services/sms.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ListSMSDTO, RestSMSDTO } from 'src/app/main-app/dto/sms/sms.dto';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
    selector: 'sms-service-modal',
    templateUrl: './sms-service-modal.component.html'
})
export class SMSServiceModalComponent implements OnInit {
    @Input() dataId!: number;

    isLoading: boolean = false;
    private destroy$ = new Subject<void>();
    categorySMS: CategorySMSDTO[] = [];
    items: Array<ListSMSDTO> = [];
    serviceForm!: FormGroup;
    modelDefault: RestSMSDTO = {
        ApiKey: '',
        ApiUrl: '',
        CustomProperties: '',
        Name: '',
        Provider: ''
    };

    constructor(
        private modal: TDSModalRef,
        private formBuilder: FormBuilder,
        private restSMSService: RestSMSService,
        private message: TDSMessageService,
    ) {
        this.createForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    createForm() {
        this.serviceForm = this.formBuilder.group({
            currentValue: new FormControl('', [Validators.required]),
            apiKey: new FormControl('', [Validators.required]),
            secretKey: new FormControl(''),
            category: new FormControl(''),
        });
    }

    resetForm() {
        this.serviceForm.controls.category.setValue('');
        this.serviceForm.controls.apiKey.setValue('');
        this.serviceForm.controls.secretKey.setValue('');
    }

    loadData() {
        this.restSMSService.getListSMS().pipe(takeUntil(this.destroy$)).subscribe((res: ListSMSDTO[]) => {
            this.items = [...res];
            res.forEach(item => {
              item.name = this.parserName(item.name);
            });
            console.log(this.items);

            if (this.dataId) {
                this.isLoading = true;
                this.restSMSService.getById(this.dataId).pipe(takeUntil(this.destroy$)).subscribe((res: RestSMSDTO) => {
                    if (res) {
                        this.modelDefault = res;
                        let temp = this.items.find(x => x.provider == res.Provider);
                        var hihi = JSON.parse(res.CustomProperties);
                        if (temp) {
                            let key = temp.categories.find(x => x.key == hihi.type.key);
                            this.serviceForm.controls.category.setValue(key?.key);
                            this.categorySMS = temp.categories
                        }
                        this.serviceForm.controls.currentValue.setValue(temp?.provider);
                        this.serviceForm.controls.apiKey.setValue(res.ApiKey);
                        this.serviceForm.controls.secretKey.setValue(hihi["secretkey"] || null);
                    }
                    this.isLoading = false;
                }, err => {
                    this.message.error(err.error ? err.error.message : 'Load dữ liệu thất bại')
                    this.isLoading = false;
                })
            }
        }, err => {
            this.message.error('Load dữ liệu danh sách đối tác dịch vụ thất bại!')
        })

    }

    parserName = (value: TDSSafeAny) => {
      if(value != null)
      {
        return TDSHelperString.replaceAll(value,"Dịch vụ","");
      }
      return value;
    };

    valueChange(ev: TDSSafeAny) {
        this.resetForm();
        let temp = this.items.find(x => x.provider == ev);
        if (temp) {
            this.categorySMS = temp.categories
            this.serviceForm.controls.category.setValue('');
        }
    }

    cancel() {
        this.modal.destroy(null);
    }

    prepareModel() {
        let model = this.serviceForm.value;
        let customProperties: customPropertiesSMSDTO = {
            secretkey: '',
            type: {
                Price: 0,
                key: 0,
                datasource: ''
            }
        };
        if (model.category) {
            let categ = this.categorySMS.find(x => x.key == model.category)
            if (categ) {
                customProperties.type.key = categ.key;
                customProperties.type.datasource = categ.datasource;
                customProperties.type.Price = categ.Price;
            }
        }
        this.modelDefault.ApiKey = model.apiKey? model.apiKey: null;
        if (model.secretKey) {
            customProperties.secretkey = model.secretKey
        }
        if (model.currentValue) {
            let current = this.items.find(x => x.provider == model.currentValue)
            if (current) {
                this.modelDefault.Provider = current.provider
                this.modelDefault.Name = current.name
                this.modelDefault.ApiUrl = current.apiurl
            }
        }
        this.modelDefault.CustomProperties = JSON.stringify(customProperties)
        return this.modelDefault
    }

    OnSave() {
        this.isLoading = true;
        let model = this.prepareModel();
        if (!model) {
            this.isLoading = false;
            return
        }
        if (!model.Provider) {
            this.message.error('Đối tác không được để trống!')
            this.isLoading = false;
            return
        }
        if (!model.ApiKey) {
            this.message.error('ApiKey không được để trống!')
            this.isLoading = false;
            return
        }
        let data = JSON.stringify(model);
        if (this.dataId) {
            this.restSMSService.update(this.dataId, data).pipe(takeUntil(this.destroy$)).subscribe(res => {
                this.message.success('Sửa đổi SMS thành công!')
                this.isLoading = false;
                this.modal.destroy(this.dataId);
            }, err => {
                this.message.error(err.error ? err.error.message : 'Sửa đổi SMS thất bại!')
                this.isLoading = false;
            })
        }
        if (!this.dataId) {
            this.restSMSService.insert(data).pipe(takeUntil(this.destroy$)).subscribe(res => {
                this.message.success('Thêm mới SMS thành công!')
                this.isLoading = false;
                this.modal.destroy('success');
            }, err => {
                this.message.error(err.error ? err.error.message : 'Thêm SMS thất bại!')
                this.isLoading = false;
            })
        }
    }
}
