import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-socket-notification',
  templateUrl: './socket-notification.component.html',
})
export class SocketNotificationComponent implements OnInit {

  isLoading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
