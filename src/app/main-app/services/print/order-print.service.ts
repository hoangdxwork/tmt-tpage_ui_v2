import { TDSSafeAny, TDSMessageService } from 'tmt-tang-ui';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TAPIDTO, TApiMethodType, TCommonService } from "src/app/lib";
import { BaseSevice } from "../base.service";
import { GeneralConfigsFacade } from "../facades/general-config.facade";

@Injectable()
export class OrderPrintService extends BaseSevice {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  private saleConfig: any;
  private configModel: any;

  constructor(
    private apiService: TCommonService,
    private message: TDSMessageService,
    private generalConfigsFacade: GeneralConfigsFacade
  ) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.loadSaleConfig();
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().subscribe(res => {
      this.saleConfig = res;
    });
  }

  printOrder(model: any, commentMessage: string | null) {

    let lsProduct = [];
    let product = "";

    if (model.Details) {
      model.Details.forEach((x: any) => {
        lsProduct.push(`${x.ProductName}\nSL: ${x.Quantity} Giá: ${x.Price.toLocaleString()}`);
      });
    }

    if (model.Address) {
      lsProduct.push(model.Address);
    }

    if (lsProduct) {
      product = lsProduct.join('\n');
    }

    if(this.saleConfig.configs && this.saleConfig.configs.PrinterConfigs != null && this.saleConfig.configs.DefaultPrinterTemplate != null) {

      var printer = this.saleConfig.configs.PrinterConfigs.filter(function (x: any) {
        return x.Code === "03";
      })[0];

      if (!printer.Template) {
        printer.Template = this.saleConfig.configs.DefaultPrinterTemplate;
      }

      var note = printer.Note;
      if (this.configModel && this.configModel.enablePrintComment) {

        if (model.Note) {
          let prepareNote = Object.assign(model.Note);

          if(!this.configModel.isPrintNote && commentMessage) {
            prepareNote = commentMessage;
          }

          if (note && this.configModel.isPrintNote) {
            note = prepareNote + '\n-------------\n' + note;
          } else {
            note = prepareNote;
          }
        }
      }
      let body = JSON.stringify({
        size: printer.Template,
        note: note,
        html: '',
        json: {
          index: (this.configModel && this.configModel.sessionEnable) ? model.SessionIndex : '',
          code: model.Code,
          header: printer.NoteHeader,
          name: model.Facebook_UserName,
          partnerCode: model.PartnerCode,
          phone: model.Telephone,
          uid: model.Facebook_UserId,
          product: product
        }
      });

      this.print(printer.Ip, printer.Port, body).subscribe(res => {
        if (typeof res === "string") {
          res = JSON.parse(res);
        }

        if (!res.Success) {
          this.message.error(`Không thể in: ${res.Message}`);
        }
      }, error => {
        this.message.error(JSON.stringify(error));
      });
    }
    else
    {
      this.message.error("Không thể tải cấu hình. Không thể in.");
    }
  }

  print(printerIp: string, printerPort: string, body: TDSSafeAny): Observable<TDSSafeAny> {
    const api: TAPIDTO = {
      url: `http://${printerIp}:${printerPort}/print/html`,
      method: TApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, body);
  }

}
