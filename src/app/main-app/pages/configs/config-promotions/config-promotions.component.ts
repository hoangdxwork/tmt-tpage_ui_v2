import { Router } from '@angular/router';
import { TDSSafeAny, TDSModalService, TDSHelperObject, TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { OdataSaleCouponProgramService } from 'src/app/main-app/services/mock-odata/odata-sale-coupon-program.service';
import { SaleCouponProgramDTO } from 'src/app/main-app/dto/configs/sale-coupon-program.dto';
import { SaleCouponProgramFilterObjDTO } from 'src/app/main-app/dto/odata/odata.dto';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { SortEnum } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SaleCouponProgramService } from 'src/app/main-app/services/sale-coupon-program.service';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'app-config-promotions',
  templateUrl: './config-promotions.component.html',
  styleUrls: ['./config-promotions.component.scss']
})
export class ConfigPromotionsComponent implements OnInit {
  dropdownList:Array<TDSSafeAny> = [
    {
      id:1,
      name:'Cập nhật không được tính khuyến mãi'
    },
    {
      id:2,
      name:'Mở hiệu lực'
    },
    {
      id:3,
      name:'Hết hiệu lực'
    },
  ];

  public filterObj: SaleCouponProgramFilterObjDTO = {
    programType: 'promotion_program',
    searchText: '',
  }

  TableData:Array<TDSSafeAny> = [];

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
  expandSet = new Set<number>();

  checked = false;
  indeterminate = false;
  loading = false;
  sort: Array<SortDataRequestDTO>= [{
      field: "DateCreated",
      dir: SortEnum.desc,
  }];

  lstData!: SaleCouponProgramDTO[];
  pageSize = 20;
  pageIndex = 1;
  count: number = 0;
  isLoading: boolean = false;

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private odataSaleCouponProgramService: OdataSaleCouponProgramService,
    private saleCouponProgramService: SaleCouponProgramService,
    private router:Router
  ) {
  }

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number){
    this.isLoading = true;
    let filters = this.odataSaleCouponProgramService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.odataSaleCouponProgramService.getView(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstData = res.value;
        this.isLoading = false;
    }, error => this.isLoading = false);
  }

  loadDetail(id: number) {
    let item = this.lstData.find(x => x.Id == id);

    if(item && !item?.Details) {
      this.saleCouponProgramService.getById(id).subscribe(res => {
        if(item) item.Details = res.Details;
      })
    }
  }

  addNewData(data:TDSSafeAny){
    this.router.navigate(['configs/promotions/create']);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
        this.setOfCheckedId.add(id);
    } else {
        this.setOfCheckedId.delete(id);
    }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly TDSSafeAny[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
      const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
      this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
      this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
      this.listOfCurrentPageData
          .filter(({ disabled }) => !disabled)
          .forEach(({ id }) => this.updateCheckedSet(id, checked));
      this.refreshCheckedStatus();
  }

  refreshData(){
    this.pageIndex = 1;

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
      searchText: '',
      programType: 'promotion_program',
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  sendRequestTableTab(): void {
      this.loading = true;
      const requestData = this.TableData.filter(data => this.setOfCheckedId.has(data.id));
      console.log(requestData);
      setTimeout(() => {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.loading = false;
      }, 1000);
  }

  showEditModal(id: number){
    this.router.navigateByUrl(`/configs/promotions/edit/${id}`);
  }

  showRemoveModal(id: number){
    const modal = this.modalService.error({
        title: 'Xác nhận xóa chương trình khuyến mãi',
        content: 'Bạn có chắc muốn xóa chương trình khuyến mãi?',
        iconType:'tdsi-trash-fill',
        okText:"Xác nhận",
        cancelText:"Hủy bỏ",
        onOk: ()=>{
          this.remove(id);
        },
        onCancel:()=>{
          modal.close();
        },
      })
  }

  onSearch(event: TDSSafeAny) {
    let text = event?.target.value;

    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

  remove(id: number) {
    this.isLoading = true;
    this.saleCouponProgramService.remove(id).subscribe(res => {
      this.message.success(Message.DeleteSuccess);
      this.refreshData();
    }, error => {
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
      this.isLoading = false;
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
      // this.loadDetail(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  onActive(item: TDSSafeAny) {
    if(item.id === 1) {
      this.updateNullValue();
    }
    else {
      let ids = [...this.setOfCheckedId];

      if(!ids || ids.length < 1) {
        this.message.error(Message.SelectOneLine);
        return;
      }

      let model = {
        Active: false,
        Ids: ids
      };

      if(item.id === 2) {
        model.Active = true;
        this.getSetActive(model);
      }
      else if(item.id === 3) {
        this.getSetActive(model);
      }
    }
  }

  getSetActive(data: TDSSafeAny) {
    this.saleCouponProgramService.setActive(JSON.stringify({model : data})).subscribe(res => {
      this.message.success(Message.ManipulationSuccessful);
      this.refreshData();
    }, error => {
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }

  updateNullValue() {
    this.saleCouponProgramService.updateNullValue().subscribe(res => {
      this.message.success(Message.ManipulationSuccessful);
    }, error => {
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }
}
