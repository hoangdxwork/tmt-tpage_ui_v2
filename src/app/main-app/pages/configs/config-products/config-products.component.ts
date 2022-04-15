import { Router } from '@angular/router';
import { TDSSafeAny, TDSModalService } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-products',
  templateUrl: './config-products.component.html',
  styleUrls: ['./config-products.component.scss']
})
export class ConfigProductsComponent implements OnInit {
  TableData:Array<TDSSafeAny> = [];
  dropdownList:Array<TDSSafeAny> = [];
  
  expandSet = new Set<number>();
  setOfCheckedId = new Set<number>();
  listOfCurrentPageData: readonly TDSSafeAny[] = [];
 
  checked = false;
  indeterminate = false;
  loading = false;
  pageSize = 20;
  pageIndex = 1;

  fallback = 'assets/images/config/no-image-default.svg'

  configModelTags:Array<TDSSafeAny> = [];
  configTagDataList:Array<TDSSafeAny> = [];
  indClickTag = -1;

  constructor(
    private router:Router,
    private modalService: TDSModalService
    ) { 
    this.initListData();
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.TableData = [
      {
        id:1,
        image:{id:1,url:'assets/images/config/SP1120.png'},
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
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[
          {id:1,name:'hàng lỗi'},
          {id:2,name:'Sale'}
        ],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
      {
        id:2,
        image:{id:1,url:'assets/images/config/SP1120.png'},
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
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
      {
        id:3,
        image:{id:1,url:'assets/images/config/SP1120.png'},
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
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
      {
        id:4,
        image:{id:1,url:'assets/images/config/SP1120.png'},
        images:[],
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
      {
        id:5,
        image:{id:1,url:'assets/images/config/SP1120.png'},
        images:[],
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
      {
        id:6,
        image:{
          id:1,url:'assets/images/config/SP1120.png'
        },
        images:[
          {
            uid: '-1',
            name: 'shoes_1.png',
            status: 'done',
            url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/ce8a6f3aa6294de988d7abce00c4e459_9366/Breaknet_Shoes_White_FX8707_01_standard.jpg'
          },
        ],
        productCode:'SP0682',
        productName:'Kristin Watson',
        productGroup:'Tất cả',
        productType:'Có thể lưu trữ',
        price:1200000,
        discountSalePrice:100000,
        allowToSellOnAnotherCompany: false,
        manufacturingCompany: 'Công Nghệ Trường Minh Thịnh',
        defaultUnit:'Cái',
        Tags:[],
        active:true,
        stockCards:[
          {
            id:1,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:2,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
          {
            id:3,
            type:'Text',
            pickingName:'text',
            reference:'text',
            source:'text',
            arriveTo:'text',
            unit:'text',
            quantity:10,
            createdDate: new Date()
          },
        ],
        inventory:[
          {
            id:1,
            stockName:'tmt30',
            quantity:2
          },
          {
            id:2,
            stockName:'Kho Hàng Tại Hà Nội',
            quantity:3
          },
          {
            id:3,
            stockName:'kho diệp minh châu',
            quantity:1
          },
          {
            id:4,
            stockName:'TMT Fashion',
            quantity:0
          },
        ],
      },
    ];
  }

  initListData(){
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

    this.configTagDataList = [
      {
        id:1,
        name:'Hàng lỗi'
      },
      {
        id:2,
        name:'Hàng khuyến mãi'
      },
      {
        id:3,
        name:'Hàng tặng'
      }
    ];
    //add product
    
  }

  updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly TDSSafeAny[]): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
      const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
      this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
      this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }

  onItemChecked(id: number, checked: boolean): void {
      this.updateCheckedSet(id, checked);
      this.refreshCheckedStatus();
  }

  onAllChecked(checked: boolean): void {
      this.listOfCurrentPageData
          .filter(({ disabled }) => !disabled)
          .forEach(({ id }) => this.updateCheckedSet(id, checked));
      this.refreshCheckedStatus();
  }

  sendRequestTableTab(): void {
      this.loading = true;
      const requestData = this.TableData.filter(data => this.setOfCheckedId.has(data.id));
      console.log(requestData);
      setTimeout(() => {
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.loading = false;
      }, 1000);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  openTag(id: number, data: TDSSafeAny) {
    this.configModelTags = [];
    this.indClickTag = id;
    this.configTagDataList = JSON.parse(data);
  }

  assignTags(id: number, tags: Array<TDSSafeAny>){
    this.TableData.find(f=>f.id == id).Tags = tags;
    this.indClickTag = -1;
  }

  closeTag() {
    this.indClickTag = -1;
  }

  addNewData(data:TDSSafeAny){
    this.router.navigate(['configs/products/create']);
  }

  refreshData(){

  }

  showEditModal(i:number){
    
  }

  showRemoveModal(i:number){
    const modal = this.modalService.error({
        title: 'Xác nhận xóa sản phẩm',
        content: 'Bạn có chắc muốn xóa sản phẩm này không?',
        iconType:'tdsi-trash-fill',
        okText:"Xác nhận",
        cancelText:"Hủy bỏ",
        onOk: ()=>{
          //remove item here

        },
        onCancel:()=>{
          modal.close();
        },
      })
  }
}
