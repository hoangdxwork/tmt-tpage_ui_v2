import { EventEmitter, Injectable, OnInit } from "@angular/core";
import { TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";

@Injectable({
  providedIn: 'root'
})

export class DraftMessageService extends BaseSevice  {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  public data: any = {};
  public onUpdateDraftMessage$ = new EventEmitter<any>();
  public onIsDraftMessage$ = new EventEmitter<any>();
  public facebookASIds!: string;

  constructor(private apiService: TCommonService) {
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

    // this.partnerService.onLoadedPartner.subscribe((res) => {
    //   if(res && (res.FacebookASIds || res.Facebook_ASUserId)) {
    //     this.currentFacebookASIds = res.FacebookASIds || res.Facebook_ASUserId;
    //   }
    //   else {
    //     this.currentFacebookASIds = null;
    //   }
    // });
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
