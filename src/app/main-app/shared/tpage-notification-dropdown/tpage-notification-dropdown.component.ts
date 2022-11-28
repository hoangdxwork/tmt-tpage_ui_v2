import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireBaseNotificationDto, NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';
import { NotificationGetMappingDTO, TPosAppMongoDBNotificationDTO } from '../../dto/notification/notification.dto';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'tpage-notification-dropdown',
  templateUrl: './tpage-notification-dropdown.component.html',
  styleUrls: ['./tpage-notification-dropdown.component.scss']
})
export class TpageNotificationDropdownComponent implements OnInit {

  visible = false;
  isLoading: boolean = false;

  items:  NotificationItemDto[] = []

  constructor(public router: Router,
    private notificationService: NotificationService,
    private firebaseRegisterService: FirebaseRegisterService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
  ) { }

  get getRead() {
    return this.items.find(x => !x.dateRead);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: FireBaseNotificationDto) => {
        this.items = [...data.items];
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  onDetail(item: any) {
    this.visible = false;
    this.firebaseRegisterService.makeRead(item?.id).pipe(takeUntil(this.destroy$)).subscribe();
    this.router.navigateByUrl(`user/firebase-notification?id=${item?.id}`);
  }

  onAll() {
    this.visible = false;
    this.router.navigateByUrl(`user/firebase-notification`);
  }

}
