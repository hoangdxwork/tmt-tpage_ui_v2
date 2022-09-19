import { LiveCampaignDTO } from './../../dto/live-campaign/odata-live-campaign.dto';
import { ODataProductDTOV2, ProductDTOV2 } from '../../dto/product/odata-product.dto';
import { ProductTemplateUOMLineService } from '../../services/product-template-uom-line.service';
import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign-model.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Message } from 'src/app/lib/consts/message.const';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { FastSaleOrderLineService } from '../../services/fast-sale-orderline.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { differenceInCalendarDays } from 'date-fns';
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

  dataModel!: LiveCampaignDTO;
  lstUser: ApplicationUserDTO[] = [];
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstProductSearch: ProductDTOV2[] = [];
  lstInventory!: GetInventoryDTO;
  textSearchProduct!: string;
  isLoading: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  _form!: FormGroup;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

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
      Facebook_UserName: [null]
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
              this.dataModel = res;
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

  //TODO: disable các giá trị ngày không khả dụng
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  onChangeDeposit(event:any){
    let maxAmountDepositRequired = this.dataModel? this.dataModel.MaxAmountDepositRequired: this._form.controls["MaxAmountDepositRequired"].value;

    if(event != maxAmountDepositRequired){
      this.isDepositChange = true;
    }else{
      this.isDepositChange = false;
    }

    if(this.isDepositChange) {
      setTimeout(()=>{
        this.isDepositChange = false;
      }, 10 * 1000);
    }
  }

  openTag(index: number) {
    this.indClickTag = index;
    //TODO: lấy dữ liệu từ formArray
    let data = this.detailsFormGroups.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
      this.modelTags = data.Tags;
    }else{
      this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(index: number) {
    //TODO: dữ liệu từ formArray
    let details = this.detailsFormGroups.at(index).value;
    details.Tags = this.modelTags;
    //TODO: cập nhật vào formArray
    this.detailsFormGroups.at(index).patchValue(details);
    this.modelTags = [];
    this.indClickTag = -1;
  }

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
        LiveCampaign_Id: [null],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: true
    });

    if(x) {
      x.LiveCampaign_Id = this.id;
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
              this.detailsFormGroups.removeAt(index);
            }
            this.isLoading = false;
        },
        error:(err) => {
            this.isLoading = false;
            this.message.error(`${err?.error?.message || JSON.stringify(err)}`);
        }
      });
    } else {
        this.detailsFormGroups.removeAt(index);
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
          Quantity: 1,
          LiveCampaign_Id: this.id || null,
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

        // TODO: thêm sản phẩm vào đầu danh sách nếu đã chưa tồn tại
        let lstProduct =  this.detailsFormGroups.value as LiveCampaignProductDTO[];
        lstProduct.unshift(product);

        //TODO: cập nhật lại danh sách sản phẩm
        this.detailsFormGroups.clear();
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
    let exist = this.detailsFormGroups.value.find((f:LiveCampaignProductDTO) => f.ProductId == data.Id && f.UOMId == data.UOMId);
    // TODO: kiểm tra xem sản phẩm có tồn tại trong form array hay chưa
    if(!exist){
      let product = {
        Quantity: 1,
        LiveCampaign_Id: this.id || null,
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
      let lstProduct =  this.detailsFormGroups.value as LiveCampaignProductDTO[];
      lstProduct.unshift(product);

      //TODO: cập nhật lại danh sách sản phẩm
      this.detailsFormGroups.clear();
      this.initFormDetails(lstProduct);
    } else {
      exist.Quantity += 1;

      // TODO: cập nhật lượng lên 1
      let formControl = this.detailsFormGroups.at(indexOf(this.detailsFormGroups.value, exist)) as FormGroup;
      formControl.controls["Quantity"].setValue(exist.Quantity);
    }

    this.closeSearchProduct();
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareHandler.prepareModel(this._form);

      let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;
      if(team?.Id && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
          model.Facebook_UserId = team.ChannelId;
          model.Facebook_UserName = team.Name;
      }

      this.isLoading = true;
      if(this.id) {
        this.updateLiveCampaign(this.id, model);
      } else {
        this.createLiveCampaign(model);
      }
    }
  }

  updateLiveCampaign(id: string, model: LiveCampaignModel){
        model.Id = id;
        this.liveCampaignService.update(model, true).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res:LiveCampaignModel) => {
              this.message.success('Cập nhật chiến dịch live thành công');
              this.onCannel(res);
              this.isLoading = false;
          },
          error: (error: any) => {
              this.isLoading = false;
              this.message.error(`${error?.error?.message || JSON.stringify(error)}`);

              this.detailsFormGroups.clear();
              this.initFormDetails(this.dataModel.Details);
          }
        });
  }

  createLiveCampaign(model: LiveCampaignModel){
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
