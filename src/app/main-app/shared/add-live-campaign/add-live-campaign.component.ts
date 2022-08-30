import { TAuthService } from './../../../lib/services/auth.service';
import { ODataProductDTOV2, ProductDTOV2 } from './../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from './../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from './../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';

import { finalize, mergeMap } from 'rxjs/operators';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { id } from 'date-fns/locale';
import { Message } from 'src/app/lib/consts/message.const';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, map, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { compareAsc, differenceInCalendarDays } from 'date-fns';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { ProductService } from '@app/services/product.service';
import { LiveCampaignProductDTO } from '@app/dto/live-campaign/odata-live-campaign.dto';
import { indexOf } from 'lodash';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'add-live-campaign',
  templateUrl: './add-live-campaign.component.html',
  providers: [TDSDestroyService]
})
export class AddLiveCampaignComponent implements OnInit {

  @Input() id?: string;
  @Input() isCopy?: boolean;

  @Output() onSuccess = new EventEmitter<any>();

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstProductSearch: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  _form!: FormGroup;
  companyCurrents!: CompanyCurrentDTO;

  constructor(
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private formBuilder: FormBuilder,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private productService: ProductService,
    private sharedService: SharedService,
    private auth: TAuthService,
    private message: TDSMessageService,
    private prepareHandler: PrepareAddCampaignHandler,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService) {
    this.createForm();
   }

