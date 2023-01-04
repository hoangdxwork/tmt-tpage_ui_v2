import { InventoryChangeType } from './../../dto/product-pouchDB/product-pouchDB.dto';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ModalAddQuickReplyComponent } from './../../pages/conversations/components/modal-add-quick-reply/modal-add-quick-reply.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrepareAddCampaignHandler } from '../../handler-v2/live-campaign-handler/prepare-add-campaign.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { Component, OnInit, Input, ViewContainerRef, ViewChild, ChangeDetectorRef, Inject, AfterViewInit, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ApplicationUserService } from '../../services/application-user.service';
import { ApplicationUserDTO } from '../../dto/account/application-user.dto';
import { Observable, takeUntil } from 'rxjs';
import { QuickReplyService } from '../../services/quick-reply.service';
import { QuickReplyDTO } from '../../dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { differenceInCalendarDays } from 'date-fns';
import { GetInventoryDTO } from '@app/dto/product/product.dto';
import { ProductService } from '@app/services/product.service';
import { ModalProductTemplateComponent } from '../tpage-add-product/modal-product-template.component';
import { ProductTemplateV2DTO } from '@app/dto/product-template/product-tempalte.dto';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from '@app/services/shared.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { StringHelperV2 } from '../helper/string.helper';
import { Message } from '@core/consts/message.const';
import { LiveCampaignSimpleDetail, LiveCampaignSimpleDto } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { DataPouchDBDTO, KeyCacheIndexDBDTO, SyncCreateProductTemplateDto } from '@app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductIndexDBService } from '@app/services/product-indexdb.service';
import { DOCUMENT } from '@angular/common';
import { ProductTemplateFacade } from '@app/services/facades/product-template.facade';

@Component({
  selector: 'edit-livecampaign-post',
  templateUrl: './edit-livecampaign-post.component.html',
  providers: [TDSDestroyService]
})

export class EditLiveCampaignPostComponent implements OnInit {

  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;
  _form!: FormGroup;
  @Input() id?: string;
  @Input() itemProduct!: LiveCampaignSimpleDetail;

  selectedIndex: number = 0;
  searchValue = '';
  visible = false;

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  dataModel!: LiveCampaignSimpleDto;
  lstUser: ApplicationUserDTO[] = [];
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;
  lstInventory!: GetInventoryDTO;

  innerText!: string;
  innerTextDebounce!: string;

  isLoading: boolean = false;
  isSave: boolean = false;
  isLoadingProduct: boolean = false;
  isDepositChange: boolean = false;
  companyCurrents!: CompanyCurrentDTO;
  indClickTag: number = -1;
  modelTags: Array<string> = [];

  isEditDetails: { [id: string] : { isEdit?: boolean, previousData?: LiveCampaignSimpleDetail} } = {};
  livecampaignSimpleDetail: any = [];
  innerTextValue: string = '';

  indClick: number = -1;
  lstVariants:  DataPouchDBDTO[] = [];
  isLoadingSelect: boolean = false;
  countUOMLine: number = 0;
  isLoadingNextdata: boolean = false;
  indexDbStorage!: DataPouchDBDTO[];
  changedData: boolean = false

  lstOrderTags!: string[];

