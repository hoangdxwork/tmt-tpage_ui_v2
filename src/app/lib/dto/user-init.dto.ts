import { TDSSafeAny } from "tmt-tang-ui";

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
}