import { Injectable } from "@angular/core";
import { FastSaleOrder_DefaultDTOV2 } from "@app/dto/fastsaleorder/fastsaleorder-default.dto";

@Injectable()

export class PrepareCopyBill {

    public prepareModel(dataModel:any, fs_default?: FastSaleOrder_DefaultDTOV2){
        let model = dataModel;

        model.TrackingRef = '';
        model.TrackingRefSort = '';
        model.State = 'draft';
        model.ShipStatus = 'none';
        model.ShipPaymentStatus = '';
        model.DateInvoice = new Date();
        model.Comment = '';

        //Truong hop nhieu cong ty copy tu cong ty khac
        delete model["Id"];
        delete model["Number"];
        delete model["MoveId"];

        // model.OrderLines.map((item:any) => {
        //   delete item["Account"];
        //   delete item["AccountId"];
        // });

        if(fs_default?.WarehouseId) {
          model.WarehouseId = fs_default.WarehouseId;
        }else{
          delete model["WarehouseId"];
        }

        if(fs_default?.Warehouse) {
          model.Warehouse = fs_default.Warehouse;
        }else{
          delete model["Warehouse"];
        }

        if(fs_default?.PaymentJournal) {
          model.PaymentJournal = fs_default.PaymentJournal;
        }else{
          delete model["PaymentJournal"];
        }

        if(fs_default?.PaymentJournalId) {
          model.PaymentJournalId = fs_default.PaymentJournalId;
        }else{
          delete model["PaymentJournalId"];
        }

        if(fs_default?.Account) {
          model.Account = fs_default.Account;
        }else{
          delete model["Account"];
        }

        if(fs_default?.AccountId) {
          model.AccountId = fs_default.AccountId;
        }else{
          delete model["AccountId"];
        }

        if(fs_default?.Company) {
          model.Company = fs_default.Company;
        }else{
          delete model["Company"];
        }

        if(fs_default?.CompanyId) {
          model.CompanyId = fs_default.CompanyId;
        }else{
          delete model["CompanyId"];
        }

        if(fs_default?.Journal) {
          model.Journal = fs_default.Journal;
        }else{
          delete model["Journal"];
        }

        if(fs_default?.JournalId) {
          model.JournalId = fs_default.JournalId;
        }else{
          delete model["JournalId"];
        }

        if(fs_default?.PaymentInfo) {
          model.PaymentInfo = fs_default.PaymentInfo;
        }else{
          delete model["PaymentInfo"];
        }

        if(fs_default?.User) {
          model.User = fs_default.User;
        }else{
          delete model["User"];
        }

        if(fs_default?.UserId) {
          model.UserId = fs_default.UserId;
          model.UserName = fs_default.UserName;
        }else{
          delete model["UserId"];
          delete model["UserName"];
        }

        return {...model} as FastSaleOrder_DefaultDTOV2;
    }
}
