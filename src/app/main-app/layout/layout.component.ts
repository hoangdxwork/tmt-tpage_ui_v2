import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { environment } from 'src/environments/environment';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMenuDTO, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { CRMTeamService } from '../services/crm-team.service';
import { TPageHelperService } from '../services/helper.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userInit!: UserInitDTO;
  currentTeam!: CRMTeamDTO | null;
  lstMenu!: TDSSafeAny;
  inlineCollapsed = false;
  params!: TDSSafeAny;
  constructor(private auth: TAuthService, public crmService: CRMTeamService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.crmService.onChangeTeam().subscribe(res => {
      this.lstMenu = this.setMenu(res);
      this.currentTeam = res;
    })
    this.getAllFacebook();
    this.loadUserInfo();
    this.activatedRoute.queryParams.subscribe(res => {
      this.params = res;
    })
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

  onClickItem() {
    sessionStorage.removeItem('reportItem')
  }
  //load thông tin user
  loadUserInfo() {
    this.auth.getUserInit().subscribe(res => {
      this.userInit = res || {};
    })
  }
  onClickTeam(data: CRMTeamDTO) {
    if (this.params?.teamId) {
      let url = this.router.url.split("?")[0];
      const params = { ...this.params };
      params.teamId = data.Id;
      this.router.navigate([url], { queryParams: params })
    } else {
      this.crmService.onUpdateTeam(data);
    }
  }
}
