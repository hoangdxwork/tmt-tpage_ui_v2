import { FacebookAuthorizeService } from './../../../../services/facebook-authorize.service';
import { TDSNotificationService } from 'tds-ui/notification';
import { VerifyTeamDto, FacebookVerifyResultDto } from '../../../../dto/team/team.dto';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSModalService } from 'tds-ui/modal';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewContainerRef, ViewEncapsulation} from '@angular/core';
import { FacebookAuth, FacebookAuthResponse, FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { FBUserPageRequestDTO, UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { TDSSafeAny, TDSHelperString } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { FacebookService } from '@app/services/facebook.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'facebook-channel',
  templateUrl: './facebook-channel.component.html',
  styleUrls: ['./facebook-channel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TDSDestroyService]
})

export class FacebookChannelComponent extends TpageBaseComponent implements OnInit  {

  data: CRMTeamDTO[] = [];
  loginTeam!: CRMTeamDTO | null;
  me!: FacebookUser | null;
  userFBAuth!: FacebookAuth | null;
  isLoading: boolean = true;

  constructor(private modal: TDSModalService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private message: TDSMessageService,
    private facebookGraphService: FacebookGraphService,
    private viewContainerRef: ViewContainerRef,
    private destroy$: TDSDestroyService,
    private facebookService: FacebookService,
    private notification: TDSNotificationService,
    public router: Router,
    @Inject(DOCUMENT) private document: Document,
    public activatedRoute: ActivatedRoute,
    private facebookAuthorizeService: FacebookAuthorizeService) {
      super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe( {
      next: (teams: CRMTeamDTO[] | any[]) => {

        this.isLoading = false;
        this.data = teams?.filter((x: any) => x.Type == CRMTeamType._Facebook);

        if(this.me && this.userFBAuth) {
          this.sortByFbLogin(this.me.id);
        } else {
          this.facebookAuthorizeService.fbLoginStatus().subscribe({
            next: (data: FacebookAuthResponse | any) => {
              this.isLoading = false;

              if(data && data.status === 'connected') {
                this.userFBAuth = data.authResponse;
                this.grapfbGetMe(this.userFBAuth?.accessToken);
              }
            },
            error: (error) => {
              this.isLoading = false;
              console.log(error);
            }
          })
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    })
  }

  grapfbGetMe(accessToken: any) {
    this.me = null;
    this.isLoading = true;

    this.facebookGraphService.grapfbGetMe(accessToken).subscribe({
      next: (me: any) => {
        this.isLoading = false;

        if(me && me.id) {
          this.me = me;

          if(this.data) {
            this.sortByFbLogin(me.id);
          }
        }

      },
      error: (error: TDSSafeAny) => {
        this.isLoading = false;
        console.log(error);
      }
    })
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.userFBAuth = null;

    this.facebookAuthorizeService.fbSignIn().subscribe({
      next: (data: TDSSafeAny) => {
        this.isLoading = false;

        if(data && data.graphDomain == "facebook") {
          this.userFBAuth = data;
          this.grapfbGetMe(data.accessToken);
        }
      },
      error: (error: TDSSafeAny) => {
        this.isLoading = false;
        console.log(error);
      }
    })
  }

  facebookSignOut() {
    this.isLoading  = true;
    this.facebookAuthorizeService.fbSignOut().subscribe({
      next: (res: TDSSafeAny) => {
        this.me = null;
        this.loginTeam = null;
        this.userFBAuth = null;

        this.message.success('Đăng xuất thành công');
        this.isLoading = true;
        this.document.location.reload();
      },
      error: (error: TDSSafeAny) => {
        this.isLoading = false;
        console.log(error);
        this.message.error('Đăng xuất thất bại, vui lòng F5 để thử lại');
      }
    })
  }

  sortByFbLogin(userId: string) {
    let team = this.data.find((x) => x.OwnerId && x.OwnerId == userId);
    if (team) {
      this.loginTeam = team;
      this.data.splice(this.data.indexOf(team), 1);
      this.data.unshift(team);
    }

    this.cdRef.detectChanges();
  }

  onFacebookConnected() {
    this.isLoading = true;
    let channel = this.data.find((x) => x.Facebook_UserId == this.me?.id);

    if (channel || !this.me) {
      this.message.error('Kênh đã tồn tại');
    }

    if(!TDSHelperString.hasValueString(this.userFBAuth?.accessToken)) {
      this.fbLoginStatus();
    } else {
      this.insertUserChannel(this.userFBAuth?.accessToken);
    }
  }

  fbLoginStatus() {
    this.facebookAuthorizeService.fbLoginStatus().subscribe({
      next: (data: FacebookAuthResponse | any) => {
        if (data.status === 'connected') {
          this.userFBAuth = data.authResponse;
          this.insertUserChannel(this.userFBAuth?.accessToken);
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  insertUserChannel(accessToken?: string) {
    let model = {
      fb_exchange_token: accessToken,
      grant_type: 'fb_exchange_token',
    };

    this.facebookService.getGraphFacebookMe(accessToken).subscribe({
      next: (me: any) => {
        this.crmTeamService.getLongLiveToken(model).subscribe({
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
              if(this.me) {
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

  checkPermission(accessToken: any) {
    this.isLoading = true;
    this.facebookService.checkPermission(accessToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        if(res && res.IsValid) {
          this.notification.success('Thông báo', 'Token hợp lệ');
        }

        if(res && !res.IsValid && res.ErrorMessage) {
          let message = ``;
          res.ErrorMessage.forEach((x: any) => {
            message += `<li class="text-info-500 font-semibold">${x}</li>`;
          })
          this.notification.error(`<span class="text-error-400">Token thiếu quyền</span>`, `<ul>${message}</ul>`);
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error(err.error?.message || 'Token không hợp lệ');
      }
    })
  }

  unconnectTeam(data: CRMTeamDTO, event: TDSSafeAny): void {
    event.preventDefault();
    event.stopImmediatePropagation();

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
      next: (res: any) => {
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
    });
  }

  showModalAddPage(child: CRMTeamDTO): void {
    if(!child.Facebook_PageName || !child.Facebook_UserName || !child.Name) {
      this.message.error('Dữ liệu lỗi');
      return;
    }

    let modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: child,
        type: CRMTeamType._Facebook
      },
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res) {
          this.crmService.loginOnChangeTeam$.emit(true);
          this.loadData();
        }
      }
    });
  }

  refreshTokenOwner(event: TDSSafeAny, team: CRMTeamDTO) {
    event.preventDefault();
    event.stopImmediatePropagation();

    let accessToken = this.userFBAuth?.accessToken;

    if(!TDSHelperString.hasValueString(accessToken)) {
      this.message.error('Không tìm thấy Token');
      return;
    }

    this.isLoading = true;
    this.getGraphFacebookUser(team);
  }

  getGraphFacebookUser(team: CRMTeamDTO) {
    let model = this.refreshTokenUserModel(team);
    this.facebookService.verifyConect(model).subscribe({
      next: (res: any) => {
        this.message.success('Làm mới token thành công');
        this.loadData();
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error.error?.message);
      }
    })
  }

  refreshTokenUserModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: this.me?.picture?.data?.url || team.ChannelAvatar,
      FacebookId: this.userFBAuth?.userID,
      FacebookName: this.me?.name || team.Name,
      Token: this.userFBAuth?.accessToken
    } as any

    return model;
  }

  refreshTokenGroupModel(team: CRMTeamDTO) {
    let model = {
      Id: team.Id,
      Facebook_PageToken: this.userFBAuth?.accessToken,
      Facebook_PageLogo: this.me?.picture?.data?.url || team.ChannelAvatar
    } as any

    return model;
  }

  refreshTokenChild(event: TDSSafeAny, child: CRMTeamDTO)  {
    event.preventDefault();
    event.stopImmediatePropagation();

    let accessToken = this.userFBAuth?.accessToken as any;
    if(!TDSHelperString.hasValueString(accessToken)) {
      this.message.error('Không tìm thấy Token');
      return;
    }

    this.isLoading = true;
    if(child && child.Facebook_TypeId == 2) {
      this.getGraphFacebookGroup(child);
    } else {
      this.getGraphFacebookPage(child, accessToken);
    }
  }

  getGraphFacebookPage(child: CRMTeamDTO, accessToken: any) {
    this.facebookGraphService.getGraphFacebookPage(accessToken).subscribe({
      next: (res: any) => {

        if(res && res.error) {
          this.isLoading = false;
          this.message.error(res.error.message);
          return;
        }

        let data = res?.data?.filter((x: any) => x.id == child.ChannelId)[0];
        if(data) {
          let model = {
            Id: child.Id,
            Name: data.name,
            Facebook_PageName: data.name,
            Facebook_PageToken: data.access_token,
            Facebook_PageLogo: data?.picture?.data?.url
          } as any;

          if(data.link) {
            model.Facebook_Link = data.link;
          }

          this.crmService.patchCRMTeamToken(child.Id, model).subscribe({
            next: () => {
              this.facebookService.getGraphFacebookMe(data.access_token).pipe(takeUntil(this.destroy$)).subscribe({
                next: (res1: any) => {
                    this.facebookService.getGraphFacebookChannelId(data.access_token, child.ChannelId).pipe(takeUntil(this.destroy$)).subscribe({
                        next: (res2: any) => {
                          this.message.success('Làm mới token thành công');
                          this.loadData();
                        },
                        error: error => {
                          this.isLoading = false;
                          this.message.error(error.error?.message);
                        }
                    })
                },
                error: error => {
                  this.isLoading = false;
                  this.message.error(error.error?.message);
                }
            })
            },
            error: (error: any) => {
              this.isLoading = false;
              this.message.error(error.error?.message);
            }
          })
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error.error?.message);
      }
    })
  }

  getGraphFacebookGroup(child: CRMTeamDTO) {
    this.facebookGraphService.getGraphFacebookGroup(child.ChannelId).subscribe({
      next: (res: any) => {

        if(res && res.error) {
          this.isLoading = false;
          this.message.error(res.error.message);
          return;
        }

        let model = this.refreshTokenGroupModel(child);
        this.crmTeamService.patchCRMTeamToken(child.Id, model).subscribe({
          next: (res: any) => {
            this.message.success('Làm mới token thành công');
            this.loadData();
          },
          error: (error: any) => {
            this.isLoading = false;
            this.message.error(error.error?.message);
          }
        })
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error.error?.message);
      }
    })
  }


  verifyConnect(team: CRMTeamDTO) {
    this.isLoading = true;
    let ownerToken = team.OwnerToken;

    this.facebookService.getGraphFacebookMe(ownerToken).subscribe({
      next: (me: any) => {

          let model = this.prepareVerifyModel(team);
          this.facebookService.verifyConect(model).subscribe({
              next: (res: FacebookVerifyResultDto) => {

                let userToken = res.Data?.Facebook_UserToken;
                if(!userToken) {
                    this.isLoading = false;
                    this.message.error('Kết nối đã quá hạn, vui lòng làm mới token');
                    return;
                }

                this.facebookGraphService.getGraphFacebookAccounts(userToken).subscribe({
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
    model.Facebook_AccountId = this.me?.id,
    model.Facebook_ASUserId = this.me?.id,
    model.Facebook_TypeId = 'User';
    model.Facebook_UserAvatar = this.me?.picture?.data?.url;
    model.Facebook_UserName = this.me?.name;
    model.Facebook_UserToken = this.userFBAuth?.accessToken;
    model.Facebook_UserPrivateToken = '';
    model.Facebook_UserPrivateToken2 = '';
    model.IsConverted = true;
    model.IsDefault = true;
    model.Id = 0;
    model.Name = this.me?.name as any;
    model.OwnerId = this.me?.id as any;
    model.OwnerToken = this.userFBAuth?.accessToken;
    model.OwnerAvatar = this.me?.picture?.data?.url;
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
