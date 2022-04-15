import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { TDSSafeAny } from 'tmt-tang-ui';

@Injectable({
    providedIn: 'root'
})
export class ConfigPromotionService {

    constructor(private http:HttpClient){}

    public getCompanyList():Array<TDSSafeAny>{
      let comanyList = [
        {
          id:1,
          name:'Công ty CP Trường Minh Thịnh'
        }
      ];
      return comanyList
    }

    public getDiscountType(){
      let discountTypeList = [
        {
          id:1,
          name: 'phần trăm'
        },
        {
          id:2,
          name:'Tiền cố định'
        }
      ]
      return discountTypeList
    }

    public getTypeList():Array<TDSSafeAny>{
        let productTypeList = [
            {
              id:1,
              name:'Giày dép'
            },
            {
              id:2,
              name:'Thực phẩm'
            }
        ];

        return productTypeList;
    }

    public getProductList():Array<TDSSafeAny>{
      let products = [
        {
          id:1,
          name:'Giày đẹp'
        },
        {
          id:2,
          name:'Giày siêu đẹp'
        },
        {
          id:3,
          name:'Giày cực kỳ đẹp'
        }
      ];
      return products;
    }

    getGiftList(){
      let gifts = [
        {
          id:1,
          name:'Sản phẩm abc'
        },
        {
          id:2,
          name:'sản phẩm xyz'
        }
      ];
      return gifts
    }

    public getProductGroupList():Array<TDSSafeAny>{
        let productGroupList = [
            {
              id:1,
              name:'May mặc'
            },
            {
              id:2,
              name:'Điện tử'
            },
            {
              id:3,
              name:'Hàng tiêu dùng'
            }
        ];
        return productGroupList;
    }

    public getProductUnitList():Array<TDSSafeAny>{
        let productUnitList = [
            {
              id:1,
              name:'Cái'
            },
            {
              id:2,
              name:'Kg'
            }
        ];
        return productUnitList;
    }

    public getPosGroupList():Array<TDSSafeAny>{
        let PosGroupList = [
            {
              id:1,
              name:'Nhóm 1'
            },
            {
              id:2,
              name:'nhóm 2'
            }
        ];
        return PosGroupList;
    }

    public getTableData():Array<TDSSafeAny>{
      let tableData = [
        {
          id:1,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            },
            {
              id:2,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            },
            {
              id:3,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            },
            {
              id:4,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
        {
          id:2,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
        {
          id:3,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
        {
          id:4,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
        {
          id:5,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
        {
          id:6,
          name:'Khuyến mãi 30/4 - 1/5',
          active:true,
          createdDate: new Date(),
          coupon:[
            {
              id:1,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            },
            {
              id:2,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            },
            {
              id:3,
              couponCode:'NGB1YHI',
              expiredDate: new Date(),
              couponName:'Giảm 10% khách hàng vip',
              customer:'',
              referenceOrder:'',
              appliedOrder:'',
              status:true
            }
          ]
        },
      ];
      return tableData
    }
}