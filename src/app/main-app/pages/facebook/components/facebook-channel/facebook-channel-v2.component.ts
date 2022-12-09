import { FacebookCacheDto } from './../../../../../lib/dto/facebook.dto';
import { TDSNotificationService } from 'tds-ui/notification';
import { VerifyTeamDto, FacebookVerifyResultDto } from './../../../../dto/team/team.dto';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSModalService } from 'tds-ui/modal';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef, Output, EventEmitter} from '@angular/core';
import { FacebookAuth, FacebookAuthResponse, FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { FBUserPageRequestDTO, UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { FacebookService } from '@app/services/facebook.service';

@Component({
  selector: 'facebook-channel-v2',
  templateUrl: './facebook-channel-v2.component.html',
  providers: [TDSDestroyService]
})
export class FacebookChannelV2Component extends TpageBaseComponent implements OnInit  {
  data: CRMTeamDTO[] = [];

  loginTeam!: CRMTeamDTO | null;
  userFBLogin!: FacebookUser | null;
  userFBAuth!: FacebookAuth | null;
  isLoading: boolean = true;

  constructor(private modal: TDSModalService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private message: TDSMessageService,
    private facebookGraphService: FacebookGraphService,
    private viewContainerRef: ViewContainerRef,
    private facebookLoginService: FacebookLoginService,
    private destroy$: TDSDestroyService,
    private facebookService: FacebookService,
    private notification: TDSNotificationService,
    public router: Router,
    public activatedRoute: ActivatedRoute) {
      super(crmTeamService, activatedRoute, router);
  }

  ngAfterViewInit(): void {
    this.facebookLoginService.init().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.facebookLoginService.getLoginStatus().pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: FacebookAuthResponse) => {
                if (res.status === 'connected') {
                    this.userFBAuth = res.authResponse;
                    this.getMe();
                }
              },
              error: (error) => {
                  this.userFBLogin = null;
              }
            })
        },
        error: (error) => {
            this.userFBLogin = null;
        }
      })
  }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản TShop không?
    let user = this.facebookService.getCacheLoginUser() as any;
    let exist = user != null && user?.data && user?.type == CRMTeamType._Facebook;

    if(exist) {
      this.userFBLogin = user.data;
    } else {
      this.userFBLogin = null;
      this.facebookSignOut();
    }

    this.loadData();
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: FacebookAuth) => {
          if(res) {
              this.userFBAuth = {...res};
              this.getMe();
          }

          this.isLoading = false;
        },
        error: error => {
          this.isLoading = false;
        }
      }
    )
  }

  facebookSignOut() {
    this.isLoading = true;
    this.facebookLoginService.logout().pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.userFBLogin = null;
          this.loginTeam = null;
          this.isLoading = false;
        },
        error: error => {
            this.isLoading = false;
        }
      })
  }

  getMe() {
    this.facebookLoginService.getMe().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: FacebookUser) => {
          if(res && res.id) {
            this.userFBLogin = {...res};

            let cacheData = {
              access_token: this.userFBAuth?.accessToken,
              user: this.userFBLogin
            } as FacebookCacheDto;

            this.facebookService.setCacheLoginUser(cacheData, CRMTeamType._Facebook);

            if (this.data && this.data.length > 0) {
              this.sortByFbLogin(res.id);
            }
          }
        },
        error: (error) => {
          this.userFBLogin = null;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      });
  }

  loadData() {
    this.isLoading = true;

    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe( {
        next: (res: CRMTeamDTO[]) => {
          if(!res) return;

          this.data = res.filter((x: any) => x.Type != CRMTeamType._TUser);

          if(this.userFBLogin) {
            this.sortByFbLogin(this.userFBLogin.id);
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

  sortByFbLogin(userId: string) {
    // TODO: lấy tài khoản đang đăng nhập đưa lên đầu danh sách
    let exist = this.data.find((x) => x.OwnerId && x.OwnerId == userId);

    if (exist) {
      this.loginTeam = {...exist};

      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);
    }

    this.cdRef.detectChanges();
  }

  onFacebookConnected() {
    this.isLoading = true;
    let channel = this.data.find((x) => x.Facebook_UserId == this.userFBLogin?.id);

    if (channel || !this.userFBLogin) {
      this.message.error('Kênh đã tồn tại');
    }

    this.insertUserChannel(this.userFBAuth?.accessToken);
  }

  insertUserChannel(accessToken?: string) {
    let model = {
        fb_exchange_token: accessToken,
        grant_type: 'fb_exchange_token',
    };

    this.facebookService.verifyConectGraphFacebook(accessToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (me: any) => {

        this.crmTeamService.getLongLiveToken(model).pipe(takeUntil(this.destroy$)).subscribe(
          {
            next: (res) => {
              let team = this.prepareLoginModel();

              this.crmTeamService.insert(team).pipe(takeUntil(this.destroy$)).subscribe({
                next: (obs) => {
                  this.isLoading = false;
                  this.message.success('Thêm page thành công');
                  this.loadData();
                },
                error: error => {
                  this.isLoading = false;
                  this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
                }
              });
            },
            error: (error) => {
              // TODO: nếu lỗi sẽ lấy token của user đăng nhập
              if(this.userFBLogin) {
                let team = this.prepareLoginModel();

                this.crmTeamService.insert(team).pipe(takeUntil(this.destroy$)).subscribe({
                  next: (obs) => {
                    this.isLoading = false;
                    this.message.success('Thêm page thành công');
                    this.loadData();
                  },
                  error: (error) => {
                      this.isLoading = false;
                      this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
                  }
                })
              }
            }
          })
      }
    })
  }

  unconnectTeam(data: CRMTeamDTO): void {
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${ data.Name }.`,
      onOk: () => {
        this.deleteTeam(data.Id);
      },
      onCancel: () => {},
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  deleteTeam(id: number) {
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          this.message.success('Hủy kết nối thành công');
          this.crmService.loginOnChangeTeam$.emit(true);
          
          if(id == this.loginTeam?.Id) {
            this.loginTeam = null;
          }

          this.loadData();
        },
        error: (error) => {
          this.message.error(error?.error?.message || 'Đã có lỗi xảy ra');
          this.cdRef.detectChanges();
        }
      }
    );
  }

  showModalAddPage(child: CRMTeamDTO): void {
    if(!child.Facebook_PageName || !child.Facebook_UserName || !child.Name) {
      this.message.error('Dữ liệu lỗi');
      return;
    }

    const modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: child,
        type: CRMTeamType._Facebook
      },
    });

    modal.afterClose.subscribe((res) => {
      if(res) {
        if(res) {
          this.crmService.loginOnChangeTeam$.emit(true);
          this.loadData();
        }
      }
    });
  }

  refreshPageToken(team: CRMTeamDTO) {
    let model = {
      access_token: team.ChannelToken,
      pageId: team.ChannelId,
    };

    this.isLoading = true;

    this.crmTeamService.refreshPageToken(team.Id, model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          if (TDSHelperString.hasValueString(res)) {
            this.message.success('Cập nhật token thành công');
            this.loadData();
          } else {
            this.message.error('Cập nhật token thất bại');
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Cập nhật token thất bại');
          this.cdRef.detectChanges();
        }
      }
    );
  }

  verifyConnect(team: CRMTeamDTO) {
    this.isLoading = true;
    let ownerToken = team.OwnerToken;

    this.facebookService.verifyConectGraphFacebook(ownerToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (me: any) => {
          let model = this.prepareVerifyModel(team);

          this.facebookService.verifyConect(model).pipe(takeUntil(this.destroy$)).subscribe({
              next: (res: FacebookVerifyResultDto) => {

                let userToken = res.Data?.Facebook_UserToken;
                if(!userToken) {
                    this.isLoading = false;
                    this.message.error('Kết nối đã quá hạn, vui lòng làm mới token');
                    return;
                }

                this.facebookGraphService.getUserPages(userToken).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (res: FBUserPageRequestDTO) => {
                        this.isLoading = false;

                        let exist = res && res.data && res.data.length == 0;
                        if(exist) {
                            this.message.info('Không tìm thấy kênh mới nào');
                            return;
                        }

                        let ids = team?.Childs?.map(x => x.ChannelId) || [];
                        let verifyData = res?.data as UserPageDTO[];

                        let newArray: any = [];
                        verifyData.map((x: UserPageDTO) => {
                            let exist1 = ids?.find(a => a == x.id);
                            if(!exist1) {
                                let item = this.prepareUserPageToTeam(x, team);
                                newArray.push(item);
                            }
                        });

                        if(newArray.length == 0) {
                            this.isLoading = false;
                            this.message.info('Không tìm thấy kênh mới nào');
                            return;
                        }

                        // TODO: map thêm kênh mới nếu có
                        let findIndex = this.data.findIndex(x => x.Id == team.Id);
                        if(findIndex > -1) {
                          this.data[findIndex].Childs = [...(this.data[findIndex].Childs || []), ...newArray];
                          this.data[findIndex] = {...this.data[findIndex]};

                          this.message.info(`Đã tìm thấy ${newArray.length} kênh mới`);
                        }

                        this.isLoading = false;
                    },
                    error: (error) => {
                      this.isLoading = false;
                      this.message.error(error.error?.message);
                    }
                })
              },
              error: (error: any) => {
                  this.isLoading = false;
                  this.message.error(error.error?.message);
                  this.cdRef.detectChanges();
              }
            })
      },
      error: (error: any) => {
          this.isLoading = false;
          this.notification.error(`Không thể chọn kênh`,
            `<div class="whitespace-normal w-[300px]">Hãy đăng nhập đúng tài khoản facebook<br>
              [<span class="text-error-400 font-semibold">${team.Name}</span>]
            </div>`,
            { duration: 5000 });
      }
    })
  }

  prepareLoginModel() {
    let model = {} as CRMTeamDTO;

    model.CountGroup = 0;
    model.CountPage = 0;
    model.Facebook_AccountId = this.userFBLogin?.id,
    model.Facebook_ASUserId = this.userFBLogin?.id,
    model.Facebook_TypeId = 'User';
    model.Facebook_UserAvatar = this.userFBLogin?.picture.data.url;
    model.Facebook_UserName = this.userFBLogin?.name;
    model.Facebook_UserToken = this.userFBAuth?.accessToken;
    model.Facebook_UserPrivateToken = '';
    model.Facebook_UserPrivateToken2 = '';
    model.IsConverted = true;
    model.IsDefault = true;
    model.Id = 0;
    model.Name = this.userFBLogin?.name as any;
    model.OwnerId = this.userFBLogin?.id as any;
    model.OwnerToken = this.userFBAuth?.accessToken;
    model.OwnerAvatar = this.userFBLogin?.picture.data.url;
    model.Type = CRMTeamType._Facebook;

    return model;
  }

  prepareVerifyModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: team.ChannelAvatar,
      FacebookId : team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken
    } as VerifyTeamDto

    return model;
  }

  prepareUserPageToTeam(x: UserPageDTO, team?: CRMTeamDTO) {
    let model = {} as CRMTeamDTO;

    model.Name = x.name;
    model.ChannelId = x.id;
    model.ChannelToken = x.access_token;
    model.Facebook_Link = x.link;
    model.Facebook_TypeId = 'Page';
    model.Facebook_ASUserId = team?.OwnerId;
    model.Facebook_UserAvatar = team?.Facebook_UserAvatar;
    model.Facebook_UserId = team?.Facebook_UserId;
    model.Facebook_UserName = team?.Name;
    model.Facebook_UserToken = team?.OwnerToken;
    model.Facebook_PageId = x.id;
    model.Facebook_PageName = x.name;
    model.Facebook_PageLogo = x.picture?.data?.url;
    model.Facebook_PageToken = x.access_token;
    model.Active = false;
    model.ParentId = team?.Id;
    model.Type = CRMTeamType._Facebook;

    return model;
  }
}
