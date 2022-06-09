import { takeUntil } from 'rxjs/operators';
import { TDSMenuDTO } from 'tmt-tang-ui';
import { UserMenu } from './../user.menu';
import { InfoUserComponent } from './../components/info-user/info-user.component';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit, OnDestroy {

  menuData = UserMenu;
  currentPage = UserMenu[0];

  private destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
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
    let find = this.menuData.find(x => x.link == url);

    if(find) {
      this.currentPage = find;
      sessionStorage.setItem('userItem',JSON.stringify(find));
    }
    else {
      let item = sessionStorage.getItem('userItem');
      if(item){
        this.currentPage = JSON.parse(item);
      }
    }
  }

  onChangePageUser(page:TDSMenuDTO){
    this.currentPage = page;
    sessionStorage.setItem('userItem',JSON.stringify(page));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
