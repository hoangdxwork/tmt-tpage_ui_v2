import { ProductVariantEditTableModalComponent } from './../product-variant-edit-table-modal/product-variant-edit-table-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject } from 'tmt-tang-ui';
import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'table-template-product-variant',
  templateUrl: './table-template-product-variant.component.html',
  styleUrls: ['./table-template-product-variant.component.scss']
})
export class TableTemplateProductVariantComponent implements OnInit {
  @Input() TableData:Array<TDSSafeAny> = [];

  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
 
  checked = false;
  indeterminate = false;
  loading = false;

  constructor(private modalService: TDSModalService, private viewContainerRef: ViewContainerRef) {}

  ngOnInit(): void {}

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
    let editData =  this.TableData[i];
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
