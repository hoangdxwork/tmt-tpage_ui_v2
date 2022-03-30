import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookGraphMessageDTO } from 'src/app/main-app/dto/conversation/message.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TpageBaseComponent } from 'src/app/main-app/shared/tpage-base/tpage-base.component';
import { TDSSafeAny } from 'tmt-tang-ui';

@Component({
  selector: 'app-conversation-all',
  templateUrl: './conversation-all.component.html',
  styleUrls: ['./conversation-all.component.scss']
})
export class ConversationAllComponent extends TpageBaseComponent {
  // select Page QAXK Nhiên Trung
  public contact:number = 1;
  public contactOptions = [
      { id: 1, name: 'Page QAXK Nhiên Trung' },
      { id: 2, name: 'Elvis Presley' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }
  ]
  // search
  inputValue?: string;

  listData: Array<TDSSafeAny> = []
  constructor(public crmService: CRMTeamService, public activatedRoute: ActivatedRoute, public router: Router) {
    super(crmService, activatedRoute, router);
    this.type ="all"
  }
  onInit(): void {
    console.log("onInit")
    this.listData = this.getData();
  }
  getData() {
    return [
      {
        "id": "tpos_e97e79e6-f649-45c7-ad73-2d6f2bd5b147",
        "from_id": "4457015097690900",
        "object_id": null,
        "is_admin": true,
        "message_formatted": "Xin chào Thuý Vy Nguyễn, đơn hàng có mã 220100027 đã được cập nhật. 123\nXuân\n",
        "comment": null,
        "message": null,
        "type": 3,
        "nlps": [],
        "error_message": "(#10901) Activity replying time expired",
        "DateCreated": "2022-01-12T09:48:10.293Z",
        "LastUpdated": "2022-01-12T09:48:15.018Z",
        "IsCompleted": true,
        "DateProcessed": "2022-01-12T09:48:15.018Z",
        "CreatedBy": null
      },
      {
        "id": "tpos_f9f9bcfd-e1f4-4ed2-9a13-d7183ebc0c37",
        "from_id": "4457015097690900",
        "object_id": null,
        "is_admin": true,
        "message_formatted": "Xin chào Thuý Vy Nguyễn, đơn hàng có mã 220100027 đã được cập nhật. 123\nXuân\n",
        "comment": null,
        "message": null,
        "type": 3,
        "nlps": [],
        "error_message": "(#10901) Activity replying time expired",
        "DateCreated": "2022-01-12T03:41:11.48Z",
        "LastUpdated": "2022-01-12T03:41:11.98Z",
        "IsCompleted": true,
        "DateProcessed": "2022-01-12T03:41:11.98Z",
        "CreatedBy": null
      },
      {
        "id": "tpos_85060c9f-af4b-4bb8-9919-9ee0a3cab576",
        "from_id": "4457015097690900",
        "object_id": null,
        "is_admin": true,
        "message_formatted": "Xin chào Thuý Vy Nguyễn, đơn hàng có mã 211200022 đã được cập nhật.\nXuân\n",
        "comment": null,
        "message": null,
        "type": 3,
        "nlps": [],
        "error_message": "(#10901) Activity replying time expired",
        "DateCreated": "2021-12-17T03:55:11.615Z",
        "LastUpdated": "2021-12-17T03:55:11.99Z",
        "IsCompleted": true,
        "DateProcessed": "2021-12-17T03:55:11.99Z",
        "CreatedBy": null
      },
      {
        "id": "tpos_74da476f-3d03-4c50-b6f1-1f87484d9f62",
        "from_id": "4457015097690900",
        "object_id": null,
        "is_admin": true,
        "message_formatted": "Xin chào Thuý Vy Nguyễn, đơn hàng có mã 211200022 đã được cập nhật.\nXuân\n",
        "comment": null,
        "message": null,
        "type": 3,
        "nlps": [],
        "error_message": "(#10901) Activity replying time expired",
        "DateCreated": "2021-12-17T03:33:42.196Z",
        "LastUpdated": "2021-12-17T03:33:42.596Z",
        "IsCompleted": true,
        "DateProcessed": "2021-12-17T03:33:42.596Z",
        "CreatedBy": null
      },
      {
        "id": "117939300636803_117986687298731",
        "from_id": "4457015097690900",
        "object_id": "100431209054279_117939300636803",
        "is_admin": false,
        "message_formatted": "0945098123",
        "comment": {
          "id": "117939300636803_117986687298731",
          "parent": null,
          "is_hidden": false,
          "can_hide": true,
          "can_remove": true,
          "can_like": false,
          "can_reply_privately": false,
          "comment_count": 0,
          "message": "0945098123",
          "user_likes": false,
          "created_time": "2021-10-14T07:18:02Z",
          "object": {
            "id": "100431209054279_117939300636803"
          },
          "from": {
            "id": "4457015097690900",
            "name": "Thuý Vy Nguyễn",
            "uid": null
          },
          "comments": null,
          "attachment": null,
          "message_tags": null
        },
        "message": null,
        "type": 2,
        "nlps": null,
        "error_message": null,
        "DateCreated": "2021-10-14T07:18:02Z",
        "LastUpdated": "2022-03-06T08:17:08.92Z",
        "IsCompleted": false,
        "DateProcessed": null,
        "CreatedBy": null
      },
      {
        "id": "209295271248328_209301177914404",
        "from_id": "4457015097690900",
        "object_id": "100431209054279_209295271248328",
        "is_admin": false,
        "message_formatted": "Xuân",
        "comment": {
          "id": "209295271248328_209301177914404",
          "parent": null,
          "is_hidden": false,
          "can_hide": true,
          "can_remove": true,
          "can_like": false,
          "can_reply_privately": false,
          "comment_count": 0,
          "message": "Xuân",
          "user_likes": false,
          "created_time": "2021-09-08T08:29:02Z",
          "object": {
            "id": "100431209054279_209295271248328"
          },
          "from": {
            "id": "4457015097690900",
            "name": "Thuý Vy Nguyễn",
            "uid": null
          },
          "comments": null,
          "attachment": null,
          "message_tags": null
        },
        "message": null,
        "type": 2,
        "nlps": null,
        "error_message": null,
        "DateCreated": "2021-09-08T08:29:02Z",
        "LastUpdated": "2022-03-06T08:17:08.971Z",
        "IsCompleted": false,
        "DateProcessed": null,
        "CreatedBy": null
      },
      {
        "id": "100486765715390_100488735715193",
        "from_id": "4457015097690900",
        "object_id": "100431209054279_100486765715390",
        "is_admin": false,
        "message_formatted": "cho đặt hàng, 0938723986",
        "comment": {
          "id": "100486765715390_100488735715193",
          "parent": null,
          "is_hidden": false,
          "can_hide": true,
          "can_remove": true,
          "can_like": false,
          "can_reply_privately": false,
          "comment_count": 0,
          "message": "cho đặt hàng, 0938723986",
          "user_likes": false,
          "created_time": "2021-09-08T06:48:27Z",
          "object": {
            "id": "100431209054279_100486765715390"
          },
          "from": {
            "id": "4457015097690900",
            "name": "Thuý Vy Nguyễn",
            "uid": null
          },
          "comments": null,
          "attachment": null,
          "message_tags": null
        },
        "message": null,
        "type": 2,
        "nlps": null,
        "error_message": null,
        "DateCreated": "2021-09-08T06:48:27Z",
        "LastUpdated": "2022-03-06T08:17:09.047Z",
        "IsCompleted": false,
        "DateProcessed": null,
        "CreatedBy": null
      },
      {
        "id": "100486765715390_100486799048720",
        "from_id": "4457015097690900",
        "object_id": "100431209054279_100486765715390",
        "is_admin": false,
        "message_formatted": "alo alo ",
        "comment": {
          "id": "100486765715390_100486799048720",
          "parent": null,
          "is_hidden": false,
          "can_hide": true,
          "can_remove": true,
          "can_like": false,
          "can_reply_privately": false,
          "comment_count": 0,
          "message": "alo alo ",
          "user_likes": false,
          "created_time": "2021-09-08T06:40:55Z",
          "object": {
            "id": "100431209054279_100486765715390"
          },
          "from": {
            "id": "4457015097690900",
            "name": "Thuý Vy Nguyễn",
            "uid": null
          },
          "comments": null,
          "attachment": null,
          "message_tags": null
        },
        "message": null,
        "type": 2,
        "nlps": null,
        "error_message": null,
        "DateCreated": "2021-09-08T06:40:55Z",
        "LastUpdated": "2022-03-06T08:17:09.047Z",
        "IsCompleted": false,
        "DateProcessed": null,
        "CreatedBy": null
      }
    ];
  }
}
