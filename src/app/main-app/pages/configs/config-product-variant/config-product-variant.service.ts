import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConfigProductVariantService {

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
}