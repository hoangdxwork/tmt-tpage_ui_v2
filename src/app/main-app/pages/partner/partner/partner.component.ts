import { ChatomniMessageFacade } from './../../../services/chatomni-facade/chatomni-message.facade';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize, switchMap } from 'rxjs/operators';
import { ModalBirthdayPartnerComponent } from './../components/modal-birthday-partner/modal-birthday-partner.component';
import { ModalSendMessageComponent } from './../components/modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './../components/modal-convert-partner/modal-convert-partner.component';
import { ModalEditPartnerComponent } from './../components/modal-edit-partner/modal-edit-partner.component';

import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ElementRef, AfterViewInit, HostListener, Inject } from '@angular/core';
import { FilterObjPartnerModel, OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { OperatorEnum, SortEnum, THelperCacheService } from 'src/app/lib';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { ColumnTableDTO } from '../../bill/components/config-column/config-column.component';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { fromEvent, Observable, Subject, takeUntil } from 'rxjs';
import { ODataPartnerDTO, PartnerDTO, } from 'src/app/main-app/dto/partner/partner.dto';
import { ODataTagsPartnerDTO, TagsPartnerDTO } from 'src/app/main-app/dto/partner/partner-tags.dto';
import { PartnerStatusReport, PartnerStatusReportDTO } from 'src/app/main-app/dto/partner/partner-status-report.dto';
import { PartnerBirthdayDTO } from 'src/app/main-app/dto/partner/partner-birthday.dto';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalService } from 'tds-ui/modal';
import { TDSResizeObserver } from 'tds-ui/core/resize-observers';
import { TDSConfigService } from 'tds-ui/core/config';
import { TDSMessageService } from 'tds-ui/message';
import { TDSTableQueryParams } from 'tds-ui/table';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { ChatomniConversationItemDto } from '@app/dto/conversation-all/chatomni/chatomni-conversation';
import { DOCUMENT } from '@angular/common';
import { TDSDestroyService } from 'tds-ui/core/services';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  providers: [TDSDestroyService]
})

export class PartnerComponent implements OnInit, AfterViewInit, OnDestroy {

  lstOfData: Array<PartnerDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  public filterObj: FilterObjPartnerModel = {
    tags: [],
    status: [],
    searchText: '',
  }

  sort: Array<SortDataRequestDTO> = [{
    field: "DateCreated",
    dir: SortEnum.desc
  }];

  tabIndex: any = null;
  partnerStatusReport: Array<PartnerStatusReportDTO> = [];

  isOpenMessageFacebook = false
  indClickTag = -1;

  public modelTags: Array<TagsPartnerDTO> = [];
  public lstDataTag: Array<TagsPartnerDTO> = [];
  public lstBirtdays: Array<PartnerBirthdayDTO> = [];
  public lstStatus: Array<TDSSafeAny> = [];//TODO: dùng để filter

  currentConversation!: ChatomniConversationItemDto;
  psid: any;
  team!: CRMTeamDTO;
  public mappingTeams: any[] = [];
  public currentMappingTeam: any;
  isOpenDrawer: boolean = false;

  selected = 0;
  isLoadingTable = false
  isProcessing: boolean = false;
  idsModel: any = [];

  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: Array<ColumnTableDTO> = [
    { value: 'DisplayName', name: 'Tên', isChecked: true },
    { value: 'Phone', name: 'Điện thoại', isChecked: true },
    { value: 'Email', name: 'Email', isChecked: false },
    { value: 'Street', name: 'Địa chỉ', isChecked: true },
    { value: 'StatusText', name: 'Trạng thái', isChecked: true },
    { value: 'Tag', name: 'Nhãn', isChecked: true },
    { value: 'FacebookId', name: 'Facebook', isChecked: false },
    { value: 'Zalo', name: 'Zalo', isChecked: false },
    { value: 'Credit', name: 'Nợ hiện tại', isChecked: true },
    { value: 'Active', name: 'Hiệu lực', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: true }
  ];

  expandSet = new Set<number>();
  isLoadingCollapse: boolean = false;

