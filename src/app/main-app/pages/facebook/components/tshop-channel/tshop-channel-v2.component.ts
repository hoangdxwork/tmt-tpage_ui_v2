import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSModalService } from 'tds-ui/modal';
import { ViewportScroller } from '@angular/common';
import { FacebookGraphService } from 'src/app/main-app/services/facebook-graph.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { Message } from '../../../../../lib/consts/message.const';
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

@Component({
  selector: 'tshop-channel-v2',
  templateUrl: './tshop-channel-v2.component.html',
  providers: [TDSDestroyService]
})
export class TshopChannelComponentV2 extends TpageBaseComponent implements OnInit {
  data: CRMTeamDTO[] = [];

  userTShopLogin!: TUserDto | null;
  isUserTShopConnectChannel: boolean = false;

  isLoading: boolean = true;
  loginTeam!: CRMTeamDTO;

  tShopAuthentication!: string;

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
    this.loadData();
    // this.userTShopLogin = this.tShopService.getCacheTShopUser();

    if(this.userTShopLogin) {
      this.sortByTShopLogin(this.userTShopLogin?.Id);
    } else {
      this.getTShopAuthentication();
    }
  }

  getTShopAuthentication() {debugger
    // this.tShopService.removeCacheTshopUser();
    let fragment = 'connect-channel/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);
     
    this.tShopService.onChangeUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {debugger
        if(res) {
          this.userTShopLogin = {...res};
          // this.tShopService.setCacheTShopUser(this.userTShopLogin);
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
    const height = 600;
    const y = (window.top?.outerHeight || 0) / 2 + (window.top?.screenY || 0) - (width / 2);
    const x = (window.top?.outerWidth || 0) / 2 + (window.top?.screenX || 0) - (height / 2);
    window.open(this.tShopAuthentication, ``, `resizable=no, width=${width}, height=${height}, top=${y}, left=${x}`);
  }

  tShopSignOut() {
    this.isLoading = true;
    this.tShopService.logout();
    // this.tShopService.removeCacheTshopUser();
    this.userTShopLogin = null;
    this.isLoading = false;
  }

  onTShopConnected() {
    this.isLoading = true;
    let channel = this.data.find((x) => x.OwnerId == this.userTShopLogin?.Id);

    if (channel || !this.userTShopLogin) {
      this.message.error(Message.ConnectionChannel.ChannelExist);
    }

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
        this.loadData();
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

  loadData() {
    this.isLoading = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          if (res) {
            this.data = res.filter((x: any) => x.Type == CRMTeamType._TUser);
          }

          if (this.userTShopLogin) {
            this.sortByTShopLogin(this.userTShopLogin.Id);
          }

          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error: error => {
          this.isLoading = false;
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
    }
  }

  getTShopPages(team: CRMTeamDTO) {
    let pageIdConnected = team?.Childs!.map((x) => x.ChannelId);

    this.crmService.getTShop(team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          if(TDSHelperArray.hasListValue(res))
          {
            
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

  loadPageNotConnect(team: CRMTeamDTO) {
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

  unConnected(team: CRMTeamDTO): void {
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${team.Name}.`,
      onOk: () => {
        this.delete(team.Id);
      },
      onCancel: () => {},
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  delete(id: number) {
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.message.success('Hủy kết nối thành công');
          this.loadData();
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

  prepareModel(team: CRMTeamDTO) {
    let model = {
      FacebookAvatar: team.ChannelAvatar || team.Facebook_UserAvatar || team.OwnerAvatar,
      FacebookId : team.ChannelId || team.Facebook_UserId || team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken || team.ChannelToken
    } as any

    return model;
  }

  showModalAddPage(data: CRMTeamDTO): void {
    const modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data
      },
    });

    modal.afterClose.subscribe((result) => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData();
      }
    });
  }
}
