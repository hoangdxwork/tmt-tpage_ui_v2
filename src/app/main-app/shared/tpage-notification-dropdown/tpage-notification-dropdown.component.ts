import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
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

  lstData: TPosAppMongoDBNotificationDTO[] = [];
  pageSize = 10;
  pageIndex = 1;
  hasNextPage: boolean = true;

  constructor(
    public router: Router,
    private notificationService: NotificationService
  ) { }

  get getRead() {
    return this.lstData.find(x => !x.DateRead);
  }

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
        console.log(this.lstData);
      });
  }

  prepareModel(pageSize: number, pageIndex: number) {
    let model = {} as NotificationGetMappingDTO;

    model.Page = pageIndex;
    model.Limit = pageSize;
    model.IsRead = undefined;

    return model;
  }

  onNext() {
    this.pageIndex++;
    this.loadData(this.pageSize, this.pageIndex);
  }

  onDetail(id: string) {
    this.visible = false;
    this.router.navigateByUrl(`user/notification/${id}`);
  }

  onAll() {
    this.visible = false;
    this.router.navigateByUrl(`user/notification`);
  }

}
