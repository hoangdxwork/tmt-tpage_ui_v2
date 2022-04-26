import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { throttle } from 'lodash';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, mergeMap, startWith, takeUntil, tap } from 'rxjs/operators';
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
  private destroy$ = new Subject<void>();
  constructor(private auth: TAuthService, public crmService: CRMTeamService, private activatedRoute: ActivatedRoute, private router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd), // Only get the event of NavigationEnd
      map(() => activatedRoute), // Listen to activateRoute
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data),
      takeUntil(this.destroy$),
      // get the data
    ).subscribe(res => {
      this.inlineCollapsed = res.collapse;
    })
  }

  ngOnInit(): void {

    this.crmService.onChangeTeam().pipe(
      takeUntil(this.destroy$),
    ).subscribe(res => {
      this.lstMenu = this.setMenu(res);
      this.currentTeam = res;
    })
    this.getAllFacebook();
    this.loadUserInfo();
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
    ).subscribe(res => {
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
    combineLatest(
      [
        this.crmService.getAllFacebooks(),
        this.crmService.getCacheTeamId()
      ]
    ).pipe(
      takeUntil(this.destroy$),
    )
      .subscribe(([dataTeam, teamId]) => {
        // console.log(f)
        if (TDSHelperObject.hasValue(dataTeam)) {
          // let team!: CRMTeamDTO;
          this.crmService.onUpdateListFaceBook(dataTeam);
          const team = TPageHelperService.findTeamById(dataTeam.Items, teamId, true)
          this.crmService.onUpdateTeam(team);
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
      // {
      //   name: "Tất cả",
      //   icon: "tdsi-drawer-fill",
      //   link: '/conversation/all',
      //   linkProps: {
      //     queryParams: {
      //       'teamId': data?.Id,
      //       'type': 'all',
      //     },
      //   },
      //   hidden: hidden
      // },
      // {
      //   name: "Tin nhắn",
      //   icon: "tdsi-email-fill",
      //   link: '/conversation/inbox',
      //   linkProps: {
      //     queryParams: {
      //       'teamId': data?.Id,
      //       'type': 'message',
      //     },
      //   },
      //   hidden: hidden,
      // },

      // {
      //   name: "Bình luận",
      //   icon: "tdsi-comment-fill",
      //   link: `/conversation/comment`,
      //   linkProps: {
      //     queryParams: {
      //       'teamId': data?.Id,
      //       'type': 'comment',
      //     },
      //   },
      //   hidden: hidden,
      // },

      // {
      //   name: "Bài viết",
      //   icon: "tdsi-edit-paper-fill",
      //   link: `/conversation/post`,
      //   linkProps: {
      //     queryParams: {
      //       'teamId': data?.Id,
      //       'type': 'post',
      //     },
      //   },
      //   hidden: hidden,
      // },

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


  //load thông tin user
  loadUserInfo() {
    this.auth.getUserInit().pipe(
      takeUntil(this.destroy$),
    ).subscribe(res => {
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
