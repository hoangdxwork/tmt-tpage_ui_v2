import { formatDate } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { addDays, format } from "date-fns";
import { DeliveryCarrierService } from "src/app/main-app/services/delivery-carrier-order.service";
import { TagService } from "src/app/main-app/services/tag.service";
import { TDSContextMenuService, TDSSafeAny } from "tmt-tang-ui";


@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
})

export class FilterOptionsComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    bill: null,
    deliveryType: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
  }

  datePicker: any = [addDays(new Date(), -30), new Date()];

  trackingRefs = [
    { text: 'Chưa có mã vận đơn', value: 'noCode' },
    { text: 'Đã có mã vận đơn', value: 'isCode' },
  ];
  currentTracking!: string;

  status = [
    { text: 'Tất cả', value: 'all' },
    { text: 'Nháp', value: 'draft' },
    { text: 'Đã xác nhận', value: 'open' },
    { text: 'Đã thanh toán', value: 'paid' },
    { text: 'Hủy bỏ', value: 'cancel' }
  ];
  currentStatus = 'all';

  lstCarriers: Array<TDSSafeAny> = [];
  modelCarrier: TDSSafeAny;

  lstTags: Array<TDSSafeAny> = [];
  selectTags:  Array<TDSSafeAny> = [];

  isActive: boolean = false;

  constructor(private tagService: TagService,
      private tdsContextMenuService: TDSContextMenuService,
      private carrierService: DeliveryCarrierService) {
  }

  ngOnInit(): void {
    this.carrierService.get().subscribe((res: TDSSafeAny) => {
        this.lstCarriers = res.value;
    });

    let type = "fastsaleorder";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    })
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
    var exits = this.trackingRefs.filter(x => x.value === event.value)[0] as TDSSafeAny;
    if(exits && this.currentTracking == event.value) {
        this.currentTracking = '';
        this.filterObj.bill = '';
    }
    else if(exits) {
        this.currentTracking = event.value;
    }
  }

  selectState(event: any): void {
    var exits = this.status.filter(x => x.value === event.value)[0] as TDSSafeAny;
    if(exits) {
        this.currentStatus = event.value;
    }
  }

  onApply() {
    this.filterObj = {
        tags: this.selectTags,
        status: this.currentStatus == 'all' ? '' : this.currentStatus,
        bill: this.currentTracking,
        deliveryType:  this.modelCarrier ? this.modelCarrier.DeliveryType : '',
        searchText: '',
        dateRange: {
            startDate: this.datePicker[0],
            endDate: this.datePicker[1]
        }
    }

    this.onLoadOption.emit(this.filterObj);debugger
    if(this.currentStatus != 'all' && this.currentTracking && this.modelCarrier && this.selectTags.length > 0) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }

    this.tdsContextMenuService.close();
  }

  onCancel() {
    this.currentStatus = 'all';
    this.currentTracking = '';
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];
    this.modelCarrier = null;

    this.filterObj = {
        tags: [],
        status: '',
        bill: null,
        deliveryType: '',
        searchText: '',
        dateRange: {
            startDate: addDays(new Date(), -30),
            endDate: new Date(),
        }
    }

    this.onLoadOption.emit(this.filterObj);
    this.isActive = false;
  }

  closeMenu() {
    this.tdsContextMenuService.close();
  }

}
