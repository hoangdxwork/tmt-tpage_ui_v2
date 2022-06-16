import { finalize, switchMap } from 'rxjs/operators';
import { da } from 'date-fns/locale';
import { ModalBirthdayPartnerComponent } from './../components/modal-birthday-partner/modal-birthday-partner.component';
import { ModalSendMessageComponent } from './../components/modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './../components/modal-convert-partner/modal-convert-partner.component';
import { ModalEditPartnerComponent } from './../components/modal-edit-partner/modal-edit-partner.component';

import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { OperatorEnum, SortEnum, THelperCacheService } from 'src/app/lib';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { ColumnTableDTO } from '../../bill/components/config-column/config-column.component';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject } from 'rxjs';
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
import { ConversationMatchingItem } from 'src/app/main-app/dto/conversation-all/conversation-all.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { MDBByPSIdDTO } from 'src/app/main-app/dto/crm-matching/mdb-by-psid.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html'
})

export class PartnerComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('innerText') innerText!: ElementRef;

  lstOfData: Array<PartnerDTO> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  public filterObj: TDSSafeAny = {
    searchText: '',
    statusText: null
  }

  tabIndex: any = null;
  partnerStatusReport: Array<PartnerStatusReportDTO> = [];

  isOpenMessageFacebook = false
  indClickTag = -1;

  public modelTags: Array<TagsPartnerDTO> = [];
  public lstDataTag: Array<TagsPartnerDTO> = [];
  public lstBirtdays: Array<PartnerBirthdayDTO> = [];

  currentConversation!: ConversationMatchingItem;
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
    { value: 'Credit', name: 'Nợ hiện tại', isChecked: true },
    { value: 'FacebookId', name: 'Facebook', isChecked: false },
    { value: 'Zalo', name: 'Zalo', isChecked: false },
    { value: 'Active', name: 'Hiệu lực', isChecked: true },
    { value: 'DateCreated', name: 'Ngày tạo', isChecked: true }
  ];

  expandSet = new Set<number>();
  private destroy$ = new Subject<void>();
  private _destroy = new Subject<void>();
  widthTable: number = 0;
  paddingCollapse: number = 36;
  marginLeftCollapse: number = 0;
  isLoadingCollapse: boolean = false
  @ViewChild('viewChildWidthTable') viewChildWidthTable!: ElementRef;
  @ViewChild('viewChildDetailPartner') viewChildDetailPartner!: ElementRef;

  constructor(private modalService: TDSModalService,
    private odataPartnerService: OdataPartnerService,
    private cacheApi: THelperCacheService,
    private commonService: CommonService,
    private message: TDSMessageService,
    private tagService: TagService,
    private modal: TDSModalService,
    private crmTeamService: CRMTeamService,
    private crmMatchingService: CRMMatchingService,
    private excelExportService: ExcelExportService,
    private partnerService: PartnerService,
    private viewContainerRef: ViewContainerRef,
    private resizeObserver: TDSResizeObserver,
    private configService: TDSConfigService) {
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
    // this.loadData() >Đã load đầu tiên khi sử dụng queryParams
    this.loadTags();
    this.loadGridConfig();
    this.loadPartnerStatusReport();
    this.loadBirtdays();
    this.configService.set('message',{pauseOnHover: true});

    this.team = this.crmTeamService.getCurrentTeam() as any;
  }

  loadGridConfig() {
    const key = this.partnerService._keyCacheGrid;
    this.cacheApi.getItem(key).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if (res && res.value) {
        let jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    })
  }

  loadData(pageSize: number, pageIndex: number) {
    let filters = this.odataPartnerService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters);

    this.getViewData(params).subscribe((res: ODataPartnerDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = [...res.value];
    }, error => {
      this.message.error('Tải dữ liệu khách hàng thất bại!');
    });
  }

  private getViewData(params: string): Observable<ODataPartnerDTO> {
    this.isLoading = true;
    return this.odataPartnerService
      .getView(params).pipe(takeUntil(this.destroy$))
      .pipe(finalize(() => { this.isLoading = false }));
  }

  loadTags() {
    let type = "partner";
    this.tagService.getByType(type).pipe(takeUntil(this.destroy$)).subscribe((res: ODataTagsPartnerDTO) => {
      this.lstDataTag = [...res.value];
    })
  }

  loadPartnerStatusReport() {
    this.commonService.getPartnerStatusReport().pipe(takeUntil(this.destroy$)).subscribe((res: PartnerStatusReport) => {
      if (res && TDSHelperArray.isArray(res.item)) {
        this.partnerStatusReport = [...res.item];
      }
    }, error => {
      this.message.error('Tải dữ liệu trạng thái khách hàng thất bại!');
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.tabIndex = null;
    this.innerText.nativeElement.value = '';

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
      searchText: '',
      statusText: null
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.pageSize = params.pageSize;
    this.loadData(params.pageSize, params.pageIndex);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  checkStatusText(text: string) {
    let exits = this.partnerStatusReport.filter(x => x.StatusText.toLowerCase() == text.toLowerCase())[0] as any;
    if (exits) {
      return exits.StatusStyle;
    }
  }

  checkNameNetwork(type: string) {
    switch (type) {
      case "Viettel":
        return "error"
      case "Mobifone":
        return "success"
      case "Vinaphone":
        return "info"
      default:
        return "info"
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
    let model = { PartnerId: id, Tags: tags };
    this.partnerService.assignTagPartner(model).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
      if (res && res.PartnerId) {
        let exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
        if (exits) {
          exits.Tags = JSON.stringify(tags)
        }

        this.indClickTag = -1;
        this.modelTags = [];

        this.message.success('Gán nhãn thành công!');
      }
    }, error => {
      this.indClickTag = -1;
      this.message.error('Gán nhãn thất bại!');
    });
  }
  ngAfterViewInit(): void {
    this.widthTable = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse

    this.resizeObserver
      .observe(this.viewChildWidthTable)
      .subscribe(() => {
        this.widthTable = this.viewChildWidthTable?.nativeElement?.offsetWidth - this.paddingCollapse;
        this.viewChildWidthTable?.nativeElement.click()
      });
    setTimeout(() => {
      let that = this;
      let wrapScroll = this.viewChildDetailPartner?.nativeElement?.closest('.tds-table-body');
      wrapScroll?.addEventListener('scroll', function () {
        let scrollleft = wrapScroll.scrollLeft;
        that.marginLeftCollapse = scrollleft;
      });
    }, 500);

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => { return event.target.value }),
      debounceTime(750),
      distinctUntilChanged(),
      // TODO: switchMap xử lý trường hợp sub in sub
      switchMap((text: TDSSafeAny) => {
        this.tabIndex = null;
        this.pageIndex = 1;
        this.indClickTag = -1;

        this.filterObj.searchText = text;
        let filters = this.odataPartnerService.buildFilter(this.filterObj);

        let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
        return this.getViewData(params);
      }))
      .subscribe((res: any) => {
        this.count = res['@odata.count'] as number;
        this.lstOfData = [...res.value];
      }, error => {
        this.message.error('Tải dữ liệu phiếu bán hàng thất bại!');
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

  onLoadOption(event: any) {
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj = {
      statusText: event.statusText,
      searchText: event.searchText,
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  exportExcel() {
    if (this.isProcessing) { return }
    let state = {
      skip: 0,
      take: 20,
      filter: {
        filters: [
          { field: "Customer", operator: OperatorEnum.eq, value: true },
          { field: "Active", operator: OperatorEnum.eq, value: true },
        ],
        logic: "and",
      }
    };

    let data = { customer: true, data: JSON.stringify(state) }

    let that = this;
    let callBackFn = () => {
      that.isProcessing = false;
    }

    this.excelExportService.exportPost('/Partner/ExportFile', { data: JSON.stringify(data) }, 'danh-sach-kh')
      .pipe(finalize(() => this.isProcessing = false), takeUntil(this._destroy))
      .subscribe();
  }

  setActive(type: string) {
    if (this.checkValueEmpty() == 1) {
      switch (type) {
        case "active":
          let active = { Active: true, Ids: this.idsModel };

          this.partnerService.setActive({ model: active }).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
            this.message.success('Đã mở hiệu lực thành công!');
            this.loadData(this.pageSize, this.pageIndex);
          }, error => {
            this.message.error('Mở hiệu lực thất bại!');
          })
          break;

        case "unactive":
          let unactive = { Active: false, Ids: this.idsModel };

          this.partnerService.setActive({ model: unactive }).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
            this.message.success('Đóng hiệu lực thành công!');
            this.loadData(this.pageSize, this.pageIndex);
          }, error => {
            this.message.error('Đóng hiệu lực thất bại!');
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
        this.partnerService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe((res: TDSSafeAny) => {
          this.message.success('Xóa thành công!')
        }, error => {
          this.message.error(`${error.error.message}`)
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
      title: 'Sửa Khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        partnerId: data.Id
      }
    });
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData(this.pageSize, this.pageIndex);
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
    modal.afterClose.subscribe(result => {
      if (TDSHelperObject.hasValue(result)) {
        this.loadData(this.pageSize, this.pageIndex);
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

    this.modal.success({
      title: 'Reset điểm tích lũy',
      content: 'Bạn muốn chắc chắn reset điểm khách hàng này?',
      onOk: () => {
        that.partnerService.resetLoyaltyPoint({ ids: ids }).pipe(takeUntil(this.destroy$)).subscribe(() => {
          that.message.success('Thao tác thành công!');
          that.isProcessing = false;
        }, error => {
          that.message.error(`${error?.error?.message}`);
          that.isProcessing = false;
        })
      },
      onCancel: () => { that.isProcessing = false; },
      okText: "Xác nhận",
      cancelText: "Đóng",
      // confirmViewType:"compact"
    });
  }

  openTransferPartner() {
    this.modalService.create({
      title: 'Chuyển đổi khách hàng',
      content: ModalConvertPartnerComponent,
      size: "md",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        lstOfData: this.lstOfData
      }
    });
  }

  //Modal gửi tin nhắn đến khách hàng
  showModalSendMessage() {
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
    this.modalService.create({
      title: 'Sinh nhật khách hàng',
      content: ModalBirthdayPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {
        data: this.lstBirtdays
      }
    });
  }

  loadBirtdays() {
    let type = "day";
    this.partnerService.getPartnerBirthday(type).pipe(takeUntil(this.destroy$)).subscribe((res: Array<PartnerBirthdayDTO>) => {
      this.lstBirtdays = res;
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
    this.partnerService.getAllByMDBPartnerId(partnerId).pipe(takeUntil(this.destroy$)).subscribe((res: any): any => {

      let pageIds: any = [];
      res.map((x: any) => {
          pageIds.push(x.page_id);
      });

      if(pageIds.length == 0) {
        return this.message.error('Không có kênh kết nối với khách hàng này.');
      }

      this.crmTeamService.getActiveByPageIds$(pageIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe((teams: any): any => {

          if (teams.length == 0) {
            return this.message.error('Không có kênh kết nối với khách hàng này.');
          }

          this.mappingTeams.length = 0;
          var pageDic = {} as any;

          teams.map((x: any) => {
            var exist = res.filter((r: any) => r.page_id == x.Facebook_PageId)[0];
            if (exist && !pageDic[exist.Facebook_PageId]) {
              pageDic[exist.Facebook_PageId] = true; // Cờ này để không thêm trùng page vào
              this.mappingTeams.push({
                psid: exist.psid,
                team: x
              });
            }
          });

          if (this.mappingTeams.length > 0) {
            this.currentMappingTeam = this.mappingTeams[0];
            this.loadMDBByPSId(this.currentMappingTeam.team.Facebook_PageId, this.currentMappingTeam.psid);
          }
      });
    }, error => {
      this.message.error('Đã xả ra lỗi!');
    })
  }

  loadMDBByPSId(pageId: string, psid: string) {
    // Xoá hội thoại hiện tại
    (this.currentConversation as any) = null;

    // get data currentConversation
    this.crmMatchingService.getMDBByPSId(pageId, psid)
      .subscribe((res: MDBByPSIdDTO) => {
        if (res) {
          //tags
          res["keyTags"] = {};

          if(res.tags && res.tags.length > 0) {
            res.tags.map((x: any) => {
              res["keyTags"][x.id] = true;
            });
          }
          else {
            res.tags = [];
          }

          this.currentConversation = { ...res, ...this.currentConversation};
          this.psid = res.psid;
          this.isOpenDrawer = true;
        }
      });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
