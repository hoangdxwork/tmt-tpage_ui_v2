import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "@app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable()

export class PrepareCopyBill {

    public prepareModel(dataModel:any, data?: any){
        let model = dataModel;

        model.TrackingRef = "";
        model.TrackingRefSort = "";
        model.State = 'draft';
        model.ShipStatus = 'none';
        model.ShipPaymentStatus = '';
        model.DateInvoice = new Date();
        model.Comment = "";

        //Truong hop nhieu cong ty copy tu cong ty khac
        delete model["Id"];
        delete model["Number"];
        delete model["Warehouse"];
        delete model["WarehouseId"];
        delete model["PaymentJournal"];
        delete model["PaymentJournalId"];
        delete model["Account"];
        delete model["AccountId"];
        delete model["Company"];
        delete model["CompanyId"];
        delete model["Journal"];
        delete model["JournalId"];
        delete model["PaymentInfo"];
        delete model["User"];
        delete model["UserId"];
        delete model["UserName"];
        delete model["MoveId"];

        model.OrderLines.map((item:any) => {
        delete item["Account"];
        delete item["AccountId"];
        });

        // if(data.Warehouse){
        //     model.WareHouse = data.WareHouse;
        //     model.WareHouseId = data.WareHouse.Id;
        // }

        // if(data.PaymentJournal){
        //     model.PaymentJournal = data.PaymentJournal;
        //     model.PaymentJournalId = data.PaymentJournal.Id;
        // }

        // if(data.Account){
        //     model.Account = data.Account;
        //     model.AccountId = data.Account.Id;
        // }

        // if(data.Company){
        //     model.Company = data.Company;
        //     model.CompanyId = data.Company.Id;
        // }

        // if(data.Journal){
        //     model.Journal = data.Journal;
        //     model.JournalId = data.Journal.Id;
        // }

        // if(data.PaymentInfo){
        //     model.PaymentInfo = data.PaymentInfo
        // }

        // if(data.User){
        //     model.User = data.User;
        //     model.UserId = data.User.Id;
        // } 

        return {...model} as FastSaleOrder_DefaultDTOV2;
    }
}