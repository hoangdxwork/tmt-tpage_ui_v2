import { FormGroup, FormBuilder } from '@angular/forms';
import { SortEnum } from './../../../../lib/enum/sort.enum';
import { SortDataRequestDTO } from './../../../../lib/dto/dataRequest.dto';
import { QuickReplyService } from './../../../services/quick-reply.service';
import { QuickReplyDTO } from './../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { Subject } from 'rxjs';
import { OdataQuickReplyService } from './../../../services/mock-odata/odata-quick-reply.service';
import { AutoChatAddDataModalComponent } from '../components/auto-chat-add-data-modal/auto-chat-add-data-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject, TDSMessageService, TDSTableQueryParams, TDSHelperString } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ODataQuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';

@Component({
  selector: 'app-config-auto-chat',
  templateUrl: './config-auto-chat.component.html',
  styleUrls: ['./config-auto-chat.component.scss']
})
export class ConfigAutoChatComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    // this.loadData(this.pageSize, this.pageIndex);
  }



  loadData(pageSize: number, pageIndex: number) {
    this.isLoading = true;
    let filters = this.odataQuickReplyService.buildFilter(this.filterObj);  
    let params = TDSHelperString.hasValueString(this.filterObj.searchText)?
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters):
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataQuickReplyService.get(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataQuickReplyDTO) => {
      this.AutoChatList = res.value
      this.count = res['@odata.count'] as number
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.message.error('Tải dữ liệu thất bại!');
    });

  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
    this.pageIndex = params.pageIndex;
  }

  refreshData() {
    this.pageIndex = 1;

  }

  selectOrderDefault(key: number) {
    this.quickReplyService.updateDefaultForOrder(key).subscribe((res: any) => {
      this.message.success("Thay đổi Templates đơn hàng thành công!");
      this.loadData(this.pageSize, this.pageIndex);
    });
  }

  selectBillDefault(key: number) {
    this.quickReplyService.updateDefaultForBill(key).subscribe((res: any) => {
      this.message.success("Thay đổi Templates hóa đơn thành công!");
      this.loadData(this.pageSize, this.pageIndex);
    });
  }



  applyFilter(event: TDSSafeAny) {
    this.tabIndex = null;
    this.pageIndex = 1;
    this.pageSize = 20;

    let keyFilter = event.target.value as string
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
    this.quickReplyService.updateStatus(key).subscribe((res) => {

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
            this.message.success('Xóa trả lời nhanh thất bại!!');
          })
      },
      onCancel: () => {

      },
      okText: "Xác nhận",
      cancelText: "Hủy"
    });
  }
}
