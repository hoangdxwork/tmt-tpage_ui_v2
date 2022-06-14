import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonService } from "src/app/main-app/services/common.service";
import { TDSContextMenuService } from "tds-ui/dropdown";
import { TDSMessageService } from "tds-ui/message";
import { TDSSafeAny } from "tds-ui/shared/utility";

@Component({
  selector: 'filter-option-partner',
  templateUrl: './filter-option-partner.component.html',
})

export class FilterOptionPartnerComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() status: any = [];

  isVisible: boolean = false;

  public filterObj: TDSSafeAny = {
      searchText: '',
      statusText: null
  }

  currentStatus = { value: 'all', text: 'Tất cả'};
  isActive: boolean = false;

  constructor(private message: TDSMessageService,
      private commonService: CommonService,
      private tdsContextMenuService: TDSContextMenuService) {
  }

  ngOnInit(): void {
  }

  selectState(event: any): void {
    if(event == "all") {
      this.currentStatus = { value: 'all', text: 'Tất cả'};

      this.filterObj = {
          statusText: null,
          searchText: '',
      }
    } else {
      this.currentStatus = { value: event.StatusText, text: event.StatusText };
      this.filterObj = {
          statusText: event.StatusText,
          searchText: '',
      }
    }
  }

  onApply() {
    this.onLoadOption.emit(this.filterObj);
  }

  onCancel() {
    this.currentStatus = { value: 'all', text: 'Tất cả'};

    this.filterObj = {
        statusText: null,
        searchText: '',
    }

    this.onLoadOption.emit(this.filterObj);
    this.isActive = false;
  }

  closeMenu() {
    this.isVisible = false;
  }

}
