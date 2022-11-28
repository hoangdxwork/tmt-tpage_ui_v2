import { EditLiveCampaignPostComponent } from '@app/shared/edit-livecampaign-post/edit-livecampaign-post.component';
import { TDSNotificationService } from 'tds-ui/notification';
import { LiveCampaignSimpleDetail } from '@app/dto/live-campaign/livecampaign-simple.dto';
import { ProductService } from './../../services/product.service';
import { CompanyCurrentDTO } from '@app/dto/configs/company-current.dto';
import { SharedService } from './../../services/shared.service';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { NgxVirtualScrollerDto } from './../../dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { TDSSafeAny, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { ReportLiveCampaignDetailDTO } from '../../dto/live-campaign/report-livecampain-overview.dto';
import { Message } from '../../../lib/consts/message.const';
import { takeUntil } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ModalLiveCampaignBillComponent } from '../../pages/live-campaign/components/modal-live-campaign-bill/modal-live-campaign-bill.component';
import { ModalLiveCampaignOrderComponent } from '../../pages/live-campaign/components/modal-live-campaign-order/modal-live-campaign-order.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';

@Component({
    selector: 'table-detail-report',
    templateUrl: './table-detail-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TDSDestroyService]
})

export class TableDetailReportComponent implements OnInit, OnChanges {

  @Input() liveCampaignId!: string;
  @Input() isShowEdit!: boolean;
  @ViewChild(VirtualScrollerComponent) virtualScroller!: VirtualScrollerComponent;

  lstDetails: ReportLiveCampaignDetailDTO[] = [];
  inventories!: TDSSafeAny;
  companyCurrents!: CompanyCurrentDTO;
  count!: number;
  indClickQuantity: string = '';
  currentQuantity: number = 0;
  isLoading: boolean = false;
  innerText: string = '';
  idPopoverVisible: number = -1;
  isShowAll: boolean = false;

  pageSize: number = 10;
  pageIndex: number = 1;
  resfeshScroll: boolean = false;

  isEditDetails: { [id: string] : ReportLiveCampaignDetailDTO } = {};
  indClickTag = -1;
  modelTags: Array<string> = [];

  numberWithCommas =(value:TDSSafeAny) =>{
    if(value != null){
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return value;
  }

  parserComas = (value: TDSSafeAny) =>{
    if(value != null){
      return TDSHelperString.replaceAll(value,'.','');
    }
    return value;
  };

  constructor(private message: TDSMessageService,
      private modalService: TDSModalService,
      private sharedService: SharedService,
      private productService: ProductService,
      private viewContainerRef: ViewContainerRef,
      private destroy$: TDSDestroyService,
      private liveCampaignService: LiveCampaignService,
      private cdr: ChangeDetectorRef,
      private notificationService: TDSNotificationService) { }

  ngOnInit(): void {
    this.validateData();
    this.loadCurrentCompany();
    this.loadData(this.pageSize, this.pageIndex);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['liveCampaignId'] && !changes['liveCampaignId'].firstChange) {
      this.liveCampaignId = changes['liveCampaignId'].currentValue;

      this.validateData();
      this.loadCurrentCompany();
      this.loadData(this.pageSize, this.pageIndex);
    }
  }

  validateData() {
    this.companyCurrents = {} as any;
    this.lstDetails = [];
    this.pageIndex = 1;
    this.pageSize = 10;
    this.count = 0;
    this.indClickQuantity = '';
    this.isLoading = false;
    this.innerText = '';
    this.idPopoverVisible = -1;
    this.isShowAll = false;
  }

