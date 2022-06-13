import { finalize } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/main-app/services/notification.service';
import { TPosAppMongoDBNotificationDTO } from 'src/app/main-app/dto/notification/notification.dto';

@Component({
  selector: 'notification-detail',
  templateUrl: './notification-detail.component.html'
})
export class NotificationDetailComponent implements OnInit {

  notificationId?: string | null;
  data!: TPosAppMongoDBNotificationDTO;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.notificationId = this.route.snapshot.paramMap.get("id");
      if(this.notificationId) {
        this.loadData(this.notificationId);
      }
    });

  }

  loadData(id: string) {
    this.isLoading = true;
    this.notificationService.getById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.data = res;
      });
  }

  onBack() {
    this.router.navigateByUrl(`user/notification`);
  }

}
