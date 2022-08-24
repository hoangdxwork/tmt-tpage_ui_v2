import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSModalService } from 'tds-ui/modal';
import { CRMTeamService } from './../../services/crm-team.service';
import { Router } from '@angular/router';
import { SocketEventSubjectDto } from './../../services/socket-io/socket-onevent.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'notification-event-socket',
  templateUrl: './notification-event-socket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})
export class NotificationEventSocketComponent implements OnInit {

  @Input() data!: SocketEventSubjectDto;
  @Output() isShowModal = new EventEmitter<string>();
  fristShow: boolean = false;

  constructor(private router: Router,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
  ) { }

  ngOnInit(): void {
  }

  getLink(data: SocketEventSubjectDto) {
    if (data && data.Notification && data.Notification?.Url) {
      if (data.Team && data.Team.Id) {
        this.router.navigateByUrl(data.Notification.Url);
        this.crmTeamService.onUpdateTeam(data.Team);
      } else {
        console.log('Không  tìm thấy teamId' + `, channelId: ${data.Data.Conversation.ChannelId}`);
      }
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