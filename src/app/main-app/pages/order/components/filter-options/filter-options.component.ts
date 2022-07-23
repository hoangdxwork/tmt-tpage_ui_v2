import { OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SaleOnline_OrderService } from './../../../../services/sale-online-order.service';
import { takeUntil } from 'rxjs';
import { SaleOnlineOrderSummaryStatusDTO } from './../../../../dto/saleonlineorder/sale-online-order.dto';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addDays } from 'date-fns/esm';
import { FilterObjSOOrderModel, TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { TDSContextMenuService } from 'tds-ui/dropdown';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'order-filter-options',
  templateUrl: './filter-options.component.html',
})

export class FilterOptionsComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() tabNavs!: TabNavsDTO[];
  @Input() lstDataTag: Array<TDSSafeAny> = [];
  @Input() filterObj!: FilterObjSOOrderModel;

  datePicker: any = [addDays(new Date(), -30), new Date()];
  lstTags: Array<TDSSafeAny> = [];
  selectTags: Array<TDSSafeAny> = [];
  listStatus: Array<TDSSafeAny> = [];

  isActive: boolean = false;
  isVisible: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(private saleOnline_OrderService: SaleOnline_OrderService) {
  }

  ngOnInit(): void {
    this.loadSummaryStatus();
  }

  loadSummaryStatus() {
    let model: SaleOnlineOrderSummaryStatusDTO = {
      DateStart: this.filterObj.dateRange.startDate,
      DateEnd: this.filterObj.dateRange.endDate,
      SearchText: this.filterObj.searchText,
      TagIds: this.filterObj.tags.map((x: TDSSafeAny) => x.Id).join(","),
    }

    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$)).subscribe((res: Array<TDSSafeAny>) => {
        res.forEach(item => {
          this.listStatus.push({
            Name: item.StatusText,
            Total: item.Total,
            IsSelected: false
          })
        });
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
    this.filterObj.dateRange = {
        startDate: this.datePicker[0],
        endDate: this.datePicker[1]
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
      return false
    }
  }

  onCancel() {
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];

    this.filterObj = {
      tags: [],
      status: [],
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

  closeMenu(): void {
    this.isVisible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
