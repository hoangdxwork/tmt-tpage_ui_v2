import { ProductTemplateDTO } from './../../../dto/product/product.dto';
import { OdataProductService } from './../../../services/mock-odata/odata-product.service';
import { CRMTeamService } from './../../../services/crm-team.service';
import { ProductVariantEditTableModalComponent } from './../components/product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { takeUntil } from 'rxjs/operators';
import { ODataProductTemplateDTO } from './../../../dto/configs/product/config-odata-product.dto';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSHelperString, TDSMessageService, TDSModalService, TDSHelperObject, TDSTableQueryParams } from 'tmt-tang-ui';
import { Component, OnInit, ViewEncapsulation, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-product-variant',
  templateUrl: './config-product-variant.component.html',
  styleUrls: ['./config-product-variant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigProductVariantComponent implements OnInit {
  listOfDataProductTemplateAll!: ODataProductTemplateDTO;
  dropdownList:Array<TDSSafeAny> = [];
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
  listOfDataTableProduct: ProductTemplateDTO[] = [];
  pageId!: string;
  pageName!: string;
  currentTeam: TDSSafeAny;
  isLoading = false;
  checked = false;
  indeterminate = false;
  selected!: number;
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  indClickTag: number = -1;
  private destroy$ = new Subject<void>();
  public filterObj: TDSSafeAny = {
    searchText: ''
  }

  constructor(
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private router:Router,
    private odataProductService : OdataProductService,
    private message: TDSMessageService,
    private teamService: CRMTeamService
    
    ) {
    this.dropdownList = [
      {
        id:1,
        name:'Xuất excel kiểm kho'
      },
      {
        id:2,
        name:'Mở hiệu lực'
      },
      {
        id:3,
        name:'Hết hiệu lực'
      },
      {
        id:4,
        name:'Thêm SP vào Page'
      },
    ];
  }

  ngOnInit(): void {
    
    this.teamService.onChangeTeam().subscribe(data => {
      if(data) {
        console.log(data)
        this.currentTeam = data;
        this.pageId = data.Facebook_PageId;
        this.pageName = data.Facebook_PageName;
        this.loadData(this.pageSize,this.pageIndex, this.pageId);
      }
    });
  }

  

  loadData(pageSize: number, pageIndex: number, pageId?: string){
    this.isLoading = true;
    let filters = this.odataProductService.buildFilter(this.filterObj);  
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters)
    console.log(params)
    if(pageId){
      this.odataProductService.getProductOnFacebookPage(params, pageId).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductTemplateDTO) => {
        this.listOfDataTableProduct = res.value
        this.count = res['@odata.count'] as number
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.message.error(error.error.message ?? 'Tải dữ liệu thất bại!');
      });
    }else{
      this.odataProductService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductTemplateDTO) => {
        this.listOfDataTableProduct = res.value
        this.count = res['@odata.count'] as number
        this.isLoading = false;
      }, error => {
        this.isLoading = false;
        this.message.error(error.error.message ?? 'Tải dữ liệu thất bại!');
      });
    }
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData(params.pageSize, params.pageIndex);
  }

  applyFilter(event: TDSSafeAny) {
    this.pageIndex = 1;
    this.pageSize = 20;

    let keyFilter = event.target.value as string
    this.filterObj = {
      searchText:  TDSHelperString.stripSpecialChars(keyFilter.trim())
    }
    this.loadData(this.pageSize, this.pageIndex);
  }

  onSelectChange(value : number){
    this.pageIndex = 1;
    this.indClickTag = -1;
    if(value==0){
      this.loadData(this.pageSize, this.pageIndex);
    }
    if(value==1){
      this.loadData(this.pageSize, this.pageIndex, this.pageId);
    }

    
  }
  
  addNewData(data:TDSSafeAny){
    this.router.navigate(['/configs/product-variant/create']);
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
  console.log(this.listOfCurrentPageData)
}

sendRequestTableTab(): void {
  this.isLoading = true;
  const requestData = this.listOfDataTableProduct.filter(data => this.setOfCheckedId.has(data.Id));
  console.log(requestData);
  setTimeout(() => {
      this.setOfCheckedId.clear();
      this.refreshCheckedStatus();
      this.isLoading = false;
  }, 1000);
}

showEditModal(i:number){
let editData =  this.listOfDataTableProduct[i];
const modal = this.modalService.create({
  title: 'Cập nhật biến thể sản phẩm',
  content: ProductVariantEditTableModalComponent,
  viewContainerRef: this.viewContainerRef,
  componentParams: {
    data: editData
  }
});
modal.afterOpen.subscribe(() => {

});
//receive result from modal after close modal
modal.afterClose.subscribe(result => {
    if (TDSHelperObject.hasValue(result)) {
      //get new changed value here
    }
});
}

showRemoveModal(i:number){
const modal = this.modalService.error({
    title: 'Xác nhận xóa biến thể sản phẩm',
    content: 'Bạn có chắc muốn xóa biến thể sản phẩm này không?',
    iconType:'tdsi-trash-fill',
    okText:"Xác nhận",
    cancelText:"Hủy bỏ",
    onOk: ()=>{
      //remove item here

    },
    onCancel:()=>{
      modal.close();
    },
  })
}
}