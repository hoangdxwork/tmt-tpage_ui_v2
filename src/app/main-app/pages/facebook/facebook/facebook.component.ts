import { FacebookUser } from './../../../../lib/dto/facebook.dto';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import {
  FacebookAuth,
  FacebookAuthResponse,
} from 'src/app/lib/dto/facebook.dto';
import { PagedList2 } from 'src/app/main-app/dto/pagedlist2.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import {
  TDSHelperObject,
  TDSModalService,
  TDSSafeAny,
  TDSMessageService,
  TDSHelperString,
  TDSCollapsePanelComponent,
} from 'tmt-tang-ui';
import { AddPageComponent } from '../components/add-page/add-page.component';
import { ViewportScroller } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';

export interface PageNotConnectDTO {
  // /rest/v1.0/product/getinventory
  [key: string]: Array<UserPageDTO>;
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
})
export class FacebookComponent implements OnInit, AfterViewInit, OnDestroy {

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  currentTeam!: CRMTeamDTO | null;
  lstPageNotConnect: PageNotConnectDTO = {};
  lstData: TDSSafeAny = {};

  inputValue?: string;
  userFBLogin?: FacebookUser;
  userFBAuth?: FacebookAuth;

  listsFieldListAll: any = {
    id: 1,
    name: 'Tất cả',
  };

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
  ];

  listFilter: Array<any> = [
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
  ];

  listSetting: Array<any> = [
    {
      id: 1,
      name: 'Ẩn/ Hiện tài khoản',
    },
    {
      id: 2,
      name: 'Xóa tài khoản',
    },
  ];

  fieldListFilter: any = {};
  iconCollapse: TDSSafeAny = {};

  isLoading: boolean = true;
  lastScrollPosition: TDSSafeAny = null;

  private _destroy = new Subject<void>();

  constructor(
    private modal: TDSModalService,
    private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private facebookGraphService: FacebookGraphService,
    private viewContainerRef: ViewContainerRef,
    private facebookLoginService: FacebookLoginService,
    private viewportScroller: ViewportScroller
  ) {}

  ngAfterViewInit(): void {
    this.facebookLoginService.init().subscribe(
      (sdk) => {
        this.facebookLoginService.getLoginStatus().subscribe(
          (res: FacebookAuthResponse) => {
            if (res.status === 'connected') {
              this.userFBAuth = res.authResponse;
              this.getMe();
            }
            this.isLoading = false;
          },
          (error) => {
            this.userFBLogin = undefined;
            this.isLoading = false;
          }
        );
      },
      (error) => {
        this.userFBLogin = undefined;
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadListTeam(false);
    this.crmTeamService.onChangeTeam()
      .pipe(takeUntil(this._destroy))
      .subscribe((res) => {
        this.currentTeam = res;
      });
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().subscribe(
      (res: FacebookAuth) => {
        this.userFBAuth = res;
        this.getMe();
        this.sortByFbLogin(this.userFBLogin?.id);
        this.isLoading = false;
        console.log(res);
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  facebookSignOut() {
    this.isLoading = true;
    this.facebookLoginService.logout().subscribe(
      () => {
        this.userFBLogin = undefined;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getMe() {
    this.facebookLoginService.getMe().subscribe(
      (res: FacebookUser) => {
        this.userFBLogin = res;

        if (this.data && this.data.length > 0) {
          this.onChangeCollapse(this.data[0].Id, false);
          this.sortByFbLogin(this.userFBLogin?.id);
        }
      },
      (error) => (this.userFBLogin = undefined)
    );
  }

  loadListTeam(isRefresh: boolean) {
    this.isLoading = true;
    this.crmTeamService.getAllChannels().subscribe(
      (res: TDSSafeAny) => {
        this.data = res;

        if(res && res.length > 0) {
          res.sort((a: any, b: any) => {
            if (a.Active) return -1;
            return 1;
          });

          res.forEach((item: any) => {
            this.fieldListFilter[item.Id] = this.listFilter[0];
            this.getListData(item.Id);
          });

          if (this.userFBLogin) {
            this.sortByFbLogin(this.userFBLogin.id);
          }
          else {
            this.onChangeCollapse(res[0].Id, true);
          }

          if(isRefresh){
            this.crmTeamService.onRefreshListFacebook();
            this.scrollToLastPosition();
          }
        }
        this.isLoading = false;
      },
      (error) => (this.isLoading = false)
    );
  }

  onFacebookConnected() {
    let channel = this.data.find(
      (x) => x.Facebook_UserId == this.userFBLogin?.id
    );

    if (channel || !this.userFBLogin) {
      this.message.error(Message.ConnectionChannel.ChannelExist);
    }

    this.lastScrollPosition = this.viewportScroller.getScrollPosition();

    this.insertUserChannel(this.userFBAuth?.accessToken);
  }

  insertUserChannel(accessToken: string | undefined) {
    this.isLoading = true;

    let model = {
      fb_exchange_token: accessToken,
      grant_type: 'fb_exchange_token',
    };

    this.crmTeamService.getLongLiveToken(model).subscribe(
      (res) => {
        let team = {
          Facebook_ASUserId: this.userFBLogin?.id,
          Facebook_TypeId: 'User',
          Facebook_UserAvatar: this.userFBLogin?.picture.data.url,
          Facebook_UserName: this.userFBLogin?.name,
          Facebook_UserToken: res,
          Facebook_UserId: this.userFBLogin?.id,
          IsConverted: true,
          IsDefault: true,
          Name: this.userFBLogin?.name,
          Type: 'Facebook',
        };

        this.crmTeamService.insert(team).subscribe(
          (res) => {
            this.message.success(Message.InsertSuccess);
            this.loadListTeam(true);
            this.isLoading = false;
          },
          (error) => (this.isLoading = false)
        );
      },
      (error) => (this.isLoading = false)
    );
  }

  sortByFbLogin(userId: string | undefined | null) {
    let item = this.data.find(
      (x) => x.Facebook_UserId && x.Facebook_UserId == userId
    );

    if (item) {
      this.data.splice(this.data.indexOf(item), 1);
      this.data.unshift(item);

      this.onChangeCollapse(item.Id, true);
    }
  }

  onClickFieldListFilter(value: TDSSafeAny, id: number) {
    this.fieldListFilter[id] = value;
    this.getListData(id);
  }

  onClickFieldListSetting(value: TDSSafeAny, id: number) {
    if (value.id == 1) {
      this.hideChannel(id);
    } else if (value.id == 2) {
      let user = this.data.find((x) => x.Id == id);
      if (user) {
        this.unConnected(id, user.Facebook_UserId);
      } else {
        this.message.error(Message.ErrorOccurred);
      }
    }
  }

  onClickFieldListAll(value: TDSSafeAny) {
    this.listsFieldListAll = value;

    if (value.id == 1) delete this.dataSearch;
    else if (value.id == 2) {
      this.dataSearch = this.data.filter((x) => x.Active);
    } else if (value.id == 3) {
      this.dataSearch = this.data.filter((x) => !x.Active);
    }
  }

  onSearch(event: TDSSafeAny) {
    let text = event.target.value;
    if (!TDSHelperString.hasValueString(text)) delete this.dataSearch;

    this.dataSearch = this.data.filter(
      (x) => x.Name.toLowerCase().indexOf(text.toLowerCase()) !== -1
    );
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  }

  unConnected(id: number, userId: any): void {
    this.lastScrollPosition = this.viewportScroller.getScrollPosition();
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: 'Bạn có chắc muốn hủy kết nối',
      onOk: () => {
        this.delete(id, userId)
      },
      onCancel: () => {
        console.log('cancel');
        this.lastScrollPosition = null;
      },
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  delete(id: number, userId: any) {
    this.crmTeamService.delete(id).subscribe(
      (res) => {
        this.message.success(Message.DeleteSuccess);
        this.loadListTeam(true);
      },
      (error) => {
        if (error?.error?.message) {
          this.message.error(error?.error?.message);
        } else {
          this.message.error(Message.ErrorOccurred);
        }
      }
    );
  }

  showModalAddPage(data: UserPageDTO, user: CRMTeamDTO): void {
    const modal = this.modalService.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data,
        user: user,
      },
    });

    modal.afterClose.subscribe((result) => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
        this.loadListTeam(true);
        // if (this.lstPageNotConnect[user.Id]) {
        //   this.lstPageNotConnect[user.Id] = this.lstPageNotConnect[user.Id].filter((x) => x.id != data.id);
        // }
      }
    });
  }

  hideChannel(id: number) {
    this.isLoading = true;
    this.crmTeamService.updateActive(id).subscribe(
      (res: any) => {
        this.message.success(Message.ManipulationSuccessful);
        // this.loadListTeam(true);
        this.updateActiveData(id);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        if (error?.error?.message) {
          this.message.error(error?.error?.message);
        } else {
          this.message.error(Message.ErrorOccurred);
        }
      }
    );
  }

  updateActiveData(id: number) {
    let channel = this.data.find((x) => x.Id == id);
    channel && (channel.Active = !channel.Active);
    this.crmTeamService.onRefreshListFacebook();
  }

  loadPageNotConnect(user: CRMTeamDTO) {
    let pageIdConnected = user?.Childs.map((x) => x.Facebook_PageId);

    this.isLoading = true;
    this.facebookGraphService.getUserPages(user.Facebook_UserToken).subscribe(
      (res) => {
        if (res?.data.length < 1) {
          this.message.info(Message.ConnectionChannel.NotFoundUserPage);
        } else {
          this.lstPageNotConnect[user.Id] = res.data;
          this.lstData[user.Id]['notConnected'] = this.lstPageNotConnect[user.Id].filter(
            (item) => !pageIdConnected.includes(item.id)
          );;
          this.message.success(
            `Tìm thấy ${this.lstPageNotConnect[user.Id]?.length || 0} kênh mới.`
          );
        }
        this.isLoading = false;
      },
      (error) => {
        this.message.error(Message.ConnectionChannel.TokenExpires);
        this.isLoading = false;
      }
    );
  }

  onChangeCollapse(id: number, event: TDSSafeAny) {
    this.iconCollapse[id] = event;
  }

  getIsIconCollapse(id: number) {
    if (this.iconCollapse[id] && this.iconCollapse[id] === true)
      return true;
    return false;
  }

  getFieldListFilter(teamId: number): number {
    let id = this.fieldListFilter?.[teamId]?.id;
    if (id) return id;
    return 1;
  }

  refreshPageToken(teamId: number, pageId: number) {
    let model = {
      access_token: '',
      pageId: pageId,
    };

    this.isLoading = true;

    this.crmTeamService.refreshPageToken(teamId, model).subscribe(
      (res: any) => {
        if (TDSHelperString.hasValueString(res)) {
          this.message.success(Message.ConnectionChannel.RefreshTokenSuccess);
          this.loadListTeam(true);
        } else {
          this.message.error(Message.ConnectionChannel.RefreshTokenFail);
        }
      },
      (error) => {
        this.isLoading = false;
        if(error?.error?.message)this.message.error(error?.error?.message);
        else this.message.error(Message.ConnectionChannel.RefreshTokenFail);
      }
    );
  }

  getListData(teamId: number) {
    let field = this.getFieldListFilter(teamId);
    let channel = this.data.find((x) => x.Id == teamId);

    if (!channel) {
      this.message.error(Message.ConnectionChannel.NotFoundUserPage);
      return;
    }

    let childIds = channel?.Childs.map(x => x.Facebook_PageId) || [];

    if (field == 1) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs || [];
      this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
    } else if (field == 2) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs.filter((x) => x.Active);
      this.lstData[teamId]['notConnected'] = [];
    } else if (field == 3) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs.filter((x) => !x.Active);
      this.lstData[teamId]['notConnected'] = [];
    } else if (field == 4) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = [];
      this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
    }
  }

  scrollToLastPosition(){
    if(TDSHelperObject.hasValue(this.lastScrollPosition))
    {
      this.viewportScroller.scrollToPosition(this.lastScrollPosition);
    }
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
