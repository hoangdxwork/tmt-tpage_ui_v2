import { finalize } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationGetMappingDTO, TPosAppMongoDBNotificationDTO } from 'src/app/main-app/dto/notification/notification.dto';
import { NotificationService } from 'src/app/main-app/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'notification-list',
  templateUrl: './notification-list.component.html'
})
export class NotificationListComponent implements OnInit {

  @Input() isRead?: boolean | null = null;

  isLoading: boolean = false;

  lstData: TPosAppMongoDBNotificationDTO[] = [];
  pageSize = 10;
  pageIndex = 1;
  hasNextPage: boolean = true;

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadData(this.pageSize, this.pageIndex);
  }

  loadData(pageSize: number, pageIndex: number) {
    let model = this.prepareModel(pageSize, pageIndex);

    this.isLoading = true;
    this.notificationService.getMapping(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.hasNextPage = res.HasNextPage;
        this.lstData = [...this.lstData, ...res.Items];
      });
  }

  prepareModel(pageSize: number, pageIndex: number) {
    let model = {} as NotificationGetMappingDTO;

    model.Page = pageIndex;
    model.Limit = pageSize;
    model.IsRead = this.isRead;

    return model;
  }

  onNext() {
    this.pageIndex++;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onDetail(id: string) {
    this.router.navigateByUrl(`user/notification/${id}`);
  }

}
