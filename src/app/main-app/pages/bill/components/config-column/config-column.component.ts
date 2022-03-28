import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FastSaleOrderService } from "src/app/main-app/services/fast-sale-order.service";
import { TDSSafeAny } from "tmt-tang-ui";

@Component({
  selector: 'config-column',
  templateUrl: './config-column.component.html',
})

export class ConfigColumComponent implements OnInit {

  @Input() hiddenColumns: any[] = [];
  @Input() columns: any[] = [];

  @Output() onLoadConfigColumn = new EventEmitter<TDSSafeAny>();

  constructor(private fastSaleOrderService: FastSaleOrderService) {
  }

  ngOnInit(): void {

  }

  public isHidden(columnName: string): boolean {
    return this.hiddenColumns.indexOf(columnName) > -1;
  }

  public isDisabled(columnName: string): boolean {
     return this.columns.length - this.hiddenColumns.length === 1 && !this.isHidden(columnName);
  }

  public hideColumn(columnName: string): void {
    const hiddenColumns = this.hiddenColumns;

    if (!this.isHidden(columnName)) {
      hiddenColumns.push(columnName);
    } else {
      hiddenColumns.splice(hiddenColumns.indexOf(columnName), 1);
    }

    const gridConfig = {
      columnsConfig: hiddenColumns.map((x: string) => {
        return <any> {
          name: (this.columns.filter((a: any) => a.value === x)[0]).name,
          value: x
        }
      })
    }

    const key = this.fastSaleOrderService._keyCacheGrid;
    localStorage.setItem(key, JSON.stringify(gridConfig));
  }


}
