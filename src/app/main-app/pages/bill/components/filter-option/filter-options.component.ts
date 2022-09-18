import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { TabNavsDTO } from "@app/services/mock-odata/odata-saleonlineorder.service";
import { addDays } from "date-fns";
import { Subject, takeUntil } from "rxjs";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { FilterObjFastSaleModel } from "src/app/main-app/services/mock-odata/odata-fastsaleorder.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterOptionsComponent implements OnInit, OnDestroy {

  @Input() lstTags: Array<TDSSafeAny> = [];
  @Input() summaryStatus: Array<TabNavsDTO> = [];
  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() filterObj!: FilterObjFastSaleModel;
  @Input() lstCarriers: Array<DeliveryCarrierDTOV2> = [];

  datePicker: any = [addDays(new Date(), -30), new Date()];
  trackingRefs = [
    { text: 'Chưa có mã vận đơn', value: 'noCode' },
    { text: 'Đã có mã vận đơn', value: 'isCode' },
  ];

  status = [
    { Name: 'Nháp', Type: 'draft', Total: 0, IsSelected: false },
    { Name: 'Đã xác nhận', Type: 'open', Total: 0, IsSelected: false },
    { Name: 'Đã thanh toán', Type: 'paid', Total: 0, IsSelected: false },
    { Name: 'Hủy bỏ', Type: 'cancel', Total: 0, IsSelected: false }
  ];

  private destroy$ = new Subject<void>();

  modelCarrier: TDSSafeAny;
  selectTags:  Array<TDSSafeAny> = [];
  selectRefs!: string | null;

  isActive: boolean = false;
  isVisible: boolean = false;

  constructor(private message: TDSMessageService,
    private fastSaleOrderService: FastSaleOrderService,
    private cdr : ChangeDetectorRef) {
  }

  ngOnInit() {
    this.checkActiveStatus();
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
    }
  }

  onChangeCarrier(event: any): void {
    if(!event) {
      this.modelCarrier = null;
    } else {
      var exits = this.lstCarriers.filter(x => x.Id === event.Id)[0];
      if(exits) {
          this.modelCarrier = exits;
      }
    }
  }

  onChangeTags(event: Array<TDSSafeAny>): void {
    this.selectTags = [];
    if(event){
      event.forEach(x => {
          this.selectTags.push(x);
      })
    }
  }

  selectTracking(event: any): void {
    if(event && event.value == this.selectRefs){
        this.selectRefs = null;
    } else {
        this.selectRefs = event?.value;
    }

    this.filterObj.hasTracking = this.selectRefs;
  }

  selectState(event: any): void {
    if(this.filterObj.status.includes(event.Type)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.Type));
    } else {
        this.filterObj.status.push(event.Type);
    }
    this.checkActiveStatus();
  }

  loadSummaryStatus(){
    if(this.summaryStatus) {
      // this.summaryStatus.map((x) => {
      //   let index = this.status.findIndex(a => a.Type == x.Name)
      //   if(index != -1) {
      //     this.status[index].Total = x.Total
      //   }
      // })
  

      this.cdr.detectChanges();
    }
  }

  onApply() {
    this.filterObj.dateRange = {
      startDate: this.datePicker[0],
      endDate: this.datePicker[1]
    }

    this.isActive = true;
    this.loadSummaryStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  checkActiveStatus(){
    this.status.map(stt=>{
      stt.IsSelected = this.filterObj.status.some(f=>f == stt.Type);
    })
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.filterObj.tags) || TDSHelperArray.hasListValue(this.filterObj.status)
        || TDSHelperString.hasValueString(this.filterObj.hasTracking) || TDSHelperString.hasValueString(this.filterObj.deliveryType)

    if(exist) {
      return true
    } else {
      return false
    }
  }

  onCancel() {
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];

    this.filterObj = {
      tags: [],
      status: [],
      deliveryType: '',
      hasTracking: null,
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.isActive = false;
    this.checkActiveStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  closeMenu() {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
