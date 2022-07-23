import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FilterObjPartnerModel } from "src/app/main-app/services/mock-odata/odata-partner.service";
import { TDSHelperArray, TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-option-partner',
  templateUrl: './filter-option-partner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterOptionPartnerComponent implements OnInit  {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() lstStatus: Array<TDSSafeAny> = [];
  @Input() lstDataTag: Array<TDSSafeAny> = [];
  @Input() filterObj!: FilterObjPartnerModel;

  isVisible: boolean = false;
  selectTags: Array<TDSSafeAny> = [];
  isActive: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}
  
  ngOnInit(): void {
  }

  checkActiveStatus(){
    this.lstStatus.map(stt=>{
      stt.IsSelected = this.filterObj.status.some(f=>f == stt.Name);
    })
  }

  selectState(event: any): void {
    if(this.filterObj.status.includes(event.Name)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.Name));
    } else {
        this.filterObj.status.push(event.Name);
    }
    this.checkActiveStatus();
  }

  onApply() {
    this.isActive = true;
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
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
    this.checkActiveStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  closeMenu() {
    this.isVisible = false;
  }
}
