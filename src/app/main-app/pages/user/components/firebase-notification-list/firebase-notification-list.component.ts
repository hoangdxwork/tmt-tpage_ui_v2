import { Component, Input, OnInit } from '@angular/core';
import { FireBaseNotificationDto, NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil, pipe } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { Router } from '@angular/router';

@Component({
  selector: 'firebase-notification-list',
  templateUrl: './firebase-notification-list.component.html',
  providers: [TDSDestroyService]
})
export class FirebaseNotificationListComponent implements OnInit {

  @Input() isRead!: boolean

  isLoading: boolean = false;
  items!: NotificationItemDto[];
  cursor: any;

  constructor(
    private router: Router,
    private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: FireBaseNotificationDto) => {
        this.items = [...(this.items || []), ...data.items];
        this.cursor = data.cursor;
        if (this.isRead == false) {
          this.items = this.items.filter(a => a.dateRead == null)
        }
        console.log(this.items);
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

  onDetail(id: string) {
    this.firebaseRegisterService.makeRead(id).pipe(takeUntil(this.destroy$)).subscribe();
    this.router.navigateByUrl(`user/firebase-notification/${id}`);
  }

}
