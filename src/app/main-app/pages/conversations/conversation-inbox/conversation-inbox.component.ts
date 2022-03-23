import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';

@Component({
  selector: 'app-conversation-inbox',
  templateUrl: './conversation-inbox.component.html',
  styleUrls: ['./conversation-inbox.component.scss']
})
export class ConversationInboxComponent extends TpageBaseComponent {

  constructor(public crmService: CRMTeamService, public activatedRoute: ActivatedRoute, public router: Router) {
    super(crmService, activatedRoute, router);
    this.type ="message"
  }

}
