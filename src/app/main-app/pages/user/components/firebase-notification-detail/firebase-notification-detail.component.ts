import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSMessageService } from 'tds-ui/message';

@Component({
  selector: 'firebase-notification-detail',
  templateUrl: './firebase-notification-detail.component.html',
})
export class FirebaseNotificationDetailComponent implements OnInit {

  data!: NotificationItemDto[];
  firebaseId: any;
  detailItem!: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firebaseRegisterService: FirebaseRegisterService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.firebaseId = this.route.snapshot.paramMap.get("id");
      if (this.firebaseId) {
        this.loadData();
      }
    });
  }

  loadData(params?: any) {
    this.firebaseRegisterService.notifications(params).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.data = res.items;
        this.detailItem = this.data.filter((a: any) => a.id == this.firebaseId)[0]

        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

}
