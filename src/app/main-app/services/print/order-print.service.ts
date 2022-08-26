import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CoreAPIDTO, CoreApiMethodType, TCommonService } from "src/app/lib";
import { TDSMessageService } from "tds-ui/message";
import { TDSSafeAny } from "tds-ui/shared/utility";
import { BaseSevice } from "../base.service";
import { GeneralConfigsFacade } from "../facades/general-config.facade";
import { takeUntil } from 'rxjs/operators';
import { QuickSaleOnlineOrderModel } from "../../dto/saleonlineorder/quick-saleonline-order.dto";
import { InitSaleDTO } from "../../dto/setting/setting-sale-online.dto";

@Injectable()
export class OrderPrintService extends BaseSevice implements OnDestroy {

  prefix: string = "";
  table: string = "";
  baseRestApi: string = "";

  private saleConfig!: InitSaleDTO;
  private configModel: any;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: TCommonService,
    private message: TDSMessageService,
    private generalConfigsFacade: GeneralConfigsFacade) {
    super(apiService);
    this.initialize();
  }

  initialize() {
    this.loadSaleConfig();
  }

  loadSaleConfig() {
    this.generalConfigsFacade.getSaleConfigs().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.saleConfig = res;
    });

    this.generalConfigsFacade.getSaleOnineSettingConfig().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.configModel = res;
    });
  }

  printOrder(model: any, commentMessage?: string) {

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

      let printer = this.saleConfig.configs.PrinterConfigs.filter(function (x: any) {
        return x.Code === "03";
      })[0];

      if (!printer.Template) {
        printer.Template = this.saleConfig.configs.DefaultPrinterTemplate;
      }

      let note = printer.Note;
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
          product: product || "null"
        }
      });

      this.printRequest(printer.Ip, printer.Port, body).pipe(takeUntil(this.destroy$)).subscribe(res => {
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

  printIpFromOrder(model: any): any {
    let exist = this.saleConfig.configs && this.saleConfig.configs.PrinterConfigs != null && this.saleConfig.configs.DefaultPrinterTemplate != null;
    if(!exist) {
      return this.message.error('"Không thể tải cấu hình.", "Không thể in."')
    }

    let lsProduct: any = [];
    let product = "";
    let printer = this.saleConfig.configs.PrinterConfigs.filter((x: any) => x.Code === "03")[0];

    let checkQuanlityProduct = printer?.Others?.find((x: any) => x.Key == "config.hide_quantity_product")?.Value;
    let checkQuanlityPrice = printer?.Others?.find((x: any) => x.Key == "config.hide_price_product")?.Value;
    let showPageName = printer?.Others?.find((x: any) => x.Key == "config.show_page_name")?.Value;
    let showPartnerStatus = printer?.Others?.find((x: any) => x.Key == "config.show_partner_status")?.Value;

    if (model.Details) {
        model.Details.forEach((x: any) => {
            lsProduct.push((`${x.ProductName}\n ${(!checkQuanlityProduct) ? `SL: ${x.Quantity}` : ""} ${(!checkQuanlityPrice) ? `Giá: ${x.Price.toLocaleString()}` : ""} `).trim());
        });
    }

    if (lsProduct) {
        product = lsProduct.join('\n');
    }

    if (!printer.Template) {
        printer.Template = this.saleConfig.configs.DefaultPrinterTemplate;
    }

    let note = printer.Note;
    if (this.configModel && this.configModel.enablePrintComment) {
        if (model.Note) {
            if (note) {
                note = model.Note + '\n-------------\n' + note;
            } else {
                note = model.Note;
            }
        }
    }
    if (this.configModel.enablePrintAddress) {
        if (model.Address) {
            note = `Đc: ${model.Address}` + '\n-------------\n' + note;
        }
    }

    let noteHeader = printer.NoteHeader ? printer.NoteHeader : "";
    let header = showPageName ? noteHeader + "\n" + model.CRMTeamName : noteHeader;
    let partnerStatus = showPartnerStatus ? (model.Partner ? model.Partner.StatusText : "") : "";

    let body = {
      size: printer.Template,
      note: note,
      html: '',
      json: {
          index: (this.configModel && this.configModel.sessionEnable) ? model.SessionIndex : '',
          code: model.Code,
          header: header,
          name: model.Facebook_UserName,
          partnerCode: model.PartnerCode,
          phone: model.Telephone,
          uid: model.Facebook_UserId,
          product: product || "null",
          address: model.Address,
          dateInvoice: model.DateCreated,
          userName: model.User ? model.User.Name : "",
          details: model.Details,
          partnerStatus: partnerStatus
      }
    } as any;

    this.printRequest(printer.Ip, printer.Port, body).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      if (!data.Success) {
        this.message.error(`Không thể in: ${data.Message}`);
      }
    });
  }

  printId(id: string, quickOrderModel: QuickSaleOnlineOrderModel) {
    let printer = this.saleConfig.configs && this.saleConfig.configs.PrinterConfigs.filter((x: any) =>  {
        return x.Code == "03";
    })[0];

    if (!printer.Template) {
        printer.Template = this.saleConfig.configs.DefaultPrinterTemplate;
    }
    let note = printer.Note;
    if (this.configModel && this.configModel.enablePrintComment) {
        if (quickOrderModel.Note) {
            if (note) {
                note = quickOrderModel.Note + '\n-------------\n' + note;
            } else {
                note = quickOrderModel.Note;
            }
        }
    }
    if (this.configModel.enablePrintAddress) {
        if (quickOrderModel.Address) {
            note = `Đc: ${quickOrderModel.Address}` + '\n-------------\n' + note;
        }
    }
    let lsProduct: any = [];
    let product = "";

    var checkQuanlityProduct = printer.Others.find(x => x.Key == "config.hide_quantity_product")?.Value;
    var checkQuanlityPrice = printer.Others.find(x => x.Key == "config.hide_price_product")?.Value;
    var showPageName = printer.Others.find(x => x.Key == "config.show_page_name")?.Value;
    var showPartnerStatus = printer.Others.find(x => x.Key == "config.show_partner_status")?.Value;

    if (quickOrderModel.Details) {
        quickOrderModel.Details.forEach((x) => {
            lsProduct.push((`${x.ProductName}\n ${(!checkQuanlityProduct) ? `SL: ${x.Quantity}` : ""} ${(!checkQuanlityPrice) ? `Giá: ${x.Price.toLocaleString()}` : ""} `).trim());
        });
    }

    if (lsProduct) {
        product = lsProduct.join('\n');
    }
    var noteHeader = printer.NoteHeader ? printer.NoteHeader : "";
    var header = showPageName ? noteHeader + "\n" + quickOrderModel.CRMTeamName : noteHeader;
    var partnerStatus = showPartnerStatus ? (quickOrderModel.Partner ? quickOrderModel.Partner.StatusText : "") : "";

    let body = {
      size: printer.Template,
      html: '',
      note: note,
      json: {
          index: (this.configModel && this.configModel.sessionEnable) ? quickOrderModel.SessionIndex : '',
          code: quickOrderModel.Code,
          header: header,
          name: quickOrderModel.Facebook_UserName,
          partnerCode: quickOrderModel.PartnerCode,
          phone: quickOrderModel.Telephone,
          uid: quickOrderModel.Facebook_UserId,
          product: product || "null",
          address: quickOrderModel.Address,
          userName: quickOrderModel.User ? quickOrderModel.User.Name:"",
          dateInvoice: quickOrderModel.DateCreated,
          details: quickOrderModel.Details,
          partnerStatus: partnerStatus
      }
    }

    this.printRequest(printer.Ip, printer.Port, body).pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (typeof data === "string") {
        data = JSON.parse(data);
      }

      if (!data.Success) {
        this.message.error(`Không thể in: ${data.Message}`);
      }
    });
  }

  printRequest(printerIp: string, printerPort: string, body: TDSSafeAny): Observable<TDSSafeAny> {
    const api: CoreAPIDTO = {
      url: `http://${printerIp}:${printerPort}/print/html`,
      method: CoreApiMethodType.post,
    }

    return this.apiService.getData<TDSSafeAny>(api, body);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
