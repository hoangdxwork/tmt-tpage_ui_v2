import { TDSModalService } from 'tmt-tang-ui';
import { TDSMessageService } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { TDSHelperArray } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamDTO, TPosAppMongoDBFacebookDTO } from 'src/app/main-app/dto/team/team.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { ListChannelConnectComponent } from '../components/list-channel-connect/list-channel-connect.component';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  lstChannelChatbot: TPosAppMongoDBFacebookDTO[] = [];
  isLoading: boolean = false;
  lstPage: CRMTeamDTO[] = [];

  constructor(
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.loadChannelChatbot();
  }

  loadChannelChatbot() {
    this.isLoading = true;
    this.crmTeamService.onChangeListFaceBook().subscribe(res => {
      let childs = this.getChilds(res?.Items);
      let pageIds = childs.map(x => x.Facebook_PageId);

      if(TDSHelperArray.hasListValue(pageIds) && pageIds?.length) {
        this.crmTeamService.getChannelChatbot(pageIds)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(res => {
            this.lstChannelChatbot = res;
          }, error => {
            this.message.error(`${error?.error?.message}` || JSON.stringify(error));
          });
      }
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

  changeEnableChatbot(channel: TPosAppMongoDBFacebookDTO) {
    let isEnableChatbot = channel.IsEnableChatbot;

    if(isEnableChatbot) {
      this.offChatbot(channel);
    }
    else {
      this.onChatbot(channel);
    }
  }

  offChatbot(item: any) {
    this.crmTeamService.offChatbot(item.FacebookId).subscribe(res => {
      this.message.success(Message.Chatbot.OffChatbotSuccess);
      item.IsEnableChatbot = false;
    }, error => {
      this.message.error(`${error?.error?.message}` || JSON.stringify(error));
    });
  }

  onChatbot(item: any) {
    this.crmTeamService.onChatbot(item.FacebookId).subscribe(res => {
      this.message.success(Message.Chatbot.OnChatbotSuccess);
      item.IsEnableChatbot = true;
    }, error => {
      this.message.error(`${error?.error?.message}` || JSON.stringify(error));
    });
  }

  showModalConnectChatbot() {
    let idConnect = this.lstChannelChatbot.map(x => x.FacebookId);
    const modal = this.modal.create({
      title: 'Kết nối kênh',
      content: ListChannelConnectComponent,
      size: 'xl',
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        idConnect : idConnect
      }
    });

    modal.componentInstance?.onCreateSuccess.subscribe(res => {
      this.loadChannelChatbot();
    })
  }

}
