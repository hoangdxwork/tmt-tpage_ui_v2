import { TDSMessageService } from 'tds-ui/message';
import { CRMTeamService } from './../../services/crm-team.service';
import { Router } from '@angular/router';
import { SocketEventSubjectDto } from './../../services/socket-io/socket-onevent.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';

@Component({
  selector: 'notification-event-socket',
  templateUrl: './notification-event-socket.component.html',
  styleUrls : ['./notification-event-socket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotificationEventSocketComponent implements OnInit {

  @Input() data!: SocketEventSubjectDto;
  @Output() isShowModal = new EventEmitter<string>();

  fristShow: boolean = false;

  constructor(private router: Router,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService) {
  }

  ngOnInit(): void {
  }

  getLink(data: SocketEventSubjectDto) {
    let exist = data && data.Notification && data.Notification?.Url && (data.EventName != ChatmoniSocketEventName.chatomniMarkseen);
    if (exist && data.Team && data.Team?.Id) {
        this.router.navigateByUrl(data.Notification.Url);
        this.crmTeamService.onUpdateTeam(data.Team);
    }
  }

  showModalEditOrder(data: SocketEventSubjectDto) {
    if(this.fristShow){
      return
    }

    if (data && data.Data && data.Data.Data && data.Data.Data.Id) {
        this.isShowModal.emit(data.Data.Data.Id)
        this.fristShow = true;
    } else {
        this.message.error("Không tìm thấy đơn hàng");
    }

  }
}
