import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { shareReplay } from 'rxjs/operators';
import { ButtonSize, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { ImageFacade } from '../../services/facades/image.facade';

@Component({
  selector: 'tpage-avatar-facebook',
  templateUrl: './tpage-avatar-facebook.component.html',
  styleUrls: ['./tpage-avatar-facebook.component.scss']
})
export class TpageAvatarFacebookComponent implements OnInit {
  @Input()
  fbid!: TDSSafeAny;

  @Input()
  token!: TDSSafeAny;
  @Input()
  size: 'md' | 'lg' | 'sm' | 'xl' | number = 'md';
  @Input()
  shape:'square' | 'circle' = 'circle';
  url!: string;
  private nativeElement: HTMLElement;

  constructor(element: ElementRef,
    private imageFacade: ImageFacade
  ) {
    this.nativeElement = element.nativeElement;
  }

  ngOnInit(): void {
    this.buildUrl(this.fbid, this.token);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fbid"] && !changes["fbid"].firstChange) {
      this.buildUrl(changes["fbid"].currentValue,this.token);
    }
  }

  buildUrl(fbid:string,token:string){
    if(TDSHelperString.hasValueString(fbid) && TDSHelperString.hasValueString(token))
    {
      let url = `https://graph.facebook.com/${fbid}/picture?type=large&access_token=${token}`;

      this.imageFacade.getImage(url)
      .pipe(shareReplay(1))
      .subscribe(res => {
        this.url = res;
      });
    } else{
      this.url = '';
    }
  }
}
