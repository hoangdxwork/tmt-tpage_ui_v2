import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
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

  data:  NotificationItemDto[] = []

  cursor: any;
  isLoadingProduct: boolean = false;
  isLoadingNextdata: boolean = false;

  constructor(public router: Router,
    private notificationService: NotificationService,
    private firebaseRegisterService: FirebaseRegisterService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
  ) { }

  get getRead() {
    return this.data.find(x => !x.dateRead);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: FireBaseNotificationDto) => {
        this.data = [...res.items];
        this.cursor = res.cursor;
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  onDetail(item: any) {
    this.visible = false;
    if(item.dateRead == null) {
      this.makeRead(item);
    }
    this.router.navigateByUrl(`user/firebase-notification?id=${item?.id}`);
  }

  makeRead(item: any) {
    this.firebaseRegisterService.makeRead(item?.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        let index = this.data.findIndex(x => x.id === item.id);
        if(index >= 0) {
          this.data[index].dateRead = new Date()
        }
      }
    });
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    if (this.isLoadingProduct || this.isLoadingNextdata) {
      return;
    }

    let exisData = this.data && this.data.length > 0 && event && event.scrollStartPosition > 0;
    if (exisData) {
      const vsEnd = Number(this.data.length - 1) == Number(event.endIndex);
      if (vsEnd) {
        this.isLoadingNextdata = true;
        setTimeout(() => {
          this.nextData();
          this.isLoadingNextdata = false;
        }, 350)
      }
    }
  }

  nextData() {
    if (this.cursor) {
      this.firebaseRegisterService.notifications(this.cursor).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.data = [...(this.data || []), ...res.items];
          this.cursor = res.cursor;
          this.isLoadingNextdata = false;
        },
        error: (err: any) => {
          this.isLoadingNextdata = false;
          this.message.error(`${err?.error?.message}`);
        }
      })
    }
  }

  onAll() {
    this.visible = false;
    this.router.navigateByUrl(`user/firebase-notification`);
  }

}
