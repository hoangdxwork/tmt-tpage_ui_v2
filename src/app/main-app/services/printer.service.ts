import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable } from 'rxjs';
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from 'src/app/lib';
import { PageLoadingService } from 'src/app/shared/services/page-loading.service';
import { TDSSafeAny } from 'tds-ui/shared/utility';
import { BaseSevice } from './base.service';

@Injectable()
export class PrinterService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  public renderer: Renderer2;

  constructor(private apiService: TCommonService,
    public rendererFactory: RendererFactory2) {

    super(apiService);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  printHtml(html: string) {
    let body = document.querySelector('body');
    let iframe = this.renderer.createElement("iframe");
    this.renderer.setStyle(iframe, "display", "none");
    //gán vào body
    this.renderer.appendChild(body, iframe);
    iframe.onload = function () {
      iframe.contentWindow.print();
    };

    iframe.contentWindow.onafterprint = function () {
      iframe.remove();
    }

    let doc = iframe.contentWindow.document.open("text/html", "replace");
    doc.write(html);
    doc.close();
  }

  printUrl(url: string) {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${url}`,
      method: CoreApiMethodType.get
    }
    return this.apiService.getExFile<TDSSafeAny>(api, null)
  }

  printUrlAsync(url: string): Observable<any> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${url}`,
      method: CoreApiMethodType.get,
    }
    return this.apiService.getExFile<TDSSafeAny>(api, null)
  }

  printIP(url: string, value: any): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `${this._BASE_URL}/${url}`,
      method: CoreApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, value);
  }

}
