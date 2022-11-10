import { Observable } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookAuth, FacebookAuthResponse, FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { PageDataPictureDTO, PagePictureDTO, UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { ViewportScroller } from '@angular/common';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { debounceTime, distinctUntilChanged, map, takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { TShopDto, TUserDto } from '@core/dto/tshop.dto';
import { TShopService } from '@app/services/tshop-service/tshop.service';
import { FacebookService } from '@app/services/facebook.service';
import { AddPageComponent } from '../add-page/add-page.component';


export interface PageNotConnectDTO {
  [key: string]: Array<UserPageDTO>;
}

@Component({
  selector: 'tshop-channel',
  templateUrl: './tshop-channel.component.html',
  animations: [eventFadeStateTrigger],
  providers: [TDSDestroyService]
})
export class TshopChannelComponent extends TpageBaseComponent implements OnInit {
  // old
  @HostBinding("@eventFadeState") eventAnimation = true;
  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild('templatePageNotConnect') templatePageNotConnect!: ElementRef;

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  // currentTeam!: CRMTeamDTO | null;
  lstPageNotConnect: PageNotConnectDTO = {};
  lstData: TDSSafeAny = {};

  userFBLogin!: FacebookUser | null;
  userFBAuth!: FacebookAuth | null;
  isUserConnectChannel: boolean = false;

  userTShopLogin!: TUserDto | undefined;
  isUserTShopConnectChannel: boolean = false;

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

  tShopAuthentication!: string;

  constructor(
    private modal: TDSModalService,
    private modalService: TDSModalService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private message: TDSMessageService,
    private facebookGraphService: FacebookGraphService,
    private viewContainerRef: ViewContainerRef,
    private facebookLoginService: FacebookLoginService,
    private viewportScroller: ViewportScroller,
    private _destroy$: TDSDestroyService,
    private facebookService: FacebookService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngAfterViewInit(): void {
    this.facebookLoginService.init().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (sdk) => {

          this.facebookLoginService.getLoginStatus().pipe(takeUntil(this._destroy$)).subscribe(
            {
              next: (res: FacebookAuthResponse) => {

                if (res.status === 'connected') {
                  this.userFBAuth = res.authResponse;
                  this.getMe();
                }

              },
              error: error => {
                this.userFBLogin = null;
              }
            })
        },
        error: error => {
          this.userFBLogin = null;
        }
      })

    if (this.innerText?.nativeElement) {
      fromEvent(this.innerText.nativeElement, 'keyup').pipe(
        map((event: any) => { return event.target.value }), debounceTime(750), distinctUntilChanged())
        .subscribe((text: any) => {

          this.isLoading = false;
          setTimeout(() => {
            if (!TDSHelperString.hasValueString(text)) delete this.dataSearch;
            this.dataSearch = this.data.filter((x) => x.Name.toLowerCase().indexOf(text.toLowerCase()) !== -1);
          }, 250)
        })
    }

  }

  ngOnInit(): void {
    this.loadListTeam(false);
    this.getTShopAuthentication();

    this.tShopService.onChangeUser().pipe(takeUntil(this._destroy$)).subscribe({
      next: (res => {
        this.userTShopLogin = res;
        this.sortByTShopLogin(res?.Id);
      })
    });
  }

  getTShopAuthentication() {
    let fragment = 'facebook/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: FacebookAuth) => {
          if (res) {
            this.userFBAuth = res;
            this.getMe();

            if (this.userFBLogin) {
              this.sortByFbLogin(this.userFBLogin.id);
            }
            this.isLoading = false;
          }
        },
        error: error => {
          this.isLoading = false;
        }
      }
    )
  }

  tShopSignIn() {
    let windowSize = {
      width: 800,
      height: 700,
    };

    let windowLocation = {
      left: (window.screen.width / 2) - (windowSize.width / 2),
      top: (window.screen.height / 2) - (windowSize.height / 2) - 50
    };

    window.open(this.tShopAuthentication, "", 'width=' + windowSize.width + ', height=' + windowSize.height + ', left=' + windowLocation.left + ', top=' + windowLocation.top);
  }

  facebookSignOut() {
    this.isLoading = true;
    this.facebookLoginService.logout().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: () => {

          this.userFBLogin = null;
          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
        }
      })
  }

  tShopSignOut() {
    this.isLoading = true;
    this.tShopService.logout();
    this.isLoading = false;
  }

  getMe() {
    this.facebookLoginService.getMe().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: FacebookUser) => {
          if (res && res.id) {
            this.userFBLogin = res;

            if (this.data && this.data.length > 0) {
              this.onChangeCollapse(this.data[0].Id, false);
              this.sortByFbLogin(res.id);
            }
          }
        },
        error: error => {
          this.userFBLogin = null
        }
      });
  }

  loadListTeam(isRefresh: boolean) {
    this.isLoading = true;
    this.isLoadChannel = true;

    this.crmTeamService.getAllChannels().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {

          if (res) {
            // TOD0: gán lại danh sách team
            this.data = [...res];

            res.sort((a: any, b: any) => {
              if (a.Active) return -1;
              return 1;
            });

            res.forEach((item: any) => {
              this.fieldListFilter[item.Id] = this.listFilter[0];
              this.getListData(item.Id);

              if (item.Childs.length > 0) {
                this.onChangeCollapse(item.Id, true);
              }
            });

            if (this.userFBLogin) {
              this.sortByFbLogin(this.userFBLogin.id);
            }

            if (this.userTShopLogin) {
              this.sortByTShopLogin(this.userTShopLogin.Id);
            }

            if (isRefresh) {
              this.crmTeamService.onRefreshListFacebook();
              this.scrollToLastPosition();
            }
          }

          this.isLoading = false;
          this.isLoadChannel = false;
          this.cdRef.detectChanges();
        },
        error: error => {
          this.isLoading = false;
          this.isLoadChannel = false
          this.cdRef.detectChanges();
        }
      })
  }

  onFacebookConnected() {
    this.isLoading = true;
    let channel = this.data.find((x) => x.Facebook_UserId == this.userFBLogin?.id);

    if (channel || !this.userFBLogin) {
      this.message.error(Message.ConnectionChannel.ChannelExist);
    }

    this.lastScrollPosition = this.viewportScroller.getScrollPosition();

    this.insertUserChannel(this.userFBAuth?.accessToken);
  }

  onTShopConnected() {
    this.isLoading = true;
    let channel = this.data.find((x) => x.OwnerId == this.userTShopLogin?.Id);

    if (channel || !this.userTShopLogin) {
      this.message.error(Message.ConnectionChannel.ChannelExist);
    }

    this.lastScrollPosition = this.viewportScroller.getScrollPosition();

    this.insertUserTShop(this.tShopService.getCurrentToken());
  }

  insertUserChannel(accessToken: string | undefined) {
    let model = {
      fb_exchange_token: accessToken,
      grant_type: 'fb_exchange_token',
    };

    this.crmTeamService.getLongLiveToken(model).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res) => {
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

          this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$)).subscribe((obs) => {

            this.message.success('Thêm page thành công');
            this.loadListTeam(true);
            this.isLoading = false;
            this.cdRef.detectChanges();

          }, error => {
            this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
            this.isLoading = false;
            this.cdRef.detectChanges();
          })

        },
        error: error => {

          // TODO: nếu lỗi sẽ lấy token của user đăng nhập
          if (this.userFBLogin) {
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
              this.message.success('Thêm page thành công');
              this.loadListTeam(true);
            }, error => {
              this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
              this.isLoading = false;
              this.cdRef.detectChanges();
            })
          }
        }
      })
  }

  insertUserTShop(accessToken: string | undefined) {
    let team = {
      Id: 0,
      OwnerId: this.userTShopLogin?.Id,
      Name: this.userTShopLogin?.Name,
      Type: "TUser",
      ChannelId: this.userTShopLogin?.Id,
      OwnerToken: accessToken,
      OwnerAvatar: this.userTShopLogin?.Address
    };

    this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$)).subscribe((obs) => {

      this.message.success('Thêm page thành công');
      this.loadListTeam(true);
      this.isLoading = false;
      this.cdRef.detectChanges();

    }, error => {
      this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
      this.isLoading = false;
      this.cdRef.detectChanges();
    })
  }

  sortByFbLogin(userId: string) {
    let exits = this.data.find((x) => x.Facebook_UserId && x.Facebook_UserId == userId);

    if (exits) {
      this.data.splice(this.data.indexOf(exits), 1);
      this.data.unshift(exits);

      this.onChangeCollapse(exits.Id, true);
      this.isUserConnectChannel = true;
    }
    else {
      this.isUserConnectChannel = false;
    }
  }

  sortByTShopLogin(ownerId: string | undefined) {
    let exits = this.data.find((x) => x.OwnerId && x.OwnerId == ownerId);

    if (exits) {
      this.data.splice(this.data.indexOf(exits), 1);
      this.data.unshift(exits);

      exits.OwnerToken = this.tShopService.getCurrentToken() || exits.OwnerToken;

      this.onChangeCollapse(exits.Id, true);
      this.isUserTShopConnectChannel = true;
    }
    else {
      this.isUserTShopConnectChannel = false;
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

  unConnected(id: number, name: TDSSafeAny, ev: TDSSafeAny): void {
    ev.stopPropagation();

    this.lastScrollPosition = this.viewportScroller.getScrollPosition();
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${name}.`,
      onOk: () => {
        this.delete(id);
      },
      onCancel: () => {
        this.lastScrollPosition = null;
      },
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  delete(id: number) {
    this.crmTeamService.delete(id).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res) => {
          this.message.success('Hủy kết nối thành công');
          this.loadListTeam(true);
        },
        error: (error) => {
          if (error?.error?.message) {
            this.message.error(error?.error?.message);
          } else {
            this.message.error(Message.ErrorOccurred);
          }
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
      if (TDSHelperObject.hasValue(result)) {
        this.loadListTeam(true);
        // if (this.lstPageNotConnect[user.Id]) {
        //   this.lstPageNotConnect[user.Id] = this.lstPageNotConnect[user.Id].filter((x) => x.id != data.id);
        // }
      }
    });
  }

  onActive(id: number, isUser: boolean, ev: TDSSafeAny) {
    ev.stopPropagation();

    this.isLoading = true;
    this.crmTeamService.updateActive(id).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: any) => {

          this.message.success(Message.ManipulationSuccessful);
          this.updateActiveData(id, isUser);
          this.isLoading = false;

        },
        error: error => {

          this.isLoading = false;

          if (error?.error?.message) {
            this.message.error(error?.error?.message);
          } else {
            this.message.error(Message.ErrorOccurred);
          }
        }
      }
    );
  }

  updateActiveData(id: number, isUser: boolean) {
    if (isUser) {
      let channel = this.data.find((x) => x.Id == id);
      channel && (channel.Active = !channel.Active);
    }
    else {
      for (let i = 0; i < this.data.length; i++) {
        if (TDSHelperArray.hasListValue(this.data[i]?.Childs)) {
          let channel = this.data[i].Childs!.find((x) => x.Id == id);
          if (channel) {
            channel.Active = !channel.Active;
            break;
          }
        }
      }
    }

    this.crmTeamService.onRefreshListFacebook();
  }

  loadPageNotConnect(team: CRMTeamDTO) {
    this.isLoading = true;

    switch (team.Type) {
      case 'Facebook':
        {
          this.verifyConnect(team);
        }
        break;
      case 'TUser':
        {
          this.getTShopPages(team);
        }
    }
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
      {
        next: (res: any) => {
          if (TDSHelperString.hasValueString(res)) {
            this.message.success(Message.ConnectionChannel.RefreshTokenSuccess);
            this.loadListTeam(true);
          } else {
            this.message.error(Message.ConnectionChannel.RefreshTokenFail);
          }
        },
        error: (error) => {
          this.isLoading = false;
          if (error?.error?.message) this.message.error(error?.error?.message);
          else this.message.error(Message.ConnectionChannel.RefreshTokenFail);
        }
      }
    );
  }

  refreshTShopPageToken(teamId: number, pageId: number) {
    this.message.info("Tính năng chưa cập nhật.");
  }

  getListData(teamId: number) {
    let field = this.getFieldListFilter(teamId);
    let channel = this.data.find((x) => x.Id == teamId);

    if (!channel) {
      this.message.error(Message.ConnectionChannel.NotFoundUserPage);
      return;
    }

    let childIds = channel?.Childs!.map(x => x.ChannelId) || [];

    if (field == 1) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs || [];
      this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
    } else if (field == 2) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs!.filter((x) => x.Active);
      this.lstData[teamId]['notConnected'] = [];
    } else if (field == 3) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = channel?.Childs!.filter((x) => !x.Active);
      this.lstData[teamId]['notConnected'] = [];
    } else if (field == 4) {
      this.lstData[teamId] = this.lstData[teamId] || {};
      this.lstData[teamId]['data'] = [];
      this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
    }
  }

  scrollToLastPosition() {
    if (TDSHelperObject.hasValue(this.lastScrollPosition)) {
      this.viewportScroller.scrollToPosition(this.lastScrollPosition);
    }
  }

  mergePage() {
    this.message.info(Message.FunctionNotWorking);
  }

  verifyConnect(team: CRMTeamDTO) {
    let model = this.prepareModel(team);
    let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);

    this.facebookService.verifyConect(model).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: res => {
          this.facebookGraphService.getUserPages(team.OwnerToken).pipe(takeUntil(this._destroy$)).subscribe(
            {
              next: (res) => {

                if (TDSHelperArray.hasListValue(res?.data)) {

                  this.lstPageNotConnect[team.Id] = res.data;
                  this.lstData[team.Id]['notConnected'] = this.lstPageNotConnect[team.Id].filter((item) => !pageIdConnected.includes(item.id));

                  if (this.lstData[team.Id]['notConnected']?.length > 0) {
                    this.message.success(`Tìm thấy ${this.lstData[team.Id]['notConnected']?.length} kênh mới`);
                  } else {
                    this.message.info('Không tìm thấy kênh mới nào');
                  }
                } else {
                  this.message.info('Không tìm thấy kênh mới nào');
                }

                this.isLoading = false;
              },
              error: error => {
                this.message.error(Message.ConnectionChannel.TokenExpires);
                this.isLoading = false;
              }
            })
        },
        error: error => {
          this.isLoading = false;
        }
      }
    )
  }

  prepareModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: team.ChannelAvatar || team.Facebook_UserAvatar || team.OwnerAvatar,
      FacebookId: team.ChannelId || team.Facebook_UserId || team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken || team.ChannelToken
    } as any

    return model;
  }

  getTShopPages(team: CRMTeamDTO) {
    let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);

    this.crmService.getTShop(team.OwnerToken).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res) => {
          if (TDSHelperArray.hasListValue(res)) {
            this.lstPageNotConnect[team.Id] = res.map(x => {
              return {
                access_token: '',
                id: x.Id,
                name: x.Name,
                picture: {
                  data: {
                    url: x.Avatar
                  }
                }
              } as UserPageDTO;
            });

            this.lstData[team.Id]['notConnected'] = this.lstPageNotConnect[team.Id].filter((item) => !pageIdConnected.includes(item.id));
          }

          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
          if (error?.error?.message) this.message.error(error?.error?.message);
          else this.message.error(Message.ErrorOccurred);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
