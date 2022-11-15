import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { UserPageDTO } from 'src/app/main-app/dto/team/user-page.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { eventFadeStateTrigger } from 'src/app/main-app/shared/helper/event-animations.helper';
import { TDSSafeAny } from 'tds-ui/shared/utility';
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

  userTShopLogin!: TUserDto | undefined;


  isLoading: boolean = true;
  isLoadChannel: boolean = false;

  tShopAuthentication!: string;

  constructor(
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef,
    private _destroy$: TDSDestroyService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private tShopService: TShopService
  ) {
    super(crmTeamService, activatedRoute, router);
  }

  ngOnInit(): void {
    this.loadListTeam();
  }

  tShopSignIn() {
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
    this.isLoading = false;
  }

  loadListTeam() {
    this.isLoading = true;
    this.isLoadChannel = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this._destroy$)).subscribe(
      {
        next: (res: TDSSafeAny) => {
          if (res) {
            this.data = res.filter((x: any) => x.Type == 'TShop');
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

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
