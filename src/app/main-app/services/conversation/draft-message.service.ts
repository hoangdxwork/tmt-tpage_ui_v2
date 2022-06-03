import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { PartnerService } from "../partner.service";

@Injectable({
  providedIn: 'root'
})

export class DraftMessageService extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public data: any = {};
  public facebookASIds!: string;

  public onUpdateDraftMessage$ = new EventEmitter<any>();
  public onIsDraftMessage$ = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
    private partnerService: PartnerService) {
      super(apiService);

      this.initialize();
  }

  initialize() {
    this.onUpdateDraftMessage$.subscribe((res: any) => {
      if(res.psid != this.facebookASIds) {
        this.data[this.facebookASIds] = res;

        let draftMessages = {
          psid: this.facebookASIds,
          isDraftMessage: res.messages || (res.images && res.images.length > 0) ? true : false
        };
        this.onIsDraftMessage$.emit(draftMessages);
      }
    });

    this.partnerService.onLoadOrderFromTabPartner.subscribe((res: any) => {
      if(res && (res.FacebookASIds || res.Facebook_ASUserId)) {
        this.facebookASIds = res.FacebookASIds || res.Facebook_ASUserId;
      } else {
        (this.facebookASIds as any) = null;
      }
    });
  }

  getMessageByASIds(ASIds: any) {
    if(this.data[ASIds]) {
      return this.data[ASIds];
    }
    return {
      messages: null,
      images: []
    }
  }

  removeCurrentFacebookASIds() {
     this.facebookASIds = '';
  }

}