  constructor(private modalService: TDSModalService,
    private odataPartnerService: OdataPartnerService,
    private cacheApi: THelperCacheService,
    private commonService: CommonService,
    private message: TDSMessageService,
    private tagService: TagService,
    private modal: TDSModalService,
    private resizeObserver: TDSResizeObserver,
    @Inject(DOCUMENT) private document: Document,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private excelExportService: ExcelExportService,
    private partnerService: PartnerService,
    private viewContainerRef: ViewContainerRef,
    private configService: TDSConfigService,
    private destroy$: TDSDestroyService,
    private chatomniMessageFacade: ChatomniMessageFacade) {
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

  ngOnInit(): void {
    // this.loadData() Đã load đầu tiên khi sử dụng queryParams
    this.loadTags();
    this.loadGridConfig();
    this.loadPartnerStatusReport();
    this.loadBirtdays();
    this.configService.set('message', { pauseOnHover: true });

    this.team = this.crmTeamService.getCurrentTeam() as any;
  }

  loadGridConfig() {
    const key = this.partnerService._keyCacheGrid;
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

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataPartnerService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
      next: (res: ODataPartnerDTO) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
      },
      error: (error: any) => {
        this.message.error(`${error?.error?.message}` || 'Đã xảy ra lỗi');
      }
    });
  }

  private getViewData(params: string): Observable<ODataPartnerDTO> {
    this.isLoading = true;
    return this.odataPartnerService
      .getView(params, this.filterObj).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  loadTags() {
    let type = "partner";
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ODataTagsPartnerDTO) => {
        this.lstDataTag = [...res.value];
      }
    })
  }

  loadPartnerStatusReport() {
    this.commonService.getPartnerStatusReport().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: PartnerStatusReport) => {
        if (res && TDSHelperArray.isArray(res.item)) {
          this.partnerStatusReport = [...res.item];

          res.item?.forEach(x => {
            this.lstStatus.push({
              Name: x.StatusText,
              Total: x.Count,
              IsSelected: false
            });
          });
        }
      },
      error: (error: any) => {
        this.message.error('Tải dữ liệu trạng thái khách hàng thất bại!');
      }
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.tabIndex = 1;

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId.clear();

    this.filterObj = {
      tags: [],
      status: [],
      searchText: ''
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet = new Set<number>();
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  // Add tag
  addTag(id: number) {
    this.indClickTag = id;
  }

  openTag(id: number, data: TDSSafeAny) {
    this.modelTags = [];
    this.indClickTag = id;
    this.modelTags = JSON.parse(data);
  }

  closeTag() {
    this.indClickTag = -1;
  }

  assignTags(id: number, tags: Array<TagsPartnerDTO>) {
    if(tags == null) {
      this.message.error("Vui lòng nhập tên thẻ!");
      return;
    }
    let model = { PartnerId: id, Tags: tags };
    this.partnerService.assignTagPartner(model).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: TDSSafeAny) => {
        if (res && res.PartnerId) {

          let exits = this.lstOfData?.filter(x => x.Id == id)[0] as TDSSafeAny;
          if (exits) {
            exits.Tags = JSON.stringify(tags);
          }

          this.indClickTag = -1;
          this.modelTags = [];

          this.message.success(Message.Tag.UpdateSuccess);
        }
      },
      error: (error: any) => {
        this.indClickTag = -1;
        this.message.error(error?.error?.message || Message.Tag.UpdateFail);
      }
    });
  }

  onSearch(data: TDSSafeAny) {
    this.tabIndex = 1;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.searchText = data.value;
    let filters = this.odataPartnerService.buildFilter(this.filterObj);

    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters, this.sort);

    this.getViewData(params).subscribe({
      next: (res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
      },
      error: (error: any) => {
        this.message.error(error?.error?.message || 'Tải dữ liệu phiếu bán hàng thất bại!');
      }
    });
  }

  isHidden(columnName: string) {
    return this.hiddenColumns.find(x => x.value == columnName)?.isChecked;
  }

  columnsChange(event: Array<ColumnTableDTO>) {
    this.hiddenColumns = event;
    if (event && event.length > 0) {
      const gridConfig = {
        columnConfig: event
      };

      const key = this.partnerService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);
      event.forEach(column => { this.isHidden(column.value) });
    }
  }

  removeCheckedRow() {
    this.setOfCheckedId.clear();
  }

  onLoadOption(event: FilterObjPartnerModel) {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.tags = event.tags;
    this.filterObj.status = event.status;

    this.removeCheckedRow();
    this.loadData(this.pageSize, this.pageIndex);
  }

  exportExcel() {
    if (this.checkValueEmpty() == 1) {
      if (this.isProcessing) { return }
      let state = {
        Filter: {
          logic: "and",
          filters: [
            { field: "Customer", operator: OperatorEnum.eq, value: true },
            { field: "Active", operator: OperatorEnum.eq, value: true },
          ],
        }
      };

      let data = { customer: true, data: JSON.stringify(state), ids: this.idsModel }

      // let that = this;

      this.partnerService.checkPrermissionPartner().pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => {
          this.excelExportService.exportPost('/Partner/ExportFile',data, 'customer_list')
            .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$))
            .subscribe();
        }, error: error => {
          this.message.error(error?.error?.message || 'Đã xảy ra lỗi');
        }
      })

      // this.excelExportService.exportPost('/Partner/ExportFile', { data: data }, 'customer_list')
      //   .pipe(finalize(() => this.isProcessing = false)).pipe(takeUntil(this.destroy$))
      //   .subscribe();
    }
  }

  setActive(type: string) {

    if (this.checkValueEmpty() == 1) {
      switch (type) {
        case "active":
          let active = { Active: true, Ids: this.idsModel };

          this.partnerService.setActive({ model: active }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: TDSSafeAny) => {
              this.message.success('Đã mở hiệu lực thành công!');
              this.loadData(this.pageSize, this.pageIndex);
            },
            error: (error: any) => {
              this.message.error('Mở hiệu lực thất bại!');
            }
          })
          break;

        case "unactive":
          let unactive = { Active: false, Ids: this.idsModel };

          this.partnerService.setActive({ model: unactive }).pipe(takeUntil(this.destroy$)).subscribe({
            next: (res: TDSSafeAny) => {
              this.message.success('Đóng hiệu lực thành công!');
              this.loadData(this.pageSize, this.pageIndex);
            },
            error: (error: any) => {
              this.message.error('Đóng hiệu lực thất bại!');
            }
          })
          break;

        default:
          break;
      }
    }
  }

  checkValueEmpty() {
    let ids: any[] = [...this.setOfCheckedId];
    this.idsModel = ids;

    if (ids.length == 0) {
      this.message.error('Vui lòng chọn tối thiểu một dòng!');
      return 0;
    }
    return 1;
  }

  onDelete(data: any) {
    let that = this;
    if (this.isProcessing) {
      return
    }

    this.modal.error({
      title: 'Xóa khách hàng',
      content: 'Bạn muốn chắc xóa khách hàng này?',
      onOk: () => {
        this.partnerService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe({
          next: (res: TDSSafeAny) => {
            this.message.success('Xóa thành công!')
            this.loadData(this.pageSize, this.pageIndex);
          },
          error: (error: any) => {
            this.message.error(`${error.error.message}`)
            this.loadData(this.pageSize, this.pageIndex);
          }
        })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
      confirmViewType: "compact"
    });

  }

  editPartner(data: any) {
    const modal = this.modalService.create({
      title: 'Sửa khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        partnerId: data.Id
      }
    });

    modal.afterClose.subscribe({
      next: result => {
        if (TDSHelperObject.hasValue(result)) {
          this.loadData(this.pageSize, this.pageIndex);
        }
      }
    });
  }

  createPartner() {
    const modal = this.modalService.create({
      title: 'Thêm mới khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        partnerId: null
      }
    });

    modal.afterClose.subscribe({
      next: result => {
        if (TDSHelperObject.hasValue(result)) {
          this.loadData(this.pageSize, this.pageIndex);
        }
      }
    });
  }

  resetLoyaltyPoint() {
    let that = this;
    if (this.isProcessing) {
      return
    }

    let ids: any = [...this.setOfCheckedId];
    that.isProcessing = true;

    this.modalService.create({
      title: 'Reset điểm tích lũy',
      content: 'Bạn muốn chắc chắn reset điểm khách hàng này?',
      onOk: () => {
        that.partnerService.resetLoyaltyPoint({ ids: ids }).pipe(takeUntil(this.destroy$)).subscribe({
          next: () => {
            that.message.success('Thao tác thành công!');
            that.isProcessing = false;
          },
          error: (error: any) => {
            that.message.error(`${error?.error?.message}`);
            that.isProcessing = false;
          }
        })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
    });
  }

  openTransferPartner() {
    const modal = this.modalService.create({
      title: 'Chuyển đổi khách hàng',
      content: ModalConvertPartnerComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOfData: this.lstOfData
      }
    });
    modal.afterClose.subscribe({
      next: result => {
        if (TDSHelperObject.hasValue(result)) {
          this.loadData(this.pageSize, this.pageIndex);
        }
      }
    });
  }

  //Modal gửi tin nhắn đến khách hàng
  showModalSendMessage() {
    if (this.setOfCheckedId.size == 0) {
      this.message.error(Message.SelectOneLine)
      return
    }
    let ids: any = [...this.setOfCheckedId];
    this.modalService.create({
      title: 'Gửi tin nhắn tới khách hàng',
      content: ModalSendMessageComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        partnerIds: ids
      }
    });
  }

  // Modal sinh nhật của khách hàng
  showModalBirthday() {
    if(!this.lstBirtdays) return;

    this.modalService.create({
      title: 'Sinh nhật khách hàng',
      content: ModalBirthdayPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstData: [...this.lstBirtdays]
      }
    });
  }

  loadBirtdays() {
    let type = "day";
    this.partnerService.getPartnerBirthday(type).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: Array<PartnerBirthdayDTO>) => {
        this.lstBirtdays = [...res];
      }
    })
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(data: any) {
    this.isOpenMessageFacebook = true;
  }

  closeDrawerMessage(ev: boolean) {
    this.isOpenMessageFacebook = false;
  }

  openMiniChat(data: PartnerDTO) {
    let partnerId = data.Id;
    this.isLoading = true;
    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any): any => {

        let pageIds: any = [];
        res?.map((x: any) => {
          pageIds.push(x.page_id);
        });

        if (pageIds.length == 0) {
          this.isLoading = false;
          return this.message.error('Không có kênh kết nối với khách hàng này.');
        }

        this.crmTeamService.getActiveByPageIds$(pageIds).pipe(takeUntil(this.destroy$)).subscribe({
          next: (teams: any): any => {
            if (teams?.length == 0) {
              this.isLoading = false;
              return this.message.error('Không có kênh kết nối với khách hàng này.');
            }

            this.mappingTeams = [];
            let pageDic = {} as any;

            teams?.map((x: any) => {
              let exist = res.filter((r: any) => r.page_id == x.ChannelId)[0];

              if (exist && !pageDic[exist.page_id]) {
                pageDic[exist.page_id] = true; // Cờ này để không thêm trùng page vào
                this.mappingTeams.push({
                  psid: exist.psid,
                  team: x
                });
              }
            });

            if (this.mappingTeams.length > 0) {
              this.currentMappingTeam = this.mappingTeams[0];
              this.loadMDBByPSId(this.currentMappingTeam.team?.Id, this.currentMappingTeam.psid);
            } else {
              this.isLoading = false;
            }
          }
        });
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thao tác không thành công');
      }
    })
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: MDBByPSIdDTO) => {
        if (res) {
          let model = this.chatomniMessageFacade.mappingCurrentConversation(res)
          this.currentConversation = { ...model };

          this.psid = res.psid;
          this.isOpenDrawer = true;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.message.error(error?.error?.message || 'Đã xảy ra lỗi')
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

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