  numberWithCommas =(value:TDSSafeAny) =>{
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

  response: any;
  inventories: any;

  constructor(private crmTeamService: CRMTeamService,
    private modal: TDSModalService,
    private modalRef: TDSModalRef,
    private fb: FormBuilder,
    private productIndexDBService: ProductIndexDBService,
    private cdRef: ChangeDetectorRef,
    private liveCampaignService: LiveCampaignService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private notificationService: TDSNotificationService,
    private productService: ProductService,
    private sharedService: SharedService,
    private message: TDSMessageService,
    private productTemplateFacade: ProductTemplateFacade,
    private prepareHandler: PrepareAddCampaignHandler,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    @Inject(DOCUMENT) private document: Document) {
      this.createForm();
  }

  get detailsForm() {
    return (this._form?.get("Details")) as FormArray;
  }

  ngOnInit(): void {
    if(this.id) {
      this.loadData();
    }

    this.loadUser();
    this.loadQuickReply();
    this.loadCurrentCompany();
    this.productLastV2();

    this.eventEmitter();
  }

  eventEmitter() {
    this.productTemplateFacade.onStockChangeProductQty$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs: any) => {
        if(obs !== InventoryChangeType._EDIT_LIVECAMPAIGN_POST) return;
        let warehouseId = this.companyCurrents?.DefaultWarehouseId;

        if(warehouseId > 0) {
          this.productService.lstInventory = null;
          this.productService.apiInventoryWarehouseId(warehouseId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                if(res) {
                    this.inventories = {};
                    this.inventories = res;
                }

                if(this.response) {
                    this.mappingProductToLive(this.response);
                }
            },
            error: (err: any) => {
                this.message.error(err?.error?.message);
                if(this.response) {
                    this.mappingProductToLive(this.response);
                }
            }
          });
        }
      }
    })
  }

  createForm() {
    this._form = this.fb.group({
      Id: [this.id],
      Details: this.fb.array([]),
      Config: [null],
      ConfigObject: [null],// xóa khi lưu
      Name: [null, Validators.required],
      Note: [null],
      ResumeTime: [0],
      DateCreated: [null],
      StartDate: [null],
      EndDate: [null],
      Users: [null],
      Preliminary_Template: [null],
      Preliminary_TemplateId: [null],
      ConfirmedOrder_Template: [null],
      ConfirmedOrder_TemplateId: [null],
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

  productLastV2() {
    this.isLoadingProduct = true;
    this.indexDbStorage = [];
    this.productIndexDBService.setCacheDBRequest();
    this.productIndexDBService.getCacheDBRequest().pipe(takeUntil(this.destroy$)).subscribe({
        next:(res: KeyCacheIndexDBDTO) => {
            this.indexDbStorage = [...res?.cacheDbStorage || []];
            this.isLoadingProduct = false;
            this.cdRef.detectChanges();
        },
        error:(err) => {
            this.isLoadingProduct = false;
            this.message.error(err?.error?.message || Message.Product.CanNotLoadData);
            this.cdRef.detectChanges();
        }
    })
  }

  onChangeConfirmedOrder_Template(event: any) {
    if(event) {
        this._form.controls['ConfirmedOrder_TemplateId'].setValue(event.Id);
    } else {
        this._form.controls['ConfirmedOrder_TemplateId'].setValue(null);
    }
  }

  onChangePreliminary_Template(event: any) {
    if(event) {
        this._form.controls['Preliminary_TemplateId'].setValue(event.Id);
    } else {
        this._form.controls['Preliminary_TemplateId'].setValue(null);
    }
  }

  onChangeConfig(event: any) {
    if(event) {
        this._form.controls['Config'].setValue(event.value);
    } else {
        this._form.controls['Config'].setValue(null);
    }
  }

  loadUser() {
    this.applicationUserService.setUserActive();
    this.applicationUserService.getUserActive().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && TDSHelperArray.isArray(res)) {
          this.lstUser = [...res];
        }
      },
      error: (err: any) => {
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  loadQuickReply() {
    this.quickReplyService.setDataActive();
    this.lstQuickReplies$ = this.quickReplyService.getDataActive();
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
    this.sharedService.apiCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
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

  loadData() {
    let id = this.id as string;
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          if(!res) return;
          delete res['@odata.context'];

          if(res.StartDate) {
            res.StartDate = new Date(res.StartDate)
          }
          if(res.EndDate) {
              res.EndDate = new Date(res.EndDate)
          }

          this.dataModel = res;
          if(!res.ConfirmedOrder_TemplateId && res.ConfirmedOrder_Template?.Id) {
              this.dataModel.ConfirmedOrder_TemplateId = res.ConfirmedOrder_Template?.Id;
          }

          if(!res.Preliminary_TemplateId && res.Preliminary_Template?.Id) {
              this.dataModel.Preliminary_TemplateId = res.Preliminary_Template?.Id;
          }

          this.updateForm(res);

          if(this.itemProduct) {
            this.selectedIndex = 1;
            this.onEditDetails(this.itemProduct);
            this.srcollBehavior(this.itemProduct);
          }
          this.isLoading = false;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  updateForm(data: any) {
    this._form.patchValue(data);
    this._form.controls['Id'].setValue(this.id);

    let exist = this.lstConfig.filter((x: any) => x.value === data.Config)[0];
    if(exist) {
        this._form.controls['ConfigObject'].patchValue(exist);
    }

    this.initFormDetails(data.Details);
    this.livecampaignSimpleDetail = [...this.detailsForm.value];
    this.getLstOrderTags(data.Details);
  }

  //TODO: disable các giá trị ngày không khả dụng
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, new Date()) < 0;

  onChangeDeposit(event:any) {
    let maxAmountDepositRequired = this.dataModel ? this.dataModel.MaxAmountDepositRequired : this._form.controls["MaxAmountDepositRequired"].value;

    if(event != maxAmountDepositRequired){
        this.isDepositChange = true;
    } else {
        this.isDepositChange = false;
    }

    if(this.isDepositChange) {
      setTimeout(()=>{
          this.isDepositChange = false;
      }, 10 * 1000);
    }
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
        IsActive: [false],
        TagWithAttributes: [null],
        AttributeValues: [null]
    });

    if(x) {
        x.LiveCampaign_Id = this.id;
        item.patchValue(x);
    }

    return item;
  }

  removeDetail(item: LiveCampaignSimpleDetail) {
    let id = this.id as string;
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
            this.getLstOrderTags(newFormDetails);

            this.searchValue = this.innerTextValue;
            delete this.isEditDetails[item.Id];

            this.changedData = true;
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
            let id = this.id as string;

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

  createProduct() {
    const modal = this.modal.create({
        title: 'Thêm sản phẩm',
        content: ModalProductTemplateComponent,
        size: 'xl',
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          type: InventoryChangeType._EDIT_LIVECAMPAIGN_POST,
          lstOrderTags: this.lstOrderTags
        }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe((response: any) => {
      if(!response) return;
      this.response = {...response} as SyncCreateProductTemplateDto;
    })
  }

  mappingProductToLive(response: any) {
    this.indexDbStorage = [...response.cacheDbStorage];

    if(response.type === 'select' && response.productTmpl) {
        const product = response.productTmpl as ProductTemplateV2DTO;
        let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == product.Id && x.UOMId == product.UOMId && x.Active) as DataPouchDBDTO[];

        if(items && items.length == 0) {
            this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
            return;
        }

        let ids = items.map((x: DataPouchDBDTO) => x.Id);
        this.liveCampaignService.getOrderTagbyIds(ids).pipe(takeUntil(this.destroy$)).subscribe({
          next: (tags: any) => {

              let lstDetails = [] as any[];
              items.map((x: DataPouchDBDTO) => {
                  // TODO: kiểm tra số lượng
                  let existQty = this.inventories && this.inventories[x.Id] && this.inventories[x.Id].QtyAvailable > 0;
                  x.QtyAvailable = existQty ? this.inventories[x.Id].QtyAvailable : 1;

                  // TODO: kiểm tra mã sp từ api
                  const vTag = tags && tags[x.Id] ? tags[x.Id] : ''; // mã chốt đơn của biến thể

                  // TODO: lọc sp trùng mã code để tạo tags
                  const exist = this.indexDbStorage.filter((f: DataPouchDBDTO) => TDSHelperString.hasValueString(x.DefaultCode) &&  x.DefaultCode == f.DefaultCode) as any[];
                  let uomName = '';
                  if(exist && exist.length > 1) {
                      uomName = TDSHelperString.stripSpecialChars(x.UOMName.trim().toLocaleLowerCase());
                  }

                  // TODO: nếu có 2 biến thể trở lên thì ko lấy orderTag
                  let orderTag = product.OrderTag;
                  if(items && items.length > 1) {
                      orderTag = '';
                  }

                  let gTags = this.generateTagDetail(x.DefaultCode, vTag, orderTag, uomName);
                  x.Tags = gTags.join(',');

                  let item = {
                      Quantity: x.QtyAvailable || 1,
                      RemainQuantity: 0,
                      ScanQuantity: 0,
                      QuantityCanceled: 0,
                      UsedQuantity: 0,
                      Price: (x.Price || 0),
                      Note: null,
                      ProductId: x.Id,
                      LiveCampaign_Id: this.id,
                      ProductName: x.Name,
                      ProductNameGet: x.NameGet,
                      UOMId: x.UOMId,
                      UOMName: x.UOMName,
                      Tags: x.Tags,
                      LimitedQuantity: 0,
                      ProductCode: x.DefaultCode,
                      ImageUrl: x.ImageUrl,
                      IsActive: true,
                  } as LiveCampaignSimpleDetail;

                  lstDetails.push(item);
              })

              this.addProductLiveCampaignDetails(lstDetails);
          },
          error: (error: any) => {
              this.message.error(error?.error?.message);
          }
        })
    }
  }

  onFilterIndexDB(event: any) {
    if(!this.innerText) {
      this.innerTextDebounce = '';
      return;
    };

    this.isLoadingProduct = true;
    setTimeout(() => {
      this.isLoadingProduct = false;
      this.cdRef.detectChanges();
    }, 150);


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
          let item = {
              Quantity: x.QtyAvailable || 1,
              RemainQuantity: 0,
              ScanQuantity: 0,
              QuantityCanceled: 0,
              UsedQuantity: 0,
              Price: x.Price || 0,
              Note: null,
              ProductId: x.Id,
              LiveCampaign_Id: this.id,
              ProductName: x.Name,
              ProductNameGet: x.NameGet,
              UOMId: x.UOMId,
              UOMName: x.UOMName,
              Tags: x.Tags,
              LimitedQuantity: 0,
              ProductCode: x.DefaultCode,
              ImageUrl: x.ImageUrl,
              IsActive: true,
          } as LiveCampaignSimpleDetail;

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

  selectProduct(model: DataPouchDBDTO, index: number){
    if(this.isLoadingSelect) return;
    this.indClick = index;
    let items = this.indexDbStorage?.filter((x: DataPouchDBDTO) => x.ProductTmplId == model.ProductTmplId && x.UOMId == model.UOMId && x.Active) as DataPouchDBDTO[];

    if(items && items.length == 0) {
      this.message.error('Sản phẩm đã bị xóa hoặc hết hiệu lực');
      return;
    }

    this.lstVariants = [...items];
    this.apiOrderTagbyIds(this.lstVariants);
  }

  apiOrderTagbyIds(model: DataPouchDBDTO[]) {
    let listData = [...(model || [])];
    let ids = listData.map(x => x.Id);

    this.liveCampaignService.getOrderTagbyIds(ids).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.validateOrderTagbyIds(listData, res);
      },
      error: (error: any) => {
          this.message.error(error?.error?.message);
      }
    })
  }

  validateOrderTagbyIds(listData: DataPouchDBDTO[], tags: any) {
    listData.map((x: DataPouchDBDTO) => {
        // TODO: kiểm tra số lượng
        const qty = (this.lstInventory && this.lstInventory[x.Id] && Number(this.lstInventory[x.Id].QtyAvailable) > 0)
           ? Number(this.lstInventory[x.Id].QtyAvailable) : 1;
        x.QtyAvailable = qty;

        // TODO: kiểm tra mã sp từ api
        const vTag = tags && tags[x.Id] ? tags[x.Id] : ''; // mã chốt đơn của biến thể

        // TODO: lọc sp trùng mã code để tạo tags
        const exist = this.indexDbStorage.filter((f: DataPouchDBDTO) => TDSHelperString.hasValueString(x.DefaultCode) && x.DefaultCode == f.DefaultCode) as any[];
        let uomName = '';
        if(exist && exist.length > 1) {
            uomName = TDSHelperString.stripSpecialChars(x.UOMName.trim().toLocaleLowerCase());
        }

        const orderTag = '';
        let gTags = this.generateTagDetail(x.DefaultCode, vTag, orderTag, uomName);
        x.Tags = gTags.join(',');
    });

    this.lstVariants = [...listData];
    if(listData && this.lstVariants.length == 1) {
        let simpleDetail = [...this.lstVariants];
        this.addItemProduct(simpleDetail)
        this.closeFilterIndexDB();
    }
  }

  generateTagDetail(defaultCode: string, vTag: string, orderTag: string, uomName: string) {
    let result: string[] = [];

    if(TDSHelperString.hasValueString(defaultCode)) {
        defaultCode = defaultCode.toLocaleLowerCase();

        if(TDSHelperString.hasValueString(uomName)) {
            let x = `${defaultCode} ${uomName}`
            result.push(x);
        } else {
            result.push(defaultCode);
        }
    }

    if(vTag) {
        let tagArr1 = vTag.split(',');
        tagArr1?.map((x: any) => {
          if(!result.find(y => y == x)) {
            if(TDSHelperString.hasValueString(uomName)) {
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
          }
        })
    }

    if(orderTag) {
        let tagArr2 = orderTag.split(',');
        tagArr2?.map((x: any) => {
          if(!result.find(y => y == x))
            if(TDSHelperString.hasValueString(uomName)) {
                let a = `${x} ${uomName}`;
                result.push(a);
            } else {
                result.push(x);
            }
        })
    }

    return [...result];
  }

  showModalAddQuickReply() {
    let modal = this.modal.create({
        title: 'Thêm mới trả lời nhanh',
        content: ModalAddQuickReplyComponent,
        viewContainerRef: this.viewContainerRef,
        size: 'md',
        componentParams: {
          isSaveSelect: true
        }

    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
        if(res) {
          this.loadQuickReply();
          if(res.type && res.type == 'select') {
            this._form.controls['ConfirmedOrder_Template'].setValue(res.value);
          }
        }
      }
    })
  }

  addProductLiveCampaignDetails(items: LiveCampaignSimpleDetail[]) {
    let id = this.id as string;
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

              this.changedData = true;
              delete this.isEditDetails[x.Id];
          })

          this.livecampaignSimpleDetail = [...this.detailsForm.value];
          this.getLstOrderTags(this.detailsForm.value);
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
    })
  }

  onSave() {
    if(this.isCheckValue() === 0) return;
    if(this.isLoading) return;

    this.isLoading = true;
    this.isSave = true;
    let model = this.prepareHandler.prepareModelSimple(this._form) as LiveCampaignSimpleDto;

    let resumeTime = model.ResumeTime;
    if(resumeTime > 0 && resumeTime < 10) {
        this.message.error('Thời gian tổng hợp tối thiểu 10 phút');
        return;
    }

    let team = this.crmTeamService.getCurrentTeam() as CRMTeamDTO;

    if(team && team?.Id && !TDSHelperString.hasValueString(model.Facebook_UserId)) {
        model.Facebook_UserId = team.ChannelId;
        model.Facebook_UserName = team.Name;
    }

    let id = this.id as string;
    this.onUpdateSimple(id, model);
  }

  onUpdateSimple(id: string, model: LiveCampaignSimpleDto){
    this.liveCampaignService.updateSimple(id, model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.isLoading = false;
          this.isSave = false;
          this.message.success('Cập nhật chiến dịch live thành công');
          this.onCancel(true);
      },
      error: (error: any) => {
          this.isLoading = false;
          this.isSave = false;
          this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    });
  }

  isCheckValue() {
    let formValue = this._form.value;

    if(!TDSHelperString.hasValueString((formValue.Name || '').trim())){
        this.message.error('Vui lòng nhập tên chiến dịch');
        return 0;
    }

    if(formValue.Name.length > 255) {
        this.message.error('Tên chiến dịch live tối đa 255 ký tự');
        return 0;
    }

    if(TDSHelperString.hasValueString((formValue.Note || '').trim()) && formValue.Note.length > 500) {
        this.message.error('Ghi chú tối đa 500 ký tự');
        return 0;
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

  onCancel(data?: any) {
    if(Object.keys(this.isEditDetails).length > 0) {
      this.modal.info({
          title: 'Thao tác chưa được lưu',
          content: 'Xác nhận đóng và không lưu dữ liệu',
          onOk: () => {
              this.modalRef.destroy(data);
          },
          onCancel:() => {},
          okText: "Đóng",
          cancelText: "Hủy bỏ"
      });
    } else {
        this.modalRef.destroy(data);
    }
  }

  onEditDetails(item: LiveCampaignSimpleDetail) {
    if(item && item.Id) {
      this.isEditDetails[item.Id] = {
        isEdit : true,
        previousData : { ...item }
      };
    }
  }

  onCancelEditDetails(item: LiveCampaignSimpleDetail, index: number) {
    if(item && item.Id) {
      this.detailsForm.at(index).patchValue(this.isEditDetails[item.Id].previousData);
      delete this.isEditDetails[item.Id];
    }
  }

  onSaveDetails(item: LiveCampaignSimpleDetail) {
    if(item && item.Id) {
      this.addProductLiveCampaignDetails([item]);
    }
  }

  refreshData() {
    this.visible = false;
    this.searchValue = '';
    this.innerTextValue = '';
    this.dataModel = null as any;

    this.detailsForm.clear();
    this.livecampaignSimpleDetail = [];

    let id = this.id as string;
    this.isLoading = true;
    this.liveCampaignService.getDetailById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          if(!res) return;

          this.initFormDetails(res.Details);
          this.livecampaignSimpleDetail = [...this.detailsForm.value];
          this.isLoading = false;
      },
      error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
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

  onOpenSearchvalue(){
    this.visible = true;
  }

  onPopoverVisibleChange(ev: boolean) {
    if(!ev) {
      this.indClick = -1;
    }
  }

  trackByIndex(_: number, data: DataPouchDBDTO): number {
    return data.Id;
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

  onChangeResumeTime(event: any) {
    if(this._form.controls?.ResumeTime && this._form.controls?.ResumeTime.value < 10 && this._form.controls?.ResumeTime.value > 0) {
      this.message.error('Thời gian tổng hợp tối thiểu 10 phút');
    }
  }

  onChangeModelTag(event: string[], item: TDSSafeAny) {
    let formDetails = this.detailsForm.value as any[];
    let strs = [...this.checkInputMatch(event)];
    let index = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    if(Number(index) >= 0) {
      let details = this.detailsForm.at(index).value;
      details.Tags = strs?.join(',');

      //TODO: cập nhật vào formArray
      this.detailsForm.at(index).patchValue(details);
      this.modelTags = [...strs];
    }

    this.cdRef.detectChanges();
  }

  checkInputMatch(strs: string[]) {
    let datas = strs as any[];
    let pop!: string;

    if(strs && strs.length == 0) {
      pop = datas[0];
    } else {
      pop = datas[strs.length - 1];
    }

    let match = pop?.match(/[~!@$%^&*(\\\/\-['`;=+\]),.?":{}|<>_]/g);//có thể thêm #
    let matchRex = match && match.length > 0;

    // TODO: check kí tự đặc biệt
    if(matchRex || (TDSHelperString.isString(pop) && !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim()))) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  srcollBehavior(item: LiveCampaignSimpleDetail) {
    setTimeout(() => {
      let element = this.document.getElementsByClassName('tds-table-body')[0] as any;

      let formDetails = this.detailsForm.value as any[];
      let idxItem = formDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);
      let idxScroll = this.document.getElementById(`dataSourceScroll${idxItem}`) as any;

      if(element && idxScroll) {
        let top = idxScroll.offsetTop - 170;

        element?.scroll({
            top: top,
            behavior: 'smooth',
        })
      }
    }, 500)
  }

  getLstOrderTags(data: LiveCampaignSimpleDetail[]) {
    if(data) {
        data = data.filter(x => x.Tags);
        let getTags = data.map(x => x.Tags.toLocaleLowerCase().trim());
        let tags = getTags.join(',');

        if(TDSHelperString.hasValueString(tags)) {
            this.lstOrderTags = tags.split(',');
        }
      }
    }
}
