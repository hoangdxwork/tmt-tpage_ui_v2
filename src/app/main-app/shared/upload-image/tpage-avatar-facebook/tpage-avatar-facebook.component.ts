import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TDSDestroyService } from 'tds-ui/core/services';
import { TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { ImageFacade } from '../../../services/facades/image.facade';

@Component({
  selector: 'tpage-avatar-facebook',
  templateUrl: './tpage-avatar-facebook.component.html',
  styleUrls: ['./tpage-avatar-facebook.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class TpageAvatarFacebookComponent implements OnInit {

  @Input() fbid!: TDSSafeAny;
  @Input() psid!: TDSSafeAny;
  @Input() token!: TDSSafeAny;
  @Input() size: 'md' | 'lg' | 'sm' | 'xl' | number = 'md';
  @Input() shape:'square' | 'circle' = 'circle';
  @Input() statusColor!: string;
  @Input() avatarUrl!: string;

  url!: string;
  nativeElement: HTMLElement;
  id: any;
  isLoading: boolean = false;

  constructor(element: ElementRef,
    private cdRef : ChangeDetectorRef,
    private destroy$: TDSDestroyService,
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
    if(changes['avatarUrl'] && !changes['avatarUrl'].firstChange) {
      this.avatarUrl = changes['avatarUrl'].currentValue;
    }

    if(changes["fbid"] && !changes["fbid"].firstChange && !TDSHelperString.hasValueString(this.avatarUrl)) {
        this.id = changes["fbid"].currentValue;
        this.buildUrl(this.id, this.token);
    }

    if(changes["psid"] && !changes["psid"].firstChange && !TDSHelperString.hasValueString(this.avatarUrl)) {
        this.id = changes["psid"].currentValue;
        this.buildUrl(this.id, this.token);
    }
  }

  buildUrl(id: string, token: string) {
    this.url = '';
    if(TDSHelperString.hasValueString(id) && TDSHelperString.hasValueString(token)){
      let url = `https://graph.facebook.com/${id}/picture?type=large&access_token=${token}`;

      this.isLoading = true;
      this.imageFacade.getImage(url).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
            this.url = res;
            this.isLoading = false;
            this.cdRef.detectChanges();
        },
        error: (err: any) => {
          this.isLoading = false;
            this.cdRef.detectChanges();
        }
      })
    }
  }

}
