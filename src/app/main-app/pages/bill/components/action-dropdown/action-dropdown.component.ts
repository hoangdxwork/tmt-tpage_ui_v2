import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OperatorEnum } from "src/app/lib";
import { ExcelExportService } from "src/app/main-app/services/excel-export.service";
import { PrinterService } from "src/app/main-app/services/printer.service";
import { TDSMessageService } from "tmt-tang-ui";

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
})

export class ActionDropdownComponent implements OnInit{

  @Input() filterObj: any;
  @Input() setOfCheckedId: any = [];

  tagIds: any = [];

  constructor(private router: Router,
    private message: TDSMessageService,
    private excelExportService: ExcelExportService,
    private printerService: PrinterService) {
  }

  ngOnInit(): void {}

  exportExcel(type: string): any {

    let dateStart = this.filterObj.dateRange.startDate;
    let dateEnd =  this.filterObj.dateRange.endDate;

    let data = {
      filter: {
        filters: [
            { field: "Type", operator: OperatorEnum.eq, value: "invoice"},
            {field: "DateInvoice", operator: "gte",value: dateStart },
            { field: "DateInvoice", operator: "lte", value: dateEnd }
        ],
        logic: "and",
      },
    };

    switch (type) {
      case "excels":
        this.excelExportService.exportPost(`/fastsaleorder/ExportFile?TagIds=
            ${this.tagIds}`, { data: JSON.stringify(data), ids: this.setOfCheckedId },
            `ban-hang`);
        break;

      case "details":
        var ids: any[] = [...this.setOfCheckedId][0];
        ids = [...ids];
        if(ids.length == 0) {
          this.message.error('Vui lòng chọn tối thiểu một dòng!');
        }

        this.excelExportService.exportPost(`/fastsaleorder/ExportFileDetail?TagIds=${this.tagIds}`,
          { data: JSON.stringify(data), ids: ids }, "ban-hang-chi-tiet");
        break;

        default:
          break;
    }

  }

}
