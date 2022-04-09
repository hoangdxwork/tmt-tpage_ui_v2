import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { TDSHelperObject, TDSModalService, TDSSafeAny, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { AddPageComponent } from '../components/add-page/add-page.component';

export interface PageNotConnectDTO { // /rest/v1.0/product/getinventory
  [key: string]: Array<UserPageDTO>
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  currentTeam!: CRMTeamDTO | null;

  lstPageNotConnect: PageNotConnectDTO = {};

  inputValue?: string;

  listsFieldListAll: any = {
    id: 1,
    name: 'Tất cả',
  }

  listAll: Array<any> = [
    {
      id: 1,
      name: 'Tất cả',
    },
    {
      id: 2,
      name: 'Đang hoạt động',
    },
    {
      id: 3,
      name: 'Người dùng đã ẩn',
    },
  ]

  listSetting: Array<any> = [
    {
      id: 1,
      name: 'Tất cả',
    },
    {
      id: 2,
      name: 'Đang hoạt động',
    },
    {
      id: 3,
      name: 'Người dùng đã ẩn',
    },
    {
      id: 4,
      name: 'Chưa kết nối',
    },
  ]

  fieldListSetting: any = {};

  addPage:TDSSafeAny = [
    {
      'id': '5a15b13c2340978ec3d2c0ea',
      'fullname': 'Nguyễn Thành Công',
      'page': 'Mèo nhạt nhẽo',
      'name': 'Mèo nhạt nhẽo',
    }
  ]

  constructor(private modal: TDSModalService,
      private modalService: TDSModalService,
      private crmTeamService: CRMTeamService,
      private message: TDSMessageService,
      private facebookGraphService: FacebookGraphService,
      private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.loadListTeam();
    this.crmTeamService.onChangeTeam().subscribe(res => {
      this.currentTeam = res;
    });
  }

  loadListTeam() {
    this.crmTeamService.getAllChannels().subscribe((res: TDSSafeAny) => {
      this.data = res;

      res.sort((a: any, b: any) => {
        this.fieldListSetting[a.Id] = this.listSetting[0];
        this.fieldListSetting[b.Id] = this.listSetting[0];

        if(a.Active) return -1; return 1})
    });
  }

  onClickFieldListSetting(value: TDSSafeAny, id: number) {
    this.fieldListSetting[id] = value;
  }

  onClickFieldListAll(value: TDSSafeAny) {
    this.listsFieldListAll = value;

    if(value.id == 1) delete this.dataSearch;
    else if(value.id == 2) {
      this.dataSearch = this.data.filter(x => x.Active);
    }
    else if(value.id == 3) {
      this.dataSearch = this.data.filter(x => !x.Active);
    }
  }

  onSearch(event: TDSSafeAny) {
    let text = event.target.value;
    if(!TDSHelperString.hasValueString(text)) delete this.dataSearch;

    this.dataSearch = this.data.filter(x => x.Name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  }

  unConnected(id: number, userId: any): void {
    this.modal.error({
        title: 'Hủy kết nối Facebook',
        content: 'Bạn có chắc muốn hủy kết nối với: Mèo nhạt nhẽo',
        onOk: () => this.delete(id, userId),
        onCancel:()=>{console.log('cancel')},
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
  }

  delete(id: number, userId: any) {
    this.crmTeamService.delete(id).subscribe(res => {
      this.message.success(Message.DeleteSuccess);
      this.loadListTeam();
      delete this.lstPageNotConnect[userId];
    }, error => {
      if(error?.error?.message) {
        this.message.error(error?.error?.message);
      }
      else {
        this.message.error(Message.ErrorOccurred);
      }
    });
  }

  showModalAddPage(data: UserPageDTO, user: CRMTeamDTO): void {
    const modal = this.modalService.create({
        title: 'Thêm Page',
        content: AddPageComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            data: data,
            user: user
        }
    });

    modal.afterClose.subscribe(result => {
        console.log('[afterClose] The result is:', result);
        if (TDSHelperObject.hasValue(result)) {
            this.loadListTeam();
            if(this.lstPageNotConnect[user.Facebook_UserId]) {
              this.lstPageNotConnect[user.Facebook_UserId] = this.lstPageNotConnect[user.Facebook_UserId].filter(x => x.id != data.id);
            }
        }
    });
  }

  hideChannel(id: number) {
    this.crmTeamService.updateActive(id).subscribe((res: any) => {
      this.message.success(Message.ManipulationSuccessful);
      this.loadListTeam();
    }, error => {
      if(error?.error?.message) {
        this.message.error(error?.error?.message);
      }
      else {
        this.message.error(Message.ErrorOccurred);
      }
    });
  }

  loadPageNotConnect(user: CRMTeamDTO) {
    let pageIdConnected = user?.Childs.map(x => x.Facebook_PageId);

    this.facebookGraphService.getUserPages(user.Facebook_UserToken).subscribe(res => {
      if(res?.data.length < 1) {
        this.message.info(Message.ConnectionChannel.NotFoundUserPage);
      }
      else {
        this.lstPageNotConnect[user.Facebook_UserId] = res.data.filter(item => !pageIdConnected.includes(item.id));
        this.message.success(`Tìm thấy ${this.lstPageNotConnect[user.Facebook_UserId]?.length || 0} kênh mới.`);
      }
    }, error => {
      this.message.error(Message.ConnectionChannel.TokenExpires);
    });
  }
}
