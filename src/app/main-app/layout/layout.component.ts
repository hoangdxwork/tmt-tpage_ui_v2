import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, finalize, map, mergeMap,take, takeUntil } from 'rxjs/operators';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { environment } from 'src/environments/environment';
import { TDSHelperObject, TDSMenuDTO, TDSMessageService, TDSModalService, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { CRMTeamService } from '../services/crm-team.service';
import { TPageHelperService } from '../services/helper.service';
import { SignalRConnectionService } from '../services/signalR/signalR-connection.service';
import { NetworkHelper } from '../shared/helper/network.helper';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})

export class LayoutComponent implements OnInit {

  userInit!: UserInitDTO;
  currentTeam!: CRMTeamDTO | null;
  lstMenu!: TDSSafeAny;
  inlineCollapsed = false;
  params!: TDSSafeAny;
  private destroy$ = new Subject<void>();
  isNetwork: boolean = false;
  disabledSignalRConnect = false;
  _connectionEstablished: boolean = false;

  constructor(private auth: TAuthService,
    private signalRConnectionService: SignalRConnectionService,
    public crmService: CRMTeamService,
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {

    router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof NavigationEnd), // Only get the event of NavigationEnd
      map(() => activatedRoute), // Listen to activateRoute
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data) ,
      // get the data
    ).subscribe(res => {
      this.inlineCollapsed = res.collapse;
    })
  }

  ngOnInit(): void {
    //TODO: Khoi tao signalR
    this.signalRConnectionService.initiateSignalRConnection();
    this.signalRConnectionService._connectionEstablished$.subscribe((res: any) => {
      this._connectionEstablished = res;
    });

    NetworkHelper.checkNetwork().subscribe(isNetwork => {
      this.isNetwork = isNetwork;
    });

    this.crmService.onChangeTeam().subscribe(res => {
      this.lstMenu = this.setMenu(res);
      this.currentTeam = res;
    })

    this.getAllFacebook();
    this.loadUserInfo();
    this.activatedRoute.queryParams.subscribe(res => {
      this.params = res;
    });
  }

  onSelectShopChange(event: TDSSafeAny) {
  }

  onLogout() {
    this.auth.logout(environment.urlLogin)
  }
  onOpenChange(e: boolean) {
    this.inlineCollapsed = e;
  }
  //lay danh sách facebook
  getAllFacebook() {
    this.crmService.getAllFacebooks()
      .subscribe(dataTeam => {
        // console.log(f)
        if (TDSHelperObject.hasValue(dataTeam)) {
          let team!: CRMTeamDTO;
          this.crmService.onUpdateListFaceBook(dataTeam);
          this.crmService.getCacheTeamId().subscribe((teamId: string | null) => {
            const team = TPageHelperService.findTeamById(dataTeam.Items, teamId, true)
            this.crmService.onUpdateTeam(team);
          })
        } else {
          this.crmService.onUpdateListFaceBook(null);
          this.crmService.onUpdateTeam(null);
        }
      }, err => {

        this.crmService.onUpdateListFaceBook(null);
        this.crmService.onUpdateTeam(null);
      })
  }

  setMenu(data: CRMTeamDTO | null): Array<TDSMenuDTO> {
    let hidden = TDSHelperObject.hasValue(data) ? false : true;
    return [
      {
        name: "Tổng quan",
        icon: "tdsi-home-fill",
        link: '/dashboard',
      },
      {
        name: "Tất cả",
        icon: "tdsi-drawer-fill",
        link: '/conversation/all',
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'all',
          },
        },
        hidden: hidden
      },
      {
        name: "Tin nhắn",
        icon: "tdsi-email-fill",
        link: '/conversation/inbox',
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'message',
          },
        },
        hidden: hidden,
      },
      {
        name: "Bình luận",
        icon: "tdsi-comment-fill",
        link: `/conversation/comment`,
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'comment',
          },
        },
        hidden: hidden,
      },
      {
        name: "Bài viết",
        icon: "tdsi-edit-paper-fill",
        link: `/conversation/post`,
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
            'type': 'post',
          },
        },
        hidden: hidden,
      },
      {
        name: "Đơn hàng",
        icon: "tdsi-bag-fill",
        link: `/order`,
      },
      {
        name: "Chiến dịch live",
        icon: "tdsi-live-session-fill",
        link: `/live-campaign`,
      },
      {
        name: "Phiếu bán hàng",
        icon: "tdsi-dataset-fill",
        link: `/bill`,
        linkProps: {
          queryParams: {
            'teamId': data?.Id,
          },
        },
        hidden: hidden,
      },
      {
        name: "Chatbot",
        icon: "tdsi-callcenter-fill",
        link: `/chatbot`,
      },
      {
        name: "Khách hàng",
        icon: "tdsi-user-fill",
        link: `/partner`,
      },
      {
        name: "Kênh kết nối",
        icon: "tdsi-facebook-2-fill",
        link: `/facebook`,
      },
      {
        name: "Thống kê",
        icon: "tdsi-chart-pie-fill",
        link: `/report`,
      },
      {
        name: "Cấu hình",
        icon: "tdsi-gear-line",
        link: `/configs`,
      }
    ];
  }

  //load thông tin user
  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
    })
  }

  onClickTeam(data: CRMTeamDTO): any{
    let uri = this.router.url;
    if(uri && uri.startsWith("/conversation")){
      this.crmService.changeTeamFromLayout.emit(data);
    } else {
      this.crmService.onUpdateTeam(data);
    }
  }

  onSave() {
    this.modalService.info({
      title: 'Kết nối realtime',
      content: 'Thử kết nối lại',
      onOk: () => { this.onConnectSginalR() },
      onCancel: () => { },
      okText: "Kết nối",
      cancelText: "Hủy",
      confirmViewType: "compact",
    });
  }

  onConnectSginalR(): any {
    if (!this.isNetwork) {
      return this.message.error("Không có kết nối mạng");
    }

    this.disabledSignalRConnect = true;
    this.signalRConnectionService.refreshConnected();

    this.signalRConnectionService._connectionEstablished$.pipe(take(1))
      .pipe(finalize(() => { this.disabledSignalRConnect = false }))
      .subscribe((res: any) => {
        if (res == true) {
          this.message.success("Kết nối thành công");
        } else {
          this.message.error("Kết nối thất bại");
        }
      }, error => {
        this.message.error("Lỗi server");
      });
  }

}
