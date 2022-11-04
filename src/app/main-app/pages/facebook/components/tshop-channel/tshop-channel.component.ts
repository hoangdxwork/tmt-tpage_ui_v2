import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { TShopService } from '@app/services/tshop-service/tshop.service';
import { TUserDto } from '@core/dto/tshop.dto';
import { TDSMessageService } from 'tds-ui/message';
import { Message } from 'src/app/lib/consts/message.const';
import { TDSHelperArray, TDSSafeAny } from 'tds-ui/shared/utility';
import { ViewportScroller } from '@angular/common';
import { takeUntil } from 'rxjs';
import { CRMTeamService } from '@app/services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TpageBaseComponent } from '@app/shared/tpage-base/tpage-base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPageDTO } from '@app/dto/team/user-page.dto';
@Component({
  selector: 'tshop-channel',
  templateUrl: './tshop-channel.component.html',
})
export class TshopChannelComponent extends TpageBaseComponent implements OnInit {

  userTShopLogin!: TUserDto | undefined;
  isUserTShopConnectChannel: boolean = false;
  isLoading: boolean = true;
  tShopAuthentication!: string;
  data: CRMTeamDTO[] = [];
  lastScrollPosition: TDSSafeAny = null;
  isLoadChannel: boolean = false;

  constructor(
    private tShopService: TShopService,
    private message: TDSMessageService,
    private viewportScroller: ViewportScroller,
    private crmTeamService: CRMTeamService,
    private _destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadListTeam(false);
    this.getTShopAuthentication();
  }

  getTShopAuthentication() {
    let fragment = 'facebook/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);
  }

  tShopSignIn() {
    let windowSize = {
      width: 800,
      height: 700
    };

    let windowLocation = {
      left: (window.screen.width / 2) - (windowSize.width / 2),
      top: (window.screen.height / 2) - (windowSize.height / 2) - 50
    };

    window.open(this.tShopAuthentication, "", 'width=' + windowSize.width + ', height=' + windowSize.height + ', left=' + windowLocation.left + ', top=' + windowLocation.top);
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

            // res.forEach((item: any) => {
            //   this.fieldListFilter[item.Id] = this.listFilter[0];
            //   this.getListData(item.Id);

            //   if (item.Childs.length > 0) {
            //     this.onChangeCollapse(item.Id, true);
            //   }
            // });

            // if (this.userTShopLogin) {
            //   this.sortByTShopLogin(this.userTShopLogin.Id);
            // }

            // if (isRefresh) {
            //   this.crmTeamService.onRefreshListFacebook();
            //   this.scrollToLastPosition();
            // }
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

  tShopSignOut() {
    this.isLoading = true;
    this.tShopService.logout();
    this.isLoading = false;
  }

}
