import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConfigProductService {

    constructor(private http:HttpClient){}

    public getTypeList(){
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

    public getProductGroupList(){
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

    public getProductUnitList(){
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

    public getPosGroupList(){
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

    public getManufacturerList(){
      let manufacturers = [
        {
          id:1,
          name:'Công ty sản xuất ABC'
        },
        {
          id:2,
          name:'Công ty sản xuất XYZ'
        },
      ];
      return manufacturers;
    }

    public getImporterList(){
      let importers = [
        {
          id:1,
          name:'Công ty nhập khẩu ABC'
        },
        {
          id:2,
          name:'Công ty nhập khẩu XYZ'
        },
      ];
      return importers;
    }

    public getDistributorList(){
      let distributors = [
        {
          id:1,
          name:'Công ty phân phối ABC'
        },
        {
          id:2,
          name:'Công ty phân phối XYZ'
        },
      ];
      return distributors;
    }

    public getNationList(){
      let nations = [
        {
          id:1,
          name: 'Nga'
        },
        {
          id:2,
          name:'Ukraine'
        }
      ];
      return nations;
    }
}