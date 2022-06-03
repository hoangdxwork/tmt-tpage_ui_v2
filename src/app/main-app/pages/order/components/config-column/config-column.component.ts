import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TDSSafeAny } from 'tmt-tang-ui';

export interface ColumnTableDTO {
  value: TDSSafeAny,
  name: TDSSafeAny,
  isChecked: boolean
}

@Component({
  selector: 'config-column',
  templateUrl: './config-column.component.html',
})
export class ConfigColumnComponent {

  @Input() columns: Array<ColumnTableDTO> =[];
  @Output() columnsChange = new EventEmitter<TDSSafeAny>();

  onChecked(event: TDSSafeAny, column:ColumnTableDTO) {
      column.isChecked = event.checked;
      this.columnsChange.emit(this.columns);
  }

}