  get detailsFormGroups() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    this.loadData(this.id);
    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.formBuilder.group({
      Id: [this.id],
      Details: this.formBuilder.array([]),
      Config: [null],
      Name: [null, Validators.required],
      Note: [null],
      ResumeTime: [0],
      StartDate: [new Date()],
      EndDate: [new Date()],
      Users: [null],
      Preliminary_Template: [null],
      ConfirmedOrder_Template: [null],
      MinAmountDeposit: [0],
      MaxAmountDepositRequired: [0],
      IsEnableAuto: [false],
      EnableQuantityHandling: [false],
      IsAssignToUserNotAllowed: [false],
      IsShift: [false]
    });
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$;
  }

  loadQuickReply() {
    this.lstQuickReplies$ = this.quickReplyService.dataActive$;
  }

  loadProduct(textSearch: string) {
    this.isLoadingProduct = true;
    let top = 20;
    let skip = 0;

    this.productTemplateUOMLineService.getProductUOMLine(skip, top, textSearch).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: ODataProductDTOV2) => {
        this.lstProductSearch = [...res.value];
        this.isLoadingProduct = false;
      },
      error:(err) =>{
       this.message.error(err?.error?.message || 'Không thể tải danh sách sản phẩm');
      }
    });
  }

  loadInventoryWarehouseId(warehouseId: number) {
    this.productService.setInventoryWarehouseId(warehouseId);
    this.productService.getInventoryWarehouseId().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstInventory = res;
      },
      error:(err) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe((res: CompanyCurrentDTO) => {
      this.companyCurrents = res;

      if(this.companyCurrents.DefaultWarehouseId) {
          this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
      }
  }, error => {
      this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
  });
  }

  loadData(id?: string) {
    if(id) {
      this.isLoading = true;

      this.liveCampaignService.getDetailById(id).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe({
          next:(res) => {
            this.updateForm(res);
          },
          error:(err) => {
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          }
        });
    }
  }

  updateForm(data: any) {
    if(!this.isCopy) delete data["Id"];

    this._form.patchValue(data);

    this.initFormDetails(data.Details);
  }

  onChangeDate(event:Date, type:number){
    if(type == 0){
      this._form.controls["StartDate"].setValue(event.toISOString());
    }
    if(type == 1){
      this._form.controls["EndDate"].setValue(event.toISOString());
    }
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  initFormDetails(details: any[]) {

    if(TDSHelperArray.hasListValue(details)) {
      details.forEach(detail => {

        const control = <FormArray>this._form.controls['Details'];
        control.push(this.initDetail(detail));
      });
    }
  }

  initDetail(detail?: LiveCampaignProductDTO) {
    let detailFormGroup = this.formBuilder.group({
        Id: [null],
        Index: [null],
        Quantity: [null],
        RemainQuantity: [null],
        ScanQuantity: [null],
        UsedQuantity: [null],
        Price: [null],
        Note: [null],
        ProductId: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [null],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: true
    });

    if(detail) {
      detailFormGroup.patchValue(detail);
    }

    return detailFormGroup;
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    if(TDSHelperString.hasValueString(detail?.Id) && !this.isCopy) {
      this.isLoading = true;

      this.fastSaleOrderLineService.getByLiveCampaignId(detail.Id, detail.ProductId, detail.UOMId).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
      .subscribe({
        next:(res) => {
          if(TDSHelperArray.hasListValue(res?.value)) {
            this.message.error(Message.LiveCampaign.ErrorRemoveLine);
          }else {
            const control = this.detailsFormGroups;
            control.removeAt(index);
          }
        },
        error:(err) => {
          this.message.error(`${err?.error?.message || JSON.stringify(err)}`);
        }
      });
    }
    else {
      const control = this.detailsFormGroups;
      control.removeAt(index);
    }
  }

  removeAllDetail() {
    this.message.info('Chưa thể xóa tất cả sản phẩm.');
  }

  createProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          typeComponent: null,
        }
    });

    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)) {
        let data = result[0] as ProductTemplateV2DTO;

        let product = {
          Id: this.id,
          Quantity: 1,
          LimitedQuantity: 0,
          Price: data.ListPrice || 0,
          Note: null,
          ProductId: data.Id,
          ProductName: data.Name,
          ProductNameGet: data.NameGet,
          RemainQuantity: 0,
          ScanQuantity: 0,
          Tags: data.Tags || '',
          UOMId: data.UOMId,
          UOMName: data.UOMName,
          ProductCode: data.DefaultCode,
          ImageUrl: data.ImageUrl,
          IsActive: data.Active,
          UsedQuantity: 0
        } as LiveCampaignProductDTO;

        const formArray = this.detailsFormGroups;
        // TODO: thêm sản phẩm vào đầu danh sách nếu đã chưa tồn tại
        let lstProduct =  formArray.value as LiveCampaignProductDTO[];
        lstProduct.unshift(product);

        //TODO: cập nhật lại danh sách sản phẩm
        formArray.clear();
        this.initFormDetails(lstProduct);
      }
    })
  }

  onSearchProduct(event: any) {
    let text = this.textSearchProduct;
    this.loadProduct(text);
  }

  closeSearchProduct(){
    this.textSearchProduct = '';
  }

  selectProduct(data: ProductDTOV2){
    const formArray = this.detailsFormGroups;

    let exist = formArray.value.find((f:LiveCampaignProductDTO)=>f.ProductId == data.Id);
    // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
    if(!exist){
      let product = {
        Id: this.id,
        Quantity: 1,
        LimitedQuantity: 0,
        Price: data.Price || 0,
        Note: data.Note || null,
        ProductId: data.Id,
        ProductName: data.Name,
        ProductNameGet: data.NameGet,
        RemainQuantity: 0,
        ScanQuantity: 0,
        Tags:'',
        UOMId: data.UOMId,
        UOMName: data.UOMName,
        ProductCode: data.DefaultCode,
        ImageUrl: data.ImageUrl,
        IsActive: data.Active,
        UsedQuantity: 0
      } as LiveCampaignProductDTO;

      // TODO: thêm sản phẩm vào đầu danh sách nếu đã chưa tồn tại
      let lstProduct =  formArray.value as LiveCampaignProductDTO[];
      lstProduct.unshift(product);

      //TODO: cập nhật lại danh sách sản phẩm
      formArray.clear();
      this.initFormDetails(lstProduct);
    }else{
      exist.Quantity += 1;

      // TODO: cập nhật lượng lên 1
      let formControl = formArray.at(indexOf(formArray.value, exist)) as FormGroup;
      formControl.controls["Quantity"].setValue(exist.Quantity);
    }

    this.closeSearchProduct();
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);
      this.isLoading = true;

      if(this.id){
        model.Id = this.id;

        this.liveCampaignService.update(model,true).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe((res:LiveCampaignModel) => {

          this.message.success(Message.UpdatedSuccess);
          this.onSuccess.emit(res);

          this.onCannel();
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });

      }else{

        this.liveCampaignService.create(model).pipe(finalize(() => this.isLoading = false), takeUntil(this.destroy$))
        .subscribe((res:LiveCampaignModel) => {

          this.message.success(Message.InsertSuccess);
          this.onSuccess.emit(res);

          this.onCannel();
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
      }

    }
  }

  isCheckValue() {
    let formValue = this._form.value;

    if(!TDSHelperString.hasValueString(formValue.Name)){
      this.message.error('Vui lòng nhập tên chiến dịch');

      return 0;
    }

    if(TDSHelperArray.hasListValue(formValue.Details)) {
      let find = formValue.Details.findIndex((x: any) => !this.isNumber(x.Quantity) || !this.isNumber(x.LimitedQuantity) || !this.isNumber(x.Price));

      if(find > -1) {
        this.message.error(Message.LiveCampaign.ErrorNumberDetail);

        return 0;
      }
    }

    let compare = compareAsc(new Date(formValue.StartDate).getTime(), new Date(formValue.EndDate).getTime());

    if(compare >= 0){
      this.message.error('Vui lòng nhập thời gian Kết thúc lớn hơn thời gian Bắt đầu');

      return 0;
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCannel() {
    this.modalRef.destroy(null);
  }
}
