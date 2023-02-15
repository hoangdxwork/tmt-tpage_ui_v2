import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'filter-options',
  templateUrl: './filter-options.component.html',
})
export class FilterOptionsComponent implements OnInit {
  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();

  isActive: boolean = false;
  isVisible: boolean = false;
  selectSortDate!: string | null;
  selectSortPrice!: string | null;
  sort!: string;

  dateRange = [
    { text: 'Tăng dần theo ngày', value: 'date', IsSelected: false },
    { text: 'Giảm dần theo ngày', value: 'date_desc', IsSelected: false },
  ];

  priceRange = [
    { text: 'Tăng dần theo giá', value: 'price', IsSelected: false },
    { text: 'Giảm dần theo giá', value: 'price_desc', IsSelected: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  checkActive(): boolean {
    if (this.sort) {
      return true
    } else {
      return false
    }
  }

  // selectPrice(event: any): void {
  //   if (event && event.value && event.IsSelected) {
  //     this.sort = event.value;

  //     this.priceRange.map(x=> {
  //       if(x.value == event.value) {
  //         return x.IsSelected = true;
  //       }
  //       return x.IsSelected = false;
  //     })
  //   } else {
  //     this.sort = '';
  //   }

  // }

  selectDate(event: any): void {
    if (event && event.value && event.IsSelected) {
      this.sort = event.value;

      this.dateRange.map(x=> {
        if(x.value == event.value) {
          return x.IsSelected = true;
        }
        return x.IsSelected = false;
      })
    } else {
      this.sort = '';
    }

  }

  onApply() {
    this.onLoadOption.emit(this.sort);
    this.closeMenu();
  }

  onCancel() {
    this.sort = 'date';
    // this.priceRange.map(x => x.IsSelected = false);
    this.dateRange.map(x=> x.IsSelected = false)
    this.onLoadOption.emit(this.sort);
    this.closeMenu();
  }

  closeMenu() {
    this.isVisible = false;
  }

}
