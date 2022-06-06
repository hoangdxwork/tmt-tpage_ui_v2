import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { addDays } from 'date-fns/esm';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { TDSContextMenuService, TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'order-filter-options',
  templateUrl: './order-filter-options.component.html',
})
export class OrderFilterOptionsComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  datePicker: any = [addDays(new Date(), -30), new Date()];

  lstCarriers: Array<TDSSafeAny> = [];
  lstTags: Array<TDSSafeAny> = [];
  selectTags:  Array<TDSSafeAny> = [];

  isActive: boolean = false;

  status = [
    { text: 'Tất cả', value: 'all' },
    { text: 'Nháp', value: 'draft' },
    { text: 'Hủy', value: 'canceled' },
    { text: 'Xác nhận', value: 'confirmed' },
  ];

  currentStatus = 'all';

  constructor(
    private tagService: TagService,
    private carrierService: DeliveryCarrierService,
    private tdsContextMenuService: TDSContextMenuService,
  ) { }

  ngOnInit(): void {
    this.carrierService.get().subscribe((res: TDSSafeAny) => {
      this.lstCarriers = res.value;
    });

    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstTags = res.value;
    });
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
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

  selectState(event: any): void {
    var exits = this.status.filter(x => x.value === event.value)[0] as TDSSafeAny;
    if(exits) {
        this.currentStatus = event.value;
    }
  }

  onApply() {
    let textStatus = this.status.filter(x => x.value === this.currentStatus)[0].text as TDSSafeAny;

    this.filterObj = {
        tags: this.selectTags,
        status: textStatus == 'Tất cả' ? '' : textStatus,
        searchText: '',
        dateRange: {
            startDate: this.datePicker[0],
            endDate: this.datePicker[1]
        }
    }

    this.onLoadOption.emit(this.filterObj);

    this.tdsContextMenuService.close();
  }

  onCancel() {
    this.currentStatus = 'all';
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];

    this.filterObj = {
      tags: [],
      status: '',
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
