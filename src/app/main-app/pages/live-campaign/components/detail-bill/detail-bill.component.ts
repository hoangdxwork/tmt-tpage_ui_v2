import { BillFilterOptionsComponent } from './../../../../shared/bill-filter-options/bill-filter-options.component';
import { ViewChild } from '@angular/core';
import { Message } from 'src/app/lib/consts/message.const';
import { CommonService } from './../../../../services/common.service';
import { ModalMergeOrderComponent } from './modal-merge-order.component';
import { TDSNotificationService } from 'tds-ui/notification';
import { SendDeliveryComponent } from './../../../bill/components/send-delivery/send-delivery.component';
import { TDSModalService } from 'tds-ui/modal';
import { PrinterService } from './../../../../services/printer.service';
import { takeUntil, map } from 'rxjs';
import { ChatomniConversationItemDto } from 'src/app/main-app/dto/conversation-all/chatomni/chatomni-conversation';
import { CRMTeamService } from './../../../../services/crm-team.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PartnerService } from './../../../../services/partner.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { addDays } from 'date-fns';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { ODataLiveCampaignBillService } from 'src/app/main-app/services/mock-odata/odata-live-campaign-bill.service';
import { FastSaleOrderModelDTO } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder.dto';
import { SortEnum, THelperCacheService } from 'src/app/lib';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { finalize } from 'rxjs/operators';
import { TagService } from 'src/app/main-app/services/tag.service';
import { FastSaleOrderService } from 'src/app/main-app/services/fast-sale-order.service';
import { Router } from '@angular/router';
import { TDSSafeAny, TDSHelperObject, TDSHelperString, TDSHelperArray } from 'tds-ui/shared/utility';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { ColumnTableDTO } from '@app/dto/common/table.dto';
import { ChatomniConversationService } from '@app/services/chatomni-service/chatomni-conversation.service';
import { PartnerCanMergeOrdersDto } from '@app/dto/live-campaign/sale-order-livecampaign.dto';

@Component({
  selector: 'detail-bill',
  templateUrl: './detail-bill.component.html',
  providers: [ TDSDestroyService ]
})
export class DetailBillComponent implements OnInit {

  @Input() liveCampaignId!: string;

  @ViewChild(BillFilterOptionsComponent) billFilterOptions!: TDSSafeAny;

  public filterObj: any = {
    tags: [],
    status: '',
    bill: null,
    liveCampaignId: '',
    deliveryType: '',
    isWaitPayment: false,
    searchText: '',
    dateRange: {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
    },
    carrierId: -1
  }

  sort: Array<SortDataRequestDTO>= [{
    field: "DateCreated",
    dir: SortEnum.desc,
  }];

  lstOfData: Array<FastSaleOrderModelDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;
  tabIndex: number = 1;
  indClickTag = -1;

  public lstTags: Array<TDSSafeAny> = [];
  public modelTags: Array<TDSSafeAny> = [];
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  isOpenDrawer: boolean = false;
  orderMessage: TDSSafeAny;

  isProcessing!: boolean;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  idsModel: any = [];

