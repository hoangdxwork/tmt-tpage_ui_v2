import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { LiveCampaignService } from "@app/services/live-campaign.service";
import { TDSDestroyService } from "tds-ui/core/services";
import { takeUntil} from "rxjs";
import { TDSMessageService } from "tds-ui/message";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from "@app/dto/product-pouchDB/product-pouchDB.dto";
import { ProductIndexDBService } from "@app/services/product-indexdb.service";
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from "@app/dto/live-campaign/livecampaign-simple.dto";
import { TDSModalService } from "tds-ui/modal";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { GetInventoryDTO } from "@app/dto/product/product.dto";
import { SharedService } from "@app/services/shared.service";
import { CompanyCurrentDTO } from "@app/dto/configs/company-current.dto";
import { ProductService } from "@app/services/product.service";
import { TDSNotificationService } from "tds-ui/notification";
import { StringHelperV2 } from "@app/shared/helper/string.helper";

@Component({
  selector: 'drawer-edit-livecampaign',
  templateUrl: './drawer-edit-livecampain.component.html',
  providers: [ TDSDestroyService ]
})

export class DrawerEditLiveCampaignComponent implements OnInit, OnChanges {

  @Input() liveCampaignId: any;
  _form!: FormGroup;

  dataModel!: LiveCampaignSimpleDto;
  isLoading: boolean = false;
  indexDbStorage!: DataPouchDBDTO[];
  isLoadingProduct: boolean = false;

  livecampaignSimpleDetail: any = [];
  isEditDetails: { [id: string] : boolean } = {};
  innerTextValue: string = '';
  searchValue: string = '';
  innerText: string = '';
  innerTextDebounce!: string;
  indClick: number = -1;

  lstVariants: DataPouchDBDTO[] = [];
  lstInventory!: GetInventoryDTO;
  companyCurrents!: CompanyCurrentDTO;

  visible: boolean = false;
  indClickTag: number = -1;
  modelTags: Array<string> = [];
  isLoadingSelect: boolean = false;
  isLoadingTable: boolean = false;

  numberWithCommas =(value: TDSSafeAny) =>{
    if(value != null) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  }

