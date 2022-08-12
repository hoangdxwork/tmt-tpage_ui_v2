import { LiveCampaignModel } from 'src/app/main-app/dto/live-campaign/odata-live-campaign.dto';
import { TDSHelperArray } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";

@Injectable()

export class PrepareAddCampaignHandler {

    public prepareModel(form: FormGroup) {

        let formValue = form.value;
        let model = {} as LiveCampaignModel;
    
        model.Config = formValue.Config?.value;
        model.Name = formValue.Name;
        model.Users = formValue.Users || [];
        model.Note = formValue.Note;
        model.ResumeTime = formValue.ResumeTime;
        model.DateCreated = new Date();
        model.StartDate = formValue.StartDate;
        model.EndDate = formValue.EndDate;
        model.Preliminary_TemplateId = formValue.Preliminary_Template?.Id;
        model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_Template?.Id;
        model.MinAmountDeposit = formValue.MinAmountDeposit;
        model.MaxAmountDepositRequired = formValue.MaxAmountDepositRequired;
        model.EnableQuantityHandling = formValue.EnableQuantityHandling;
        model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
        // model.IsShift = formValue.IsShift;
    
        if (TDSHelperArray.hasListValue(formValue.Details)) {
          formValue.Details.forEach((detail: any, index: number) => {
            detail["Index"] = index;
          });
        }
    
        model.Details = formValue.Details;
    
        return model;
    }
}