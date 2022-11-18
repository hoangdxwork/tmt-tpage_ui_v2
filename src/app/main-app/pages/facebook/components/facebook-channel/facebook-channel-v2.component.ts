import { VerifyTeamDto } from './../../../../dto/team/team.dto';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSModalService } from 'tds-ui/modal';
import { AddPageComponent } from '../add-page/add-page.component';
import { ConvertPageComponent } from '../convert-page/convert-page.component';
import { Observable } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookAuth, FacebookAuthResponse, FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { PageDataPictureDTO, PagePictureDTO, UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { ViewportScroller } from '@angular/common';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { debounceTime, distinctUntilChanged, map, takeUntil, finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { TShopDto, TUserDto } from '@core/dto/tshop.dto';
import { TShopService } from '@app/services/tshop-service/tshop.service';
import { FacebookService } from '@app/services/facebook.service';
import { Dictionary } from 'lodash';

@Component({
  selector: 'facebook-channel-v2',
  templateUrl: './facebook-channel-v2.component.html',
  animations: [eventFadeStateTrigger],
  providers: [ TDSDestroyService]
})
export class FacebookChannelV2Component extends TpageBaseComponent implements OnInit, AfterViewInit  {

  @HostBinding("@eventFadeState") eventAnimation = true;
  @ViewChild('innerText') innerText!: ElementRef;
  @ViewChild('templatePageNotConnect') templatePageNotConnect!: ElementRef;

  data: CRMTeamDTO[] = [];

  loginTeam!: CRMTeamDTO | null;
  lstNotConnectPage!: Dictionary<UserPageDTO[]>;
  userFBLogin!: FacebookUser | null;
  userFBAuth!: FacebookAuth | null;

  listFilter: Array<any> = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Đang hoạt động' },
    { id: 3, name: 'Người dùng đã ẩn' },
    { id: 4, name: 'Chưa có trang được kết nối' }
  ];

  currentFilter = this.listFilter[0];

  fieldListFilter: any = {};

  isLoading: boolean = true;
  lastScrollPosition: TDSSafeAny = null;

  constructor(private modal: TDSModalService,
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
    public activatedRoute: ActivatedRoute
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

      // if(this.innerText?.nativeElement) {
      //   fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      //       map((event: any) => { return event.target.value }), debounceTime(750), distinctUntilChanged())
      //       .subscribe((text: any) => {

      //         this.isLoading = false;
      //         setTimeout(() => {
      //             if (!TDSHelperString.hasValueString(text)) delete this.dataSearch;
      //             this.dataSearch = this.data.filter((x) => x.Name.toLowerCase().indexOf(text.toLowerCase()) !== -1 );
      //         }, 250)
      //     })
      // }

  }

  ngOnInit(): void {
    this.loadData();
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: FacebookAuth) => {
          if(res) {
              this.userFBAuth = res;
              this.getMe();

              if(this.userFBLogin) {
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

  getMe() {
    this.facebookLoginService.getMe().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: FacebookUser) => {
          if(res && res.id) {
            this.userFBLogin = {...res};
            
            if (this.data && this.data.length > 0) {
              // this.onChangeCollapse(this.data[0].Id, false);
              this.sortByFbLogin(res.id);
            }
          }
        },
        error: error => {
            this.userFBLogin = null
        }
      });
  }

  loadData(isRefresh?: boolean) {
    this.isLoading = true;

    this.crmTeamService.getAllChannels().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: CRMTeamDTO[]) => {
          if(!res) return;

          this.data = res.filter((x: any) => x.Type != CRMTeamType._TUser);

          if(this.userFBLogin) {
            this.sortByFbLogin(this.userFBLogin.id);
          }

          if(isRefresh){
            this.crmTeamService.onRefreshListFacebook();
            this.scrollToLastPosition();
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;
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

  insertUserChannel(accessToken: string | undefined) {
    let model = {
        fb_exchange_token: accessToken,
        grant_type: 'fb_exchange_token',
    };

    this.crmTeamService.getLongLiveToken(model).pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res) => {
          let team = this.prepareLoginModel('Facebook');


          this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$)).subscribe({
            next: (obs) => {

              this.message.success('Thêm page thành công');
              this.loadData(true);
              this.isLoading = false;
              this.cdRef.detectChanges();

            }, 
            error: error => {
              this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
              this.isLoading = false;
              this.cdRef.detectChanges();
            }
          })

        },
        error: error => {
          // TODO: nếu lỗi sẽ lấy token của user đăng nhập
          if(this.userFBLogin) {
            let team = this.prepareLoginModel('Facebook');

            this.crmTeamService.insert(team).pipe(takeUntil(this._destroy$), finalize(() => this.isLoading = false)).subscribe({
              next: (obs) => {
                this.message.success('Thêm page thành công');
                this.loadData(true);
              }, 
              error: (error) => {
                  this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
                  this.isLoading = false;
                  this.cdRef.detectChanges();
              }
            })
          }
        }
      })
  }

  sortByFbLogin(userId: string) {
    // TODO: lấy tài khoản đang đăng nhập đưa lên đầu danh sách
    let exist = this.data.find((x) => x.Facebook_UserId && x.Facebook_UserId == userId);
    
    if (exist) {
      this.loginTeam = {...exist};
      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);
    }

    this.cdRef.detectChanges();
  }

  unConnected(data: CRMTeamDTO): void {
    this.lastScrollPosition = this.viewportScroller.getScrollPosition();
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${ data.Name }.`,
      onOk: () => {
        this.delete(data.Id);
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
          this.loadData(true);
        },
        error: (error) => {
          if (error?.error?.message) {
            this.message.error(error?.error?.message);
          } else {
            this.message.error(Message.ErrorOccurred);
          }
          this.cdRef.detectChanges();
        }
      }
    );
  }

  showModalAddPage(data: UserPageDTO, user: CRMTeamDTO): void {
    const modal = this.modal.create({
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
        this.loadData(true);
        if (this.lstNotConnectPage[user.Id]) {
          this.lstNotConnectPage[user.Id] = this.lstNotConnectPage[user.Id].filter((x) => x.id != data.id);
        }
      }
    });
  }

  // onActive(id: number, isUser: boolean) {

  //   this.isLoading = true;
  //   this.crmTeamService.updateActive(id).pipe(takeUntil(this._destroy$)).subscribe(
  //     {
  //       next: (res: any) => {

  //         this.message.success('Thao tác thành công');
  //         this.updateActiveData(id, isUser);
  //         this.isLoading = false;
  //         this.cdRef.detectChanges();
  //       },
  //       error: error => {

  //         this.isLoading = false;

  //         if (error?.error?.message) {
  //           this.message.error(error?.error?.message);
  //         } else {
  //           this.message.error(Message.ErrorOccurred);
  //         }

  //         this.cdRef.detectChanges();
  //       }
  //     }
  //   );
  // }

  updateActiveData(id: number, isUser: boolean) {
    if(isUser) {
      let channel = this.data.find((x) => x.Id == id);
      channel && (channel.Active = !channel.Active);
    }
    else {
      for(let i = 0; i < this.data.length; i++) {
        if(TDSHelperArray.hasListValue(this.data[i]?.Childs)) {
          let channel = this.data[i].Childs!.find((x) => x.Id == id);
          if(channel) {
            channel.Active = !channel.Active;
            break;
          }
        }
      }
    }

    this.crmTeamService.onRefreshListFacebook();
  }

  // refreshPageToken(teamId: number, pageId: number) {
  //   let model = {
  //     access_token: '',
  //     pageId: pageId,
  //   };

  //   this.isLoading = true;

  //   this.crmTeamService.refreshPageToken(teamId, model).pipe(takeUntil(this._destroy$)).subscribe({
  //       next: (res: any) => {
  //         if (TDSHelperString.hasValueString(res)) {
  //           this.message.success('Cập nhật token thành công');
  //           this.loadData(true);
  //         } else {
  //           this.message.error('Cập nhật token thất bại');
  //         }
  //       },
  //       error: (error) => {
  //         this.isLoading = false;
  //         if(error?.error?.message)this.message.error(error?.error?.message);
  //         else this.message.error('Cập nhật token thất bại');
  //         this.cdRef.detectChanges();
  //       }
  //     }
  //   );
  // }

  // getListData(teamId: number) {
  //   let field = this.getFieldListFilter(teamId);
  //   let channel = this.data.find((x) => x.Id == teamId);

  //   if (!channel) {
  //     this.message.error(Message.ConnectionChannel.NotFoundUserPage);
  //     return;
  //   }

  //   let childIds = channel?.Childs!.map(x => x.ChannelId) || [];

  //   if (field == 1) {
  //     this.lstData[teamId] = this.lstData[teamId] || {};
  //     this.lstData[teamId]['data'] = channel?.Childs || [];
  //     this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
  //   } else if (field == 2) {
  //     this.lstData[teamId] = this.lstData[teamId] || {};
  //     this.lstData[teamId]['data'] = channel?.Childs!.filter((x) => x.Active);
  //     this.lstData[teamId]['notConnected'] = [];
  //   } else if (field == 3) {
  //     this.lstData[teamId] = this.lstData[teamId] || {};
  //     this.lstData[teamId]['data'] = channel?.Childs!.filter((x) => !x.Active);
  //     this.lstData[teamId]['notConnected'] = [];
  //   } else if (field == 4) {
  //     this.lstData[teamId] = this.lstData[teamId] || {};
  //     this.lstData[teamId]['data'] = [];
  //     this.lstData[teamId]['notConnected'] = this.lstPageNotConnect?.[teamId]?.filter(x => !childIds.includes(x.id)) || [];
  //   }
  // }

  scrollToLastPosition(){
    if(TDSHelperObject.hasValue(this.lastScrollPosition)) {
      this.viewportScroller.scrollToPosition(this.lastScrollPosition);
    }
  }

  verifyConnect(team: CRMTeamDTO) {
    if(this.isLoading) {
      return;
    }

    let model = this.prepareVerifyModel(team);
    // let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);
    this.isLoading = true;

    this.facebookService.verifyConect(model).pipe(takeUntil(this._destroy$)).subscribe({
        next: (res) => {
          this.facebookGraphService.getUserPages(team.OwnerToken).pipe(takeUntil(this._destroy$)).subscribe(
            {
              next: (res) => {

                if(res && TDSHelperArray.hasListValue(res?.data)) {
                  
                  // this.data.map(x => {
                  //   if(x.Id == )
                  // })
                  // this.lstPageNotConnect[team.Id] = res.data;
                  // this.lstData[team.Id]['notConnected'] = this.lstPageNotConnect[team.Id].filter((item) => !pageIdConnected.includes(item.id));

                  // if(this.lstData[team.Id]['notConnected']?.length > 0) {
                  //   this.message.success(`Tìm thấy ${this.lstData[team.Id]['notConnected']?.length} kênh mới`);
                  // } else {
                  //   this.message.info('Không tìm thấy kênh mới nào');
                  // }
                } else {
                  this.message.info('Không tìm thấy kênh mới nào');
                }

                this.isLoading = false;
              },
              error: (error) => {debugger
                this.isLoading = false;
                this.message.error(error.error?.message || 'Kết nối không thành công');
              }
          })
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message.error(error.error?.message || 'Kết nối không thành công');
        }
      }
    )
  }

  prepareLoginModel(type: string) {
    return {
      Facebook_ASUserId: this.userFBLogin?.id,
      Facebook_TypeId: "User",
      Facebook_UserAvatar: this.userFBLogin?.picture.data.url,
      Facebook_UserName: this.userFBLogin?.name,
      Facebook_UserToken: this.userFBAuth?.accessToken,
      Facebook_UserId: this.userFBLogin?.id,
      IsConverted: true,
      IsDefault: true,
      Name: this.userFBLogin?.name,
      Type: type
    }
  }

  prepareVerifyModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: team.ChannelAvatar || team.Facebook_UserAvatar || team.OwnerAvatar,
      FacebookId : team.ChannelId || team.Facebook_UserId || team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken || team.ChannelToken
    } as VerifyTeamDto

    return model;
  }
}
