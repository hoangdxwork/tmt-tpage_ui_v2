import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { TabNavsDTO } from "@app/services/mock-odata/odata-saleonlineorder.service";
import { addDays } from "date-fns";
import { Observable, Subject, takeUntil } from "rxjs";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { FilterObjFastSaleModel } from "src/app/main-app/services/mock-odata/odata-fastsaleorder.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";
import { ODataLiveCampaignService } from '@app/services/mock-odata/odata-live-campaign.service';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { LiveCampaignService } from '@app/services/live-campaign.service';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class FilterOptionsComponent implements OnInit {

  @Input() lstTags: Array<TDSSafeAny> = [];
  @Input() summaryStatus: Array<TabNavsDTO> = [];
  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() filterObj!: FilterObjFastSaleModel;
  @Input() lstCarriers: Array<DeliveryCarrierDTOV2> = [];

  datePicker: any = [addDays(new Date(), -30), new Date()];

  trackingRefs = [
    { text: 'Chưa có mã vận đơn', value: 'noCode', IsSelected: false },
    { text: 'Đã có mã vận đơn', value: 'isCode', IsSelected: false },
  ];

  lstStatus: Array<TDSSafeAny> = [];

  status = [
    { Name: 'Nháp', Type: 'draft', Total: 0, IsSelected: false },
    { Name: 'Đã xác nhận', Type: 'open', Total: 0, IsSelected: false },
    { Name: 'Đã thanh toán', Type: 'paid', Total: 0, IsSelected: false },
    { Name: 'Hủy bỏ', Type: 'cancel', Total: 0, IsSelected: false }
  ];

  lstShipPaymentStatus = [
    { "code": "0", "name": "Chờ xác nhận" },
    { "code": "10", "name": "Đã xác nhận" },
    { "code": "20", "name": "Từ chối đơn hàng" },
    { "code": "30", "name": "Đã lấy hàng" },
    { "code": "35", "name": "Đang lấy hàng" },
    { "code": "40", "name": "Không lấy được hàng" },
    { "code": "500", "name": "Lưu kho giao hàng" },
    { "code": "50", "name": "Đang vận chuyển" },
    { "code": "55", "name": "Đang giao hàng" },
    { "code": "60", "name": "Giao thành công" },
    { "code": "70", "name": "Đổi hàng/Trả hàng" },
    { "code": "550", "name": "Lưu kho hoàn hàng" },
    { "code": "80", "name": "Không giao được" },
    { "code": "90", "name": "Đang hoàn trả" },
    { "code": "100", "name": "Đã hoàn trả" },
    { "code": "101", "name": "Hoàn trả thất bại" },
    { "code": "200", "name": "Đã trả tiền" },
    { "code": "250", "name": "Đã thu tiền" },
    { "code": "400", "name": "Không xác định" }
  ]
  shipPaymentStatus!: string | null;

  modelCarrier: TDSSafeAny;
  selectTags: Array<TDSSafeAny> = [];
  selectRefs!: string | null;

  isActive: boolean = false;
  isVisible: boolean = false;
  lstCampaign!: LiveCampaignModel[];
  selectCampaign: TDSSafeAny;

  constructor(private liveCampaignService: LiveCampaignService,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit() {
    // this.loadSummaryStatus();
    this.checkActiveStatus();
    this.loadLiveCampaign();
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if (event) {
      event.forEach(x => {
        this.datePicker.push(x);
      })
    }
  }

  loadLiveCampaign(text?: string) {
    this.liveCampaignService.getAvailables(text).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.lstCampaign = [...res.value];
      },
    })
  }

  onChangeCarrier(event: any): void {
    if (!event) {
      this.modelCarrier = null;
    } else {
      var exits = this.lstCarriers.filter(x => x.Id === event.Id)[0];
      if (exits) {
        this.modelCarrier = exits;
      }
    }
  }

  onChangeTags(event: Array<TDSSafeAny>): void {
    this.selectTags = [];
    if (event) {
      event.forEach(x => {
        this.selectTags.push(x);
      })
    }
  }

  selectTracking(event: any): void {
    if (event && event.value == this.selectRefs) {
      this.selectRefs = null;
    } else {
      this.selectRefs = event?.value;
    }

    this.filterObj.hasTracking = this.selectRefs;
  }

  selectState(event: any): void {
    if (this.filterObj.status.includes(event.Type)) {
      this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.Type));
    } else {
      this.filterObj.status.push(event.Type);
    }
    this.checkActiveStatus();
  }

  onChangeShipPaymentStatus(event: TDSSafeAny){
    if(event) {
      this.shipPaymentStatus = event.name;
    }
  }

  loadSummaryStatus() {
    if (this.summaryStatus) {
      this.filterObj.status.forEach(x => {

      })
    }
  }

  onRefreshStatus() {
    this.lstStatus.map(x=> x.IsSelected = false);
  }

  onRefreshTrackingRefs(){
    this.trackingRefs.map(x=> x.IsSelected = false);
  }

  onChangeLiveCampaign(event: any) {
    this.filterObj.liveCampaignId = event;
  }

  onSearchLiveCampaign(event: any) {
    let text = '';
    if (TDSHelperString.hasValueString(event)) {
        text = event;
        text = TDSHelperString.stripSpecialChars(text.toLocaleLowerCase()).trim();
    }
    this.loadLiveCampaign(text);
  }

  onApply() {
    this.filterObj.dateRange = {
      startDate: this.datePicker[0],
      endDate: this.datePicker[1]
    }

    this.filterObj.shipPaymentStatus = this.shipPaymentStatus || null;

    this.isActive = true;
    this.loadSummaryStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  checkActiveStatus() {
    this.status.map(stt => {
      stt.IsSelected = this.filterObj.status.some(f => f == stt.Type);
    })
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.filterObj.tags) || TDSHelperArray.hasListValue(this.filterObj.status)
      || TDSHelperString.hasValueString(this.filterObj.hasTracking) || TDSHelperString.hasValueString(this.filterObj.deliveryType)

    if (exist) {
      return true
    } else {
      return false
    }
  }

  onCancel() {
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];
    this.shipPaymentStatus = null;
    this.selectCampaign = null;
    this.onRefreshStatus();
    this.onRefreshTrackingRefs();

    this.filterObj = {
      tags: [],
      status: [],
      carrierId: '',
      deliveryType: '',
      hasTracking: null,
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      },
      shipPaymentStatus: null,
      liveCampaignId: null
    };

    this.isActive = false;
    this.checkActiveStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  closeMenu() {
    this.isVisible = false;
  }
}
