import { Component, Input, OnInit, ViewContainerRef, ChangeDetectorRef } from '@angular/core';
import { NotificationItemDto } from '@app/dto/firebase/firebase-notification.dto';
import { FirebaseRegisterService } from '@app/services/firebase/firebase-register.service';
import { takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Router } from '@angular/router';
import { TDSModalService } from 'tds-ui/modal';
import { FirebaseNotificationDetailComponent } from '../firebase-notification-detail/firebase-notification-detail.component';

@Component({
  selector: 'firebase-notification-list',
  templateUrl: './firebase-notification-list.component.html',
  providers: [TDSDestroyService]
})
export class FirebaseNotificationListComponent implements OnInit {

  @Input() data!: NotificationItemDto[];

  isLoading: boolean = false;
  items!: NotificationItemDto[];
  cursor: any;

  constructor(
    private router: Router,
    private firebaseRegisterService: FirebaseRegisterService,
    private destroy$: TDSDestroyService,
    private modalService: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private cdRef : ChangeDetectorRef
    ) { }

  ngOnInit(): void { }

  onDetail(item : NotificationItemDto) {
    // this.firebaseRegisterService.makeRead(id).pipe(takeUntil(this.destroy$)).subscribe({
    //   next: (res: any) => {
    //   }
    // });
    const modal = this.modalService.create({
      content: FirebaseNotificationDetailComponent,
      viewContainerRef: this.viewContainerRef,
      footer: null,
      closable: false,
      centered: true,
      bodyStyle: {
        padding: '0px',
      },
      size: 'xl',
      componentParams: {
        data: item.id
      }
    });
    modal.afterClose.subscribe(() => {
      this.firebaseRegisterService.makeRead(item.id).pipe(takeUntil(this.destroy$)).subscribe();
      let index = this.data.findIndex(x => x.id == item.id);
      if(Number(index) >= 0) {
        this.data[index].dateRead = new Date();
        this.data[index] = {...this.data[index]};
        this.data = [...this.data];

        this.cdRef.detectChanges();
      }
    });

  }

}
