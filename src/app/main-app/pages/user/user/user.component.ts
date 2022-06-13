import { takeUntil } from 'rxjs/operators';
import { UserMenu } from './../user.menu';
import { InfoUserComponent } from './../components/info-user/info-user.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TDSMenuDTO } from 'tds-ui/menu';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {

  menuData = UserMenu;
  currentPage = UserMenu[0];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    let url = this.router.url;
    this.changeUrl(url);

    this.loadUrl();
  }

  loadUrl() {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res instanceof NavigationStart){
        this.changeUrl(res?.url);
      }
    });
  }

  changeUrl(url: string) {
    let find = this.menuData.find(x => url.indexOf(x.link) != -1);

    if(find) {
      this.currentPage = find;
    }
    else {
      this.currentPage = this.menuData[0];
    }
  }

  onChangePageUser(page:TDSMenuDTO){
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
