import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../../lib/services/helper-data.service';
import { OdataProductTemplateService } from './../../../../services/mock-odata/odata-product-template.service';
import { Subject } from 'rxjs';
import { ConfigProductTemplateDTO } from './../../../../dto/configs/product/config-product.dto';
import { ODataProductTemplateDTO } from './../../../../dto/configs/product/config-odata-product.dto';
import { ProductVariantEditTableModalComponent } from '../product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { Component, OnInit, Input, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'table-template-product-variant',
  templateUrl: './table-template-product-variant.component.html',
  styleUrls: ['./table-template-product-variant.component.scss']
})
export class TableTemplateProductVariantComponent implements OnInit, OnChanges {

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
  listOfDataTableAll: ConfigProductTemplateDTO[] = [];
  isLoading = false;
  pageSize: number = 20;
  pageIndex: number = 1;
  count: number = 0;
  private destroy$ = new Subject<void>();
  public filterObj: TDSSafeAny = {
    searchText: ''
  }
 
  checked = false;
  indeterminate = false;
  loading = false;
  
  


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes.listOfDataProductTemplate.currentValue['@odata.count'])
    
  }

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef,
    private odataProductTemplateService : OdataProductTemplateService,
    private message: TDSMessageService) {}

  ngOnInit(): void {
    this.loadData
  }

  loadData(pageSize: number, pageIndex: number){

    this.isLoading = true;
    let filters = this.odataProductTemplateService.buildFilter(this.filterObj);  
    let params = TDSHelperString.hasValueString(this.filterObj.searchText)?
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters):
        THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
    this.odataProductTemplateService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataProductTemplateDTO) => {
      this.listOfDataTableAll = res.value
      this.count = res['@odata.count'] as number
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.message.error('Tải dữ liệu thất bại!');
    });
  ;}

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

  sendRequestTableTab(): void {
      this.loading = true;
      const requestData = this.listOfDataTableAll.filter(data => this.setOfCheckedId.has(data.Id));
      console.log(requestData);
      setTimeout(() => {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.loading = false;
      }, 1000);
  }

  showEditModal(i:number){
    let editData =  this.listOfDataTableAll[i];
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
