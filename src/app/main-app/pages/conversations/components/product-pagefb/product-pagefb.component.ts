import { AfterViewInit, ChangeDetectorRef, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { TDSModalRef, TDSTableComponent, TDSHelperArray, TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DataPouchDBDTO, KeyCacheIndexDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { ProductTemplateV2DTO } from 'src/app/main-app/dto/producttemplate/product-tempalte.dto';
import { debounceTime, finalize, map, mergeMap, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/main-app/services/common.service';
import { ProductIndexDBService } from 'src/app/main-app/services/product-indexDB.service';
import { orderBy as _orderBy } from 'lodash';
import { SharedService } from 'src/app/main-app/services/shared.service';
import { CompanyCurrentDTO } from 'src/app/main-app/dto/configs/company-current.dto';
import { formatDate } from '@angular/common';
import { ProductService } from 'src/app/main-app/services/product.service';
import { ProductPageFbDTO } from 'src/app/main-app/dto/product-pagefb/product-pagefb.dto';

@Component({
  selector: 'product-pagefb',
  templateUrl: './product-pagefb.component.html',
})

export class ProductPagefbComponent implements OnInit, OnDestroy {

  @Input() pageId: any;

  lstOfData!: ProductPageFbDTO[];

  state: any = {
    Skip: 0,
    Limmit: 10,
    KeyWord: "",
  };

  constructor(private productService: ProductService,
    private modal: TDSModalRef) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.productService.getProductsByPageFacebook(this.pageId, this.state).subscribe((res: any) => {
      this.lstOfData = [...res];
    })
  }

  ngOnDestroy(): void {

  }

  cancel() {
    this.modal.destroy(null);
  }

}
