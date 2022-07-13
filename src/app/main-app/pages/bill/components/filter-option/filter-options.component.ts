import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { addDays } from "date-fns";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { DeliveryCarrierService } from "src/app/main-app/services/delivery-carrier.service";
import { FilterObjFastSaleModel } from "src/app/main-app/services/mock-odata/odata-fastsaleorder.service";
import { TagService } from "src/app/main-app/services/tag.service";
import { TDSContextMenuService } from "tds-ui/dropdown";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
})

export class FilterOptionsComponent {

  @Input() lstTags: Array<TDSSafeAny> = [];
  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() filterObj!: FilterObjFastSaleModel;
  @Input() lstCarriers: Array<DeliveryCarrierDTOV2> = [];

  datePicker: any = [addDays(new Date(), -30), new Date()];

  trackingRefs = [
    { text: 'Chưa có mã vận đơn', value: 'noCode' },
    { text: 'Đã có mã vận đơn', value: 'isCode' },
  ];

  status = [
    { text: 'Nháp', value: 'draft' },
    { text: 'Đã xác nhận', value: 'open' },
    { text: 'Đã thanh toán', value: 'paid' },
    { text: 'Hủy bỏ', value: 'cancel' }
  ];

  modelCarrier: TDSSafeAny;
  selectTags:  Array<TDSSafeAny> = [];
  selectRefs!: string | null;

  isActive: boolean = false;
  isVisible: boolean = false;

  constructor(private tagService: TagService,
    private tdsContextMenuService: TDSContextMenuService,
    private carrierService: DeliveryCarrierService) {
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
    if(this.filterObj.status.includes(event.value)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.value));
    } else {
        this.filterObj.status.push(event.value);
    }
  }

  onApply() {
    this.filterObj.dateRange = {
      startDate: this.datePicker[0],
      endDate: this.datePicker[1]
    }

    this.isActive = true;
    this.onLoadOption.emit(this.filterObj);
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
    this.onLoadOption.emit(this.filterObj);
  }

  closeMenu() {
    this.isVisible = false;
  }

}
