import { CRMMatchingService } from './../../../../services/crm-matching.service';
import { MDBByPSIdDTO } from './../../../../dto/crm-matching/mdb-by-psid.dto';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { PartnerService } from './../../../../services/partner.service';
import { ConversationMatchingItem } from './../../../../dto/conversation-all/conversation-all.dto';
import { QuickSaleOnlineOrderModel } from 'src/app/main-app/dto/saleonlineorder/quick-saleonline-order.dto';
import { EditOrderComponent } from './../../../order/components/edit-order/edit-order.component';

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { addDays } from 'date-fns';
import { ODataLiveCampaignOrderService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-order.service';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize, takeUntil } from 'rxjs/operators';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { SortEnum } from 'src/app/lib';
import { SaleOnline_OrderService } from 'src/app/main-app/services/sale-online-order.service';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTagStatusType } from 'tds-ui/tag';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSModalService } from 'tds-ui/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'detail-order',
  templateUrl: './detail-order.component.html'
})
export class DetailOrderComponent implements OnInit {

  @Input() liveCampaignId!: string;

  public filterObj: any = {
    tags: [],
    status: '',
    searchText: '',
    dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
    }
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ConversationMatchingItem;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;
  private destroy$ = new Subject<void>();

  constructor(
    private message: TDSMessageService,
    private modal: TDSModalService,
    private viewContainerRef: ViewContainerRef,
    private saleOnline_OrderService: SaleOnline_OrderService,
    private oDataLiveCampaignOrderService: ODataLiveCampaignOrderService,
    private partnerService: PartnerService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
  ) { }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignOrderService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe((res: TDSSafeAny) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];

    }, error => this.message.error(`${error?.error?.message}` || Message.CanNotLoadData));
  }

  getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignOrderService
        .getView(params, this.filterObj, this.liveCampaignId)
        .pipe(takeUntil(this.destroy$), finalize(() => this.isLoading = false ));
  }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.pageSize = 20;

    this.filterObj = {
      tags: event.tags,
      status: event?.status != 'Tất cả' ? event?.status : null,
      searchText: event.searchText,
      dateRange: {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate,
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData(){
    this.pageIndex = 1;

    this.filterObj = {
      tags: [],
      status: '',
      searchText: '',
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(item: QuickSaleOnlineOrderModel) {
    if(item && item.Id) {
      this.saleOnline_OrderService.getById(item.Id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {

          if(res && res.Id) {
            delete res['@odata.context'];

            const modal = this.modal.create({
                content: EditOrderComponent,
                size: 'xl',
                viewContainerRef: this.viewContainerRef,
                componentParams: {
                  dataItem: { ...res }
                }
            })

            modal.afterClose?.subscribe((obs: string) => {
                if (TDSHelperString.hasValueString(obs) && obs == 'onLoadPage') {
                    this.loadData(this.pageSize, this.pageIndex);
                }
            })
          }
      }, error => {
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Đã xảy ra lỗi');
      });
    }
  }

  onRemove(id: string, code: string) {
    this.modal.error({
      title: 'Xóa đơn hàng',
      content: 'Bạn có chắc muốn xóa đơn hàng',
      onOk: () => this.remove(id, code),
      onCancel:()=>{},
      okText:"Xóa",
      cancelText:"Hủy"
    });
  }

  remove(id: string, code: string) {
    this.isLoading = true;
    this.saleOnline_OrderService.remove(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((res: TDSSafeAny) => {
        this.message.info(`${Message.Order.DeleteSuccess} ${code}`);
        this.loadData(this.pageSize, this.pageIndex);
      }, error => this.message.error(`${error?.error?.message}` || Message.ErrorOccurred));
  }

  getColorStatusText(status: string): TDSTagStatusType {
    switch(status) {
      case "Nháp":
        return "info";
      case "Đơn hàng":
        return "success";
      case "Hủy":
        return "error";
      default:
        return "warning";
    }
  }

  onSearch(event: TDSSafeAny) {
    let text =  event?.target.value;

    this.pageIndex = 1;
    this.filterObj.searchText = text;
    this.loadData(this.pageSize, this.pageIndex);
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe((res: any): any => {

      let pageIds: any = [];
      res.map((x: any) => {
        pageIds.push(x.page_id);
      });

      if (pageIds.length == 0) {
        return this.message.error('Không có kênh kết nối với khách hàng này.');
      }

      this.crmTeamService.getActiveByPageIds$(pageIds)
        .pipe(takeUntil(this.destroy$)).subscribe((teams: any): any => {

          if (teams.length == 0) {
            return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.mappingTeams = [];
          let pageDic = {} as any;

          teams.map((x: any) => {
            let exist = res.filter((r: any) => r.page_id == x.ChannelId)[0];

            if (exist && !pageDic[exist.page_id]) {

              pageDic[exist.page_id] = true; // Cờ này để không thêm trùng page vào

              this.mappingTeams.push({
                psid: exist.psid,
                team: x
              })
            }
          })

          if (this.mappingTeams.length > 0) {
            this.currentMappingTeam = this.mappingTeams[0];
            this.loadMDBByPSId(this.currentMappingTeam.team.ChannelId, this.currentMappingTeam.psid);
          }
        });
    }, error => {
      this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
    })
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid)
      .pipe(takeUntil(this.destroy$)).subscribe((res: MDBByPSIdDTO) => {
        if (res) {
          res["keyTags"] = {};

          if (res.tags && res.tags.length > 0) {
            res.tags.map((x: any) => {
              res["keyTags"][x.id] = true;
            })
          } else {
            res.tags = [];
          }

          this.currentConversation = { ...res, ...this.currentConversation };
          this.psid = res.psid;
          this.isOpenDrawer = true;
        }
      }, error => {
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
      })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.ChannelId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
