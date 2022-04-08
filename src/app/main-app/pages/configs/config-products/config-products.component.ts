import { TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-products',
  templateUrl: './config-products.component.html',
  styleUrls: ['./config-products.component.scss']
})
export class ConfigProductsComponent implements OnInit {
  TableData:Array<TDSSafeAny> = [];
  dropdownList:Array<TDSSafeAny> = [];
  
  expandSet = new Set<number>();
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
 
  checked = false;
  indeterminate = false;
  loading = false;
  pageSize = 20;
  pageIndex = 1;

  configTags:Array<TDSSafeAny> = [];
  configTagList:Array<TDSSafeAny> = [];
  clickingTag = -1;

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef) { 
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
  }

  loadData() {
    this.TableData = [

    ]
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

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openTag(id: number, data: TDSSafeAny) {
    this.configTags = [];
    this.clickingTag = id;
    this.configTagList = JSON.parse(data);
  }

  assignTags(id: number, tags: Array<TDSSafeAny>){

  }

  closeTag() {
    this.clickingTag = -1;
  }

  addNewData(data:TDSSafeAny){
    
  }

  refreshData(){

  }

  showEditModal(i:number){
    
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
