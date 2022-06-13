
import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TDSModalRef, TDSModalService } from 'tds-ui/modal';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { ConnectChatbotComponent } from '../connect-chatbot/connect-chatbot.component';

@Component({
  selector: 'list-channel-connect',
  templateUrl: './list-channel-connect.component.html',
  styleUrls: ['./list-channel-connect.component.scss']
})
export class ListChannelConnectComponent implements OnInit {

  @Input() idConnect: string[] = [];

  @Output() onCreateSuccess = new EventEmitter<CRMTeamDTO | null>();

  isLoading: boolean = false;
  lstChannel: CRMTeamDTO[] = [];

  constructor(
    private modelRef: TDSModalRef,
    private crmTeamService: CRMTeamService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.loadChannel();
  }

  loadChannel() {
    this.crmTeamService.onChangeListFaceBook()
      .subscribe(res => {
        let childs = this.getChilds(res?.Items);

        childs = childs.filter(x => !this.idConnect.includes(x.Facebook_PageId));
        this.lstChannel = childs;
      });
  }

  getChilds(teams: Array<CRMTeamDTO> | undefined) {
    let childs: CRMTeamDTO[] = [];

    if(TDSHelperArray.hasListValue(teams) && teams?.length) {
      teams.forEach(team => {
        let childActive = team?.Childs.filter(x => x.Active);
        if(TDSHelperArray.hasListValue(childActive) && childActive?.length) {
          childs = [...childs, ...childActive];
        }
      });
    }

    return childs;
  }

  showModalConnectChatbot(channel: CRMTeamDTO) {
    const modal = this.modal.create({
      title: 'Kết nối Chatbot',
      content: ConnectChatbotComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        channel : channel
      }
    });

    modal.componentInstance?.onCreateSuccess.subscribe(res => {
      res && this.idConnect.push(res?.Facebook_PageId);
      this.loadChannel();
      this.onCreateSuccess.emit(res);
    });
  }

  onCancel() {
    this.modelRef.destroy();
  }

}
