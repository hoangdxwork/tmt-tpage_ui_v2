import { CRMTeamService } from './../../../services/crm-team.service';
import { ExcelExportService } from './../../../services/excel-export.service';
import { ActivatedRoute, Router } from '@angular/router';
import { THelperCacheService } from './../../../../lib/utility/helper-cache';
import { ColumnTableDTO } from './../../partner/components/config-column/config-column-partner.component';
import { HistoryDeliveryStatusDetailDTO } from './../../../dto/fastsaleorder/fastsaleorder.dto';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { HistoryDeliveryDTO } from './../../../dto/bill/bill.dto';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { TDSMessageService } from 'tds-ui/message';
import { TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'history-delivery-status-detail',
  templateUrl: './history-delivery-status-detail.component.html'
})
export class HistoryDeliveryStatusDetailComponent implements OnInit {
  @Input() historyDeliveryData!:HistoryDeliveryDTO;

  lstOfData:HistoryDeliveryStatusDetailDTO[] = [];
  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    {value: 'OrderCode', name: 'Mã hóa đơn', isChecked: true},
    {value: 'ShipCode', name: 'Mã vận đơn', isChecked: true},
    {value: 'CarrierName', name: 'Đối tác giao hàng', isChecked: true},
    {value: 'OrderAmount', name: 'COD hóa đơn', isChecked: true},
    {value: 'ShipAmount', name: 'Tiền thu hộ', isChecked: true},
    {value: 'Note', name: 'Ghi chú', isChecked: true},
    {value: 'Status', name: 'Trạng thái', isChecked: true},
    {value: 'TotalCOD', name: 'Tổng COD', isChecked: false},
    {value: 'TotalCODShip', name: 'Tổng COD đối tác', isChecked: false},
    {value: 'DeliveryPrice', name: 'Phí ship giao hàng', isChecked: false},
    {value: 'CustomerDeliveryPrice', name: 'Phí ship', isChecked: false}
  ];
  isLoading = false;
  id: any;
  teamId!:TDSSafeAny;
  keyFilter!:TDSSafeAny;
  isExportExcel = false;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private fastSaleOrderService: FastSaleOrderService,
    private excelExportService: ExcelExportService,
    private cRMTeamService: CRMTeamService,
    private cacheApi: THelperCacheService,
    private message: TDSMessageService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.teamId = this.cRMTeamService.getCurrentTeam()?.Id;
    //TODO: load teamId from indexedDB
    // this.cRMTeamService.getCacheTeamId().subscribe((res)=>{
    //   this.teamId = res;
    //   this.cdRef.markForCheck();
    // })
    // TODO: lấy id lịch sử đối soát
    this.id = this.route.snapshot.paramMap.get("id");
    this.loadData();
    this.loadGridConfig();
  }

  loadData(){
    this.isLoading = true;
    if(this.historyDeliveryData?.Id || this.id){
      this.fastSaleOrderService.getHistoryDeliveryStatusById(this.historyDeliveryData?.Id || this.id).pipe(takeUntil(this.destroy$),finalize(()=>this.isLoading = false)).subscribe(
        (res:TDSSafeAny)=>{
          delete res["@odata.context"];
          if(res.Date){
            res.Date = new Date(res.Date);
          }
          this.historyDeliveryData = res;
          // TODO: lấy danh sách chi tiết đối soát
          this.lstOfData = [...res.Details];
        },
        (err)=>{
          this.message.error(err.error.message || 'Tải chi tiết đối soát thất bại');
        }
      )
    }else{
      this.message.error('Không tìm thấy Id đối soát');
    }
  }

  loadGridConfig() {
    const key = this.fastSaleOrderService._keyCacheDHSDetails;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if(res && res.value) {
        var jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    })
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if(event && event.length > 0) {
      const gridConfig = {
          columnConfig: event
      };

      const key = this.fastSaleOrderService._keyCacheDHSDetails;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  directPage(route:string){
    this.router.navigateByUrl(route);
  }

  checkStatus(status:string){
    switch(status){
      case 'Đã thu tiền':
        return 'primary'
      case 'Đã tiếp nhận':
        return 'info'
      case 'Hàng trả về':
        return 'error'
      default:
        return 'secondary'
    }
  }

  filterSearch(event:any){
    this.keyFilter = event.value;
    if(!this.keyFilter || this.keyFilter === ''){
      this.lstOfData = this.historyDeliveryData.Details;
    }else{
      this.lstOfData = this.historyDeliveryData.Details
        .filter(x=> x.ShipCode.includes(this.keyFilter)|| x.OrderCode.includes(this.keyFilter)|| x.ShipAmount.toString().includes(this.keyFilter));
    }
  }

  exportDetail(){
    this.isExportExcel = true;

    this.excelExportService.exportGet(
      `/HistoryDeliveryStatus/exportdetailhistories?id=${this.historyDeliveryData?.Id || this.id}&filter=${this.keyFilter || ''}`,
      `Chi tiết đối soát`
    )
    .pipe(finalize(()=>this.isExportExcel = false), takeUntil(this.destroy$))
    .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
