import { filter } from 'rxjs/operators';
import { Event, RouterEvent, Router } from '@angular/router';
import { TDSMenuDTO } from 'tmt-tang-ui';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tpage-menu-item',
  templateUrl: './tpage-menu-item.component.html',
  styleUrls: ['./tpage-menu-item.component.scss']
})
export class TpageMenuItemComponent implements OnInit {
  //#region variable
  @Input() menuData!:Array<TDSMenuDTO>;

  currentURL!:string;
  active:boolean = false;
  //#endregion

  constructor(private router: Router) { 
    router.events.pipe(
      filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
    ).subscribe((e: RouterEvent) => {
      this.currentURL = router.url;
    });
  }

  ngOnInit(): void {}

  onChangePage(url:string){
    this.router.navigateByUrl(url);
    this.currentURL = url;
  }

  openCollapsePanel(url:string){
    if(this.currentURL.includes(url))
      return true;
    return false;
  }
}