  lstPartner: PartnerCanMergeOrdersDto[] = [];
  countPartner: number = 0;

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    { value: 'Number', name: 'Số hóa đơn', isChecked: true },
    { value: 'PartnerDisplayName', name: 'Tên khách hàng', isChecked: true },
    { value: 'TrackingRef', name: 'Mã vận đơn', isChecked: true },
    { value: 'Address', name: 'Địa chỉ', isChecked: true },
    { value: 'AmountTotal', name: 'Tổng tiền', isChecked: true },
    { value: 'AmountDeposit', name: 'Đặt cọc', isChecked: true },
    { value: 'Residual', name: 'Còn nợ', isChecked: true },
    { value: 'State', name: 'Trạng thái', isChecked: true },
    { value: 'PrintDeliveryCount', name: 'Số lần in HĐ', isChecked: true },
    { value: 'UserName', name: 'Nhân viên', isChecked: true },
    { value: 'DateInvoice', name: 'Ngày bán', isChecked: true },
  ];

  filterDate: string = '';

  constructor(private message: TDSMessageService,
    private tagService: TagService,
    private router: Router,
    private fastSaleOrderService: FastSaleOrderService,
    private oDataLiveCampaignBillService: ODataLiveCampaignBillService,
    private partnerService: PartnerService,
    private destroy$: TDSDestroyService,
    private cacheApi: THelperCacheService,
    private crmTeamService: CRMTeamService,
    private commonService: CommonService,
    private printerService: PrinterService,
    private viewContainerRef: ViewContainerRef,
    private modal: TDSModalService,
    private notification: TDSNotificationService,
    private chatomniConversationService: ChatomniConversationService) {
  }

  ngOnInit() {
    this.setFilter();
    this.loadTags();
    this.loadGridConfig();

    // this.loadPartnerCanMergeOrders();
    this.countPartnerCanMergeOrders();
  }

  setFilter() {
    this.filterObj.liveCampaignId = this.liveCampaignId;
    this.filterObj.isWaitPayment = false;
  }

  loadTags(){
    let type = "fastsaleorder";
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          this.lstTags = [...(res?.value || [])];
      },
      error: (err: any) => {
          this.message.error(err?.error?.message);
      }
    })
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.oDataLiveCampaignBillService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.isLoading = true;
    this.getViewData(params).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res) => {
          this.count = res['@odata.count'] as number;
          this.lstOfData = [...(res?.value || [])];
          this.isLoading = false;
      },
      error:(err) => {
          this.message.error(err?.error?.message);
          this.isLoading = false;
      }
    });
  }

  private getViewData(params: string) {
    this.isLoading = true;
    return this.oDataLiveCampaignBillService.getView(params, this.filterObj);
  }

  countPartnerCanMergeOrders() {
    let id = this.liveCampaignId;
    this.fastSaleOrderService.countPartnerCanMergeOrders(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.countPartner = data;
      },
      error: (err: any) => {
        this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  // loadPartnerCanMergeOrders() {
  //   let id = this.liveCampaignId;
  //   this.lstPartner = [];
  //   this.isLoading = true;

  //   let pageSize = 10;
  //   let pageIndex = 1;

  //   let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex);
  //   this.fastSaleOrderService.getPartnerCanMergeOrders(id, params).pipe(takeUntil(this.destroy$)).subscribe({
  //     next: (res: any) => {
  //         delete res['@odata.context'];
  //         // this.countPartner = res['@odata.count'];
  //         this.lstPartner = [...(res?.value || 0)];
  //         this.isLoading = false;
  //     },
  //     error: (err) => {
  //         this.message.error(err?.error?.message || 'Đã xảy ra lỗi');
  //         this.isLoading = false;
  //     }
  //   })
  // }

  onLoadOption(event: any): void {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: event.tags,
      status: event.status,
      bill: event.bill,
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: event.deliveryType,
      carrierId: event.carrierId,
      searchText: this.filterObj.searchText,
      dateRange: event.dateRange ? {
        startDate: event.dateRange.startDate,
        endDate: event.dateRange.endDate
      } : null
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      tags: [],
      status: '',
      bill: null,
      isWaitPayment: false,
      liveCampaignId: this.liveCampaignId,
      deliveryType: '',
      searchText: '',
      carrierId: -1,
      dateRange: {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      }
    }

    this.billFilterOptions.onCancel();
    // this.loadPartnerCanMergeOrders();
    this.countPartnerCanMergeOrders();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.removeCheckedRow();
    this.loadData(params.pageSize, params.pageIndex);
  }

  onEdit(id: number) {
    this.router.navigateByUrl(`bill/detail/${id}`);
  }

  onDelete(data: FastSaleOrderModelDTO) {
    if(this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.isLoading = true;

    this.modal.error({
      title: 'Xóa hóa đơn',
      content: 'Bạn có muốn xóa hóa đơn',
      onOk: () => {
        this.fastSaleOrderService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: any) => {
                this.isProcessing = false;
                this.isLoading = false;
                this.setOfCheckedId.delete(data.Id);

                this.message.success('Xóa hóa đơn thành công!');
                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (error: any) => {
                this.isProcessing = false;
                this.isLoading = false;
                this.message.error(`${error?.error?.message}`);
            }
        })
      },
      onCancel: () => {
          this.isProcessing = false;
          this.isLoading = false;
      },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });
  }

  closeTag(): void {
    this.indClickTag = -1;
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  assignTags(id: number, tags: TDSSafeAny) {
    if(tags == null) {
      this.message.error("Vui lòng nhập tên thẻ!");
      return;
    }

    let model = {
      OrderId: id,
      Tags: tags
    };

    this.isLoading = true;
    this.fastSaleOrderService.assignTagFastSaleOrder(model).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: TDSSafeAny) => {
        if(res && res.OrderId) {
            let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
            if(exits) {
                exits.Tags = JSON.stringify(tags);
            }

            this.indClickTag = -1;
            this.isLoading = false;
            this.message.success('Gán nhãn thành công!');
        }
      },
      error: (err) => {
          this.isLoading = false;
          this.indClickTag = -1;
          this.message.error('Gán nhãn thất bại!');
      }
    });
  }


  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.filterObj.searchText = data.value;

    this.loadData(this.pageSize, this.pageIndex);
  }

  openMiniChat(data: TDSSafeAny) {
    let partnerId = data.PartnerId;
    this.orderMessage = data;
    this.isLoading = true;

    if (this.orderMessage.DateCreated) {
      this.orderMessage.DateCreated = new Date(this.orderMessage.DateCreated);
    }

    if(!TDSHelperString.hasValueString(data.TeamId)) {
      this.isLoading = false;
      this.message.error(Message.PageNotExist);
      return;
    }

    this.partnerService.getAllByPartnerId(data.TeamId, partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any): any => {

        let pageIds: any = [];
        res.map((x: any) => {
          pageIds.push(x.ChannelId);
        });

        if (pageIds.length == 0) {
          this.isLoading = false;
          return this.message.error('Không có kênh kết nối với khách hàng này.');
        }

        this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
            next: (teams: any): any => {

            if (teams.length == 0) {
              this.isLoading = false;
              return this.message.error('Không có kênh kết nối với khách hàng này.');
            }

            this.mappingTeams = [];
            let pageDic = {} as any;

            teams.map((x: any) => {
              let exist = res.filter((r: any) => r.ChannelId == x.ChannelId)[0];

              if (exist && !pageDic[exist.ChannelId]) {

                pageDic[exist.ChannelId] = true; // Cờ này để không thêm trùng page vào

                this.mappingTeams.push({
                  psid: exist.UserId,
                  team: x
                })
              }
            })

            if (this.mappingTeams.length > 0) {
              this.currentMappingTeam = this.mappingTeams[0];
              this.loadMDBByPSId(this.currentMappingTeam.team.Id, this.currentMappingTeam.psid);
            } else {
              this.isLoading = false;
            }
          }
        });
      },
      error: error => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
      }
    }
      )
  }

  loadMDBByPSId(channelId: number, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;
    if(!TDSHelperString.hasValueString(psid)) {
      this.message.error('Không tìm thấy ConversationId');
      return;
    }
    // get data currentConversation
    this.chatomniConversationService.getById(channelId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ChatomniConversationItemDto) => {
          if (res) {
            this.currentConversation = { ...res };
            this.psid = psid;
          }

          this.isOpenDrawer = true;
          this.isLoading = false;
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
      }
    })
  }

  selectMappingTeam(item: any) {
    this.currentMappingTeam = item;
    this.loadMDBByPSId(item.team?.ChannelId, item.psid); // Tải lại hội thoại
  }

  closeDrawer() {
    this.isOpenDrawer = false;
  }

  print(type: string) {
    let that = this;

    if (this.isProcessing) {
      return;
    }

    if (this.checkValueEmpty() == 1) {
      this.isLoading = true;
      this.isProcessing = true;
      let obs: TDSSafeAny;

      switch (type) {
        case "print":
          obs = this.printerService.printUrl(`/fastsaleorder/print?ids=${this.idsModel}`);
          break;
        case "printShips":
          obs = this.printerService.printUrl(`/fastsaleorder/PrintShipThuan?ids=${this.idsModel}`);
          break;
      }

      if (TDSHelperObject.hasValue(obs)) {
        this.isProcessing = true;
        obs.pipe(takeUntil(this.destroy$), finalize(() => {
            this.isProcessing = false;
            this.isLoading = false;
        })).subscribe((res: TDSSafeAny) => {
            that.printerService.printHtml(res);
        })
      }
    }
  }

  sendDelivery() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      this.isProcessing = true;
      this.isLoading = true;

      this.modal.create({
        title: 'Danh sách phù hợp gửi lại mã vận đơn',
        content: SendDeliveryComponent,
        size: 'xl',
        bodyStyle:{
          'padding':'0'
        },
        viewContainerRef: this.viewContainerRef,
        componentParams: {
          ids: this.idsModel
        }
      });

      this.modal.afterAllClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.isProcessing = false;
          this.isLoading = false;

          this.loadData(this.pageSize, this.pageIndex);
        }
      })
    }
  }

  approveOrder(type? :string) {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.isLoading = true;

      this.modal.success({
        title: 'Xác nhận bán hàng',
        content: 'Bạn có muốn xác nhận bán hàng',
        onOk: () => {
          that.fastSaleOrderService.actionInvoiceOpen({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {

              if(res && TDSHelperString.hasValueString(res.Error) && res.Errors && !TDSHelperArray.hasListValue(res.Errors)){
                that.notification.error('Thông báo', res.Error);
              }

              that.isProcessing = false;

              if(type) {
                this.print(type);
              }

              if(res.Success) {
                that.notification.success('Thông báo', 'Xác nhận bán hàng thành công!');
              }

              this.removeCheckedRow();
              this.loadData(this.pageSize, this.pageIndex);

              if(res.Success == true && !res.Error) {
                this.loadInventoryIds();
              }

              this.isLoading = false;
            },
            error:error => {
              this.isLoading = false;
              that.isProcessing = false;
              that.message.error(`${error?.error?.message}` || 'Xác nhận bán hàng thất bại');
            }
          })
        },
        onCancel: () => {
          that.isProcessing = false;
          this.isLoading = false;
        },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  loadInventoryIds(){
    let ids: any = [];

    this.lstOfData.map((data : FastSaleOrderModelDTO) => {
      if(this.idsModel.includes(data.Id)) {

        this.fastSaleOrderService.getById(data.Id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (order) => {
            if(!order) return;

            if(order.OrderLines) {
              ids = [];

              order.OrderLines.forEach((x: any) => {
                if (!ids.includes(x.ProductId)) {
                    ids.push(x.ProductId);
                }
              });
            }

            let warehouseId = order.WarehouseId;
            this.commonService.getInventoryByIds(warehouseId, ids).pipe(takeUntil(this.destroy$)).subscribe({
              next:(res: any) => {
                this.notification.success('Tồn kho', `Hóa đơn [<span class="text-info-500 font-semibold">${order.Number}</span>]<br/>Cập nhật tồn kho thành công`);
              },
              error:(error) => {
                this.notification.warning('Tồn kho', `Hóa đơn [<span class="text-info-500 font-semibold">${order.Number}</span>]<br/>Cập nhật tồn kho thất bại`);
              }
            })
          },
          error: (err) => {
            this.message.error(err.error?.message);
          }
        });
      }
    })
  }

  cancelDelivery() {
    if (this.isProcessing) return;
    let that = this;

    if (this.checkValueEmpty() == 1) {
      that.isProcessing = true;
      this.isLoading = true;

      this.modal.warning({
        title: 'Hủy vận đơn',
        content: 'Bạn có muốn hủy vận đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelShipIds({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {
              that.isProcessing = false;
              this.isLoading = false;

              that.message.success('Hủy vận đơn thành công!');
              that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
              this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
              that.isProcessing = false;
              this.isLoading = false;

              that.message.error(`${err?.error?.message}` || `Hủy vận đơn thất bại`);
            }
          })
        },
        onCancel: () => {
          that.isProcessing = false;
          this.isLoading = false;
        },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  cancelInvoice() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.isLoading = true;

      this.modal.success({
        title: 'Hủy hóa đơn',
        content: 'Bạn có muốn hủy hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.cancelInvoice({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {
                that.isProcessing = false;
                this.isLoading = false;

                that.message.success('Hủy hóa đơn thành công!');
                that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
                this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
                that.isProcessing = false;
                this.isLoading = false;
                that.message.error(`${err?.error?.message}` || `Hủy hóa đơn thất bại`);
            }
          })
        },
        onCancel: () => {
          that.isProcessing = false;
          this.isLoading = false;
        },
        okText: "Xác nhận",
        cancelText: "Đóng",
      });
    }
  }

  unLink() {
    if (this.isProcessing) return;

    if (this.checkValueEmpty() == 1) {
      let that = this;
      that.isProcessing = true;
      this.isLoading = true;

      this.modal.success({
        title: 'Xóa hóa đơn',
        content: 'Bạn có muốn xóa hóa đơn',
        onOk: () => {
          that.fastSaleOrderService.unLink({ ids: that.idsModel }).pipe(takeUntil(this.destroy$)).subscribe({
            next:(res: TDSSafeAny) => {
              that.isProcessing = false;
              this.isLoading = false;

              this.setOfCheckedId.clear();
              that.message.success('Xóa hóa đơn thành công!');

              that.fastSaleOrderService.onLoadPage$.emit('onLoadPage');
              this.loadData(this.pageSize, this.pageIndex);
            },
            error: (err) => {
              that.isProcessing = false;
              this.isLoading = false;
              that.message.error(`${err?.error?.message}` || `Xóa đơn thất bại`);
            }
          })
        },
        onCancel: () => {
          that.isProcessing = false;
          this.isLoading = false;
        },
        okText: "Xác nhận",
        cancelText: "Đóng"
      });
    }
  }

  checkValueEmpty() {
    let ids: any[] = [...this.setOfCheckedId];
    this.idsModel = [...ids];

    if (this.idsModel.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.lstOfData.forEach((x: any) => this.updateCheckedSet(x.Id, value));
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.lstOfData.every(x => this.setOfCheckedId.has(x.Id));
    this.indeterminate = this.lstOfData.some(x => this.setOfCheckedId.has(x.Id)) && !this.checked;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.oDataLiveCampaignBillService._keyCacheGridBill;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  loadGridConfig() {
    const key = this.oDataLiveCampaignBillService._keyCacheGridBill;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: TDSSafeAny) => {
            if (res && res.value) {
              let jsColumns = JSON.parse(res.value) as any;
              this.hiddenColumns = jsColumns.value.columnConfig;
            } else {
              this.hiddenColumns = this.columns;
            }
        }
    })
  }

  removeCheckedRow() {
    this.setOfCheckedId.clear();

    this.indeterminate = false;
    this.checked = false;
  }

  onChangeFilterDate() {
    let data = this.lstOfData;
    switch(this.filterDate) {
      case '':
        this.filterDate = 'asc';
        data = data.sort((a: FastSaleOrderModelDTO, b: FastSaleOrderModelDTO) => new Date(a.DateInvoice || '').getTime() - new Date(b.DateInvoice|| '').getTime());
      break;

      case 'asc':
        this.filterDate = 'desc';
        data = data.sort((a: FastSaleOrderModelDTO, b: FastSaleOrderModelDTO) => new Date(b.DateInvoice|| '').getTime() - new Date(a.DateInvoice|| '').getTime());

      break;

      case'desc':
        this.filterDate = '';
      break;
    }

    this.lstOfData = [...data];
  }

  mergeOrder() {
    if (this.checkValueMergeOrder() == 0) return;

    this.modal.success({
        title: 'Xác nhận gộp đơn',
        content: 'Bạn có chắc muốn gộp các đơn đã chọn thành 1 đơn duy nhất',
        onOk: () => { this.apiMergeOrders() },
        onCancel:() => {},
        okText: "Xác nhận",
        cancelText: "Hủy bỏ"
    });
  }

  mergeOrderAll() {
    if (this.isLoading || this.isProcessing) return;

    let exist = this.countPartner == 0;
    if(exist) {
      this.notification.error('Không thể gộp đơn', 'Không có đơn nào hợp lệ');
      return;
    }

    let modal = this.modal.create({
      title: 'Danh sách có thể gộp đơn',
      content: ModalMergeOrderComponent,
      onCancel: function(){
        modal.componentInstance?.onCancel();
      },
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
          liveCampaignId: this.liveCampaignId
      }
    });

    modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: boolean) => {
        if(res) {
          this.loadData(this.pageSize, this.pageIndex);
          // this.loadPartnerCanMergeOrders();
          this.countPartnerCanMergeOrders();
        }
      }
    })
  }

  apiMergeOrders() {
    let model = {
      OrderIds: this.idsModel
    }

    this.isLoading = true;
    this.fastSaleOrderService.mergeOrders(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {

          this.pageIndex = 1;
          this.removeCheckedRow();
          this.loadData(this.pageSize, this.pageIndex);
          // this.loadPartnerCanMergeOrders();
          this.countPartnerCanMergeOrders();

          this.setOfCheckedId.add(res.Id);
          this.isLoading = false;
          this.notification.success('Gộp đơn thành công', `Mã hóa đơn là ${res.Number}`,  { duration: 3000 });
      },
      error: (error: any) => {
          this.isLoading = false;
          this.message.error(error?.error?.message);
      }
    })
  }

  checkValueMergeOrder() {
    if (this.isLoading || this.isProcessing) return 0;

    let ids: any[] = [...this.setOfCheckedId];
    this.idsModel = [...ids];
    let idsVal = [] as any[];

    this.idsModel.map((id: any) => {
      let exist = this.lstOfData.filter(a => a.Id == id && (TDSHelperString.hasValueString(a.TrackingRef) || a.State == 'cancel'));

      if(TDSHelperArray.hasListValue(exist)) {
          idsVal = [...idsVal,...exist];
      }
    })

    if(idsVal.length > 0) {
      this.message.error('Vui lòng không chọn đơn đã hủy hoặc đơn đã có mã vận đơn', { duration: 3000 });
      return 0;
    }

    if (this.idsModel.length <= 1) {
      this.message.error('Vui lòng chọn từ 2 đơn trở lên!');
      return 0;
    }

    return 1;
  }

  onOpenTrackingUrl(data: FastSaleOrderModelDTO) {
    if(data && TDSHelperString.hasValueString(data.TrackingUrl)) {
        window.open(data.TrackingUrl, '_blank')
    }
  }

  onClearFilterSearch() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.filterObj.searchText = '';

    this.loadData(this.pageSize, this.pageIndex);
  }
}
