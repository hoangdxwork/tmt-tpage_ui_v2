import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable()
export class ExcelExportService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  @Output()
  public onReponseExcel: EventEmitter<any> = new EventEmitter<any>();

  constructor(private apiService: TCommonService,
    private message: TDSMessageService) {
    super(apiService)
  }

  exportPost(url: string, data: any, name: string) {
    var xhttp = new XMLHttpRequest();
    // Post data to URL which handles post request
    let urlStr = this._BASE_URL + url;
    xhttp.open("POST", urlStr, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');

    var auth = "Bearer " + localStorage.getItem("accessToken");
    xhttp.setRequestHeader("Authorization", auth);
    // You should set responseType as blob for binary responses
    xhttp.responseType = "blob";
    xhttp.send(JSON.stringify(data));

    xhttp.addEventListener("load", this.transferCompletePost);
    xhttp.addEventListener("error", this.transferFailedPost);

    xhttp.onreadystatechange = function () {
      var a;
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

  transferCompletePost = (evt: any) => {
    var url = evt.target.responseURL;
    this.onReponseExcel.emit(url);
  }

  transferFailedPost = (evt: any) => {
    this.message.error("Không xuất được file!");
  }

  exportGet(url: string, name: string) {
    var xhttp = new XMLHttpRequest();
    // Post data to URL which handles post request
    let urlStr = this._BASE_URL + url;
    xhttp.open("GET", urlStr);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var auth = "Bearer " + localStorage.getItem("accessToken");
    xhttp.setRequestHeader("Authorization", auth);
    // You should set responseType as blob for binary responses
    xhttp.responseType = "blob";
    xhttp.send(null);
    xhttp.addEventListener("load", this.transferCompleteGet);
    xhttp.addEventListener("error", this.transferFailedGet);

    xhttp.onreadystatechange = function () {
      var a;
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

  transferCompleteGet = (evt: any) => {
    var url = evt.target.responseURL;
    this.onReponseExcel.emit(url);
  }

  transferFailedGet = (evt: any) => {
    this.message.error("Không xuất được file!");
  }

}
