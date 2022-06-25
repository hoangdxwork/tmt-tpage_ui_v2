import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-manual-update-delivery',
  templateUrl: './modal-manual-update-delivery.component.html'
})
export class ModalManualUpdateDeliveryComponent implements OnInit {
  @Input() listOfData:any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  onCancel(){

  }

  onSave(){

  }
}
