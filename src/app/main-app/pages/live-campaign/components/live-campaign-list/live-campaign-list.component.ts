import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { finalize } from 'rxjs/operators';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { Message } from 'src/app/lib/consts/message.const';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SaleOnline_LiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';
import { FilterLiveCampaignDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { ODataLiveCampaignService } from 'src/app/main-app/services/mock-odata/odata-live-campaign.service';
import { TDSMessageService, TDSSafeAny, TdsSwitchChange, TDSTableQueryParams, TDSModalService } from 'tmt-tang-ui';
import { ColumnTableDTO } from '../../../order/components/config-column/config-column.component';

@Component({
  selector: 'live-campaign-list',
  templateUrl: './live-campaign-list.component.html'
})
export class LiveCampaignListComponent implements OnInit {

  filterObj: FilterLiveCampaignDTO = {
    status: '',
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    }
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<SaleOnline_LiveCampaignDTO> = [];

  expandSet = new Set<string | undefined>();
  isLoading: boolean = false;
  pageSize = 10;
  pageIndex = 1;
  count: number = 1;
  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Name', name: 'Tên chiến dịch', isChecked: true },
    { value: 'Order', name: 'Đơn hàng', isChecked: true },
    { value: 'Product', name: 'Sản phẩm', isChecked: true },
    { value: 'Time', name: 'Thống kê gửi tin', isChecked: true },
    { value: 'Active', name: 'Ngày tạo', isChecked: true },
    { value: 'DateCreated', name: 'Trạng thái', isChecked: true },
    { value: 'Action', name: 'Thao tác', isChecked: true }
  ];

  constructor(
    private message: TDSMessageService,
    private router: Router,
    private modal: TDSModalService,
    private oDataLiveCampaignService: ODataLiveCampaignService,
    private cacheApi: THelperCacheService,
    private liveCampaignService: LiveCampaignService,
  ) { }

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
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
    });
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.isLoading = true;
    this.getViewData(params).pipe(finalize(() => this.isLoading = false)).subscribe(res=> {
        this.count = res['@odata.count'] as number;
        this.lstOfData = res.value;
    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignService
        .get(params)
        .pipe(finalize(() => this.isLoading = false ));
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

  refreshData() {
    this.pageIndex = 1;
    this.expandSet = new Set<string>();

    this.filterObj = {
      status: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

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

  onChangeActive(event: TdsSwitchChange, data: SaleOnline_LiveCampaignDTO) {
    this.isLoading = true;
    this.liveCampaignService.approve(data.Id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        if(res?.success == true) {
          data.IsActive = event.checked;
          this.message.success(Message.UpdatedActiveSuccess);
        }
        else {
          this.message.error(Message.ErrorOccurred);
        }
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  onSearch(event: TDSSafeAny) {
    let text = event?.target.value;

    this.pageIndex = 1;
    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onDetail(id: string | undefined) {
    this.router.navigateByUrl(`live-campaign/detail/${id}`);
  }

  onEdit(id: string | undefined) {
    this.router.navigateByUrl(`live-campaign/edit/${id}`);
  }

  onCopy(id: string | undefined) {
    this.router.navigateByUrl(`live-campaign/copy/${id}`);
  }

  showModalRemove(data: SaleOnline_LiveCampaignDTO) {
    const modal = this.modal.error({
      title: 'Xác nhận xóa chiến dịch',
      content: `Bạn có chắc muốn xóa chiến dịch ${data.Name} không?`,
      iconType: 'tdsi-trash-fill',
      okText: "Xác nhận",
      cancelText: "Hủy bỏ",
      onOk: () => {
        this.remove(data.Id);
      },
      onCancel: () => {
        modal.close();
      },
    })
  }

  remove(id: string | undefined) {
    this.isLoading = true;
    this.liveCampaignService.delete(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.DeleteSuccess);
        this.loadData(this.pageSize, this.pageIndex);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

}
