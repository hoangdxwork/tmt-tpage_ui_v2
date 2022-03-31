import { ModalBirthdayPartnerComponent } from './../components/modal-birthday-partner/modal-birthday-partner.component';
import { ModalSendMessageComponent } from './../components/modal-send-message/modal-send-message.component';
import { ModalConvertPartnerComponent } from './../components/modal-convert-partner/modal-convert-partner.component';
import { ModalEditPartnerComponent } from './../components/modal-edit-partner/modal-edit-partner.component';
import { ModalAddPartnerComponent } from './../components/modal-add-partner/modal-add-partner.component';

import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { TDSModalService, TDSSafeAny, TDSHelperObject, TDSHelperArray, TDSMessageService, TDSTableQueryParams, TDSHelperString } from 'tmt-tang-ui';
import { OdataPartnerService } from 'src/app/main-app/services/mock-odata/odata-partner.service';
import { OperatorEnum, SortEnum, THelperCacheService } from 'src/app/lib';
import { THelperDataRequest } from 'src/app/lib/services/helper-data.service';
import { CommonService } from 'src/app/main-app/services/common.service';
import { PartnerService } from 'src/app/main-app/services/partner.service';
import { TagService } from 'src/app/main-app/services/tag.service';
import { ColumnTableDTO } from '../../bill/components/config-column/config-column.component';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

export interface partnerDto {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  birthday: string;
  facebook: string;
  zalo:string;
  tag: string[];
  debt: number;
  status: number;
  effect: boolean;
}

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})

export class PartnerComponent implements OnInit, OnDestroy {

  lstOfData: Array<TDSSafeAny> = [];
  pageSize = 20;
  pageIndex = 1;
  isLoading: boolean = false;
  count: number = 1;

  public filterObj: TDSSafeAny = {
    tags: [],
    searchText: '',
    statusText: null
  }

  tabIndex = null;
  partnerStatusReport: any[] = [];

  isOpenMessageFacebook = false
  indClickTag = -1;

  public modelTags: Array<TDSSafeAny> = [];
  public lstDataTag: Array<TDSSafeAny> = [];

  selected = 0;
  isLoadingTable = false
  isProcessing: boolean = false;
  idsModel: any = [];

  checked = false;
  indeterminate = false;
  listOfData: readonly partnerDto[] = [];
  setOfCheckedId = new Set<number>();

  public hiddenColumns = new Array<ColumnTableDTO>();
  public columns: any[] = [
    {value: 'DisplayName', name: 'Tên', isChecked: true},
    {value: 'Phone', name: 'Điện thoại', isChecked: true},
    {value: 'Email', name: 'Email', isChecked: false},
    {value: 'Street', name: 'Địa chỉ', isChecked: true},
    {value: 'StatusText', name: 'Trạng thái', isChecked: true},
    {value: 'Credit', name: 'Nợ hiện tại', isChecked: true},
    {value: 'FacebookId', name: 'Facebook', isChecked: false},
    {value: 'Zalo', name: 'Zalo', isChecked: false},
    {value: 'Active', name: 'Hiệu lực', isChecked: true},
    {value: 'DateCreated', name: 'Ngày tạo', isChecked: true}
  ];

  expandSet = new Set<number>();
  private _destroy = new Subject<void>();

  constructor(private modalService: TDSModalService,
      private odataPartnerService: OdataPartnerService,
      private cacheApi: THelperCacheService,
      private commonService: CommonService,
      private message: TDSMessageService,
      private tagService: TagService,
      private modal: TDSModalService,
      private excelExportService: ExcelExportService,
      private partnerService: PartnerService,
      private viewContainerRef: ViewContainerRef) {
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
    this.loadData();
    this.loadTags();
    this.loadGridConfig();
    this.loadPartnerStatusReport();
  }

  loadGridConfig() {
    const key = this.partnerService._keyCacheGrid;
    this.cacheApi.getItem(key).subscribe((res: TDSSafeAny) => {
      if(res && res.value) {
        var jsColumns = JSON.parse(res.value) as any;
        this.hiddenColumns = jsColumns.value.columnConfig;
      } else {
        this.hiddenColumns = this.columns;
      }
    })
  }

  loadData() {
    this.isLoading = true;
    let filters = this.odataPartnerService.buildFilter(this.filterObj);
    let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
    this.odataPartnerService.getView(params, this.filterObj).subscribe((res: TDSSafeAny) => {

      this.count = res['@odata.count'];
      this.lstOfData = res.value;
      this.isLoading = false;

    }, error => {
        this.isLoading = false;
        this.message.error('Tải dữ liệu khách hàng thất bại!');
    });
  }

  onSelectChange(value: TDSSafeAny) {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.tabIndex = value;

    this.filterObj = {
        tags: [],
        searchText: '',
        statusText: value
    };

    this.loadData();
  }

