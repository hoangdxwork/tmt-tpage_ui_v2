import { addDays } from 'date-fns/esm';
import { Component, OnInit } from '@angular/core';
import { SaleOnline_OrderDTO } from 'src/app/main-app/dto/saleonlineorder/sale-online-order.dto';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperObject, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { ColumnTableDTO } from 'src/app/main-app/dto/common/table.dto';
import { SortEnum } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  public filterObj: TDSSafeAny = {
    tags: [],
    status: '',
    bill: null,
    deliveryType: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    {value: 'Code', name: 'Code', isChecked: true},
    { value: 'Name', name: 'Tên', isChecked: true },
    { value: 'CRMTeamName', name: 'Kênh kết nối', isChecked: true },
    { value: 'Address', name: 'Địa chỉ', isChecked: false },
    { value: 'TotalAmount', name: 'Tổng tiền', isChecked: true },
    { value: 'TotalQuantity', name: 'Tổng SL', isChecked: true },
    { value: 'StatusText', name: 'Trạng thái', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: false }
  ];

  public tabNavs: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];

  sort: Array<SortDataRequestDTO>= [{
    field: "DateInvoice",
    dir: SortEnum.desc,
  }];


  public lstDataTag: Array<TDSSafeAny> = [];

  //////////////////////

  listSelectedTag = [
    { id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },
  ];

  tabsOrder = [
    {
      id: 0,
      name: 'Tất cả',
      count: 99,
      content: [

      ]
    },
    {
      id: 1,
      name: 'Thân thiết',
      count: 85,
      content: "Content of Tab Pane 2"
    },
    {
      id: 2,
      name: 'Bình thường',
      count: 80,
      content: "Content of Tab Pane 3"
    },
    {
      id: 3,
      name: 'Khách vip',
      count: 80,
      content: "Content of Tab Pane 3"
    },
    {
      id: 4,
      name: 'Bom hàng',
      count: 80,
      content: "Content of Tab Pane 3"
    }
  ];

  expandSet = new Set<string>();

  constructor(private saleOnline_OrderService: SaleOnline_OrderService) { }

  isOpenMessageFacebook = false;
  indClickTag = "";

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly SaleOnline_OrderDTO[] = [];
  listOfData: readonly SaleOnline_OrderDTO[] = [];
  setOfCheckedId = new Set<string>();

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
    console.log(this.setOfCheckedId)
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  ngOnInit(): void {
    this.getView();
  }

  loadData() {
    this.isLoading = true;
    let filters = this.odataFastSaleOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.odataFastSaleOrderService.getView(params, this.filterObj).subscribe((res: TDSSafeAny) => {

        this.count = res['@odata.count'] as number //260
        this.lstOfData = res.value;
        this.isLoading = false;
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showModelCreateInvoiceFast() {

  }

  showModelCreateOrderDefault() {

  }

  onCreateInvoice() {

  }

  onCurrentPageDataChange($event: readonly SaleOnline_OrderDTO[]): void {

  }

  getView() {
    this.saleOnline_OrderService.getView().subscribe(res => {

      this.listOfData = res.value;

      console.log("Order get view: ", this.listOfData);

    });
  }

  // Add tag
  addTag(id: string) {
    this.indClickTag = id;
  }

  close(): void {
    this.indClickTag = "";
    this.listSelectedTag = [{ id: 1, name: 'Tag1' },
    { id: 2, name: 'Tag2' },]
  }

  apply(): void {
    this.listSelectedTag.forEach(element => {
      // this.listOfData[this.listOfData.findIndex(x => x.id == this.indClickTag)].tags.push(element.name)
    });

    this.indClickTag = "";

    this.listSelectedTag = [
      { id: 1, name: 'Tag1' },
      { id: 2, name: 'Tag2' },];
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }

  // modal edit order
  showModalEditOrder(id: string){
    // const modal = this.modalService.create({
    //   title: 'Sửa Khách hàng',
    //   content: ModalEditPartnerComponent,
    //   size: "xl",
    //   viewContainerRef: this.viewContainerRef,
    //   centered: true,
    //   componentParams: {
    //     data: this.listOfData.find(x=>x.id == id)
    // }
    // });
    // modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    // modal.afterClose.subscribe(result => {
    //   console.log('[afterClose] The result is:', result);
    //   if (TDSHelperObject.hasValue(result)) {

    //   }
    // });
  }


}
