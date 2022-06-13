import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drawer-message',
  templateUrl: './drawer-message.component.html'
})
export class DrawerMessageComponent implements OnInit {

  @Input() isOpenDrawer = false
  @Output() isCloseDrawer = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit(): void {
  }
  close(){
    this.isOpenDrawer = false
    this.isCloseDrawer.emit(false);
  }

}
