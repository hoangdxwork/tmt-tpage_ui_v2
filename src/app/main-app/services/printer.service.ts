import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { TDSSafeAny } from 'tmt-tang-ui';
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
      var body = document.querySelector('body');
      var iframe = this.renderer.createElement("iframe");
      this.renderer.setStyle(iframe, "visibility", "hidden");
      //gán vào body
      this.renderer.appendChild(body, iframe);
      iframe.onload = function () {
          iframe.contentWindow.print();
      };

      iframe.contentWindow.onafterprint = function () {
          iframe.remove();
      }

      var doc = iframe.contentWindow.document.open("text/html", "replace");

      doc.write(html);
      doc.close();
  }

  printUrl(url: string): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${url}`,
        method: TApiMethodType.get
    }

    return this.apiService.getData<TDSSafeAny>(api, { responseType: "text"});
  }

  printUrlAsync(url: string): Observable<any> {
    return new Observable((observer: any) => {

        const api: TAPIDTO = {
            url: `${this._BASE_URL}/${url}`,
            method: TApiMethodType.get,
        }

        this.apiService.getData<TDSSafeAny>(api, { responseType: 'text' }).subscribe((res: TDSSafeAny) => {
            this.printHtml(res);

            observer.next(res);
            observer.complete();

            return res;
        }, error => {
          observer.error(error);
        })
      });
  }

  printIP(url: string, value: any): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${url}`,
        method: TApiMethodType.post
    }

    return this.apiService.getData<TDSSafeAny>(api, value);
  }

}
