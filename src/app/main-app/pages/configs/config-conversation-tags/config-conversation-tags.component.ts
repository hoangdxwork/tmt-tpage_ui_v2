import { switchMap } from 'rxjs/operators';
import { SortEnum } from './../../../../lib/enum/sort.enum';
import { SortDataRequestDTO, FilterDataRequestDTO } from 'src/app/lib/dto/dataRequest.dto';
import { CreateTagModalComponent } from '../components/create-tag-modal/create-tag-modal.component';
import { CRMTagService } from './../../../services/crm-tag.service';
import { CRMTagDTO, ODataCRMTagDTO } from './../../../dto/crm-tag/odata-crmtag.dto';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, finalize, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { THelperDataRequest } from './../../../../lib/services/helper-data.service';
import { OdataCRMTagService } from './../../../services/mock-odata/odata-crmtag.service';
import { Component, OnInit, ViewContainerRef, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TDSModalService } from 'tds-ui/modal';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSTableQueryParams } from 'tds-ui/table';
import { TDSMessageService } from 'tds-ui/message';

@Component({
    selector: 'app-config-conversation-tags',
    templateUrl: './config-conversation-tags.component.html'
})
export class ConfigConversationTagsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('filterText') filterText!: ElementRef;
    lstOfData: Array<CRMTagDTO> = [];
    private destroy$ = new Subject<void>();

    pageSize = 20;
    pageIndex = 1;
    isLoading = false;
    count: number = 1;
    public filterObj: any = {
        searchText: ''
    }

    constructor(
        private modalService: TDSModalService,
        private viewContainerRef: ViewContainerRef,
        // private configService: TDSConfigService,
        private message: TDSMessageService,
        private odataTagService: OdataCRMTagService,
        private tagService: CRMTagService) { }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnInit(): void {
        // this.configService.set('message',{maxStack:1});
    }

    ngAfterViewInit(): void {
        fromEvent(this.filterText.nativeElement, 'keyup').pipe(
            map((event: any) => { return event.target.value }),
            debounceTime(750),
            // distinctUntilChanged(),
            // TODO: switchMap xử lý trường hợp sub in sub
            switchMap((text: TDSSafeAny) => {
                this.pageIndex = 1;
                this.filterObj.searchText = text;

                let filters;
                if (TDSHelperString.hasValueString(this.filterObj.searchText)) {
                    filters = this.odataTagService.buildFilter(this.filterObj);
                }

                let params = THelperDataRequest.convertDataRequestToString(this.pageSize, this.pageIndex, filters);
                return this.getViewData(params);
            })
        ).subscribe((res: ODataCRMTagDTO) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = res.value;
        });
    }

    loadData(pageSize: number, pageIndex: number, filters?: FilterDataRequestDTO, sort?: SortDataRequestDTO[]) {
        if (TDSHelperString.hasValueString(this.filterObj.searchText)) {
            filters = this.odataTagService.buildFilter(this.filterObj);
        }

        let params = THelperDataRequest.convertDataRequestToString(pageSize, pageIndex, filters, sort);

        this.getViewData(params).subscribe((res: ODataCRMTagDTO) => {
            this.count = res['@odata.count'] as number;
            this.lstOfData = res.value;
        }, err => {
            this.message.error('Tải dữ liệu thất bại!');
        });
    }

    onQueryParamsChange(params: TDSTableQueryParams) {
        this.loadData(params.pageSize, params.pageIndex);
    }

    private getViewData(params: string): Observable<ODataCRMTagDTO> {
        this.isLoading = true;
        return this.odataTagService
            .getView(params, this.filterObj).pipe(takeUntil(this.destroy$))
            .pipe(finalize(() => { this.isLoading = false }));
    }

    refreshData() {
        this.pageIndex = 1;
        this.filterObj.searchText = '';
        this.filterText.nativeElement.value = '';
        this.loadData(this.pageSize, this.pageIndex);
    }

    showEditModal(data: CRMTagDTO): void {
        const modal = this.modalService.create({
            title: 'Chỉnh sửa thẻ hội thoại',
            content: CreateTagModalComponent,
            viewContainerRef: this.viewContainerRef,
            componentParams: {
                Id: data.Id
            }
        });

        modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
            this.loadData(this.pageSize, this.pageIndex);
        });
    }

    showRemoveModal(data: CRMTagDTO): void {
        const modal = this.modalService.error({
            title: 'Xác nhận xóa thẻ',
            content: 'Bạn có chắc muốn xóa thẻ này không?',
            iconType: 'tdsi-trash-fill',
            onOk: () => {
                this.tagService.delete(data.Id).pipe(takeUntil(this.destroy$)).subscribe(
                    (res) => {
                        this.message.success('Xóa thành công');
                        if (this.lstOfData.length <= 1) {
                            this.pageIndex = 1;
                            this.filterObj.searchText = '';
                            this.filterText.nativeElement.value = '';
                            this.loadData(this.pageSize, this.pageIndex);
                        }
                        this.loadData(this.pageSize, this.pageIndex);
                    },
                    err => {
                        this.message.error(err.error.errors.key[0]);
                    }
                );
            },
            onCancel: () => {
                modal.close();
            },
            okText: "Xác nhận",
            cancelText: "Hủy bỏ"
        });
    }

    updateStatus(data: CRMTagDTO) {
        this.changeStatus(data).pipe(takeUntil(this.destroy$)).subscribe(
            (res) => {
                let index = this.lstOfData.findIndex(x => x.Id === data.Id) as number;
                if (Number(index) > -1) {
                    this.lstOfData[index].IsDeleted = !data.IsDeleted;
                }
                this.message.success('Cập nhật trạng thái thành công');
            },
            (err) => {
                this.message.error(err.error.message ?? 'Cập nhật thất bại');
            }
        );
    }

    changeStatus(data: CRMTagDTO) {
        this.isLoading = true;
        return this.tagService.updateStatus(data.Id).pipe(takeUntil(this.destroy$))
            .pipe(finalize(
                () => {
                    this.isLoading = false;
                }
            ));
    }

    showCreateModal() {
        const modal = this.modalService.create({
            title: 'Thêm mới thẻ hội thoại',
            content: CreateTagModalComponent,
            viewContainerRef: this.viewContainerRef,
        });

        modal.afterClose.pipe(takeUntil(this.destroy$)).subscribe(result => {
            if (TDSHelperObject.hasValue(result)) {
                let sortByDate: SortDataRequestDTO = {
                    field: 'DateCreated',
                    dir: SortEnum.desc
                }
                this.pageIndex = 1;
                this.filterText.nativeElement.value = '';
                this.filterObj.searchText = '';
                this.loadData(this.pageSize, this.pageIndex, undefined, [sortByDate]);
            }
        });
    }

    onClearAll(event: MouseEvent) {
        event.stopPropagation();
        this.refreshData();
    }
}
