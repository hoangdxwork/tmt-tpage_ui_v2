import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil } from 'rxjs';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'firebase-notification-detail',
  templateUrl: './firebase-notification-detail.component.html',
})
export class FirebaseNotificationDetailComponent implements OnInit {

  @Input() data!: any

  isLoading: boolean = false;

  constructor(
    private modal: TDSModalRef,
    private firebaseRegisterService: FirebaseRegisterService,
  ) { }

  ngOnInit(): void {
  }

  onBack() {
    // this.router.navigateByUrl(`user/firebase-notification`);
    this.modal.destroy(null);
  }

}
