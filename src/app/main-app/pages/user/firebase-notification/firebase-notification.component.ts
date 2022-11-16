import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxVirtualScrollerDto } from '@app/dto/conversation-all/ngx-scroll/ngx-virtual-scroll.dto';
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
  @ViewChild('tabContent') TabContent!: TemplateRef<{}>;

  data!: NotificationItemDto[];
  dataDetail!: any;
  isRead!: NotificationItemDto[];
  cursor: any;
  isDetail: boolean = false
  isLoadingProduct: boolean = false;
  isLoadingNextdata: boolean = false;


  constructor(
    private firebaseRegisterService: FirebaseRegisterService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(params?: any) {debugger
    this.isLoadingNextdata = true;
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.data = [...res.items];
            this.isRead = this.data.filter((a : any) => a.dateRead == null);
            this.cursor = res.cursor;

            this.onDetail(this.data[0]);

            this.isLoadingNextdata = false;
        },
        error: (err: any) => {
          this.isLoadingNextdata = false;
          this.message.error(`${err?.error?.message}`);
        }
    })
  }

  onBack() {
    this.isDetail = false
  }

  onDetail(item : any) {
    this.dataDetail = item
  }

  vsEnd(event: NgxVirtualScrollerDto) {
    if(this.isLoadingProduct || this.isLoadingNextdata) {
        return;
    }

    let exisData = this.data && this.data.length > 0 && event && event.scrollStartPosition > 0;
    if(exisData) {
      const vsEnd = Number(this.data.length - 1) == Number(event.endIndex);
      if(vsEnd) {
          this.nextData();
      }
    }
  }

  nextData() {
    if (this.cursor) {
      this.isLoadingNextdata = true;
      this.firebaseRegisterService.notifications(this.cursor).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
              this.data = [...(this.data || []), ...res.items];
              this.isRead = this.data.filter((a : any) => a.dateRead == null);
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

}
