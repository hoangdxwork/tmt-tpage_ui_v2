import { ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSModalRef, TDSSafeAny, TDSMessageService, TDSTableComponent } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ProductDataFacade } from 'src/app/main-app/services/facades/product.data.facade';

@Component({
  selector: 'app-modal-list-product',
  templateUrl: './modal-list-product.component.html',
  styleUrls: ['./modal-list-product.component.scss']
})
export class ModalListProductComponent implements OnInit, OnDestroy {

  @Input() useListPrice: boolean = false;
  @Input() isSelectProduct: boolean = false;

  @Output() selectProduct = new EventEmitter<ProductTemplateV2DTO>();

  @ViewChild('basicTable', { static: false }) tableComponent?: TDSTableComponent<DataPouchDBDTO>;
  @ViewChild('innerText') innerText!: ElementRef;

  private destroy$ = new Subject();
  isLoading: boolean = false;

  keyFilter: string = '';

  lstOfData: any[] = [];
  lstPriceLists: any;

  indexDbVersion: number = 0;
  indexDbProductCount: number = -1;
  indexDbStorage!: DataPouchDBDTO[];
  productTmplItems!: ProductTemplateV2DTO;

  trackByIndex(_: number, data: any): number {
    return data.index;
  }

  constructor(private modal: TDSModalRef,
    private message: TDSMessageService,
    private commonService: CommonService,
    private productDataFacade: ProductDataFacade
  ) { }

  ngOnInit(): void {
    this.loadPriceLists();
  }

  loadPriceLists() {
    this.commonService.dataPriceLists$.pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res && res.currentId) {
        this.lstPriceLists = res[res.currentId];
      }
      this.loadData();
    }, error => {
      this.loadData();
    });
  }

  loadData(innerText: string = ''): void {
    this.productDataFacade.getProduct(innerText, this.lstPriceLists).subscribe(res => {
      this.lstOfData.length = 0;
      this.lstOfData = res || [];
    });
  }

  onSelectProduct(product: ProductTemplateV2DTO) {
    this.selectProduct.emit(product);
  }

  cancel(){
    this.modal.destroy(null);
  }

  ngAfterViewInit(): void {
    this.tableComponent?.cdkVirtualScrollViewport?.scrolledIndexChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {});

    fromEvent(this.innerText.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value
      })
      , debounceTime(750), distinctUntilChanged()).subscribe((text: string) => {
        this.keyFilter = text;
        this.loadData(this.keyFilter);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
