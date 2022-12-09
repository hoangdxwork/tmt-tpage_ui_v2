import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { addDays } from "date-fns";
import { Observable } from "rxjs";
import { DeliveryCarrierDTOV2 } from "src/app/main-app/dto/delivery-carrier.dto";
import { LiveCampaignModel, ODataLiveCampaignModelDTO } from "@app/dto/live-campaign/odata-live-campaign-model.dto";
import { TDSDateRangeDTO } from "src/app/main-app/handler-v2/common.handler";
import { DeliveryCarrierService } from "src/app/main-app/services/delivery-carrier.service";
import { LiveCampaignService } from "src/app/main-app/services/live-campaign.service";
import { FilterObjFastSaleModel } from "src/app/main-app/services/mock-odata/odata-fastsaleorder.service";
import { FilterObjLiveCampaignDTO } from "src/app/main-app/services/mock-odata/odata-live-campaign.service";
import { TagService } from "src/app/main-app/services/tag.service";
import { TDSContextMenuService } from "tds-ui/dropdown";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-option-campaign',
  templateUrl: './filter-option-campaign.component.html',
})

export class FilterOptionCampaignComponent implements OnInit, OnChanges {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() filterObj!: FilterObjLiveCampaignDTO;
  @Input() currentDateRanges!: TDSDateRangeDTO;


  datePicker: any = [];
  lstSelectLive: ODataLiveCampaignModelDTO[] = [];
  orders = [
    { text: 'Chưa có đơn hàng', value: false },
    { text: 'Đã có đơn hàng', value: true },
  ];
  activities = [
    { text: 'Hoạt động', value: true },
    { text: 'Không hoạt động', value: false },
  ];

  isActive: boolean = false;
  isVisible: boolean = false;
  lstLiveCampaigns!: Observable<ODataLiveCampaignModelDTO>;

  constructor(
    private liveCampaignService: LiveCampaignService) {
}

  mapDatePicker(){
    if(this.currentDateRanges){
      let startDate = this.currentDateRanges.startDate;
      let endDate = this.currentDateRanges.endDate; 
      this.datePicker = [startDate, endDate];
    }
  }

  ngOnInit(): void {
    this.lstLiveCampaigns = this.loadLiveCampaign();

    if(this.filterObj && this.filterObj.dateRange) {
      this.datePicker = [this.filterObj.dateRange.startDate, this.filterObj.dateRange.endDate]
    }
  }

  loadLiveCampaign() {
    return this.liveCampaignService.get();
  }

  onSearch(event: LiveCampaignModel[]) {
    if(event) {
        this.filterObj.ids = event.map((x: any) => x.Id);
    }
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
    }
  }

  checkActive() {
    let exist =  this.filterObj.isActive || this.filterObj.ids.length > 0;
    if(exist) {
      return true
    } else {
      return false
    }
  }

  selectActive(item: any) {
    if(item) {
      if(this.filterObj.isActive == item.value) {
          this.filterObj.isActive = null;
      } else {
          this.filterObj.isActive = item.value;
      }
    }
  }

  onApply() {
    this.filterObj.dateRange = {
      startDate: this.datePicker[0] || null,
      endDate: this.datePicker[1] || null
    }

    this.isActive = true;
    let model =  {
      isActive: this.isActive,
      value: this.filterObj
    }
    this.onLoadOption.emit(model);
  }

  onCancel() {
    let startDate = addDays(new Date(), -30);
    let endDate = new Date();

    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.filterObj.isActive = null;
    this.filterObj.ids = [];
    this.lstSelectLive = [];

    this.filterObj.dateRange = {
      startDate: startDate,
      endDate: endDate
    };

    this.isActive = false;
    let model =  {
      isActive: this.isActive,
      value: this.filterObj
    }
    this.onLoadOption.emit(model);
    this.isVisible = false;
  }

  closeMenu() {
    this.isVisible = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["currentDateRanges"] && !changes["currentDateRanges"].firstChange) {
      this.mapDatePicker();
    }
  }

}
