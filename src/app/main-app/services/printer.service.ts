import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Observable} from 'rxjs';
import { TAPIDTO, TApiMethodType, TCommonService } from 'src/app/lib';
import { PageLoadingService } from 'src/app/shared/services/page-loading.service';
import { TDSSafeAny } from 'tmt-tang-ui';
import { BaseSevice } from './base.service';

@Injectable()
export class PrinterService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";
  public renderer: Renderer2;

  constructor(private apiService: TCommonService,
      private loader: PageLoadingService,
      public rendererFactory: RendererFactory2) {

    super(apiService);
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  printHtml(html: string) {
      let body = document.querySelector('body');
      let iframe = this.renderer.createElement("iframe");
      this.renderer.setStyle(iframe, "visibility", "hidden");
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
    const api: TAPIDTO = {
        url: `${this._BASE_URL}/${url}`,
        method: TApiMethodType.get
    }

    this.loader.show();
    this.apiService.getExFile<TDSSafeAny>(api, null).subscribe((res: TDSSafeAny) => {
        this.loader.hidden();
        return this.printHtml(res);
    })
  }

  printUrlAsync(url: string): Observable<any> {
    return new Observable((observer: any) => {

        const api: TAPIDTO = {
            url: `${this._BASE_URL}/${url}`,
            method: TApiMethodType.get,
        }
        this.loader.show();
        this.apiService.getExFile<TDSSafeAny>(api,null).subscribe((res: TDSSafeAny) => {
            this.printHtml(res);

            observer.next(res);
            observer.complete();
            this.loader.show();

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
