import { Component, OnInit } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-shares-detail-modal',
  templateUrl: './shares-detail-modal.component.html'
})
export class SharesDetailModalComponent implements OnInit {

  listOfData: any[] = [];

  constructor(
    private modal: TDSModalRef,
  ) { }

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
        data.push({
            numerical: `${i + 1}`,
            id: `[KH9909]`,
            name: `HUi ${i}`,
            send: 200,
            share: 8,
            total: 24,
        });
    }
    this.listOfData = data;
  }

  onCancel() {
    this.modal.destroy(null);
  }

}
