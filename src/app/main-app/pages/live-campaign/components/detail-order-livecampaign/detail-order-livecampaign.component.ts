import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { SaleOnlineStatusModelDto, SaleOnlineStatusValueDto } from "@app/dto/saleonlineorder/sale-online-order.dto";
import { FilterObjSOOrderModel, TabNavsDTO } from "@app/services/mock-odata/odata-saleonlineorder.service";
import { SaleOnline_OrderService } from "@app/services/sale-online-order.service";
import { TagService } from "@app/services/tag.service";
import { addDays } from "date-fns";
import { takeUntil } from "rxjs";
import { TDSDestroyService } from "tds-ui/core/services";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { TableAllOrderComponent } from "../table-all-order/table-all-order.component";

@Component({
  selector: 'detail-order-livecampaign',
  templateUrl: './detail-order-livecampaign.component.html',
})

export class DetailOrderLiveCampaignComponent implements OnInit {
  @ViewChild(TableAllOrderComponent) tableAllOrderComponent!: TableAllOrderComponent;
  @Input() liveCampaignId!: string;

  public filterObj: FilterObjSOOrderModel = {
    Tags: [],
    StatusTexts: [],
    SearchText: '',
    DateRange: {
      StartDate: addDays(new Date(), -30),
      EndDate: new Date(),
    },
    LiveCampaignId: null,
    HasTelephone: null,
    PriorityStatus: null
  }

  currentTab: number = 0;
  isLoading: boolean = false;
  innerText: string = '';
  public summaryStatus: Array<TabNavsDTO> = [];
  public tabNavs: Array<TabNavsDTO> = [];
  public lstDataTag: Array<TDSSafeAny> = [];
  isTabNavs: boolean = false;

  constructor(
    private tagService: TagService,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private destroy$: TDSDestroyService,
  ) { }

  ngOnInit(): void {
    this.loadSummaryStatus()
  }

  loadTags() {
    let type = "saleonline";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
      this.lstDataTag = [...res.value];
    });
  }

  loadSummaryStatus() {
    let model: SaleOnlineStatusModelDto = {
      DateStart: this.filterObj?.DateRange?.StartDate,
      DateEnd: this.filterObj?.DateRange?.EndDate,
      SearchText: this.filterObj?.SearchText,
      TagIds: this.filterObj?.Tags?.map((x: TDSSafeAny) => x.Id)?.join(","),
    }

    this.isTabNavs = true;
    this.saleOnline_OrderService.getSummaryStatus(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: Array<SaleOnlineStatusValueDto>) => {
          let tabs: TabNavsDTO[] = [];
          let total = 0;

          res?.map((x: SaleOnlineStatusValueDto, index: number) => {
            total += x.Total;
            index = index + 2;

            tabs.push({ Name: `${x.StatusText}`, Index: index, Total: x.Total });
          });

          tabs.sort((a, b) => a.Index - b.Index);

          this.tabNavs = [...tabs];
          this.summaryStatus = this.tabNavs;
          this.isTabNavs = false
        }
      });
  }

  selectedIndexChange(event: number) {
    this.currentTab = event;
  }

  onCreateQuicklyFS() {
    this.tableAllOrderComponent.onCreateQuicklyFS();
  }

  printCustomer() {
    this.tableAllOrderComponent.printCustomer();
  }

  printMultiOrder() {
    this.tableAllOrderComponent.printMultiOrder();
  }

  onSearch(data: TDSSafeAny) {
    this.tableAllOrderComponent.onSearch(data);
  }

  onLoadOption(event: any) {
    this.tableAllOrderComponent.onLoadOption(event);
  }

}
