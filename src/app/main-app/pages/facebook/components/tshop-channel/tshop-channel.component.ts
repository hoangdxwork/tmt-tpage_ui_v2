import { TDSNotificationService } from 'tds-ui/notification';
import { TUserCacheDto } from '../../../../../lib/dto/tshop.dto';
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
import { TDSSafeAny, TDSHelperObject, TDSHelperString } from 'tds-ui/shared/utility';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { TUserDto } from '@core/dto/tshop.dto';
import { TShopService } from '@app/services/tshop-service/tshop.service';

@Component({
  selector: 'tshop-channel',
  templateUrl: './tshop-channel.component.html',
  providers: [TDSDestroyService]
})
export class TshopChannelComponent extends TpageBaseComponent implements OnInit {
  data: CRMTeamDTO[] = [];

  userTShopLogin!: TUserDto | null;
  isUserTShopConnectChannel: boolean = false;

  isLoading: boolean = true;
  loginTShopOwner!: CRMTeamDTO | null;
  access_token: string = '';

  constructor(private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private notification: TDSNotificationService,
    private message: TDSMessageService) {
      super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản TShop không?
    let cacheData = this.tShopService.getCacheLoginUser() as any;
    let exist = cacheData != null && cacheData?.data && cacheData?.data?.user && cacheData?.type == CRMTeamType._TUser;

    if(exist) {
      this.userTShopLogin = cacheData.data.user;
      this.access_token = cacheData.data.access_token;
    } else {
      this.userTShopLogin = null;
      this.access_token = null as any;
      this.loginTShopOwner = null;
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

          if (this.userTShopLogin) {
            this.sortByTShopLogin(this.userTShopLogin.Id);
          }
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
    this.loginTShopOwner = null;
    this.tShopService.removeCacheLoginUser();
  }

  insertUserTShop() {
    let item = {
      Id: 0,
      OwnerId: this.userTShopLogin?.Id,
      Name: this.userTShopLogin?.Name,
      Type: CRMTeamType._TUser,
      ChannelId: this.userTShopLogin?.Id,
      OwnerToken: this.access_token,
      OwnerAvatar: this.userTShopLogin?.Avatar
    };

    this.crmTeamService.insert(item).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.message.success('Thao tác thành công');
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
      this.loginTShopOwner = { ...exist };

      this.data.splice(this.data.indexOf(exist), 1);
      this.data.unshift(exist);
    }
  }

  getTShopPage(team: CRMTeamDTO) {
    this.isLoading = true;
    if(this.userTShopLogin && this.userTShopLogin.Id == team.OwnerId) {
        team.OwnerToken = this.access_token;
    }

    if(!TDSHelperString.hasValueString(team.OwnerToken)) {
      this.notification.error(`Không thể kết nối trang`,
      `<div class="whitespace-normal w-[300px]">Hãy đăng nhập đúng tài khoản TShop<br>
        [<span class="text-error-400 font-semibold">${team.Name}</span>]</div>`, { duration: 5000 });

      return;
    }

    this.tShopService.refreshUserToken(team.Id, team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (token) => {
        this.crmTeamService.getTShop(team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe({

            next: (res: TUserDto[]) => {
              let exist = res && res.length > 0;

              if (!exist) {
                this.message.info('Không tìm thấy kênh mới nào');
                return;
              }

              let ids = team?.Childs?.map(x => x.ChannelId) || [];
              let childs: any = [];

              res.map((x: TUserDto) => {
                let exist1 = ids?.find(a => a == x.Id);
                if (!exist1) {
                  let item = this.prepareTeam(x, team);
                  childs.push(item);
                }
              });

              if (childs.length == 0) {
                this.isLoading = false;
                this.message.info('Không tìm thấy kênh mới nào');
                return;
              }

              // TODO: map thêm kênh mới nếu có
              let findIndex = this.data.findIndex(x => x.Id == team.Id);
              if (findIndex > -1) {
                this.data[findIndex].Childs = [...(this.data[findIndex].Childs || []), ...childs];
                this.data[findIndex] = { ...this.data[findIndex] };
                this.message.info(`Đã tìm thấy ${childs.length} kênh mới`);
              }

              this.isLoading = false;
            },
            error: (error) => {
              this.isLoading = false;
              console.error(error);

              this.notification.error(`Không thể kết nối trang`,
                `<div class="whitespace-normal w-[300px]">Hãy đăng nhập đúng tài khoản TShop<br>
                  [<span class="text-error-400 font-semibold">${team.Name}</span>]</div>`, { duration: 5000 });
            }
          })
      }
    })
  }

  refreshUserToken(team: CRMTeamDTO) {
    this.isLoading = true;
    this.tShopService.refreshUserToken(team.Id, team.OwnerToken).subscribe({
      next: (res) => {
        this.message.success('Làm mới token thành công');
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
      }
    })
  }

  refreshChannelToken(child: CRMTeamDTO, team: CRMTeamDTO) {
    this.isLoading = true;

    this.tShopService.refreshChannelToken(team.Id, child.ChannelId, team.ChannelToken).subscribe({
      next: (token: any) => {

        if(!TDSHelperString.hasValueString(token)) {
          this.isLoading = false;
          this.message.error('Không thể lấy token của'+ ` ${child.Name}`);
          return;
        }

        let index = this.data.findIndex(x=> x.Id == child.ParentId);

        this.data[index].Childs?.map(f => {
          if(f.ChannelId == child.ChannelId) {
            f.ChannelToken = token;
          }
        })

        this.isLoading = false;
        this.message.success('Làm mới token thành công');
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
          this.loadData();
          this.message.success('Hủy kết nối thành công');
          this.crmService.loginOnChangeTeam$.emit(true);
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

  showModalAddPage(child: CRMTeamDTO, team: CRMTeamDTO) {
    if(!this.userTShopLogin) {
      this.message.error('Vui lòng đăng nhập để thực hiện tính năng này');
      return;
    }

    this.isLoading = true;
    this.tShopService.getlonglivetoken(child.ChannelId, team.OwnerToken).pipe(takeUntil(this.destroy$)).subscribe({
      next: (token: any) => {

        if(!TDSHelperString.hasValueString(token)) {
          this.isLoading = false;
          this.message.error('Không thể lấy token của'+ ` ${child.Name}`);
          return;
        }

        child.ChannelToken = token;

        const modal = this.modal.create({
          title: 'Thêm Page',
          content: AddPageComponent,
          viewContainerRef: this.viewContainerRef,
          componentParams: {
            data: child,
            type: CRMTeamType._TShop
          },
        });

        modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: any) => {
            if(res) {
              this.crmService.loginOnChangeTeam$.emit(true);
              this.loadData();
            } else {
              this.isLoading = false;
            }
          },
          error: (error: any) => {
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.message.error('Không thể lấy token của'+ ` ${child.Name}`);
      }
    })
  }

  prepareTeam(x: TUserDto, team?: CRMTeamDTO) {
    let model = {} as CRMTeamDTO;

    model.Name = x.Name;
    model.ChannelId = x.Id;
    model.ChannelAvatar = x.Avatar;
    model.ChannelToken = '';//verify mới lấy dc token
    model.Facebook_Link = '';
    model.Facebook_TypeId = 'Page';
    model.Facebook_ASUserId = team?.OwnerId;
    model.Facebook_UserAvatar = x.Avatar;
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
