import { SortEnum } from './../../../../lib/enum/sort.enum';
import { SortDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { ConfigConversationTagsCreateDataModalComponent } from './../components/config-conversation-tags-create-data-modal/config-conversation-tags-create-data-modal.component';
import { CRMTagService } from './../../../services/crm-tag.service';
import { CRMTagDTO, ODataCRMTagDTO } from './../../../dto/crm-tag/odata-crmtag.dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { OdataCRMTagService } from './../../../services/mock-odata/odata-crmtag.service';
import { FormControl } from '@angular/forms';
import { ConfigConversationTagsEditDataModalComponent } from '../components/config-conversation-tags-edit-data-modal/config-conversation-tags-edit-data-modal.component';
import { TDSSafeAny, TDSModalService, TDSHelperObject, TDSTableQueryParams, TDSMessageService, TDSHelperString } from 'tmt-tang-ui';
import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { CTMTagFilterObjDTO } from 'src/app/main-app/dto/odata/odata.dto';

@Component({
  selector: 'app-config-conversation-tags',
  templateUrl: './config-conversation-tags.component.html',
  styleUrls: ['./config-conversation-tags.component.scss']
})
export class ConfigConversationTagsComponent implements OnInit, OnDestroy {

  lstOfData:Array<CRMTagDTO> = [];
  private destroy$ = new Subject<void>();

  pageSize = 20;
  pageIndex = 1;
  isLoading = false;
  count: number = 1;
  public filterObj: CTMTagFilterObjDTO = {
    searchText: ''
  }

  constructor(
    private modalService: TDSModalService, 
    private viewContainerRef: ViewContainerRef,
    private message: TDSMessageService,
    private odataTagService:OdataCRMTagService,
    private tagService:CRMTagService,
    ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
  }

  loadData(pageSize: number, pageIndex: number, filters?:TDSSafeAny,sort?:TDSSafeAny[]){
    this.isLoading = true;
    
    if(TDSHelperString.hasValueString(this.filterObj.searchText)){
      filters = this.odataTagService.buildFilter(this.filterObj);
    }
    
    let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex,filters,sort);
    this.odataTagService.getView(params).pipe(takeUntil(this.destroy$)).subscribe((res: ODataCRMTagDTO) => {
      this.count = res['@odata.count'] as number;
      this.lstOfData = res.value;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      this.message.error('Tải dữ liệu thất bại!');
    });
  }

  onQueryParamsChange(params: TDSTableQueryParams){
    this.loadData(params.pageSize, params.pageIndex);
  }

  refreshData() {
    this.pageIndex = 1;

    this.filterObj = {
      searchText: '',
    }

    this.loadData(this.pageSize, this.pageIndex);
  }

  showEditModal(data:CRMTagDTO): void {
    const modal = this.modalService.create({
        title: 'Chỉnh sửa thẻ hội thoại',
        content: ConfigConversationTagsEditDataModalComponent,
        viewContainerRef: this.viewContainerRef,
        componentParams: {
            //send data to edit modal
            data: data
        }
    });

    //receive result from edit modal after close modal
    modal.afterClose.subscribe(result => {
        this.loadData(this.pageSize,this.pageIndex);
    });
  }

  showRemoveModal(data:CRMTagDTO): void {
    const modal = this.modalService.error({
        title: 'Xác nhận xóa thẻ',
        content: 'Bạn có chắc muốn xóa thẻ này không?',
        iconType:'tdsi-trash-fill',
        onOk: () => {
          this.tagService.delete(data.Id).subscribe(
            (data)=>{
              this.message.success('Xóa thành công');
              this.loadData(this.pageSize,this.pageIndex);
            },
            err=>{
              this.message.error(err.error.message);
            }
          );
        },
        onCancel:()=>{
          modal.close();
        },
        okText:"Xác nhận",
        cancelText:"Hủy bỏ"
    });
  }

  updateStatus(data:CRMTagDTO){
    this.tagService.updateStatus(data.Id).subscribe(
      (data)=>{
        this.loadData(this.pageSize,this.pageIndex);
      },
      (err)=>{
        this.message.error(err.error.message);
      }
    );
  }

  doFilter(event:TDSSafeAny){
    this.filterObj = {
      searchText: event.target.value
    }
    this.loadData(this.pageSize,this.pageIndex);
  }

  showCreateModal(){
    const modal = this.modalService.create({
      title: 'Thêm mới thẻ hội thoại',
      content: ConfigConversationTagsCreateDataModalComponent,
      viewContainerRef: this.viewContainerRef,
    });

    //receive result from edit modal after close modal
    modal.afterClose.subscribe(result => {
      if(TDSHelperObject.hasValue(result)){
        this.pageSize = 20;
        this.pageIndex = 1;
        
        let sortByDate:SortDataRequestDTO = {
          field:'DateCreated',
          dir: SortEnum.desc
        }
        this.loadData(this.pageSize,this.pageIndex,undefined,[sortByDate]);
      }
    });
  }
}
