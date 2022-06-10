import { Component, ContentChildren, QueryList, Input, ChangeDetectionStrategy } from '@angular/core';
import { TpageAvatarFacebookComponent } from '../upload-image/tpage-avatar-facebook/tpage-avatar-facebook.component';

@Component({
  selector: 'tpage-avatar-group-facebook',
  templateUrl: './tpage-avatar-group-facebook.component.html',
  styleUrls: ['./tpage-avatar-group-facebook.component.scss'],
  host: {
    class: 'tds-avatar-group-facebook inline-flex'
  }
})
export class TpageAvatarGroupFacebookComponent {

  @ContentChildren(TpageAvatarFacebookComponent, { descendants: true }) lstAvatar!: QueryList<TpageAvatarFacebookComponent>;
  @Input() tdsClass:Array<string> =['-ml-3','border-2','border-white','rounded-full','z-10'];
  ngAfterViewInit(): void {
    if (this.lstAvatar) {
        this.lstAvatar.forEach((avatar:TpageAvatarFacebookComponent,index:number) =>{
          if(index != 0)
          {
            this.tdsClass.forEach(cl=>{
              avatar.nativeElement.classList.add(cl);
            })

          }
        })
    }
  }
}
