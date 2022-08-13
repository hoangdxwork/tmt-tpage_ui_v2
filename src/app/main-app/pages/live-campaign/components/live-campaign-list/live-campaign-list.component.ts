import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, Observable, pipe, Subject } from 'rxjs';
import { finalize, map, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { LiveCampaignModel, ODataLiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { CommonHandler, TDSDateRangeDTO } from 'src/app/main-app/handler-v2/common.handler';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { FilterObjLiveCampaignDTO, ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { TdsSwitchChange } from 'tds-ui/switch';
import { TDSTableQueryParams } from 'tds-ui/table';
import { ColumnTableDTO } from '../../../order/components/config-column/config-column.component';

@Component({
  selector: 'live-campaign-list',
  templateUrl: './live-campaign-list.component.html'
})

export class LiveCampaignListComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input() currentDateRanges!: TDSDateRangeDTO;
  @ViewChild('innerText') innerText!: ElementRef;

  filterObj: FilterObjLiveCampaignDTO = {
    ids: [],
    searchText: '',
    isActive: null,
    dateRange: {
      startDate: null,
      endDate: null
    }
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<LiveCampaignModel> = [];
  expandSet = new Set<string | undefined>();
  lstLiveCampaigns!: Observable<ODataLiveCampaignDTO>;

  isLoading: boolean = false;
  pageSize = 20;
  pageIndex = 1;
  count: number = 1;

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: ColumnTableDTO[] = [
    { value: 'Name', name: 'Tên chiến dịch', isChecked: true },
    { value: 'Order', name: 'Đơn hàng', isChecked: true },
    { value: 'Product', name: 'Sản phẩm', isChecked: true },
    { value: 'ResumeTime', name: 'Thống kê gửi tin', isChecked: true },
    { value: 'IsActive', name: 'Hoạt động', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: true },
  ];

  widthTable: number = 0;
  paddingCollapse: number = 36;
  marginLeftCollapse: number = 0;
  isLoadingCollapse: boolean = false;

  private destroy$ = new Subject<void>();

  @ViewChild('viewChildWidthTable') viewChildWidthTable!: ElementRef;
  @ViewChild('viewChildDetailPartner') viewChildDetailPartner!: ElementRef;

  constructor(private message: TDSMessageService,
    private router: Router,
    private odataLiveCampaignService: ODataLiveCampaignService,
    private modal: TDSModalService,
    private commonHandler: CommonHandler,
    private resizeObserver: TDSResizeObserver,
    private cacheApi: THelperCacheService,
    private liveCampaignService: LiveCampaignService,
    private cdref: ChangeDetectorRef) { 
  }

  mapDatePicker(){
    if(this.currentDateRanges){
      this.filterObj.dateRange = {
        startDate: this.currentDateRanges.startDate,
        endDate: this.currentDateRanges.endDate
      }  
    }
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach((x: any) => this.updateCheckedSet(x.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  ngOnInit(): void {
    this.loadGridConfig();
  }

  loadGridConfig() {
    const key = this.liveCampaignService._keyCacheGrid;
    this.cacheApi.getItem(key).subscribe((res: TDSSafeAny) => {
      if(res && res.value) {
          let jsColumns = JSON.parse(res.value) as any;
          this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
          this.hiddenColumns = this.columns;
      }
    })
  }

  loadData(pageSize: number, pageIndex: number) {

    let filters = this.odataLiveCampaignService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: ODataLiveCampaignDTO) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
    });
  }

  getViewData(params: string): Observable<ODataLiveCampaignDTO> {
    this.isLoading = true;
    return this.odataLiveCampaignService
      .getView(params).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  onExpandChange(id: string | undefined, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onLoadOption(event: FilterObjLiveCampaignDTO) {
    this.filterObj = { ...this.filterObj, ...event };
    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;
    this.innerText.nativeElement.value = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<string>();

    this.filterObj.ids = [];
    this.filterObj.searchText = '';
    this.filterObj.isActive = null;

    this.loadData(this.pageSize, this.pageIndex);
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if(event && event.length > 0) {
      const gridConfig = {
          columnConfig: event
      };

      const key = this.liveCampaignService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  onChangeActive(event: TdsSwitchChange, data: LiveCampaignModel) {
    this.isLoading = true;
    this.liveCampaignService.approve(data.Id).pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false))
      .subscribe(res => {
         if(res) {
            data.IsActive = event.checked;
            this.message.success('Thao tác thành công')
         }
      }, error => {
          this.message.error(`${error?.error?.message }` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      })
  }

  onDetail(id: string) {
    this.router.navigateByUrl(`live-campaign/detail/${id}`);
  }

  onEdit(id: string) {
    this.router.navigateByUrl(`live-campaign/edit/${id}`);
  }

  onCopyCampaign(id: string) {
    this.router.navigateByUrl(`live-campaign/copy/${id}`);
  }

  showModalRemove(data: any) {
    const modal = this.modal.error({
        title: 'Xác nhận xóa chiến dịch',
        content: `Bạn có chắc muốn xóa chiến dịch <span class="font-semibold">${data.Name}</span> không?`,
        iconType: 'tdsi-trash-fill',
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
        onOk: () => {
            this.onRemove(data.Id);
        },
        onCancel: () => {
          modal.close();
        },
    })
  }

  onRemove(id: string) {
    this.isLoading = true;
    this.liveCampaignService.delete(id)
      .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false)).subscribe(res => {
          this.message.success('Thao tác thành công');
          this.loadData(this.pageSize, this.pageIndex);
      }, error => {
          this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["currentDateRanges"] && !changes["currentDateRanges"].firstChange) {
        this.currentDateRanges = changes["currentDateRanges"].currentValue;
        this.filterObj.dateRange = {
          startDate: this.currentDateRanges.startDate,
          endDate: this.currentDateRanges.endDate
        }
        this.loadData(this.pageSize, this.pageIndex)
    }
  }

  ngAfterViewInit(): void {
    this.widthTable = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse

    this.resizeObserver.observe(this.viewChildWidthTable)
      .subscribe(() => {
          this.widthTable = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
          this.viewChildWidthTable?.nativeElement.click()
      });

    setTimeout(() => {
      let that = this;
      let wrapScroll = this.viewChildDetailPartner?.nativeElement?.closest('.tds-table-body');
      wrapScroll?.addEventListener('scroll', function () {
          let scrollleft = wrapScroll.scrollLeft;
          that.marginLeftCollapse = scrollleft;
      });
    }, 500);

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: TDSSafeAny) => {

        this.pageIndex = 1;
        this.filterObj.searchText = text;
        let filters = this.odataLiveCampaignService.buildFilter(this.filterObj);

        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);
        return this.getViewData(params);

      }))
      .subscribe((res: any) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...res.value];
      }, error => {
          this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
