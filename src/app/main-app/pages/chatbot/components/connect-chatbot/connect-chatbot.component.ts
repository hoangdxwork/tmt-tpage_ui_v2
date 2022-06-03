import { finalize } from 'rxjs/operators';
import { TDSMessageService } from 'tmt-tang-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TDSHelperString, TDSModalRef } from 'tmt-tang-ui';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CRMTeamDTO, InputCreateChatbotDTO } from 'src/app/main-app/dto/team/team.dto';
import { DeliveryCarrierService } from 'src/app/main-app/services/delivery-carrier.service';
import { DeliveryCarrierDTO } from 'src/app/main-app/dto/carrier/delivery-carrier.dto';
import { CompanyService } from 'src/app/main-app/services/company.service';
import { CompanyDTO } from 'src/app/main-app/dto/company/company.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Message } from 'src/app/lib/consts/message.const';

@Component({
  selector: 'connect-chatbot',
  templateUrl: './connect-chatbot.component.html',
  styleUrls: ['./connect-chatbot.component.scss']
})
export class ConnectChatbotComponent implements OnInit {

  @Input() channel!: CRMTeamDTO | null;

  @Output() onCreateSuccess = new EventEmitter<CRMTeamDTO | null>();

  formConnectChatbot!: FormGroup;
  lstCarriers: DeliveryCarrierDTO[] = [];
  lstCompany: CompanyDTO[] = [];
  isLoading: boolean = false;

  constructor(
    private modalRef: TDSModalRef,
    private formBuilder: FormBuilder,
    private deliveryCarrierService: DeliveryCarrierService,
    private companyService: CompanyService,
    private crmTeamService: CRMTeamService,
    private message: TDSMessageService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.updateForm();

    this.loadDeliveryCarrier();
    this.loadCompany();
  }

  createForm() {
    this.formConnectChatbot = this.formBuilder.group({
      Name:[null, [Validators.required]],
      Address: [null, [Validators.required]],
      Category:[null, [Validators.required]],
      Phone:[null, [Validators.required]],
      Company:[null, [Validators.required]],
      Carrier: [null],
    });
  }

  updateForm() {
    this.formConnectChatbot.controls["Category"].setValue("shopping");

    if(!this.channel) return;
    this.formConnectChatbot.controls["Name"].setValue(this.channel.Facebook_PageName);
  }

  loadDeliveryCarrier() {
    this.deliveryCarrierService.dataCarrierActive$.subscribe(res => {
      this.lstCarriers = res;
    });
  }

  loadCompany() {
    this.companyService.get().subscribe(res => {
      this.lstCompany = res.value.filter(x => TDSHelperString.hasValueString(x.Name));
    });
  }

  onSave() {
    let model = this.prepareModel();

    this.isLoading = true;
    this.crmTeamService.connectChatbot(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.Chatbot.CreateChatbotSuccess);
        this.onCreateSuccess.emit(this.channel);
        this.onCancel();
      }, error => {
        if(error?.Message) {
          this.message.error(error?.Message);
        }
        else {
          this.message.error(error);
        }
      });
  }

  prepareModel() {
    let model = {} as InputCreateChatbotDTO;
    let value = this.formConnectChatbot.value;

    model.Name = value.Name;
    model.Address = value.Address;
    model.Category = value.Category;
    model.Phone = value.Phone;
    model.ShipProvider = [];
    model.CompanyId = value.Company.Id;
    model.Facebook_PageId = this.channel?.Facebook_PageId || '';

    // if(value.Carrier && value.Carrier.length > 0) {
    //   value.Carrier.forEach(carrier => {
        model["ShipProvider"].push({
          "type": "GHN",
          "shopid":"1266853",
          "shoptoken":"zCV1eKl1Bdxg3fKG9XkyfJOrBOBHwNsFn1c0Vk"
        });
    //   });
    // }

    return model;
  }

  onCancel() {
    this.modalRef.destroy();
  }

}
