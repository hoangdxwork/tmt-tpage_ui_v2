import { TDSHelperString } from 'tds-ui/shared/utility';
import { TUserDto } from '@core/dto/tshop.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil, pipe } from 'rxjs';
import { TiktokService } from './../../../../services/tiktok-service/tiktok.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'tiktok-channel',
  templateUrl: './tiktok-channel.component.html',
  providers: [TDSDestroyService]

})
export class TiktokChannelComponent implements OnInit {
  data: CRMTeamDTO[] = [];
  isLoading!: boolean;

  username!: string;

  userTiktokLogin!: TUserDto | null;
  isUserTShopConnectChannel: boolean = false;

  loginTeam!: CRMTeamDTO | null;

  tShopAuthentication!: string;

  constructor(private tiktokService: TiktokService,
    private destroy$: TDSDestroyService,
    private message: TDSMessageService,
    private facebookService: FacebookService,
    private crmTeamService: CRMTeamService,
    private cdRef: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản TShop không?
    let user = this.facebookService.getCacheLoginUser() as any;
    let exist = user != null && user?.data && user?.type == CRMTeamType._TikTok;

    if(exist) {
      this.userTiktokLogin = user.data;
    } else {
      this.userTiktokLogin = null;
      this.tiktokSignOut();
    }

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if (res) {
          this.data = res.filter((x: any) => x.Type != CRMTeamType._Facebook && x.Type != CRMTeamType._TUser);
        }

        // if (this.userTShopLogin) {
        //   this.sortByTShopLogin(this.userTShopLogin.Id);
        // }

        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      }
    })
  }

  tiktokSignOut() {

  }

  unconnectTeam(team: any){

  }

  showModalAddPage(child: any) {

  }

  verifyConnect(team: any) {
    
  }

  tiktokSignIn() {
    if(!TDSHelperString.hasValueString((this.username || '').trim())){
      this.message.error('Vui lòng nhập username');
      return;
    }

    this.isLoading = true;
    this.tiktokService.login(this.username).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          

          this.isLoading = false;
        },
        error: error => {
          this.message.error(error?.error?.message || 'Đã có lỗi xảy ra');
          this.isLoading = false;
        }
      }
    )
  }

  onTiktokConnected() {

  }
}
