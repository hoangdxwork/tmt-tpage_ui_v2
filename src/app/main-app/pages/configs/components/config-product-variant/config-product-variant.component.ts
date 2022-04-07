import { TDSSafeAny } from 'tmt-tang-ui';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-config-product-variant',
  templateUrl: './config-product-variant.component.html',
  styleUrls: ['./config-product-variant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigProductVariantComponent implements OnInit {
  TableDataTab1:Array<TDSSafeAny> = [];
  TableDataTab2:Array<TDSSafeAny> = [];
  dropdownList:Array<TDSSafeAny> = [];
  currentComponent = 1;

  constructor() {
    this.dropdownList = [
      {
        id:1,
        name:'Xuất excel kiểm kho'
      },
      {
        id:2,
        name:'Mở hiệu lực'
      },
      {
        id:3,
        name:'Hết hiệu lực'
      },
      {
        id:4,
        name:'Thêm SP vào Page'
      },
    ];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.TableDataTab1 = [
      {
        id:1,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name:'[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:2,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:3,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:4,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:5,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:6,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
    ];

    this.TableDataTab2 = [
      {
        id:1,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:2,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
      {
        id:3,
        imageURL:'assets/images/config/SP1120.png',
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
          {
            uid: '-2',
            name: 'shoes_2.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        name: '[SP1120] SP2089192',
        active:true,
        sellable:true,
        buyable:true,
        showAtPOS:true,
        type:{
          id:1,
          name:'Giày dép'
        },
        productCode:'SP1120',
        QRCode:'SP1120',
        group:{
          id:1,
          name:'May mặc'
        },
        attribute:'da trâu bền chắc',
        productPrice:900000,
        capital:500000,
        defaultUnit:{
          id:1,
          name:'Cái'
        },
        unit:{
          id:1,
          name:'Cái'
        },
        controlBill:'1',
        netWeight:0.24,
        timeOut:12,
        PosGroup:{
          id:1,
          name:'Nhóm 1'
        },
        salePolicy:'1'
      },
    ];
  }

  
  onAddNewData(data:TDSSafeAny){
    this.currentComponent = 2;
  }

  getCurrentComponent(i:number){
    this.currentComponent = i;
  }
}