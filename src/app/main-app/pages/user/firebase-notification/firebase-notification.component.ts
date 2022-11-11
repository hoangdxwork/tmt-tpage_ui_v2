import { Component, OnInit } from '@angular/core';
import { NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'firebase-notification',
  templateUrl: './firebase-notification.component.html'
})
export class FirebaseNotificationComponent implements OnInit {

  data!: NotificationItemDto[];
  isRead!: NotificationItemDto[];
  cursor: any;
  isDetail: boolean = false

  constructor(
    private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.data = [...(this.data || []), ...res.items];
            this.isRead = this.data.filter((a : any) => a.dateRead == null);
            this.cursor = res.cursor;
            console.log(this.data);
            console.log(this.isRead);

        },
        error: (err: any) => {
            this.message.error(err?.error?.message);
        }
    })
  }

  onNext() {
    if (this.cursor) {
      this.loadData(this.cursor)
    }
  }

  onBack() {
    this.isDetail = false
  }

  onDetail(id : any) {
    this.isDetail = true
  }

}
