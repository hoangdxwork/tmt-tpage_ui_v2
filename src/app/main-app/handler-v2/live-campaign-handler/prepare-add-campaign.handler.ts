import { TDSHelperArray, TDSHelperString } from 'tds-ui/shared/utility';
import { FormGroup } from '@angular/forms';
import { Injectable } from "@angular/core";
import { format } from "date-fns";
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

        model.DateCreated = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss+07:00");
        model.StartDate = format(formValue.StartDate, "yyyy-MM-dd'T'HH:mm:ss+07:00");
        model.EndDate = format(formValue.EndDate, "yyyy-MM-dd'T'HH:mm:ss+07:00");

        model.Preliminary_TemplateId = formValue.Preliminary_TemplateId || formValue.Preliminary_Template?.Id;
        model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_TemplateId || formValue.ConfirmedOrder_Template?.Id;
        model.MinAmountDeposit = Number(formValue.MinAmountDeposit);
        model.MaxAmountDepositRequired = Number(formValue.MaxAmountDepositRequired);
        model.IsEnableAuto = formValue.IsEnableAuto;
        model.EnableQuantityHandling = formValue.EnableQuantityHandling;
        model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
        model.IsApplyQuantityLiveCampaign = formValue.IsApplyQuantityLiveCampaign;
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

      if(formValue.DateCreated) {
        model.DateCreated = formValue.DateCreated;
      } else {
        model.DateCreated = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss+07:00");
      }

      if(formValue.StartDate) {
        model.StartDate = format(formValue.StartDate, "yyyy-MM-dd'T'HH:mm:ss+07:00");
      }

      if(formValue.EndDate) {
        model.EndDate = format(formValue.EndDate, "yyyy-MM-dd'T'HH:mm:ss+07:00");
      }

      model.Preliminary_TemplateId = formValue.Preliminary_TemplateId || formValue.Preliminary_Template?.Id;
      model.ConfirmedOrder_TemplateId = formValue.ConfirmedOrder_TemplateId || formValue.ConfirmedOrder_Template?.Id;
      model.MinAmountDeposit = Number(formValue.MinAmountDeposit);
      model.MaxAmountDepositRequired = Number(formValue.MaxAmountDepositRequired);
      model.IsEnableAuto = formValue.IsEnableAuto;
      model.EnableQuantityHandling = formValue.EnableQuantityHandling;
      model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
      model.IsApplyQuantityLiveCampaign = formValue.IsApplyQuantityLiveCampaign;
      model.IsShift = formValue.IsShift;
      model.Facebook_UserId = formValue.FacebookUserId;
      model.Facebook_UserName = formValue.Facebook_UserName;

      model.Details = [];

      return {...model};
  }

}
