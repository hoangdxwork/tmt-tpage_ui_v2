import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';

import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Output, EventEmitter, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
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
import { Guid } from 'guid-typescript';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';

@Component({
  selector: 'add-livecampaign-post',
  templateUrl: './add-livecampaign-post.component.html',
  providers: [TDSDestroyService]
})
export class AddLiveCampaignPostComponent implements OnInit {

  @Input() id?: string;
  @Input() isCopy?: boolean;

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  lstUser: ApplicationUserDTO[] = [];
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstProductSearch: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  _form!: FormGroup;
  companyCurrents!: CompanyCurrentDTO;

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null)
    {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  } ;
  
  parserComas = (value: TDSSafeAny) =>{
    if(value != null)
    {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private crmTeamService: CRMTeamService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private fastSaleOrderLineService: FastSaleOrderLineService,
    private productTemplateUOMLineService: ProductTemplateUOMLineService,
    private productService: ProductService,
    private sharedService: SharedService,
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
    if(this.id && Guid.isGuid(this.id)) {
      this.loadData(this.id);
    }

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
  }

  createForm() {
    this._form = this.fb.group({
      Id: [this.id],
      Details: this.fb.array([]),
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
      EnableQuantityHandling: [true],
      IsAssignToUserNotAllowed: [true],
      IsShift: [false],
      Facebook_UserId: [null],
      Facebook_UserName: [null],
    });
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.lstUser = [...res];
      }
    })
  }

  loadQuickReply() {
    this.quickReplyService.setDataActive();
    this.lstQuickReplies$ = this.quickReplyService.getDataActive();
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
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
          this.companyCurrents = res;
          if(this.companyCurrents.DefaultWarehouseId) {
              this.loadInventoryWarehouseId(this.companyCurrents.DefaultWarehouseId);
          }
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Load thông tin công ty mặc định đã xảy ra lỗi!');
      }
    });
  }

  loadData(id?: string) {
    if(id) {
      this.isLoading = true;
      this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res) => {
              delete res['@odata.context'];
              this.updateForm(res);
              this.isLoading = false;
          },
          error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          }
        });
    }
  }

  updateForm(data: any) {
    // TODO: trường hợp copy chiến dịch live
    if(this.isCopy) {
        delete this.id;
        data.Details?.map((x: any) => {
            delete x.Id;
        })
    };

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
      details.forEach(x => {
          const control = <FormArray>this._form.controls['Details'];
          control.push(this.initDetail(x));
      });
    }
  }

  initDetail(x?: LiveCampaignProductDTO) {
    let item = this.fb.group({
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

    if(x) {
      item.patchValue(x);
    }

    return item;
  }

  removeDetail(index: number, detail: TDSSafeAny) {
    if(TDSHelperString.hasValueString(detail?.Id)) {
      this.isLoading = true;
      this.fastSaleOrderLineService.getByLiveCampaignId(detail.Id, detail.ProductId, detail.UOMId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            delete res['@odata.context']

            if(TDSHelperArray.hasListValue(res?.value)) {
                this.message.error(Message.LiveCampaign.ErrorRemoveLine);
            } else {
                const control = this.detailsFormGroups;
                control.removeAt(index);
            }

            this.isLoading = false;
        },
        error:(err) => {
            this.isLoading = false;
            this.message.error(`${err?.error?.message || JSON.stringify(err)}`);
        }
      });
    } else {
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

    let exist = formArray.value.find((f:LiveCampaignProductDTO) => f.ProductId == data.Id && f.UOMId == data.UOMId);
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
    } else {
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

      let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
      if(TDSHelperObject.hasValue(team) && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
          model.Facebook_UserId = team.ChannelId;
          model.Facebook_UserName = team.Name;
      }

      this.isLoading = true;
      if(this.id) {
        model.Id = this.id;
        this.liveCampaignService.update(model, true).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:LiveCampaignModel) => {
              this.message.success('Cập nhật chiến dịch live thành công');
              this.onCannel(res);
              this.isLoading = false;
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
          }
        });
      } else {
        this.liveCampaignService.create(model).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:LiveCampaignModel) => {
              this.message.success('Thêm mới chiến dịch live thành công');

              this.onCannel(res);
              this.isLoading = false;
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
          }
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

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCannel(data?: any) {
    this.modalRef.destroy(data);
  }
}
