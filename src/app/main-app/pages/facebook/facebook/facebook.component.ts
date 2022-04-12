import { FacebookUser } from './../../../../lib/dto/facebook.dto';
import { AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookAuth, FacebookAuthResponse } from 'src/app/lib/dto/facebook.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { TDSHelperObject, TDSModalService, TDSSafeAny, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { AddPageComponent } from '../components/add-page/add-page.component';
import { FacebookService } from 'src/app/main-app/services/facebook.service';

export interface PageNotConnectDTO { // /rest/v1.0/product/getinventory
  [key: string]: Array<UserPageDTO>
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit, AfterViewInit {

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  currentTeam!: CRMTeamDTO | null;

  lstPageNotConnect: PageNotConnectDTO = {};

  inputValue?: string;
  userFBLogin?: FacebookUser;
  userFBAuth?: FacebookAuth;

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
  iconCollapse: TDSSafeAny = {"0": true};

  isLoading: boolean = true;

  constructor(private modal: TDSModalService,
      private modalService: TDSModalService,
      private crmTeamService: CRMTeamService,
      private message: TDSMessageService,
      private facebookGraphService: FacebookGraphService,
      private viewContainerRef: ViewContainerRef,
      private facebookService: FacebookService
  ) { }

  ngAfterViewInit(): void {
    this.facebookService.init().subscribe(sdk => {
      this.facebookService.getLoginStatus().subscribe((res: FacebookAuthResponse) => {
        if (res.status === "connected") {
          this.userFBAuth = res.authResponse;
          this.getMe();
        }
        this.isLoading = false;
      }, (error) => {
        this.userFBLogin = undefined;
        this.isLoading = false;
      });
    }, error => {
      this.userFBLogin = undefined;
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.loadListTeam();
    this.crmTeamService.onChangeTeam().subscribe(res => {
      this.currentTeam = res;
    });
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookService.login().subscribe((res: FacebookAuth) => {
      this.userFBAuth = res;
      this.getMe();
      this.sortByFbLogin(this.userFBLogin?.id);
      this.isLoading = false;
      console.log(res);
    }, (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  facebookSignOut() {
    this.isLoading = true;
    this.facebookService.logout().subscribe(() => {
      this.userFBLogin = undefined;
      this.isLoading = false;
    },
      (error) => {
      this.isLoading = false;
        console.log(error);
      }
    );
  }

  onFacebookConnected() {
    let channel = this.data.find(x => x.Facebook_UserId == this.userFBLogin?.id);

    if(channel || !this.userFBLogin) {
      this.message.error(Message.ConnectionChannel.ChannelExist);
    }

    this.insertUserChannel(this.userFBAuth?.accessToken);
  }

  insertUserChannel(accessToken: string | undefined) {
    this.isLoading = true;

    let model = {
      fb_exchange_token: accessToken,
      grant_type: 'fb_exchange_token',
    }

    this.crmTeamService.getLongLiveToken(model).subscribe(res => {
      let team  = {
        Facebook_ASUserId: this.userFBLogin?.id,
        Facebook_TypeId: "User",
        Facebook_UserAvatar: this.userFBLogin?.picture.data.url,
        Facebook_UserName: this.userFBLogin?.name,
        Facebook_UserToken: res,
        Facebook_UserId: this.userFBLogin?.id,
        IsConverted: true,
        IsDefault: true,
        Name: this.userFBLogin?.name,
        Type: "Facebook"
      };

      this.crmTeamService.insert(team).subscribe(res => {
        this.message.success(Message.InsertSuccess);
        this.loadListTeam();
      }, error => this.isLoading = false);
    }, error => this.isLoading = false);
  }

  getMe() {
    this.facebookService.getMe().subscribe((res: FacebookUser) => {
      this.userFBLogin = res;

      if(this.data && this.data.length > 0) {
        this.sortByFbLogin(this.userFBLogin?.id);
      }
    }, error => this.userFBLogin = undefined);
  }

  loadListTeam() {
    this.isLoading = true;
    this.crmTeamService.getAllChannels().subscribe((res: TDSSafeAny) => {
      this.data = res;

      res.sort((a: any, b: any) => {
        this.fieldListSetting[a.Id] = this.listSetting[0];
        this.fieldListSetting[b.Id] = this.listSetting[0];

        if(a.Active) return -1; return 1;
      });

      if(this.userFBLogin) {
        this.sortByFbLogin(this.userFBLogin.id);
      }
      this.isLoading = false;
    }, error =>  this.isLoading = false);
  }

  sortByFbLogin(userId: string | undefined | null) {
    let item = this.data.find(x => (x.Facebook_UserId && x.Facebook_UserId == userId));

    console.log(item);

    if(item) {
      this.data.splice(this.data.indexOf(item), 1);
      this.data.unshift(item);
    }
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

  onChangeCollapse(index: number, event: TDSSafeAny) {
    this.iconCollapse[index] = event;
  }

  getIsIconCollapse(index: number) {
    if(this.iconCollapse[index] && this.iconCollapse[index] === true) return true;
    return false;
  }
}
