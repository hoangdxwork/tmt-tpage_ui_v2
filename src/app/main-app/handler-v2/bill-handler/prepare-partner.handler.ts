import { FastSaleOrder_DefaultDTOV2 } from 'src/app/main-app/dto/fastsaleorder/fastsaleorder-default.dto';
import { FormGroup } from '@angular/forms';
import { PartnerDetailDTO } from './../../dto/partner/partner-detail.dto';
import { ChangePartnerPriceListDTO } from './../../dto/partner/change-partner-pricelist.dto';
import { Injectable } from "@angular/core";

@Injectable()

export class PreparePartnerHandler {

    public prepareModel(form:FormGroup, data:ChangePartnerPriceListDTO, partner: PartnerDetailDTO, idEdit: any) {

        if (data?.Account) {
            form.controls['Account'].setValue(data.Account);
            form.controls['AccountId'].setValue(data.Account.Id);
        }

        if (partner) {
            form.controls['Partner'].setValue(partner);
            form.controls['PartnerId'].setValue(partner.Id);

            // TODO: cập nhật giảm giá
            let discount = form.controls['Discount'].value;
            if(discount > 0) {
                form.controls['Discount'].setValue(discount);
            } else {
                form.controls['Discount'].setValue(partner.Discount);
            }

            data.PartnerDisplayName = partner.Name;
            data.PartnerPhone = partner.Phone;
            data.PartnerNameNoSign = partner.NameNoSign;
            data.PartnerFacebookId = partner.FacebookId;
            data.PartnerFacebook = partner.Facebook;

            data.ReceiverName = partner.Name;
            data.ReceiverPhone = partner.Phone;
            data.ReceiverAddress = partner.Street;

            data.Ship_Receiver.Name = partner.Name;
            data.Ship_Receiver.Phone = partner.Phone;
            data.Ship_Receiver.Street = partner.Street;

            data.Ship_Receiver.City = {
                code: partner.CityCode, name: partner.CityName
            }
            data.Ship_Receiver.District = {
                code: partner.DistrictCode, name: partner.DistrictName
            }
            data.Ship_Receiver.Ward = {
                code: partner.WardCode, name: partner.WardName
            }
        }

        if(data?.PriceList) {
            form.controls['PriceList'].setValue(data.PriceList);
            form.controls['PriceListId'].setValue(data.PriceList?.Id);
        }

        form.controls['Revenue'].setValue(data?.Revenue);
        form.controls['DeliveryNote'].setValue(data?.DeliveryNote);
        form.controls['ReceiverName'].setValue(data?.ReceiverName);
        form.controls['ReceiverPhone'].setValue(data?.ReceiverPhone);
        form.controls['ReceiverNote'].setValue(data?.ReceiverNote);
        form.controls['ReceiverAddress'].setValue(data?.ReceiverAddress);

        //TODO: Cập nhật lại nợ cũ
        form.controls['PreviousBalance'].setValue(data?.PreviousBalance);

        //TODO: Cập nhật lại dataSuggestion
        if (data && data.Ship_Receiver && Number(idEdit) == 0) {
            form.controls['Ship_Receiver'].patchValue({
                Name: data.Ship_Receiver?.Name,
                Phone: data.Ship_Receiver?.Phone,
                Street: data.Ship_Receiver?.Street,
                City: {
                    code: data.Ship_Receiver?.City?.code,
                    name: data.Ship_Receiver?.City?.name
                },
                District: {
                    code: data.Ship_Receiver.District.code,
                    name: data.Ship_Receiver.District.name
                },
                Ward: {
                    code: data.Ship_Receiver.Ward.code,
                    name: data.Ship_Receiver.Ward.name
                }
            })
        }
    }

    public prepareDataModel(dataModel: FastSaleOrder_DefaultDTOV2, model: any, partner: any) {
        if(model.Account != null && dataModel.Account == null) {
            dataModel.Account = model.Account;
            dataModel.AccountId = model.AccountId;
        }

        if(partner != null && dataModel.Partner == null) {
            dataModel.Partner = partner;
            dataModel.PartnerId = partner.Id;
            
            dataModel.ReceiverName = dataModel.ReceiverName || partner.Name;
            dataModel.ReceiverPhone = dataModel.ReceiverPhone || partner.Phone;

            if(dataModel.ReceiverAddress == null) {
                dataModel.ReceiverAddress = partner.Street || partner.FullAddress;
                dataModel.Ship_Receiver = {
                    City: {
                        code: partner.CityCode,
                        name: partner.CityName
                    },
                    District: {
                        code: partner.DistrictCode,
                        name: partner.DistrictName
                    },
                    Ward:{
                        code: partner.WardCode,
                        name: partner.WardName
                    },
                    Street: partner.Street,
                    Name: partner.Name,
                    Phone: partner.Phone
                }
            }
        }

        return dataModel;
    }
}
