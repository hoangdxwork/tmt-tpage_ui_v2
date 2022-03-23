import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TAuthService, UserInitDTO } from 'src/app/lib';
import { environment } from 'src/environments/environment';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMenuDTO, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamDTO } from '../dto/team/team.dto';
import { CRMTeamService } from '../services/crm-team.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  userInit!: UserInitDTO;

  lstMenu!: TDSSafeAny;
  inlineCollapsed = false;
  shopId!: TDSSafeAny;
  lstShop!: Array<TDSSafeAny>;
  constructor(private auth: TAuthService, public crmService: CRMTeamService) { }

  ngOnInit(): void {
    this.getAllFacebook();
    this.crmService.onChangeTeam().subscribe(res => {
      debugger
      this.lstMenu = this.setMenu(res);
      debugger
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
            if (TDSHelperString.hasValueString(teamId)) {
              for (let index = 0; index < dataTeam.Items.length; index++) {
                const item = dataTeam.Items[index];
                for (let index = 0; index < item.Childs.length; index++) {
                  const child = item.Childs[index];
                  if (teamId == child.Id) {
                    team = child;
                    break;
                  }
                }
              }
              this.crmService.onUpdateTeam(team || null);
            } else {
              const firstItem = dataTeam.Items.find(res => {
                return res.Childs.length > 0
              });
              this.crmService.onUpdateTeam(firstItem || null);
            }


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
    return [
      {
        name: "Tổng quan",
        icon: "tdsi-home-fill",
        link: '/dashboard',
      },
      {
        name: "Tất cả",
        icon: "tdsi-drawer-fill",
        link: `/conversation/all?teamId=${data?.Id}&type=all`,
      },
      {
        name: "Tin nhắn",
        icon: "tdsi-email-fill",
        link: `/conversation/inbox?teamId=${data?.Id}&type=message`,
      },

      {
        name: "Bình luận",
        icon: "tdsi-comment-fill",
        link: `/conversation/comment?teamId=${data?.Id}&type=comment`,
      },

      {
        name: "Bài viết",
        icon: "tdsi-edit-paper-fill",
        link: `/conversation/post?teamId=${data?.Id}&type=post`,
      },

      {
        name: "Đơn hàng",
        icon: "tdsi-bag-fill",
        link: `/order?teamId=${data?.Id}`,
      },
      {
        name: "Phiếu bán hàng",
        icon: "tdsi-dataset-fill",
        link: `/bill?teamId=${data?.Id}`,
      },
      {
        name: "Khách hàng",
        icon: "tdsi-user-fill",
        link: `/partner?teamId=${data?.Id}`,
      },
      {
        name: "Kênh kết nối",
        icon: "tdsi-facebook-2-fill",
        link: `/facebook?teamId=${data?.Id}`,
      },
      {
        name: "Thống kê",
        icon: "tdsi-chart-pie-fill",
        link: `/report?teamId=${data?.Id}`,
      },
      {
        name: "Cấu hình",
        icon: "tdsi-gear-line",
        link: `/configs?teamId=${data?.Id}`,
      }
    ];

  }
}
