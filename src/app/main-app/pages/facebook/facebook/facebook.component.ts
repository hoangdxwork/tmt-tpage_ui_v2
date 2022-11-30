import { mergeMap, Observable, map } from 'rxjs';
import { CRMTeamDTO } from '@app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { FacebookService } from 'src/app/main-app/services/facebook.service';
import { TUserDto } from '@core/dto/tshop.dto';
import { FacebookUser } from './../../../../lib/dto/facebook.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  providers: [ TDSDestroyService]
})
export class FacebookComponent implements OnInit {

  currentTab: number = 0;
  currentPage!: string | null;
  currentTeam!: CRMTeamDTO | null;
  teamLogin!: TUserDto | FacebookUser | null;

  constructor(public router: Router,
    private facebookService: FacebookService,
    private crmTeamService: CRMTeamService,
    public activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.crmTeamService.getCacheTeamId().pipe(mergeMap((id) => {
      if(id) {
        return this.crmTeamService.getTeamById(id).pipe(map((res) => { return res?.Type || null }));
      } else {
        return new Observable(obs=>{
          obs.next(null);
          obs.complete();
        })
      }
    }))
    .subscribe({
      next: (res) => {

        // TODO: load route của tab hiện tại
        switch(res) {
          case CRMTeamType._Facebook:
            this.currentTab = 0;
            break;
          case CRMTeamType._TShop:
            this.currentTab = 1;
            break;
          case CRMTeamType._TikTok:
            this.currentTab = 2;
          break;
        }
      }
    });
    
    
    // this.activatedRoute.queryParams.subscribe(params => {
    //   this.currentPage = params?.page || 'fb';

    //   // TODO: load route của tab hiện tại
    //   switch(this.currentPage) {
    //     case 'fb':
    //       this.currentTab = 0;
    //       break;
    //     case 'tshop':
    //       this.currentTab = 1;
    //       break;
    //   }
    // });
  }

  onChangeTab(event: any) {
    if(event) {
      this.currentTab = event.index;

      switch(this.currentTab) {
        case 0:
          this.currentPage = 'fb';
          break;
        case 1:
          this.currentPage = 'tshop';
          break;
        case 2:
          this.currentPage = 'tiktok';
        break;
      }
      
      this.directPage(`connect-channel?page=${this.currentPage}`);
    }
  }

  directPage(route: string) {
    this.router.navigateByUrl(route);
  }
}
