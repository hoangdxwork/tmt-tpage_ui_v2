import { ConfigDataFacade } from '../../../services/facades/config-data.facade';
import { switchMap, distinctUntilChanged, debounceTime, map, finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuickReplyService } from '../../../services/quick-reply.service';
import { QuickReplyDTO } from '../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from '../../../../lib/services/helper-data.service';
import { Subject, Observable, fromEvent } from 'rxjs';
import { OdataQuickReplyService } from '../../../services/mock-odata/odata-quick-reply.service';
import { AutoChatAddDataModalComponent } from '../components/auto-chat-add-data-modal/auto-chat-add-data-modal.component';
import { Component, OnInit, ViewContainerRef, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ODataQuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';

@Component({
  selector: 'auto-quick-reply',
  templateUrl: './auto-quick-reply.component.html'
})

export class AutoQuickReplyComponent implements OnInit, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;

  AutoChatList: Array<QuickReplyDTO> = [];
  expandBtnList: Array<boolean> = [];
  isLoading = false;
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;

  private destroy$ = new Subject<void>();
  public filterObj: TDSSafeAny = {
    searchText: ''
  }
  tabIndex = null;


  constructor(private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private fb: FormBuilder,
    private odataQuickReplyService: OdataQuickReplyService,
    private quickReplyService: QuickReplyService,
    private configDataService: ConfigDataFacade
  ) { }

  ngOnInit(): void {
    // this.loadData(this.pageSize, this.pageIndex);

  }

  ngAfterViewInit(): void {
    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: TDSSafeAny) => {
        this.pageIndex = 1;

        this.filterObj.searchText = text;
        let filters = this.odataQuickReplyService.buildFilter(this.filterObj);

        let params = TDSHelperString.hasValueString(this.filterObj.searchText) ?
        THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters):
        THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex);

        return this.get(params);

    })).subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.AutoChatList = res.value;
    });
  }

  private get(params: string): Observable<ODataQuickReplyDTO> {
    this.isLoading = true;
    return this.odataQuickReplyService
        .get(params).pipe(takeUntil(this.destroy$))
        .pipe(finalize(() => {this.isLoading = false }));
  }

  loadData(pageSize: number, pageIndex: number) {
    this.isLoading = true;
    this.configDataService.onLoading$.emit(this.isLoading);
    let filters = this.odataQuickReplyService.buildFilter(this.filterObj);

    let params = TDSHelperString.hasValueString(this.filterObj.searchText)?
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters):
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);

    this.odataQuickReplyService.get(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataQuickReplyDTO) => {
      this.AutoChatList = res.value
      this.count = res['@odata.count'] as number
      this.isLoading = false;
      this.configDataService.onLoading$.emit(this.isLoading);
    }, error => {
      this.message.error(error.error.message || 'Tải dữ liệu thất bại!');
    });

  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
    this.pageIndex = params.pageIndex;
  }

  refreshData() {
    this.pageIndex = 1;
    this.filterObj.searchText = '';
    this.innerText.nativeElement.value = '';
    this.loadData(this.pageSize, this.pageIndex);
  }

  selectOrderDefault(key: number) {
    this.quickReplyService.updateDefaultForOrder(key).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success("Thay đổi Templates đơn hàng thành công!");
      this.loadData(this.pageSize, this.pageIndex);
    },err=>{
      this.message.error( err.error.message || 'Thay đổi Templates đơn hàng thất bại!!');
    });
  }

  selectBillDefault(key: number) {
    this.quickReplyService.updateDefaultForBill(key).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message.success("Thay đổi Templates hóa đơn thành công!");
      this.loadData(this.pageSize, this.pageIndex);
    },err=>{
      this.message.error( err.error.message || 'Thay đổi Templates hóa đơn thất bại!!');
    });
  }



  applyFilter(event: TDSSafeAny) {
    this.pageIndex = 1;
    this.pageSize = 20;

    let keyFilter = event.value as string
    this.filterObj = {
      searchText:  keyFilter
    }
    this.loadData(this.pageSize, this.pageIndex);
  }

  onAddNewData(data: TDSSafeAny) {
    const modal = this.modalService.create({
      title: 'Thêm mới trả lời nhanh',
      content: AutoChatAddDataModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {

      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    });
  }

  onChangeStatus(key: number) {
    this.isLoading = true
    this.quickReplyService.updateStatus(key).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.message.success('Thay đổi trạng thái thành công!');
      this.isLoading = false;
      return res;
    },err=>{
      this.message.error(err.error.message || 'Có lỗi xảy ra!');
      this.isLoading = false;
    });
  }

  onChangeSetting(data: TDSSafeAny, index: number) {

  }

  onEditRow(ev: TDSSafeAny, id: number) {
    const modal = this.modalService.create({
      title: 'Cập nhật trả lời nhanh',
      content: AutoChatAddDataModalComponent,
      viewContainerRef: this.viewContainerRef,
      size: 'lg',
      componentParams: {
        valueEditId: id
      }
    });
    modal.afterOpen.subscribe(() => {

    });
    // Return a result when closed
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData(this.pageSize, this.pageIndex);
      }
    })
  }

  onRemoveRow(key: number): void {
    this.modalService.error({
      title: 'Xóa trả lời nhanh',
      iconType: 'tdsi-trash-fill',
      content: 'Bạn có muốn xóa trả lời nhanh!',
      onOk: () => {
        this.quickReplyService.delete(key).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this.message.success('Xóa trả lời nhanh thành công!!');
          this.loadData(this.pageSize, this.pageIndex);
        },
          err => {
            this.message.error( err.error.message || 'Xóa trả lời nhanh thất bại!!');
          })
      },
      onCancel: () => {

      },
      okText: "Xác nhận",
      cancelText: "Hủy"
    });
  }
}
