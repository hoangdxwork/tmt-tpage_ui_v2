import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { ImageFacade } from '../../../services/facades/image.facade';

@Component({
  selector: 'tpage-avatar-facebook',
  templateUrl: './tpage-avatar-facebook.component.html'
})

export class TpageAvatarFacebookComponent implements OnInit {

  @Input() fbid!: TDSSafeAny;
  @Input() psid!: TDSSafeAny;
  @Input() token!: TDSSafeAny;
  @Input() size: 'md' | 'lg' | 'sm' | 'xl' | number = 'md';
  @Input() shape:'square' | 'circle' = 'circle';

  url!: string;
  nativeElement: HTMLElement;
  id: any;

  constructor(element: ElementRef,
    private cdRef : ChangeDetectorRef,
    private imageFacade: ImageFacade) {
    this.nativeElement = element.nativeElement;
  }

  ngOnInit(): void {
    if(TDSHelperString.hasValueString(this.fbid) && this.token){
        this.id = this.fbid;
    }
    if(TDSHelperString.hasValueString(this.psid) && this.token){
        this.id = this.psid;
    }
    this.buildUrl(this.id, this.token);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["fbid"] && !changes["fbid"].firstChange) {
        this.id = changes["fbid"].currentValue;
        this.buildUrl(this.id, this.token);
    }
    if(changes["psid"] && !changes["psid"].firstChange) {
        this.id = changes["psid"].currentValue;
        this.buildUrl(this.id, this.token);
    }
  }

  buildUrl(id: string, token: string){
    if(TDSHelperString.hasValueString(id) && TDSHelperString.hasValueString(token)){
        let url = `https://graph.facebook.com/${id}/picture?type=large&access_token=${token}`;
        this.imageFacade.getImage(url)
          .subscribe(res => {
              this.url = res;
              this.cdRef.markForCheck();
        }, error => {
          this.cdRef.markForCheck();
        });
    } else {
        this.url = '';
    }
  }

}
