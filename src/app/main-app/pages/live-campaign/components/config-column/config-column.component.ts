import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnTableDTO } from 'src/app/main-app/dto/common/table.dto';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'config-column',
  templateUrl: './config-column.component.html'
})
export class ConfigColumnComponent {

  @Input() columns: Array<ColumnTableDTO> = [];
  @Output() columnsChange = new EventEmitter<TDSSafeAny>();

  constructor() { }

  onChecked(event: TDSSafeAny, column:ColumnTableDTO) {
    column.isChecked = event.checked;
    this.columnsChange.emit(this.columns);
  }

}
