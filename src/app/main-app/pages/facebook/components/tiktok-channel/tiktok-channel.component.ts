import { Message } from '@core/consts/message.const';
import { TDSModalService } from 'tds-ui/modal';
import { TiktokUserDto } from './../../../../../lib/dto/tiktok.dto';
import { TDSHelperString } from 'tds-ui/shared/utility';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { TDSMessageService } from 'tds-ui/message';
import { TDSDestroyService } from 'tds-ui/core/services';
import { takeUntil } from 'rxjs';
import { TiktokService } from './../../../../services/tiktok-service/tiktok.service';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { ChangeDetectorRef, Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'tiktok-channel',
  templateUrl: './tiktok-channel.component.html',
  styleUrls: ['./tiktok-channel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [TDSDestroyService]

})
export class TiktokChannelComponent implements OnInit {
  data: CRMTeamDTO[] = [];
  isLoading!: boolean;

  uniqueId!: string;
  sessionId!:string;

  userTiktokLogin!: TiktokUserDto | null;
  isUserTShopConnectChannel: boolean = false;
  tShopAuthentication!: string;

  constructor(private tiktokService: TiktokService,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    //TODO: kiểm tra cache xem tài khoản đang lưu cache có phải là tài khoản tiktok không?
    let user = this.tiktokService.getCacheLoginUser() as any;
    let exist = user != null && user.data && user?.type == CRMTeamType._UnofficialTikTok;

    if(exist) {
      this.userTiktokLogin = user.data;
    } else {
      this.userTiktokLogin = null;
    }

    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // TODO load all data
    this.crmTeamService.getAllChannels().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if (res) {
          this.data = res.filter((x: any) => x.Type == CRMTeamType._UnofficialTikTok);
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

  tiktokSignOut() {
    this.userTiktokLogin = null;
    this.tiktokService.removeCacheLoginUser();
  }

  unconnectTeam(team: CRMTeamDTO) {
    this.modal.error({
      title: 'Hủy kết nối kênh Tiktok',
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
          this.crmTeamService.loginOnChangeTeam$.emit(true);
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

  tiktokSignIn() {
    if(!TDSHelperString.hasValueString((this.uniqueId || '').trim())) {
      this.message.error('Vui lòng nhập username');
      return;
    }

    if(!TDSHelperString.hasValueString((this.sessionId || '').trim())) {
      this.message.error('Vui lòng nhập sessionId');
      return;
    }

    this.isLoading = true;
    this.tiktokService.login(this.uniqueId, this.sessionId).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TiktokUserDto) => {
          if(!res.Id) {
            this.isLoading = false;
            this.message.error('Không tìm thấy tài khoản');
            return;
          }

          this.userTiktokLogin = {...res};
          // TODO: lưu cache tài khoản đăng nhập
          this.tiktokService.setCacheLoginUser(<TiktokUserDto>this.userTiktokLogin);

          let exist;
          this.data.map(x => {
            // TODO: kiểm tra tài khoản login có trong danh sách kênh 
            exist = x.Childs && x.Childs.filter(f => f.ChannelId == this.userTiktokLogin?.Id)?.[0];
            if(exist) return;
          })

          if(!exist) {
            this.onTiktokConnected();
          }

          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.message.error('Thông tin đăng nhập không chính xác');
        }
      }
    )
  }

  onTiktokConnected() {
    let item = {
      Id: 0,
      Name: this.userTiktokLogin?.Name,
      Type: CRMTeamType._UnofficialTikTok,
      OwnerId: this.uniqueId,
      ChannelId: this.userTiktokLogin?.Id,
      ChannelAvatar: this.userTiktokLogin?.Avatar,
      ChannelToken: this.sessionId
    };

    this.crmTeamService.insert(item).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.crmTeamService.loginOnChangeTeam$.emit(true);
        this.message.success('Thao tác thành công');
        this.loadData();
      },
      error: (error) => {
        this.message.error(`${error?.error?.message}` || 'Thêm mới page đã xảy ra lỗi');
      }
    })
  }
}
