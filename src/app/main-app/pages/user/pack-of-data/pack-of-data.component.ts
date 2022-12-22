import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit } from '@angular/core';
import { finalize, takeUntil } from 'rxjs/operators';
import { PackOfDataEnum } from 'src/app/main-app/dto/account/account.dto';
import { AppPackageDTO, PackageDTO, PackagePaymentDTO, TenantInfoDTO, TenantUsedDTO } from 'src/app/main-app/dto/tenant/tenant.dto';
import { TenantService } from 'src/app/main-app/services/tenant.service';
import { DateHelperV2 } from 'src/app/main-app/shared/helper/date.helper';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'pack-of-data',
  templateUrl: './pack-of-data.component.html',
  providers: [TDSDestroyService]
})
export class PackOfDataComponent implements OnInit {

  isLoading: boolean = false;
  tenantInfo!: TenantInfoDTO;
  tenantUsed!: TenantUsedDTO;
  appPackage!: AppPackageDTO;
  userTime?: TDSSafeAny;
  currentPackage?: PackageDTO;
  dataPayment!: PackagePaymentDTO;

  currentTab: PackOfDataEnum = PackOfDataEnum.INFO;

  constructor(
    private tenantService: TenantService,
    private message: TDSMessageService,
    private destroy$: TDSDestroyService
  ) { }

  get getPackOfDataEnum() {
    return PackOfDataEnum;
  }

  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo() {
    this.isLoading = true;
    this.tenantService.getInfo().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.tenantInfo = res;
        this.loadUsed();
        this.updateUserTime(res?.Tenant?.DateExpired);
      }, 
      error: (error) => {
        this.isLoading = false;
        this.message.error(error?.error?.message);
      }
    });
  }

  loadUsed() {
    this.tenantService.getUsed().subscribe({
      next: (res) => {
        this.tenantUsed = res;
        this.loadPackages();
      }, 
      error: (error) => {
        this.isLoading = false;
        this.message.error(error?.error?.message);
      }
    });
  }

  loadPackages() {
    this.tenantService.getPackages().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.appPackage = res;
        this.getCurrentPackage();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message.error(err.error?.message);
      }
    });
  }

  updateUserTime(dateExpired: TDSSafeAny) {
    if(dateExpired) {
      let timer = DateHelperV2.getCountDownTimer(dateExpired);
      let value = timer.days + " ngày " + timer.hours + " giờ " + timer.minutes + " phút ";
      this.userTime = value;
    }
  }

  getCurrentPackage() {
    this.currentPackage = this.appPackage?.packages.find(x => x.id === this.tenantInfo?.Tenant?.PackageCode);
  }

  onChangeTab(value: PackOfDataEnum) {
    this.currentTab = value;
  }

  onDataPayment(value: PackagePaymentDTO) {
    this.dataPayment = value;
    this.currentTab = PackOfDataEnum.PAYMENT;
  }

}
