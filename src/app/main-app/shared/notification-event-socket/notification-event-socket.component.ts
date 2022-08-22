import { CRMTeamService } from './../../services/crm-team.service';
import { Router } from '@angular/router';
import { SocketEventSubjectDto } from './../../services/socket-io/socket-onevent.service';
import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'notification-event-socket',
  templateUrl: './notification-event-socket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationEventSocketComponent implements OnInit {

  @Input() data!: SocketEventSubjectDto;

  constructor(
    private router: Router,
    private crmTeamService: CRMTeamService
  ) { }

  ngOnInit(): void {
  }

  getLink(data: SocketEventSubjectDto) {
    if(data && data.Notification && data.Notification.Url) {
        this.router.navigateByUrl(data.Notification.Url);
        this.crmTeamService.onUpdateTeam(data.Team);
    }
  }

}