  loadTags() {
    let type = "partner";
    this.tagService.getByType(type).subscribe((res: TDSSafeAny) => {
        this.lstDataTag = res.value;
    })
  }

  loadPartnerStatusReport() {
    this.commonService.getPartnerStatusReport().subscribe((res: any) => {
      if(res && TDSHelperArray.isArray(res.item)) {
          this.partnerStatusReport = res.item;
      }
    }, error => {
      this.message.error('Tải dữ liệu trạng thái khách hàng thất bại!');
    })
  }

  refreshData() {
    this.pageIndex = 1;
    this.indClickTag = -1;
    this.tabIndex = null;

    this.checked = false;
    this.indeterminate = false;
    this.setOfCheckedId = new Set<number>();

    this.filterObj = {
        tags: [],
        searchText: '',
        statusText: null
    }

    this.loadData();
  }

  onQueryParamsChange(params: TDSTableQueryParams) {
    this.loadData();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  checkStatusText(text: string) {
    var exits = this.partnerStatusReport.filter(x => x.StatusText.toLowerCase() == text.toLowerCase())[0] as any;
    if(exits) {
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

  assignTags(id: number, tags: TDSSafeAny) {
    let model = { PartnerId: id, Tags: tags };
    this.partnerService.assignTagPartner(model).subscribe((res: TDSSafeAny) => {
        if(res && res.PartnerId) {
          var exits = this.lstOfData.filter(x => x.Id == id)[0] as TDSSafeAny;
          if(exits) {
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

  applyFilter(event: TDSSafeAny) {
    this.tabIndex = null;
    this.pageIndex = 1;
    this.indClickTag = -1;

    this.filterObj.searchText = event.target.value;
    this.loadData();
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

      const key = this.partnerService._keyCacheGrid;
      this.cacheApi.setItem(key, gridConfig);

      event.forEach(column => { this.isHidden(column.value) });
    }
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

    let data = { customer: true, data : JSON.stringify(state) }

    let that = this;
    let callBackFn = () => {
      that.isProcessing = false;
    }

    this.excelExportService.exportPost('/Partner/ExportFile',{data: JSON.stringify(data)}, 'danh-sach-kh', callBackFn);
  }

  setActive(type: string) {
    if (this.checkValueEmpty() == 1) {
      switch(type) {
        case "active":
          let model1 = {  Active: true, Ids: this.idsModel }
          this.partnerService.setActive({model: model1}).subscribe((res: TDSSafeAny) => {
              this.message.success('Đã mở hiệu lực thành công!');
              setTimeout(() => {
                this.loadData();
              }, 350)
          }, error => {
            this.message.error('Mở hiệu lực thất bại!');
          })
          break;

        case "unactive":
          let model2 = {  Active: false, Ids: this.idsModel }
          this.partnerService.setActive({model: model2}).subscribe((res: TDSSafeAny) => {
              this.message.success('Đóng hiệu lực thành công!');
              setTimeout(() => {
                this.loadData();
              }, 350)
          }, error => {
            this.message.error('Đóng hiệu lực thất bại!');
          })
          break;

        default: break;
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

  // modal add Partner
  showModalAddPartner(){
    const modal = this.modalService.create({
      title: 'Thêm Khách hàng',
      content: ModalAddPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  // modal edit partner
  showModalEditPartner(id: number){
    const modal = this.modalService.create({
      title: 'Sửa Khách hàng',
      content: ModalEditPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      centered: true,
      componentParams: {
        data: this.listOfData.find(x=>x.id == id)
    }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  resetLoyaltyPoint(){
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
        that.partnerService.resetLoyaltyPoint({ ids: ids }).pipe(takeUntil(this._destroy)).subscribe((res: TDSSafeAny) => {
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

  openTransferPartner(){
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
  showModalSendMessage(){
    const modal = this.modalService.create({
      title: 'Gửi tin nhắn tới khách hàng',
      content: ModalSendMessageComponent,
      size: "lg",
      viewContainerRef: this.viewContainerRef,
      componentParams: {

    }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  // Modal sinh nhật của khách hàng
  showModalBirthday(){
    const modal = this.modalService.create({
      title: 'Sinh nhật khách hàng',
      content: ModalBirthdayPartnerComponent,
      size: "xl",
      viewContainerRef: this.viewContainerRef,
      componentParams: {

    }
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe(result => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {

      }
    });
  }

  // Drawer tin nhắn facebook
  openDrawerMessage(linkFacebook: string){
    this.isOpenMessageFacebook = true;
  }

  closeDrawerMessage(ev: boolean){
    this.isOpenMessageFacebook = false;
  }

  ngOnDestroy(): void {
    this._destroy.next();
    this._destroy.complete();
  }
}
