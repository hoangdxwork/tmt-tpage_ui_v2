import { VerifyTeamDto, FacebookVerifyResultDto } from './../../../../dto/team/team.dto';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TDSModalService } from 'tds-ui/modal';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSDestroyService } from 'tds-ui/core/services';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { FacebookAuth, FacebookAuthResponse, FacebookUser } from 'src/app/lib/dto/facebook.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { ViewportScroller } from '@angular/common';
import { FacebookLoginService } from 'src/app/main-app/services/facebook-login.service';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { FacebookService } from '@app/services/facebook.service';

@Component({
  selector: 'facebook-channel-v2',
  templateUrl: './facebook-channel-v2.component.html',
  providers: [ TDSDestroyService]
})
export class FacebookChannelV2Component extends TpageBaseComponent implements OnInit, AfterViewInit  {
  data: CRMTeamDTO[] = [];

  loginTeam!: CRMTeamDTO | null;
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
    private destroy$: TDSDestroyService,
    private facebookService: FacebookService,
    public router: Router,
    public activatedRoute: ActivatedRoute
    ) {
      super(crmTeamService, activatedRoute, router);
    }

  ngAfterViewInit(): void {
    this.facebookLoginService.init().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
          this.facebookLoginService.getLoginStatus().pipe(takeUntil(this.destroy$)).subscribe(
            {
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
    this.loadData();
  }

  facebookSignIn(): void {
    this.isLoading = true;
    this.facebookLoginService.login().pipe(takeUntil(this.destroy$)).subscribe(
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
    this.facebookLoginService.logout().pipe(takeUntil(this.destroy$)).subscribe(
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
    this.facebookLoginService.getMe().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: FacebookUser) => {
          if(res && res.id) {
            this.userFBLogin = {...res};
            
            if (this.data && this.data.length > 0) {
              this.sortByFbLogin(res.id);
            }
          }
        },
        error: error => {
            this.userFBLogin = null
        }
      });
  }

  loadData() {
    this.isLoading = true;

    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: CRMTeamDTO[]) => {
          if(!res) return;

          this.data = res.filter((x: any) => x.Type != CRMTeamType._TUser);

          if(this.userFBLogin) {
            this.sortByFbLogin(this.userFBLogin.id);
          }

          this.crmTeamService.onRefreshListFacebook();
          this.scrollToLastPosition();

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
    let exist = this.data.find((x) => x.Facebook_UserId && x.Facebook_UserId == userId);
    
    if (exist) {
      this.loginTeam = {...exist};
      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);
    }

    this.cdRef.detectChanges();
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
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.message.success('Hủy kết nối thành công');
          this.loadData();
        },
        error: (error) => {
          this.message.error(error?.error?.message || 'Đã có lỗi xảy ra');
          this.cdRef.detectChanges();
        }
      }
    );
  }

  showModalAddPage(team: CRMTeamDTO): void {
    const modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: team
      },
    });

    modal.afterClose.subscribe((result) => {
      if(result) {
        this.loadData();
      }
    });
  }

  refreshPageToken(teamId: number, pageId: number) {
    let model = {
      access_token: '',
      pageId: pageId,
    };

    this.isLoading = true;

    this.crmTeamService.refreshPageToken(teamId, model).pipe(takeUntil(this.destroy$)).subscribe({
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
    this.isLoading = true;

    this.facebookService.verifyConect(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: FacebookVerifyResultDto) => {
          let token = res.Data?.Facebook_UserToken || team.OwnerToken;

          if(!token) {
            this.isLoading = false;
            this.message.error('Kết nối đã quá hạn');
            return;
          }

          this.facebookGraphService.getUserPages(token).pipe(takeUntil(this.destroy$)).subscribe(
            {
              next: (res) => {

                if(res && TDSHelperArray.hasListValue(res?.data)) {
                
                  let lstNewPage = [...res.data];
                  let index = this.data.indexOf(team);
                  let lstNewTeam: CRMTeamDTO[] = [];
                  let ids = team.Childs?.map(x=> x.ChannelId) || []; //TODO: Danh sách id của page đã kết nối

                  lstNewPage.map(x => {
                    if(!ids.includes(x.id)) {
                      lstNewTeam.push(this.prepareUserPageToTeam(x, team));
                    }
                  });

                  if(lstNewTeam.length == 0) {
                    this.isLoading = false;
                    this.message.info('Không tìm thấy kênh mới nào');
                    return;
                  }

                  this.message.info(`Đã tìm thấy ${lstNewTeam.length} kênh mới`);
                  //TODO: Thêm danh sách page chưa kết nối vào danh sách child
                  this.data[index].Childs = [...(this.data[index].Childs || []), ...lstNewTeam];
                } else {
                  this.message.info('Không tìm thấy kênh mới nào');
                }

                this.isLoading = false;
                this.cdRef.detectChanges();
              },
              error: (error) => {
                this.isLoading = false;
                this.message.error(error.error?.message || 'Tìm kiếm thất bại');
                this.cdRef.detectChanges();
              }
          })
        },
        error: (error: any) => {
          this.isLoading = false;
          this.message.error(error.error?.message || 'Lỗi xác thực');
          this.cdRef.detectChanges();
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

  prepareUserPageToTeam(x: UserPageDTO, team?: CRMTeamDTO) {
    let model = {} as CRMTeamDTO;

    model.Name = x.name;
    model.ChannelId = x.id;
    model.ChannelToken = x.access_token;
    model.Facebook_Link = x.link;
    model.Facebook_ASUserId = this.userFBLogin?.id;
    model.Facebook_UserAvatar = team?.OwnerAvatar;
    model.Facebook_UserId = team?.OwnerId;
    model.Facebook_UserName = team?.Name;
    model.Facebook_UserToken = team?.OwnerToken || x.access_token;
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
