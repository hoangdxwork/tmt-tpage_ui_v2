import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'firebase-notification-detail',
  templateUrl: './firebase-notification-detail.component.html',
})
export class FirebaseNotificationDetailComponent implements OnInit {

  isLoading: boolean = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  onBack() {
    this.router.navigateByUrl(`user/firebase-notification`);
  }

}
