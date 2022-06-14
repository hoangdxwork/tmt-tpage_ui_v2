import { filter } from 'rxjs/operators';
import { Event, RouterEvent, Router } from '@angular/router';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TDSMenuDTO } from 'tds-ui/menu';

@Component({
  selector: 'tpage-menu-item',
  templateUrl: './tpage-menu-item.component.html'
})
export class TpageMenuItemComponent implements OnInit {
  //#region variable
  @Input() menuData!:Array<TDSMenuDTO>;
  @Input() loading!:boolean;

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
