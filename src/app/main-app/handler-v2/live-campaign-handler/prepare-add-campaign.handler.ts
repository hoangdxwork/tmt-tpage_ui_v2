import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { LiveCampaignSimpleDto } from '@app/dto/live-campaign/livecampaign-simple.dto';

@Injectable()

export class PrepareAddCampaignHandler {

    public prepareModel(form: FormGroup) {

        let formValue = form.value;
        let model = {} as LiveCampaignSimpleDto;

        model.Config = formValue.Config || formValue.ConfigObject?.value;
        model.Name = formValue.Name;
        model.Users = formValue.Users || [];
        model.Note = formValue.Note;
        model.ResumeTime = formValue.ResumeTime;
        model.DateCreated = new Date();
        model.StartDate = new Date(formValue.StartDate);
        model.EndDate = new Date(formValue.EndDate);
        model.Preliminary_TemplateId = formValue.Preliminary_TemplateId || formValue.Preliminary_Template?.Id;
        model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_TemplateId || formValue.ConfirmedOrder_Template?.Id;
        model.MinAmountDeposit = Number(formValue.MinAmountDeposit);
        model.MaxAmountDepositRequired = Number(formValue.MaxAmountDepositRequired);
        model.IsEnableAuto = formValue.IsEnableAuto;
        model.EnableQuantityHandling = formValue.EnableQuantityHandling;
        model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
        model.IsShift = formValue.IsShift;
        model.Facebook_UserId = formValue.FacebookUserId;
        model.Facebook_UserName = formValue.Facebook_UserName;

        if (TDSHelperArray.hasListValue(formValue.Details)) {
          formValue.Details.map((x: any, index: number) => {
              if(!TDSHelperString.hasValueString(x.Id)) {
                  delete x.Id;
              }

              x["Index"] = index + 1;
              x.Tags = x?.Tags.toString();

              if(TDSHelperString.hasValueString(formValue.Id)) {
                  x.LiveCampaign_Id = formValue.Id;
              }
          });
        }

        model.Details = formValue.Details;
        return {...model};
    }

    public prepareModelSimple(form: FormGroup) {

      let formValue = form.value;
      let model = {} as LiveCampaignSimpleDto;

      model.Id = formValue.Id;
      model.Config = formValue.Config || formValue.ConfigObject?.value;
      model.Name = formValue.Name;
      model.Users = formValue.Users || [];
      model.Note = formValue.Note;
      model.ResumeTime = formValue.ResumeTime;
      model.DateCreated = new Date();
      model.StartDate = formValue.StartDate ? new Date(formValue.StartDate) : null;
      model.EndDate = formValue.EndDate ? new Date(formValue.EndDate) : null;
      model.Preliminary_TemplateId = formValue.Preliminary_TemplateId || formValue.Preliminary_Template?.Id;
      model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_TemplateId || formValue.ConfirmedOrder_Template?.Id;
      model.MinAmountDeposit = Number(formValue.MinAmountDeposit);
      model.MaxAmountDepositRequired = Number(formValue.MaxAmountDepositRequired);
      model.IsEnableAuto = formValue.IsEnableAuto;
      model.EnableQuantityHandling = formValue.EnableQuantityHandling;
      model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
      model.IsShift = formValue.IsShift;
      model.Facebook_UserId = formValue.FacebookUserId;
      model.Facebook_UserName = formValue.Facebook_UserName;

      model.Details = [];

      return {...model};
  }
}
