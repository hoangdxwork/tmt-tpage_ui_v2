import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { ButtonSize, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';

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
  ) {
    this.nativeElement = element.nativeElement;
  }

  ngOnInit(): void {

   this.buildUrl(this.fbid,this.token);
  
    // this.imageService.getImage(url).subscribe(res => {
    //   this.nativeElement.style.setProperty('background-image', `url('${res}')`);

    // });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fbid"] && !changes["fbid"].firstChange) {
      // this.url = `https://graph.facebook.com/${changes["fbid"].currentValue}/picture?type=large&access_token=${this.token}`;
      this.buildUrl(changes["fbid"].currentValue,this.token);
    }
  }
  buildUrl(fbid:string,token:string){
    if(TDSHelperString.hasValueString(fbid) && TDSHelperString.hasValueString(token))
    {
      this.url = `https://graph.facebook.com/${fbid}/picture?type=large&access_token=${token}`;
    }else{
      this.url ='';
    }
  }
}
