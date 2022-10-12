import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { ODataPartnerStartusDTO, PartnerStatusDTO } from '@app/dto/partner/partner-status.dto';
import { PartnerService } from '@app/services/partner.service';
import { FilterDataRequestDTO, SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { THelperDataRequest } from '@core/services/helper-data.service';
import { debounceTime, finalize, fromEvent, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { CreatePartnerStatusComponent } from '../create-partner-status/create-partner-status.component';

@Component({
  selector: 'partner-status',
  templateUrl: './partner-status.component.html',
})
export class PartnerStatusComponent implements OnInit {
  // @Input() onLoadData!: boolean;
  @Input() filterText!: string;
  private destroy$ = new Subject<void>();

  lstData!: PartnerStatusDTO[];

  pageSize = 20;
  pageIndex = 1;
  isLoading = false;
  count: number = 1;
  public filterObj: any = {
    searchText: ''
  }

  constructor(
    private partnerService: PartnerService,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private viewContainerRef: ViewContainerRef,
  ) { }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes["onLoadData"] && !changes["onLoadData"].firstChange) {
  //     this.loadData(this.pageSize, this.pageIndex);
  //   }
  // }

  ngOnInit(): void {
    // this.loadData(this.pageSize, this.pageIndex);
  }

  ngAfterViewInit(): void {
    // fromEvent(this.filterText, 'keyup').pipe(
    //   map((event: any) => { return event.target.value }),
    //   debounceTime(750),
    //   // distinctUntilChanged(),
    //   // TODO: switchMap xử lý trường hợp sub in sub
    //   switchMap((text: string) => {
    //
    // });
  }

  onSearch(text: string) {
    this.pageIndex = 1;
    this.filterObj.searchText = text;

    let filters;
    if (TDSHelperString.hasValueString(text)) {
      this.filterObj.searchText = text.toLocaleLowerCase().trim();
      filters = this.partnerService.buildFilter(this.filterObj);
    }

    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
    this.getViewData(params).subscribe((res: ODataPartnerStartusDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstData = res.value;
    }, err => {
      this.message.error('Tải dữ liệu thất bại!');
    });
  }

  loadData(pageSize: number, pageIndex: number, filters?: FilterDataRequestDTO, sort?: SortDataRequestDTO[]) {
    if (TDSHelperString.hasValueString(this.filterObj.searchText)) {
      filters = this.partnerService.buildFilter(this.filterObj);
    }

    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, sort);

    this.getViewData(params).subscribe((res: ODataPartnerStartusDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstData = res.value;
    }, err => {
      this.message.error('Tải dữ liệu thất bại!');
    });
  }

  private getViewData(params: string): Observable<ODataPartnerStartusDTO> {
    this.isLoading = true;
    return this.partnerService
      .getPartnerStatusExtra(params).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
  }

  showRemoveStatus(data: PartnerStatusDTO) {
    const modal = this.modalService.error({
      title: 'Xác nhận xóa trạng thái',
      content: 'Bạn có chắc muốn xóa trạng thái khách hàng này không?',
      iconType: 'tdsi-trash-fill',
      onOk: () => {
        this.partnerService.deletePartnerStatusExtra(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
          (res) => {
            this.message.success('Xóa thành công');
            if (this.lstData.length <= 1) {
              this.pageIndex = 1;
              this.filterObj.searchText = '';
              this.filterText = '';
              this.loadData(this.pageSize, this.pageIndex);
            }
            this.loadData(this.pageSize, this.pageIndex);
          },
          err => {
            this.message.error(err.error.message || "Xóa thất bại !!");
          }
        );
      },
      onCancel: () => {
        modal.close();
      },
      okText: "Xác nhận",
      cancelText: "Hủy bỏ"
    });
  }

  showCreateModal() {
    const modal = this.modalService.create({
      title: 'Thêm mới trạng thái khách hàng',
      content: CreatePartnerStatusComponent,
      viewContainerRef: this.viewContainerRef,
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      debugger
      if (TDSHelperObject.hasValue(result)) {
        this.pageIndex = 1;
        this.filterText = '';
        this.filterObj.searchText = '';
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  showEditModal(data: PartnerStatusDTO): void {
    const modal = this.modalService.create({
      title: 'Chỉnh sửa trạng thái khách hàng',
      content: CreatePartnerStatusComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
      if (result) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  onClearAll(event: MouseEvent) {
    event.stopPropagation();
    this.refreshData();
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.filterText = '';
    this.loadData(this.pageSize, this.pageIndex);
  }

}
