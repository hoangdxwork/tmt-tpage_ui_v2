import { Message } from './../../../../../lib/consts/message.const';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSSafeAny, TDSHelperArray } from 'tds-ui/shared/utility';
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

  isLoading: boolean = true;
  isLoadChannel: boolean = false;
  iconCollapse: TDSSafeAny = {};

  tShopAuthentication!: string;
  lstPageNotConnect: PageNotConnectDTO = {};
  lstData: TDSSafeAny = {};

  constructor(
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService,
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
    let fragment = 'facebook/tshop-login';
    this.tShopAuthentication = this.tShopService.getAuthentication(fragment);
     

    this.tShopService.onChangeUser().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        if(res) {
          this.userTShopLogin = {...res};
          this.tShopService.setCacheTShopUser(this.userTShopLogin);
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

    let windowSize = {
      width: 800,
      height: 700,
    };

    let windowLocation = {
      left: (window.screen.width / 2) - (windowSize.width / 2),
      top: (window.screen.height / 2) - (windowSize.height / 2) - 50
    };

    window.open(this.tShopAuthentication, "", 'width=' + windowSize.width + ', height=' + windowSize.height + ', left=' + windowLocation.left + ', top=' + windowLocation.top);
  }

  tShopSignOut() {
    this.isLoading = true;
    this.tShopService.logout();
    this.tShopService.removeCacheTshopUser();
    this.userTShopLogin = null;
    this.isLoading = false;
  }

  loadListTeam() {
    this.isLoading = true;
    this.isLoadChannel = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          if (res) {
            this.data = res.filter((x: any) => x.Type == 'TUser');
            console.log(this.data);
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
    let exits = this.data.find((x) => x.OwnerId && x.OwnerId == ownerId);

    if (exits) {
      this.data.splice(this.data.indexOf(exits), 1);
      this.data.unshift(exits);

      exits.OwnerToken = this.tShopService.getCurrentToken() || exits.OwnerToken;

      this.onChangeCollapse(exits.Id, true);
      this.isUserTShopConnectChannel = true;
    }
    else {
      this.isUserTShopConnectChannel = false;
    }
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
            this.message.error(Message.ErrorOccurred)
          };
        }
      }
    );
  }
}
