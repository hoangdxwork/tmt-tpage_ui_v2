import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSModalService } from 'tds-ui/modal';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { Message } from '../../../../../lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, OnInit, Output, ViewContainerRef, EventEmitter } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { TDSSafeAny, TDSHelperObject } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { ChatOmniTShopDto, TUserDto } from '@core/dto/tshop.dto';
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
  loginTeam!: CRMTeamDTO | null;

  tShopAuthentication!: string;

  constructor(
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService,
    private facebookService: FacebookService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private message: TDSMessageService
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản TShop không?
    let user = this.facebookService.getCacheLoginUser() as any;
    let exist = user != null && user?.data && user?.type == CRMTeamType._TShop;

    if(exist) {
      this.userTShopLogin = user.data;
    } else {
      this.userTShopLogin = null;
      this.tShopSignOut();
    }

    this.loadData();
  }

  getTShopAuthentication() {
    let fragment = 'connect-channel/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);

    this.tShopService.onChangeUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if (res) {
          this.userTShopLogin = { ...res };
          //TODO: lưu cache thông tin đăng nhập
          this.facebookService.setCacheLoginUser(this.userTShopLogin, CRMTeamType._TShop);
          this.message.success('Đăng nhập thành công');
          // TODO: cập nhật lại danh sách sau khi đăng nhập thành công
          this.loadData();
        }
      },
      error: (err) => {
        this.userTShopLogin = null;
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
    this.userTShopLogin = null;
    this.loginTeam = null;
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
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe({
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
      error: (error) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    })
  }

  sortByTShopLogin(ownerId: string | undefined) {
    let exist = this.data.find((x) => x.OwnerId && x.OwnerId == ownerId);

    if (exist) {
      this.loginTeam = { ...exist };

      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);

      exist.OwnerToken = this.tShopService.getCurrentToken() || exist.OwnerToken;
    }
  }

  getTShopUser(token: string) {
    this.crmTeamService.getTShopUser(token).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        console.log(res);
        
      }
    })
  }

  verifyConnect(team: CRMTeamDTO) {
    let model = this.prepareModel(team);
    this.isLoading = true;

    this.facebookService.verifyConect(model).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {

          this.crmTeamService.getTShop(team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe(
            {
              next: (res: ChatOmniTShopDto[]) => {
                let exist = res && res.length > 0;

                if (!exist) {
                  this.message.info('Không tìm thấy kênh mới nào');
                  return;
                }

                let ids = team?.Childs?.map(x => x.ChannelId) || [];
                let newArray: any = [];

                res.map((x: ChatOmniTShopDto) => {
                  let exist1 = ids?.find(a => a == x.Id);
                  if (!exist1) {
                    let item = this.prepareChatOmniTShopToTeam(x, team);
                    newArray.push(item);
                  }
                });

                if (newArray.length == 0) {
                  this.isLoading = false;
                  this.message.info('Không tìm thấy kênh mới nào');
                  return;
                }

                // TODO: map thêm kênh mới nếu có
                let findIndex = this.data.findIndex(x => x.Id == team.Id);
                if (findIndex > -1) {
                  this.data[findIndex].Childs = [...(this.data[findIndex].Childs || []), ...newArray];
                  this.data[findIndex] = { ...this.data[findIndex] };

                  this.message.info(`Đã tìm thấy ${newArray.length} kênh mới`);
                }

                this.isLoading = false;
              },
              error: (error) => {
                this.message.error('Kết nối quá hạn. Vui lòng đăng nhập lại!');
                this.isLoading = false;
              }
            })
        },
        error: (error: any) => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
          this.isLoading = false;
        }
      }
    )
  }

  refreshToken(id: any) {
    this.isLoading = true;

    this.tShopService.refreshUserToken(id).subscribe({
      next: (res) => {
        this.message.success('Cập nhật thành công');
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
      }
    })
  }

  unConnected(team: CRMTeamDTO): void {
    this.modal.error({
      title: 'Hủy kết nối Facebook',
      content: `Bạn có chắc muốn hủy kết nối với: ${team.Name}.`,
      onOk: () => {
        this.delete(team.Id);
      },
      onCancel: () => { },
      okText: 'Xác nhận',
      cancelText: 'Hủy bỏ',
    });
  }

  delete(id: number) {
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res) => {
          this.message.success('Hủy kết nối thành công');
          if(id == this.loginTeam?.Id) {
            this.loginTeam = null;
          }
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
      FacebookId: team.ChannelId || team.Facebook_UserId || team.OwnerId,
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

  prepareChatOmniTShopToTeam(x: ChatOmniTShopDto, team?: CRMTeamDTO) {
    let model = {} as CRMTeamDTO;

    model.Name = x.Name;
    model.ChannelId = x.Id;
    // model.ChannelToken = '';
    // model.Facebook_Link = x.link;
    model.Facebook_TypeId = 'Page';
    model.Facebook_ASUserId = team?.OwnerId;
    model.Facebook_UserAvatar = team?.Facebook_UserAvatar;
    model.Facebook_UserId = team?.Facebook_UserId;
    model.Facebook_UserName = team?.Name;
    model.Facebook_UserToken = team?.OwnerToken;
    model.Facebook_PageId = x.Id;
    model.Facebook_PageName = x.Name;
    model.Facebook_PageLogo = x.Avatar;
    // model.Facebook_PageToken = x.access_token;
    model.Active = false;
    model.ParentId = team?.Id;
    model.Type = CRMTeamType._TShop;

    return model;
  }
}
