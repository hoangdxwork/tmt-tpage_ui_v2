import { TDSSafeAny } from "tds-ui/shared/utility";

export interface UserInitDTO{
    Avatar?:string;
    Company?:{
        Id?:TDSSafeAny;
        Name?:string;
    };
    Email?:string;
    Id?:string;
    Name?:string;
    PhoneNumber?:string;
    UserName?:string;
    Website?:string;
}
