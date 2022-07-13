import { FacebookUser } from './../../../../lib/dto/facebook.dto';
import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookAuth, FacebookAuthResponse } from 'src/app/lib/dto/facebook.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { AddPageComponent } from '../components/add-page/add-page.component';
import { ViewportScroller } from '@angular/common';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { debounceTime, distinctUntilChanged, map, takeUntil, finalize } from 'rxjs/operators';

export interface PageNotConnectDTO {
  // /rest/v1.0/product/getinventory
  [key: string]: Array<UserPageDTO>;
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss'],
  animations: [eventFadeStateTrigger]
})
export class FacebookComponent implements OnInit, AfterViewInit, OnDestroy {

  @HostBinding("@eventFadeState") eventAnimation = true;
  @ViewChild('innerText') innerText!: ElementRef;

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  currentTeam!: CRMTeamDTO | null;
  lstPageNotConnect: PageNotConnectDTO = {};
  lstData: TDSSafeAny = {};

  userFBLogin?: FacebookUser;
  userFBAuth?: FacebookAuth;

  isUserConnectChannel: boolean = false;

  listFilter: Array<any> = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Đang hoạt động' },
    { id: 3, name: 'Người dùng đã ẩn' },
    { id: 4, name: 'Chưa có trang được kết nối' }
  ];

  currentFilter = this.listFilter[0];

  fieldListFilter: any = {};
  iconCollapse: TDSSafeAny = {};

  isLoading: boolean = true;
  lastScrollPosition: TDSSafeAny = null;
  isLoadChannel: boolean = false;

  private _destroy$ = new Subject<void>();

  constructor( private modal: TDSModalService,
    private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService,
    private facebookGraphService: FacebookGraphService,
    private viewContainerRef: ViewContainerRef,
    private facebookLoginService: FacebookLoginService,
    private viewportScroller: ViewportScroller) {}

  ngAfterViewInit(): void {
      this.facebookLoginService.init().pipe(takeUntil(this._destroy$)).subscribe((sdk) => {

        this.facebookLoginService.getLoginStatus().pipe(takeUntil(this._destroy$)).subscribe((res: FacebookAuthResponse) => {

            if (res.status === 'connected') {
              this.userFBAuth = res.authResponse;
              this.getMe();
            }

          },error => {
              this.userFBLogin = undefined;
          })
      }, error => {
          this.userFBLogin = undefined;
      })

      if(this.innerText?.nativeElement) {
        fromEvent(this.innerText.nativeElement, 'keyup').pipe(
            map((event: any) => { return event.target.value }), debounceTime(750), distinctUntilChanged())
            .subscribe((text: any) => {

              this.isLoading = false;
              setTimeout(() => {
                  if (!TDSHelperString.hasValueString(text)) delete this.dataSearch;
                  this.dataSearch = this.data.filter((x) => x.Name.toLowerCase().indexOf(text.toLowerCase()) !== -1 );
              }, 250)
          })
      }

  }

  ngOnInit(): void {
    this.loadListTeam(false);
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this._destroy$)).subscribe((res) => {
        this.currentTeam = res;
    });
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().pipe(takeUntil(this._destroy$)).subscribe((res: FacebookAuth) => {

        this.userFBAuth = res;
        this.getMe();
        this.sortByFbLogin(this.userFBLogin?.id);
        this.isLoading = false;

      }, error => {
        this.isLoading = false;
      }
    );
  }

  facebookSignOut() {
    this.isLoading = true;
    this.facebookLoginService.logout().pipe(takeUntil(this._destroy$)).subscribe(() => {

        this.userFBLogin = undefined;
        this.isLoading = false;

      },error => {
          this.isLoading = false;
      })
  }

  getMe() {
    this.facebookLoginService.getMe().pipe(takeUntil(this._destroy$)).subscribe((res: FacebookUser) => {
        this.userFBLogin = res;

        if (this.data && this.data.length > 0) {
          this.onChangeCollapse(this.data[0].Id, false);
          this.sortByFbLogin(this.userFBLogin?.id);
        }
      },error => {
        this.userFBLogin = undefined
      });
  }

  loadListTeam(isRefresh: boolean) {
    this.isLoading = true;
    this.isLoadChannel = true;

    this.crmTeamService.getAllChannels().pipe(takeUntil(this._destroy$), finalize(() => this.isLoadChannel = false)).subscribe((res: TDSSafeAny) => {
        this.data = res;

        if(res && TDSHelperArray.hasListValue(res)) {
          res.sort((a: any, b: any) => {
              if (a.Active) return -1;
              return 1;
          });

          res.forEach((item: any) => {
              this.fieldListFilter[item.Id] = this.listFilter[0];
              this.getListData(item.Id);

              if(item.Childs.length > 0) {
                this.onChangeCollapse(item.Id, true);
              }
          });

          if (this.userFBLogin) {
              this.sortByFbLogin(this.userFBLogin.id);
          }

          if(isRefresh){
              this.crmTeamService.onRefreshListFacebook();
              this.scrollToLastPosition();
          }
        }

        this.isLoading = false;
      }, error => {
          this.isLoading = false
      })
  }

  onFacebookConnected() {
    let channel = this.data.find((x) => x.Facebook_UserId == this.userFBLogin?.id);

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

    this.crmTeamService.getLongLiveToken(model).pipe(takeUntil(this._destroy$), finalize(() => this.isLoading = false)).subscribe((res) => {
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

        this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$), finalize(() => this.isLoading = false)).subscribe((obs) => {

            this.message.success(Message.InsertSuccess);
            this.loadListTeam(true);

          })

      }, error => {

        // TODO: nếu lỗi sẽ lấy token của user đăng nhập
        if(this.userFBLogin) {
          let team = { // user
              Facebook_ASUserId: this.userFBLogin.id,
              Facebook_TypeId: "User",
              Facebook_UserAvatar: this.userFBLogin.picture.data.url,
              Facebook_UserName: this.userFBLogin.name,
              Facebook_UserToken: this.userFBAuth?.accessToken,
              Facebook_UserId: this.userFBLogin.id,
              IsConverted: true,
              IsDefault: true,
              Name: this.userFBLogin.name,
              Type: "Facebook"
          };

          this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$), finalize(() => this.isLoading = false)).subscribe((obs) => {
              this.message.success(Message.InsertSuccess);
              this.loadListTeam(true);
          })
        }
      });
  }

  sortByFbLogin(userId: string | undefined | null) {
    let item = this.data.find(
      (x) => x.Facebook_UserId && x.Facebook_UserId == userId
    );

    if (item) {
      this.data.splice(this.data.indexOf(item), 1);
      this.data.unshift(item);

      this.onChangeCollapse(item.Id, true);
      this.isUserConnectChannel = true;
    }
    else {
      this.isUserConnectChannel = false;
    }
  }

  onClickFieldListFilter(value: TDSSafeAny, id: number) {
    this.fieldListFilter[id] = value;
    this.getListData(id);
  }

  onClickFieldListAll(value: TDSSafeAny) {
    this.currentFilter = value;

    if (value.id == 1) delete this.dataSearch;
    else if (value.id == 2) {
      this.dataSearch = this.data.filter((x) => x.Active);
    } else if (value.id == 3) {
      this.dataSearch = this.data.filter((x) => !x.Active);
    } else if (value.id == 4) {
      this.dataSearch = this.data.filter((x) => x.Childs);
    }
  }

  onClickDropdown(e: MouseEvent) {
    e.stopPropagation();
  }

  unConnected(id: number, name?: string): void {
    this.lastScrollPosition = this.viewportScroller.getScrollPosition();
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${name}.`,
      onOk: () => {
        this.delete(id)
      },
      onCancel: () => {
        console.log('cancel');
        this.lastScrollPosition = null;
      },
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  delete(id: number) {
    this.crmTeamService.delete(id).pipe(takeUntil(this._destroy$)).subscribe(
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

  onActive(id: number, isUser: boolean) {
    this.isLoading = true;
    this.crmTeamService.updateActive(id).pipe(takeUntil(this._destroy$)).subscribe((res: any) => {

        this.message.success(Message.ManipulationSuccessful);
        this.updateActiveData(id, isUser);
        this.isLoading = false;

      }, error => {

        this.isLoading = false;

        if (error?.error?.message) {
          this.message.error(error?.error?.message);
        } else {
          this.message.error(Message.ErrorOccurred);
        }
      }
    );
  }

  updateActiveData(id: number, isUser: boolean) {
    if(isUser) {
      let channel = this.data.find((x) => x.Id == id);
      channel && (channel.Active = !channel.Active);
    }
    else {
      for(let i = 0; i < this.data.length; i++) {
        if(TDSHelperArray.hasListValue(this.data[i]?.Childs)) {
          let channel = this.data[i].Childs.find((x) => x.Id == id);
          if(channel) {
            channel.Active = !channel.Active;
            break;
          }
        }
      }
    }

    this.crmTeamService.onRefreshListFacebook();
  }

  loadPageNotConnect(team: CRMTeamDTO) {
    let pageIdConnected = team?.Childs.map((x) => x.Facebook_PageId);

    this.isLoading = true;
    this.facebookGraphService.getUserPages(team.Facebook_UserToken).pipe(takeUntil(this._destroy$)).subscribe((res) => {

        if(TDSHelperArray.hasListValue(res?.data)) {

          this.lstPageNotConnect[team.Id] = res.data;
          this.lstData[team.Id]['notConnected'] = this.lstPageNotConnect[team.Id].filter((item) => !pageIdConnected.includes(item.id));

          if(this.lstData[team.Id]['notConnected']?.length > 0) {
            this.message.success(`Tìm thấy ${this.lstData[team.Id]['notConnected']?.length} kênh mới`);
          } else {
            this.message.info('Không tìm thấy kênh mới nào');
          }
        } else {
          this.message.info('Không tìm thấy kênh mới nào');
        }

        this.isLoading = false;

      }, error => {
        this.message.error(Message.ConnectionChannel.TokenExpires);
        this.isLoading = false;
      })
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

    this.crmTeamService.refreshPageToken(teamId, model).pipe(takeUntil(this._destroy$)).subscribe(
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
    if(TDSHelperObject.hasValue(this.lastScrollPosition)) {
      this.viewportScroller.scrollToPosition(this.lastScrollPosition);
    }
  }

  mergePage() {
    this.message.info(Message.FunctionNotWorking);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
