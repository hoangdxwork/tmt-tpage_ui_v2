import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ODataPartnerStartusDTO, PartnerStatusDTO } from '@app/dto/partner/partner-status.dto';
import { PartnerService } from '@app/services/partner.service';
import { FilterDataRequestDTO, SortDataRequestDTO } from '@core/dto/dataRequest.dto';
import { THelperDataRequest } from '@core/services/helper-data.service';
import { debounceTime, finalize, fromEvent, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { CreatePartnerStatusComponent } from '../components/create-partner-status/create-partner-status.component';

@Component({
  selector: 'app-config-partner-status',
  templateUrl: './config-partner-status.component.html',
})
export class ConfigPartnerStatusComponent implements OnInit {
  @ViewChild('filterText') filterText!: ElementRef;
  private destroy$ = new Subject<void>();

  lstData!: PartnerStatusDTO[];

  pageSize = 10;
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

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
  }

  ngAfterViewInit(): void {
    fromEvent(this.filterText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      // distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: string) => {
        this.pageIndex = 1;
        this.filterObj.searchText = text;

        let filters;
        if (TDSHelperString.hasValueString(this.filterObj.searchText)) {
          filters = this.partnerService.buildFilter(this.filterObj);
        }

        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
        return this.getViewData(params);
      })
    ).subscribe((res: ODataPartnerStartusDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstData = res.value;
    });
  }

  loadData(pageSize: number, pageIndex: number, filters?: FilterDataRequestDTO, sort?: SortDataRequestDTO[]) {
    // this.partnerService.getPartnerStatusExtra().subscribe({
    //   next: (res: ODataPartnerStartusDTO) => {
    //     this.lstData = [...res.value];
    //   }
    // })

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
              this.filterText.nativeElement.value = '';
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
      if (TDSHelperObject.hasValue(result)) {
        this.pageIndex = 1;
        this.filterText.nativeElement.value = '';
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
      this.loadData(this.pageSize, this.pageIndex);
    });
  }

  onClearAll(event: MouseEvent) {
    event.stopPropagation();
    this.refreshData();
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.filterText.nativeElement.value = '';
    this.loadData(this.pageSize, this.pageIndex);
  }

}
