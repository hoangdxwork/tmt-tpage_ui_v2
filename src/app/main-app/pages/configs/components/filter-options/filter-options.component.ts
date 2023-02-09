import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
})
export class FilterOptionsComponent implements OnInit {
  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() sort!: any;

  isActive: boolean = false;
  isVisible: boolean = false;
  selectSortDate!: string | null;
  selectSortPrice!: string | null;

  dateRange = [
    { text: 'Tăng dần theo ngày', value: 'asc', IsSelected: false },
    { text: 'Giảm dần theo ngày', value: 'desc', IsSelected: false },
  ];

  priceRange = [
    { text: 'Tăng dần theo giá', value: 'asc', IsSelected: false },
    { text: 'Giảm dần theo giá', value: 'desc', IsSelected: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.sort.DateCreated) || TDSHelperArray.hasListValue(this.sort.Price)

    if (exist) {
      return true
    } else {
      return false
    }
  }

  selectPrice(event: any): void {
    if (event && event.value && event.IsSelected) {
      this.selectSortPrice = event.value;

      this.priceRange.map(x=> {
        if(x.value == event.value) {
          return x.IsSelected = true;
        }
        return x.IsSelected = false;
      })
    } else {
      this.selectSortPrice = null;
    }

    this.sort.Price = this.selectSortPrice;
  }

  selectDate(event: any): void {
    if (event && event.value && event.IsSelected) {
      this.selectSortDate = event.value;

      this.dateRange.map(x=> {
        if(x.value == event.value) {
          return x.IsSelected = true;
        }
        return x.IsSelected = false;
      })
    } else {
      this.selectSortDate = null;
    }

    this.sort.DateCreated = this.selectSortDate;
  }

  onApply() {
    this.onLoadOption.emit(this.sort);
    this.closeMenu();
  }

  onCancel() {

  }

  closeMenu() {
    this.isVisible = false;
  }

}
