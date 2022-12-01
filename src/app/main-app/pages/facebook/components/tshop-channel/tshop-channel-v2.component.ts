import { TUserCacheDto } from './../../../../../lib/dto/tshop.dto';
import { CRMTeamType } from 'src/app/main-app/dto/team/chatomni-channel.dto';
import { AddPageComponent } from '../add-page/add-page.component';
import { TDSModalService } from 'tds-ui/modal';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { Message } from '../../../../../lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, OnInit, Output, ViewContainerRef, EventEmitter, HostListener } from '@angular/core';
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
  access_token: string = '';

  constructor(private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService,
    private facebookService: FacebookService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private message: TDSMessageService) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản TShop không?
    let cacheData = this.tShopService.getCacheLoginUser() as any;
    let exist = cacheData != null && cacheData?.data && cacheData?.data?.user && cacheData?.type == CRMTeamType._TShop;

    if(exist) {
        this.userTShopLogin = cacheData.data.user;
    } else {
        this.tShopSignOut();
    }

    this.loadData();
    this.eventEmitter();
  }

  eventEmitter() {
    this.tShopService.getTShopUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TUserCacheDto) => {
        if(res) {
          this.access_token = res.access_token;
          this.userTShopLogin = res.user;

          this.insertUserTShop(res.access_token);
        }
      },
      error: (err: any) => {
        this.message.error(err?.error?.message);
      }
    })
  }

  tShopSignIn() {
    let fragment = 'connect-channel/tshop-login';
    const auth = this.tShopService.getAuthentication(fragment);

    const width = 800;
    const height = 600;
    const y = (window.top?.outerHeight || 0) / 2 + (window.top?.screenY || 0) - (width / 2);
    const x = (window.top?.outerWidth || 0) / 2 + (window.top?.screenX || 0) - (height / 2);
    window.open(auth, ``, `resizable=no, width=${width}, height=${height}, top=${y}, left=${x}`);
  }

  tShopSignOut() {
    this.userTShopLogin = null;
    this.loginTeam = null;
    this.tShopService.removeCacheLoginUser();
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
    }
  }

  verifyConnect(team: CRMTeamDTO) {
    if(!this.userTShopLogin) {
      this.message.error('Vui lòng đăng nhập để thực hiện tính năng này');
      return; 
    }

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
                this.message.error('Kết nối quá hạn. Vui lòng đăng nhập lại');
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
    this.crmTeamService.delete(id).pipe(takeUntil(this.destroy$)).subscribe({
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
      FacebookId: team.ChannelId || team.Facebook_UserId || team.OwnerId,
      FacebookName: team.Name || team.Facebook_UserName,
      Token: team.OwnerToken || team.ChannelToken
    } as any

    return model;
  }

  showModalAddPage(data: CRMTeamDTO): void {
    if(!this.userTShopLogin) {
      this.message.error('Vui lòng đăng nhập để thực hiện tính năng này');
      return; 
    }

    const modal = this.modal.create({
      title: 'Thêm Page',
      content: AddPageComponent,
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: data,
        type: CRMTeamType._TShop
      },
    });

    modal.afterClose.subscribe((result) => {
      if (TDSHelperObject.hasValue(result)) {
        // TODO: trường hợp active childs
        let index = this.data.findIndex(x=>x.Id == data.ParentId);

        this.data[index].Childs?.map(f => {
          if(f.ChannelId == data.ChannelId) {
            f.Active = true;
          }
        })
      }
    });
  }

  prepareChatOmniTShopToTeam(x: ChatOmniTShopDto, team?: CRMTeamDTO) {
    let model = {} as CRMTeamDTO;

    model.Name = x.Name;
    model.ChannelId = x.Id;
    model.ChannelToken = '';
    model.Facebook_Link = '';
    model.Facebook_TypeId = 'Page';
    model.Facebook_ASUserId = team?.OwnerId;
    model.Facebook_UserAvatar = team?.Facebook_UserAvatar;
    model.Facebook_UserId = team?.Facebook_UserId;
    model.Facebook_UserName = team?.Name;
    model.Facebook_UserToken = team?.OwnerToken;
    model.Facebook_PageId = x.Id;
    model.Facebook_PageName = x.Name;
    model.Facebook_PageLogo = x.Avatar;
    model.Facebook_PageToken = '';
    model.Active = false;
    model.ParentId = team?.Id;
    model.Type = CRMTeamType._TShop;

    return model;
  }
}