  loadData(pageSize: number, pageIndex: number, text?: string) {
    this.isLoading = true;
    let params = THelperDataRequest.convertDataRequestToStringShipTake(pageSize, pageIndex, text);
    this.liveCampaignService.overviewDetailsReport(this.liveCampaignId, params).pipe(takeUntil(this.destroy$)).subscribe({
        next: res => {
            this.lstDetails = [...(this.lstDetails || []), ...res.Details];
            this.lstDetails.map((x: any, i: number)=> { x.Index = i + 1; });

            this.count = res.TotalCount;
            this.isLoading = false;

            this.cdr.detectChanges();
        },
        error: error => {
            this.isLoading = false;
            this.message.error(error?.error?.message || 'Tải sản phẩm lỗi')
        }
    })
  }

  loadCurrentCompany() {
    this.sharedService.setCurrentCompany();
    this.sharedService.getCurrentCompany().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: CompanyCurrentDTO) => {
        this.companyCurrents = res || {};

        if(this.companyCurrents?.DefaultWarehouseId) {
            this.loadInventoryWarehouseId(this.companyCurrents?.DefaultWarehouseId);
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
          this.inventories = res;
      },
      error: (err: any) => {
          this.message.error(err?.error?.message || 'Không thể tải thông tin kho hàng');
      }
    });
  }

  showModalLiveCampaignOrder(id: string, index: number) {
      if(index){
          this.modalService.create({
              title: 'Đơn hàng chờ chốt',
              size: 'xl',
              content: ModalLiveCampaignOrderComponent,
              viewContainerRef: this.viewContainerRef,
              componentParams: {
                  livecampaignDetailId: id
              }
          });
      }
  }

  showModalLiveCampaignBill(id: string, index: number) {
      if(index){
          this.modalService.create({
              title: 'Hóa đơn đã chốt',
              size: 'xl',
              content: ModalLiveCampaignBillComponent,
              viewContainerRef: this.viewContainerRef,
              componentParams: {
                  livecampaignDetailId: id
              }
          });
      }
  }

  openQuantityPopover(data: ReportLiveCampaignDetailDTO, dataId: string) {
      this.indClickQuantity = dataId;
      this.currentQuantity = data.Quantity || 0;
  }

  changeQuantity(value: number) {
      this.currentQuantity = value;
  }

  saveChangeQuantity(data: ReportLiveCampaignDetailDTO) {
      this.isLoading = true;
      this.liveCampaignService.updateProductQuantity(data.Id, this.currentQuantity, this.liveCampaignId).pipe(takeUntil(this.destroy$)).subscribe({
        next:(res) => {
            data.Quantity = this.currentQuantity;
            data.RemainQuantity = data.Quantity - data.UsedQuantity;

            this.message.success(Message.UpdateQuantitySuccess);
            this.indClickQuantity = '';

            this.isLoading = false;
            this.cdr.detectChanges();
        },
        error:(err) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || Message.UpdateQuantityFail);

            this.indClickQuantity = '';
            this.cdr.detectChanges();
        }
    })
  }

  closeQuantityPopover(): void {
      this.indClickQuantity = '';
  }

  onSearch(event: TDSSafeAny) {
      let text = TDSHelperString.stripSpecialChars(event.value?.toLocaleLowerCase()).trim();
      this.lstDetails = [];
      this.pageIndex = 1;
      this.resfeshScroll = false;
      this.loadData(this.pageSize, this.pageIndex, text);
  }

  nextData() {
      this.pageIndex += 1;
      this.loadData(this.pageSize, this.pageIndex, this.innerText);
  }

  vsEnd(event: NgxVirtualScrollerDto) {
      if(this.isLoading) {
        return;
      }
      let exisData = this.lstDetails && this.lstDetails.length > 0 && event && event.scrollStartPosition > 0;
      if(exisData) {
        const vsEnd = Number(this.lstDetails.length - 1) == Number(event.endIndex) && this.pageIndex >= 1 &&  Number(this.lstDetails.length) < this.count;
        if(vsEnd) {
            this.nextData();
        }
      }
  }

  onEditDetails(item: ReportLiveCampaignDetailDTO) {
    if(this.checkIsEdit() == 0) return;

    if(item && item.Id) {
        this.isEditDetails[item.Id] = {...item};
    }
  }

  checkIsEdit() {
    let exist = Object.keys(this.isEditDetails);
    if(exist && exist.length > 0) {

      let key = exist[0];
      let formDetails = this.lstDetails as any[];
      let product = formDetails.filter(f => f.Id == key)[0];

      this.message.info(`Sản phẩm ${product.ProductName} chưa được lưu`, { duration: 3000 });
      return 0;
    }

    return 1;
  }

  onSaveDetails(item: LiveCampaignSimpleDetail) {
    if(item && item.Id) {
        this.addProductLiveCampaignDetails([item]);
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

              this.notificationService.info(`Cập nhật sản phẩm`,
              `<div class="flex flex-col ">
                  <span class="mb-1">Sản phẩm: <span class="font-semibold"> ${x.ProductName}</span></span>
                  <span> Số lượng: <span class="font-semibold text-secondary-1">${x.Quantity}</span></span>
              </div>`);

              delete this.isEditDetails[x.Id];
          })

          this.cdr.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
        }
    })
  }

  removeDetail(item: LiveCampaignSimpleDetail) {
    if(this.checkIsEdit() == 0) return;

    let id = this.liveCampaignId as string;
    this.isLoading = true;
    this.liveCampaignService.deleteDetails(id, [item.Id]).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.refreshData();

            this.isLoading = false;
            this.message.success('Thao tác thành công');

            this.cdr.detectChanges();
        },
        error: (err: any) => {
            this.isLoading = false;
            this.message.error(err?.error?.message || 'Đã xảy ra lỗi')
        }
    })
  }
  
  openTag(item: LiveCampaignSimpleDetail) {
    let details = this.lstDetails as any[];
    let index = details.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    this.indClickTag = index;
    let data = details[index];

    if(data && TDSHelperArray.isArray(data.Tags)){
        this.modelTags = data.Tags;
    } else {
        this.modelTags = data.Tags ? data.Tags.split(",") : [];
    }
  }

  onChangeModelTag(event: string[], item: TDSSafeAny) {
    let lstDetails = this.lstDetails as any[];
    let strs = [...this.checkInputMatch(event)];
    let idx = lstDetails.findIndex((x: any) => x.Index == item.Index) as number;

    if(Number(idx) >= 0) {
      let details = lstDetails[idx];
      details.Tags = strs?.join(',');

      //TODO: cập nhật vào formArray
      this.lstDetails[idx] = {...details};
      this.modelTags = [...strs];
    }
    this.cdr.detectChanges();
  }

  onCloseTag() {
    this.modelTags = [];
    this.indClickTag = -1;
  }

  onSaveTag(item: any) {
    let lstDetails = this.lstDetails as any[];
    let index = lstDetails.findIndex(x => x.ProductId === item.ProductId && x.UOMId == item.UOMId);

    //TODO: dữ liệu từ formArray
    let details = lstDetails[index];
    details.Tags = this.modelTags;

    //TODO: cập nhật vào formArray
    this.lstDetails[index] = {...details};

    this.modelTags = [];
    this.indClickTag = -1;
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
    if(matchRex || !TDSHelperString.hasValueString(pop.toLocaleLowerCase().trim())) {
        this.message.warning('Ký tự không hợp lệ');
        datas = datas.filter(x => x!= pop);
    }

    return datas;
  }

  refreshData() {
    this.innerText = '';
    this.lstDetails = [];
    this.pageIndex = 1;
    this.isEditDetails = {};

    this.loadData(this.pageSize, this.pageIndex)
  }

  onCloseDetail(item: ReportLiveCampaignDetailDTO) {
    let index = this.lstDetails.findIndex(x=> x.ProductId == item.ProductId && x.UOMId == item.UOMId)

    if(Number(index) >= 0) {
      this.lstDetails[index] = this.isEditDetails[item.Id];
      this.lstDetails = [...this.lstDetails];

      delete this.isEditDetails[item.Id];
    }
  }
}
