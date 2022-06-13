import { finalize } from 'rxjs/operators';
import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppPackageDTO, TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { TenantService } from 'src/app/main-app/services/tenant.service';

@Component({
  selector: 'choose-pack-of-data',
  templateUrl: './choose-pack-of-data.component.html'
})
export class ChoosePackOfDataComponent implements OnInit {

  array = [0,1,2,3]
  isIndex = -1;
  isLoading: boolean = false;

  @Input() tenantInfo!: TenantInfoDTO;
  @Input() tenantUsed!: TenantUsedDTO;
  @Input() appPackage!: AppPackageDTO;
  @Input() userTime: TDSSafeAny;

  @Output() eventChangeTab = new EventEmitter<PackOfDataEnum>();

  constructor(
    private tenantService: TenantService
  ) { }

  ngOnInit(): void {
  }

  onExpand() {
    this.eventChangeTab.emit(PackOfDataEnum.EXPAND);
  }

  onBack() {
    this.eventChangeTab.emit(PackOfDataEnum.INFO);
  }

  focusData(idx: number){
    this.isIndex = idx
  }
  clickBackPageInfoData(){
  }
}
