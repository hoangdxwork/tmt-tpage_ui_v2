import { TDSHelperArray } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';

@Injectable()

export class PrepareAddCampaignHandler {

    public prepareModel(form: FormGroup): LiveCampaignModel {

        let formValue = form.value;
        let model = {} as LiveCampaignModel;

        model.Config = formValue.Config?.value;
        model.Name = formValue.Name;
        model.Users = formValue.Users || [];
        model.Note = formValue.Note;
        model.ResumeTime = formValue.ResumeTime;
        model.DateCreated = new Date();
        model.StartDate = new Date(formValue.StartDate);
        model.EndDate = new Date(formValue.EndDate);
        model.Preliminary_TemplateId = formValue.Preliminary_Template?.Id;
        model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_Template?.Id;
        model.MinAmountDeposit = formValue.MinAmountDeposit;
        model.MaxAmountDepositRequired = formValue.MaxAmountDepositRequired;
        model.IsEnableAuto = formValue.IsEnableAuto;
        model.EnableQuantityHandling = formValue.EnableQuantityHandling;
        model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
        model.IsShift = formValue.IsShift;
        model.Facebook_UserId = formValue.FacebookUserId;
        model.Facebook_UserName = formValue.Facebook_UserName;
        
        if (TDSHelperArray.hasListValue(formValue.Details)) {
          formValue.Details.map((detail: any, index: number) => {
            detail["Index"] = index;
            detail.Tags = detail?.Tags.toString();
          });
        }

        model.Details = formValue.Details;

        return {...model};
    }
}
