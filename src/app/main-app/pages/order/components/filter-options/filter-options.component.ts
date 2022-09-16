import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterObjSOOrderModel, TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'order-filter-options',
  templateUrl: './filter-options.component.html',
  providers: [TDSDestroyService]
})

export class FilterOptionsComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() tabNavs!: TabNavsDTO[];
  @Input() summaryStatus: Array<TabNavsDTO> = [];
  @Input() lstDataTag: Array<TDSSafeAny> = [];
  @Input() filterObj!: FilterObjSOOrderModel;
  @Input() isLiveCamp!: boolean;

  datePicker!: any[] | any;
  lstTags: Array<TDSSafeAny> = [];
  selectTags: Array<TDSSafeAny> = [];
  listStatus: Array<TDSSafeAny> = [];

  isActive: boolean = false;
  isVisible: boolean = false;

  constructor(
    private cdr : ChangeDetectorRef,
    private destroy$: TDSDestroyService) {
  }

  ngOnInit(): void {}

  loadSummaryStatus() {
    // if(this.summaryStatus) {
    //   this.summaryStatus.map(x => {
    //     if(x.Index != 1) {
    //       this.listStatus.push(x);
    //     }
    //   })
    //   this.cdr.detectChanges();
    // }
    console.log(this.summaryStatus)
    this.listStatus = this.summaryStatus.map(f=> {
      return {
        Name: f.Name,
        Index: f.Index,
        Total: f.Total,
        isSelected: false
      }
    });
    
    this.cdr.detectChanges();
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
    this.filterObj.tags = this.selectTags;
  }

  selectState(event: any): void {
    if(this.filterObj.status.includes(event.Name)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.Name));
    } else {
        this.filterObj.status.push(event.Name);
    }
    this.checkActiveStatus();
  }

  checkActiveStatus(){
    this.listStatus.map(stt=>{
      stt.IsSelected = this.filterObj.status.some(f=>f == stt.Name);
    })
  }

  onApply() {
    if(this.datePicker){
      this.filterObj.dateRange = {
        startDate: this.datePicker[0],
        endDate: this.datePicker[1]
    }
    }

    this.isActive = true;
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.filterObj.tags) || TDSHelperArray.hasListValue(this.filterObj.status);
    if(exist) {
      return true;
    } else {
      return false;
    }
  }

  onCancel() {
    this.datePicker = null;
    this.selectTags = [];

    this.filterObj = {
      tags: [],
      status: [],
      searchText: '',
      dateRange: null
    }

    this.isActive = false;
    this.checkActiveStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  closeMenu(): void {
    this.isVisible = false;
  }
}