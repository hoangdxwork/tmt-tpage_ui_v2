import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { AddPageComponent } from './../add-page/add-page.component';
import { TDSModalService } from 'tds-ui/modal';
import { ViewportScroller } from '@angular/common';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { Message } from './../../../../../lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSSafeAny, TDSHelperArray, TDSHelperObject } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { TUserDto } from '@core/dto/tshop.dto';
import { TShopService } from '@app/services/tshop-service/tshop.service';

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
  @ViewChild('innerText') innerText!: ElementRef;

  data: CRMTeamDTO[] = [];
  dataSearch?: CRMTeamDTO[];

  userTShopLogin!: TUserDto | null;
  isUserTShopConnectChannel: boolean = false;

  listFilter: Array<any> = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Đang hoạt động' },
    { id: 3, name: 'Người dùng đã ẩn' },
    { id: 4, name: 'Chưa có trang được kết nối' }
  ];

  isLoading: boolean = true;
  isLoadChannel: boolean = false;
  iconCollapse: TDSSafeAny = {};
  fieldListFilter: any = {};
  loginTeam!: CRMTeamDTO;

  tShopAuthentication!: string;
  lstPageNotConnect: PageNotConnectDTO = {};
  lstData: TDSSafeAny = {};
  lastScrollPosition: TDSSafeAny = null;

  constructor(
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService,
    private facebookService: FacebookService,
    private facebookGraphService: FacebookGraphService,
    private viewportScroller: ViewportScroller,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private message: TDSMessageService
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadListTeam();
    this.userTShopLogin = this.tShopService.getCacheTShopUser();

    if(this.userTShopLogin) {
      this.sortByTShopLogin(this.userTShopLogin?.Id);
    } else {
      this.getTShopAuthentication();
    }
  }

  getTShopAuthentication() {
    this.tShopService.removeCacheTshopUser();
    let fragment = 'connect-channel/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);
     
    this.tShopService.onChangeUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res) {
          this.userTShopLogin = {...res};
          this.tShopService.setCacheTShopUser(this.userTShopLogin);
          this.message.success('Đăng nhập thành công');
          
          this.sortByTShopLogin(res?.Id);
        }
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    });
  }

  tShopSignIn() {
    this.getTShopAuthentication();
    
    const width = 800;
    const height = 700;
    const y = (window.top?.outerHeight || 0) / 2 + (window.top?.screenY || 0) - (width / 2);
    const x = (window.top?.outerWidth || 0) / 2 + (window.top?.screenX || 0) - (height / 2);
    window.open(this.tShopAuthentication, ``, `resizable=no, width=${width}, height=${height}, top=${y}, left=${x}`);
  }

  tShopSignOut() {
    this.isLoading = true;
    this.tShopService.logout();
    this.tShopService.removeCacheTshopUser();
    this.userTShopLogin = null;
    this.isLoading = false;
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

  insertUserTShop(accessToken: string | null) {
    let team = {
      Id: 0,
      OwnerId: this.userTShopLogin?.Id,
      Name: this.userTShopLogin?.Name,
      Type: "TUser",
      ChannelId: this.userTShopLogin?.Id,
      OwnerToken: accessToken,
      OwnerAvatar: this.userTShopLogin?.Address
    };

    this.crmTeamService.insert(team).pipe(takeUntil(this.destroy$)).subscribe({
      next: (obs) => {

        this.message.success('Thêm page thành công');
        this.loadListTeam(true);
        this.isLoading = false;
        this.cdRef.detectChanges();

      }, 
      error: (error) => {
        this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    })
  }

  loadListTeam(isRefresh?: boolean) {
    this.isLoading = true;
    this.isLoadChannel = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          if (res) {
            this.data = res.filter((x: any) => x.Type == CRMTeamType._TUser);
          }

          this.data.sort((a: any, b: any) => {
            if (a.Active) return -1;
            return 1;
          });

          this.data.forEach((item: any) => {
              this.fieldListFilter[item.Id] = this.listFilter[0];
              this.getListData(item.Id);

              if(item.Childs.length > 0) {
                this.onChangeCollapse(item.Id, true);
              }
          });

          if (this.userTShopLogin) {
            this.sortByTShopLogin(this.userTShopLogin.Id);
          }

          if(isRefresh){
            this.crmTeamService.onRefreshListFacebook();
            this.scrollToLastPosition();
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

  sortByTShopLogin(ownerId: string | undefined) {
    let exist = this.data.find((x) => x.OwnerId && x.OwnerId == ownerId);

    if (exist) {
      this.loginTeam = {...exist};

      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);

      exist.OwnerToken = this.tShopService.getCurrentToken() || exist.OwnerToken;

      this.onChangeCollapse(exist.Id, true);
      this.isUserTShopConnectChannel = true;
    }
    else {
      this.isUserTShopConnectChannel = false;
    }
  }

  getIsIconCollapse(id: number) {
    if (this.iconCollapse[id] && this.iconCollapse[id] === true)
      return true;
    return false;
  }

  onChangeCollapse(id: number, event: TDSSafeAny) {
    this.iconCollapse[id] = event;
  }

  getTShopPages(team: CRMTeamDTO) {
    let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);

    this.crmService.getTShop(team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          if(TDSHelperArray.hasListValue(res))
          {
            this.lstPageNotConnect[team.Id] = res.map(x => {
              return {
                access_token: '',
                id: x.Id,
                name: x.Name,
                picture: {
                  data : {
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

          if(error?.error?.message) {
            this.message.error(error?.error?.message);
          } else {
            this.message.error('Đã có lỗi xảy ra');
          };
        }
      }
    );
  }

  getFieldListFilter(teamId: number): number {
    let id = this.fieldListFilter?.[teamId]?.id;
    if (id) return id;
    return 1;
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

  loadPageNotConnect(team: CRMTeamDTO, ev: TDSSafeAny) {
    ev.stopPropagation();
    this.isLoading = true;
    this.verifyConnect(team);
  }

  verifyConnect(team: CRMTeamDTO) {
    let model = this.prepareModel(team);
    let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);

    this.facebookService.verifyConect(model).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: any) => {
          this.facebookGraphService.getUserPages(team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe(
            {
              next: (res) => {

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
              },
              error: error => {
                this.message.error(Message.ConnectionChannel.TokenExpires);
                this.isLoading = false;
              }
            })
        },
        error: (error: any) => {
          this.isLoading = false;
        }
      }
    )
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
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe(
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

  scrollToLastPosition(){
    if(TDSHelperObject.hasValue(this.lastScrollPosition)) {
      this.viewportScroller.scrollToPosition(this.lastScrollPosition);
    }
  }

  prepareModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: team.ChannelAvatar || team.Facebook_UserAvatar || team.OwnerAvatar,
      FacebookId : team.ChannelId || team.Facebook_UserId || team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken || team.ChannelToken
    } as any

    return model;
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
        this.loadListTeam(true);
        // if (this.lstPageNotConnect[user.Id]) {
        //   this.lstPageNotConnect[user.Id] = this.lstPageNotConnect[user.Id].filter((x) => x.id != data.id);
        // }
      }
    });
  }
}
