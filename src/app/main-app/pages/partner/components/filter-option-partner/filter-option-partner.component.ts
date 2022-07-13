import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterObjPartnerModel } from "src/app/main-app/services/mock-odata/odata-partner.service";
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-option-partner',
  templateUrl: './filter-option-partner.component.html',
})

export class FilterOptionPartnerComponent  {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() status: any = [];
  @Input() lstDataTag: Array<TDSSafeAny> = [];
  @Input() filterObj!: FilterObjPartnerModel;

  isVisible: boolean = false;
  selectTags: Array<TDSSafeAny> = [];
  isActive: boolean = false;

  constructor() {}

  selectState(event: any): void {
    if(this.filterObj.status.includes(event.StatusText)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.StatusText));
    } else {
        this.filterObj.status.push(event.StatusText);
    }
  }

  onApply() {
    this.isActive = true;
    this.onLoadOption.emit(this.filterObj);
  }

  onChangeTags(event: Array<TDSSafeAny>): void {
    this.selectTags = [];
    if(event){
      event.forEach(x => {
          this.selectTags.push(x);
      })
    }
    this.filterObj.tags = [...this.selectTags];
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.filterObj.tags) || TDSHelperArray.hasListValue(this.filterObj.status)
    if(exist) {
      return true
    } else {
      return false
    }
  }

  onCancel() {
    this.selectTags = [];
    this.filterObj.tags = [];
    this.filterObj.status = [];

    this.isActive = false;
    this.onLoadOption.emit(this.filterObj);
  }

  closeMenu() {
    this.isVisible = false;
  }

}