  parserComas = (value: TDSSafeAny) => {
    if(value != null) {
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  }

  constructor(private liveCampaignService: LiveCampaignService,
    private message: TDSMessageService,
    private modal: TDSModalService,
    private cdRef: ChangeDetectorRef,
    private productIndexDBService: ProductIndexDBService,
    private sharedService: SharedService,
    private productService: ProductService,
    private notificationService: TDSNotificationService,
    private fb: FormBuilder,
    private destroy$: TDSDestroyService) {
      this.createForm();
  }

  ngOnInit() {
    if(this.liveCampaignId) {
      this.loadData();
    }

    this.loadCurrentCompany();
    this.productLastV2();
  }

  createForm() {
    this._form = this.fb.group({
        Id: [null],
        Details: this.fb.array([]),
    })
  }

  get detailsForm() {
    return (this._form?.get("Details")) as FormArray;
  }

  loadData() {
    this.isLoading = true;
    this.liveCampaignService.getById(this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(!res) return;
          delete res['@odata.context'];

          this.dataModel = res;
          this.updateForm(res);

          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
          this.cdRef.detectChanges();
      }
    })
  }

  updateForm(data: LiveCampaignSimpleDto) {
    this._form.patchValue(data);
    this._form.controls['Id'].setValue(this.liveCampaignId);

    this.initFormDetails(data.Details);
    this.livecampaignSimpleDetail = [...this.detailsForm.value];
  }

  initFormDetails(details: any[]) {
    details?.forEach(x => {
        this.detailsForm.push(this.initDetail(x));
    });
  }

  initDetail(x?: LiveCampaignSimpleDetail | null) {
    let item = this.fb.group({
        Id: [null],
        Index: [null],
        Quantity: [0],
        RemainQuantity: [0],
        ScanQuantity: [0],
        UsedQuantity: [0],
        Price: [null],
        Note: [null],
        ProductId: [null],
        LiveCampaign_Id: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [0],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: [false]
    });

    if(x) {
        x.LiveCampaign_Id = this.liveCampaignId;
        item.patchValue(x);
    }

    return item;
  }

  removeDetail(item: LiveCampaignSimpleDetail) {
    let id = this.liveCampaignId as string;
    this.isLoading = true;
    this.liveCampaignService.deleteDetails(id, [item.Id]).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {

            let formDetails = this.detailsForm.value as any[];
            let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
            this.detailsForm.removeAt(index);

            let newFormDetails = this.detailsForm.value as any[];
            this.livecampaignSimpleDetail = [];
            this.detailsForm.clear();

            this.initFormDetails(newFormDetails);
            this.livecampaignSimpleDetail = [...newFormDetails];

            this.searchValue = this.innerTextValue;
            delete this.isEditDetails[item.Id];

            this.isLoading = false;
            this.message.success('Thao tác thành công');
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }

  removeAllDetail() {
    let formDetails = this.detailsForm.value as LiveCampaignSimpleDetail[];
    let ids = formDetails?.map(x => x.Id) as any[];

    this.modal.warning({
        title: 'Xóa tất cả sản phẩm',
        content: 'Xác nhận xóa tất cả sản phẩm trong chiến dịch',
        onOk: () => {
            this.isLoading = true;
            let id = this.liveCampaignId as string;

            this.liveCampaignService.deleteDetails(id, ids).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: any) => {

                  this.isEditDetails = {};
                  this.detailsForm.clear();
                  this.livecampaignSimpleDetail = [];

                  this.isLoading = false;
                  this.message.success('Thao tác thành công');
              },
              error: (err: any) => {
                  this.isLoading = false;
                  this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
              }
            })
        },
        onCancel:() => {},
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
  }

  onFilterIndexDB(event: any) {
    if(!this.innerText) {
      this.innerTextDebounce = '';
      return;
    };

    this.innerTextDebounce = TDSHelperString.stripSpecialChars(this.innerText.toLocaleLowerCase().trim());
  }

  closeFilterIndexDB(){
    this.innerText = '';
    this.innerTextDebounce = '';
    this.indClick = -1;
    this.lstVariants = [];
  }

  addItemProduct(listData: DataPouchDBDTO[]) {
    let formDetails = this.detailsForm.value as any[];
    let simpleDetail: LiveCampaignSimpleDetail[] = [];

    listData.forEach((x: DataPouchDBDTO) => {
      let exist = formDetails.filter((f: LiveCampaignSimpleDetail) => f.ProductId == x.Id && f.UOMId == x.UOMId)[0];
      if(!exist){
          let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
            ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
          let item = {
              Quantity: qty,
              RemainQuantity: 0,
              ScanQuantity: 0,
              QuantityCanceled: 0,
              UsedQuantity: 0,
              Price: x.Price || 0,
              Note: null,
              ProductId: x.Id,
              LiveCampaign_Id: this.liveCampaignId,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              Tags: x.Tags,
              LimitedQuantity: 0,
              ProductCode: x.Barcode || x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as LiveCampaignSimpleDetail;

          let name = item.ProductNameGet || item.ProductName;
          if(x._attributes_length == undefined) x._attributes_length = 0;

          let tags = this.generateTagDetail(name, item.ProductCode, item.Tags, x._attributes_length);
          item.Tags = tags?.join(',');

          simpleDetail = [...simpleDetail, ...[item]];

      } else {
          exist.Quantity += 1;
          simpleDetail = [...simpleDetail, ...[exist]];
      }
    })

    if(simpleDetail && simpleDetail.length > 0){
        this.addProductLiveCampaignDetails(simpleDetail);
    }
  }

  addProductLiveCampaignDetails(items: LiveCampaignSimpleDetail[]) {
    let id = this.liveCampaignId as string;
    items.map(x => {
      if(x && x.Tags) {
          x.Tags = x.Tags.toString();
      }
    });

    this.isLoading = true;
    this.liveCampaignService.updateDetails(id, items).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any[]) => {
          this.isLoading = false;
          if(!res) return;

          res.map((x: LiveCampaignSimpleDetail, idx: number) => {

              x.ProductName = items[idx].ProductName;
              x.ProductNameGet = items[idx].ProductNameGet;
              x.ImageUrl = items[idx].ImageUrl;

              let formDetails = this.detailsForm.value as any[];
              let index = formDetails.findIndex(f => f.Id == x.Id && f.ProductId == x.ProductId);

              if(Number(index) >= 0) {
                  index = Number(index);
                  this.detailsForm.at(index).patchValue(x);

                  this.notificationService.info(`Cập nhật sản phẩm`,
                  `<div class="flex flex-col ">
                      <span class="mb-1">Sản phẩm: <span class="font-semibold"> ${x.ProductName}</span></span>
                      <span> Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span>
                  </div>`);
              } else {
                  formDetails = [...[x], ...formDetails];
                  this.detailsForm.clear();

                  this.initFormDetails(formDetails);
                  this.notificationService.info(`Thêm mới sản phẩm`,
                  `<div class="flex flex-col">
                      <span class="mb-1">Sản phẩm: <span class="font-semibold">[${x.ProductCode}] ${x.ProductName}</span></span>
                      <span>Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span>
                  </div>`);
              }

              delete this.isEditDetails[x.Id];
          })

          this.livecampaignSimpleDetail = [...this.detailsForm.value];
          this.cdRef.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
    })
  }

  generateTagDetail(productName: string, code: string, tags: string,  _attributes_length?: number) {
    let result: string[] = [];

    if(!TDSHelperString.hasValueString(productName)) {
      return result;
    }

    productName = productName.replace(`[${code}]`, "");
    productName = productName.trim();

    let word = StringHelperV2.removeSpecialCharacters(productName);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    result.push(word);

    if(!result.includes(wordNoSignCharacters)) {
      result.push(wordNoSignCharacters);
    }

    if(!result.includes(wordNameNoSpace)) {
      result.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code && _attributes_length == 0) {
      result.push(code);
    }

    if(TDSHelperString.hasValueString(tags)){
        let tagArr = tags.split(',');
        tagArr.map(x => {
          if(x && !result.find(y => y == x))
              result.push(x);
        })
    }

    return [...result];
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
  }

  onReset(): void {
    this.searchValue = '';
    this.innerTextValue = '';
    this.visible = false;
    this.indClickTag = -1;
    this.detailsForm.clear();
    this.initFormDetails(this.livecampaignSimpleDetail);
  }

  onSearch(): void {
    this.indClickTag = -1;
    this.searchValue = TDSHelperString.stripSpecialChars(this.innerTextValue?.toLocaleLowerCase()).trim();
  }

  getVariant(data?: DataPouchDBDTO) {
    if(data && data.Id) {//chọn hiện tại
        let simpleDetail = [data];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    } else {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    }

    this.lstVariants = [];
    this.indClick = -1;
  }

  selectProduct(model: DataPouchDBDTO, index: number){
    if(this.isLoadingSelect) return;
    this.indClick = index;

    let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.ProductTmplId && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

    if(items && items.length == 0) {
      this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
      return;
    }

    items.map((x: DataPouchDBDTO) => {
      x._attributes_length = 0;

      let qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id]?.QtyAvailable) > 0)
        ? Number(this.lstInventory[x.Id]?.QtyAvailable) : 1;
      x.QtyAvailable =qty;
    });

    this.lstVariants = [...items];
    if(this.lstVariants && this.lstVariants.length == 1) {
      let simpleDetail = [...this.lstVariants];
      this.addItemProduct(simpleDetail)
      this.closeFilterIndexDB();
    }
  }

  refreshData() {
    this.visible = false;
    this.searchValue = '';
    this.innerTextValue = '';
    this.dataModel = null as any;

    this.detailsForm.clear();
    this.livecampaignSimpleDetail = [];

    let id = this.liveCampaignId as string;
    this.isLoading = true;
    
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(!res) return;

          this.initFormDetails(res.Details);
          this.livecampaignSimpleDetail = [...this.detailsForm.value];
          this.isLoading = false;
          this.cdRef.detectChanges();
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
          this.cdRef.detectChanges();
      }
    });
  }


  openTag(item: LiveCampaignSimpleDetail) {
    let formDetails = this.detailsForm.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    this.indClickTag = index;
    let data = this.detailsForm.at(index).value;

    if(data && TDSHelperArray.isArray(data.Tags)){
        this.modelTags = data.Tags;
    } else {
        this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(item: any) {
    let formDetails = this.detailsForm.value as any[];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    //TODO: dữ liệu từ formArray
    let details = this.detailsForm.at(index).value;
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.detailsForm.at(index).patchValue(details);
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];

    this.modelTags = [];
    this.indClickTag = -1;
  }

  onChangeIsActive(event: any, item: LiveCampaignSimpleDetail) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeQuantity(event: any, item: LiveCampaignSimpleDetail) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangeLimitedQuantity(event: any, item: LiveCampaignSimpleDetail) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  onChangePrice(event: any, item: LiveCampaignSimpleDetail) {
    this.livecampaignSimpleDetail = [...this._form.controls["Details"].value];
  }

  productLastV2() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            if(!res) return;
            this.indexDbStorage = [...res?.cacheDbStorage];
            this.isLoadingProduct = false;
        },
        error:(err) => {
            this.isLoadingProduct = false;
            this.message.error(err?.error?.message );
        }
    })
  }

  onEditDetails(item: LiveCampaignSimpleDetail) {
    if(item && item.Id) {
        this.isEditDetails[item.Id] = true;
    }
  }

  onSaveDetails(item: LiveCampaignSimpleDetail) {
    if(item && item.Id) {
        this.addProductLiveCampaignDetails([item]);
    }
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

  onOpenSearchvalue(){
    this.visible = true;
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

}
