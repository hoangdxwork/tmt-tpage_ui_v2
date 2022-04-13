import { ConfigPromotionService } from './config-promotion.service';
import { TDSSafeAny, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-config-promotions',
  templateUrl: './config-promotions.component.html',
  styleUrls: ['./config-promotions.component.scss']
})
export class ConfigPromotionsComponent implements OnInit {
  dropdownList:Array<TDSSafeAny> = [];
  TableData:Array<TDSSafeAny> = [];

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
  expandSet = new Set<number>();
 
  checked = false;
  indeterminate = false;
  loading = false;
  currentComponentIndex = 1;

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef, private service: ConfigPromotionService) { 
    this.dropdownList = [
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
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.TableData = this.service.getTableData();
  }

  addNewData(data:TDSSafeAny){
    this.currentComponentIndex = 2;
  }

  getComponentIndex(i:number){
    this.currentComponentIndex = i;
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

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
        this.expandSet.add(id);
    } else {
        this.expandSet.delete(id);
    }
}
}
