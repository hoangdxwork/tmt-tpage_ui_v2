import { TDSModalRef } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
interface infoBrithdayPartner {
  id: number;
  namePartner: string;
  phone: string;
  address: string;
  birthday: string;
}
@Component({
  selector: 'app-modal-birthday-partner',
  templateUrl: './modal-birthday-partner.component.html',
  styleUrls: ['./modal-birthday-partner.component.scss']
})
export class ModalBirthdayPartnerComponent implements OnInit {

  constructor(    private modal: TDSModalRef,
    ) { }
    checked = false;
    indeterminate = false;
    listOfCurrentPageData: readonly infoBrithdayPartner[] = [];
    listOfData: readonly infoBrithdayPartner[] = [];
    setOfCheckedId = new Set<number>();

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }

    onAllChecked(value: boolean): void {
        this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
        this.refreshCheckedStatus();
    }

    onCurrentPageDataChange($event: readonly infoBrithdayPartner[]): void {
        this.listOfCurrentPageData = $event;
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
        this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }

    ngOnInit(): void {
        this.listOfData =[
          {id:0, namePartner: 'Phạm Nhi', phone:'0901234567', address:'172 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh', birthday:'19/09/1998'},
          {id:1, namePartner: 'Hoàng Minh', phone:'0903017371', address:'172 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh', birthday:'19/09/1998'},
          {id:2, namePartner: 'Hoàng Hải', phone:'0901737103', address:'371 Nguyễn Kiệm, Phường 3, Quận Gò Vấp, Thành phố Hồ Chí Minh', birthday:'19/09/1998'},

        ]
    }
  cancel() {
    this.modal.destroy(null);
  }

}
