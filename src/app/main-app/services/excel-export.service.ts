import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TAuthService, TCommonService } from 'src/app/lib';
import { TDSHelperObject, TDSHelperString, TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable()
export class ExcelExportService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  @Output()
  public onReponseExcel: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
    private authen: TAuthService,
    private message: TDSMessageService) {
    super(apiService)
  }

  exportPost(url: string, data: any, name: string) {
    let xhttp = new XMLHttpRequest();
    // Post data to URL which handles post request
    let urlStr = this._BASE_URL + url;
    xhttp.open("POST", urlStr, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');

    this.authen.getCacheToken().subscribe(
      response => {
        if (TDSHelperObject.hasValue(response) && TDSHelperString.hasValueString(response.access_token)) {

            let auth = "Bearer " + `${response.access_token}`;

            xhttp.setRequestHeader("Authorization", auth);
            // You should set responseType as blob for binary responses
            xhttp.responseType = "blob";
            xhttp.send(JSON.stringify(data));

            xhttp.addEventListener("load", this.transferCompletePost);
            xhttp.addEventListener("error", this.transferFailedPost);

            xhttp.onreadystatechange = function () {
              let a;
              if (xhttp.readyState === 4 && xhttp.status === 200) {
                // Trick for making downloadable link
                a = document.createElement("a");
                a.href = window.URL.createObjectURL(xhttp.response);
                // Give filename you wish to download
                a.download = name + ".xlsx";
                a.style.display = "none";
                document.body.appendChild(a);
                a.click();
              }
            };
        }
    })
  }

  transferCompletePost = (evt: any) => {
    let url = evt.target.responseURL;
    this.onReponseExcel.emit(url);
  }

  transferFailedPost = (evt: any) => {
    this.message.error("Không xuất được file!");
  }

  exportGet(url: string, name: string) {
    let xhttp = new XMLHttpRequest();
    // Post data to URL which handles post request
    let urlStr = this._BASE_URL + url;
    xhttp.open("GET", urlStr);
    xhttp.setRequestHeader("Content-Type", "application/json");

    this.authen.getCacheToken().subscribe(
      response => {
      if (TDSHelperObject.hasValue(response) && TDSHelperString.hasValueString(response.access_token) ) {

        let auth = "Bearer " + response.access_token;

        xhttp.setRequestHeader("Authorization", auth);
        // You should set responseType as blob for binary responses
        xhttp.responseType = "blob";
        xhttp.send(null);
        xhttp.addEventListener("load", this.transferCompleteGet);
        xhttp.addEventListener("error", this.transferFailedGet);

        xhttp.onreadystatechange = function () {
          let a;
          if (xhttp.readyState === 4 && xhttp.status === 200) {
            // Trick for making downloadable link
            a = document.createElement("a");
            a.href = window.URL.createObjectURL(xhttp.response);
            // Give filename you wish to download
            a.download = name + ".xlsx";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
          }
        };
      }
    })
  }

  transferCompleteGet = (evt: any) => {
    let url = evt.target.responseURL;
    this.onReponseExcel.emit(url);
  }

  transferFailedGet = (evt: any) => {
    this.message.error("Không xuất được file!");
  }

}
