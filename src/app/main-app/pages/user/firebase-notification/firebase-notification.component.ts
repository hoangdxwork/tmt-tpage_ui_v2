import { Component, OnInit } from '@angular/core';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil, pipe } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'firebase-notification',
  templateUrl: './firebase-notification.component.html',
  providers: [TDSDestroyService]
})
export class FirebaseNotificationComponent implements OnInit {

  data: any;

  constructor(private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.firebaseRegisterService.notifications().pipe(takeUntil(this.destroy$)).subscribe({
        next: (data: any) => {
            this.data = data;
            console.log(this.data);
        },
        error: (err: any) => {
            this.message.error(err?.error?.message);
        }
    })
  }

}
