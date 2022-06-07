import { TDSMessageService } from 'tmt-tang-ui';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Message } from 'src/app/lib/consts/message.const';
import { DataPouchDBDTO } from 'src/app/main-app/dto/product-pouchDB/product-pouchDB.dto';
import { FastSaleOrderLineService } from 'src/app/main-app/services/fast-sale-orderline.service';
import { StringHelperV2 } from 'src/app/main-app/shared/helper/string.helper';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tmt-tang-ui';
import { finalize } from 'rxjs/operators';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { QuickReplyService } from 'src/app/main-app/services/quick-reply.service';
import { ApplicationUserDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { QuickReplyDTO } from 'src/app/main-app/dto/quick-reply.dto.ts/quick-reply.dto';
import { Observable } from 'rxjs';
import { LiveCampaignService } from 'src/app/main-app/services/live-campaign.service';
import { SaleOnlineLiveCampaignDetailDTO, SaleOnline_LiveCampaignDTO } from 'src/app/main-app/dto/live-campaign/live-campaign.dto';

@Component({
  selector: 'add-livecampaign',
  templateUrl: './add-livecampaign.component.html'
})
export class AddLiveCampaignComponent implements OnInit {

  lstConfig: any = [
    { text: "Nháp", value: "Draft" },
    { text: "Xác nhận", value: "Confirmed" },
    { text: "Xác nhận và gửi vận đơn", value: "ConfirmedAndSendLading" },
  ];

  liveCampaignId!: string | null;
  isCopy?: boolean = false;
  isEdit?: boolean = false;

  formLiveCampaign!: FormGroup;
  isLoading: boolean = false;
  isShowFormInfo: boolean = true;
  indClickTag: number = -1;

  lstUser$!: Observable<ApplicationUserDTO[]>;
  lstQuickReplies$!: Observable<QuickReplyDTO[]>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private quickReplyService: QuickReplyService,
    private liveCampaignService: LiveCampaignService,
    private fastSaleOrderLineService: FastSaleOrderLineService
  ) { }

  get detailFormGroups() {
    return (this.formLiveCampaign?.get("Details") as FormArray);
  }

  ngOnInit(): void {
    this.createForm();

    this.loadLiveCampaignId();
    this.loadUser();
    this.loadQuickReply();
  }

  loadLiveCampaignId() {
    this.liveCampaignId = this.route.snapshot.paramMap.get("id");

    let path = this.route.snapshot?.routeConfig?.path;
    if(path === "copy/:id") {
      this.isCopy = true;
      this.loadLiveCampaign(this.liveCampaignId);
    }
    else if(path == "edit/:id") {
      this.isEdit = true;
      this.loadLiveCampaign(this.liveCampaignId);
    }
  }

  loadUser() {
    this.lstUser$ = this.applicationUserService.dataActive$;
  }

  loadQuickReply() {
    this.lstQuickReplies$ = this.quickReplyService.dataActive$;
  }

  loadLiveCampaign(liveCampaignId?: string | null) {
    if(liveCampaignId) {
      this.isLoading = true;
      this.liveCampaignService.getDetailById(liveCampaignId)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(res => {
            this.updateForm(res);
          });
    }
  }

  createForm() {
    this.formLiveCampaign = this.formBuilder.group({
      Details: this.formBuilder.array([]),
      Config: [null],
      Name: [null],
      Note: [null],
      ResumeTime: [0],
      StartDate: [null],
      EndDate: [null],
      Users: [null],
      Preliminary_Template: [null],
      ConfirmedOrder_Template: [null],
      MinAmountDeposit: [0],
      MaxAmountDepositRequired: [0],
      EnableQuantityHandling: [false],
      IsAssignToUserNotAllowed: [false],
      IsShift: [false]
    });
  }

  updateForm(data: SaleOnline_LiveCampaignDTO) {
    if(!this.isCopy) data.Id = undefined;
    this.formLiveCampaign.patchValue(data);
    this.initFormDetails(data.Details);
  }

  initFormDetails(details: SaleOnlineLiveCampaignDetailDTO[]) {
    if(TDSHelperArray.hasListValue(details)) {
      details.forEach(detail => {
        const control = <FormArray>this.formLiveCampaign.controls['Details'];
        control.push(this.initDetailByLiveCampaign(detail));
      });
    }
  }

  initDetailByLiveCampaign(detail?: SaleOnlineLiveCampaignDetailDTO) {
    let detailFormGroup = this.formBuilder.group({
        Id: [null],
        Index: [null],
        Quantity: [null],
        RemainQuantity: [null],
        ScanQuantity: [null],
        UsedQuantity: [null],
        Price: [null],
        Note: [null],
        ProductId: [null],
        ProductName: [null],
        ProductNameGet: [null],
        UOMId: [null],
        UOMName: [null],
        Tags: [null],
        LimitedQuantity: [null],
        ProductCode: [null],
        ImageUrl: [null],
        IsActive: true
    });

    if(detail) {
      detail.Tags = detail?.Tags.split(",");
      detailFormGroup.patchValue(detail);
    }

    return detailFormGroup;
  }

  onLoadProduct(product: DataPouchDBDTO) {
    let detailValue = this.formLiveCampaign.controls['Details'].value;

    let indexExist = detailValue.findIndex((item: any) => `${item.ProductId}_${item.UOMId}` === product.Product_UOMId);

    if(indexExist > -1) {
      detailValue[indexExist].Quantity++;
      const control = <FormArray>this.formLiveCampaign.controls['Details'];
      control.at(indexExist).setValue(detailValue[indexExist]);
    }
    else {
      const control = <FormArray>this.formLiveCampaign.controls['Details'];
      control.push(this.initDetailBySelectProduct(detailValue.length, product));
    }
  }

  initDetailBySelectProduct(index?: number, product?: DataPouchDBDTO) {
    const model = this.formBuilder.group({
      ProductName: [null],
      ProductNameGet: [null],
      ProductId: [null],
      Price: [null],
      UOMId: [null],
      UOMName: [null],
      Quantity: [1],
      LimitedQuantity: [0],
      Index: [index],
      Tags: [null],
      IsActive: [true],
    });

    if(product) {
      let generateTag = this.generateTagDetail(product.NameGet, product.DefaultCode);

      model.controls.Tags.setValue(generateTag);
      model.controls.ProductName.setValue(product.NameGet);
      model.controls.ProductNameGet.setValue(product.NameGet);
      model.controls.ProductId.setValue(product.Id);
      model.controls.Price.setValue(product.Price);
      model.controls.UOMId.setValue(product.UOMId);
      model.controls.UOMName.setValue(product.UOMName);
    }

    return model;
  }

  generateTagDetail(productName: string, code?: string) {
    productName = productName.replace(`[${code}]`, "");
    productName = productName.trim();

    let result: string[] = [];

    let word = StringHelperV2.removeSpecialCharacters(productName);
    let wordNoSignCharacters = StringHelperV2.nameNoSignCharacters(word);
    let wordNameNoSpace = StringHelperV2.nameCharactersSpace(wordNoSignCharacters);

    result.push(word);

    if(!result.includes(wordNoSignCharacters)) {
      result.push(wordNoSignCharacters);
    }

    if(!result.includes(wordNameNoSpace)) {
      result.push(wordNameNoSpace);
    }

    if(TDSHelperString.hasValueString(code) && code) {
      result.push(code);
    }

    return result;
  }

  openTag(index: number) {
    this.indClickTag = index;
  }

  onCloseTag() {
    this.indClickTag = -1;
  }

  onSaveTag() {
  }

  onChangeCollapse(event: TDSSafeAny) {
    this.isShowFormInfo = event;
  }

  onBack() {
    history.back();
  }


  removeDetail(index: number, detail: TDSSafeAny) {
    if(TDSHelperString.hasValueString(detail?.Id) && !this.isCopy) {
      this.isLoading = true;
      this.fastSaleOrderLineService.getByLiveCampaignId(detail.Id, detail.ProductId, detail.UOMId).pipe(finalize(() => this.isLoading = false)).subscribe(res => {
        if(TDSHelperArray.hasListValue(res?.value)) {
          this.message.error(Message.LiveCampaign.ErrorRemoveLine);
        }
        else {
          const control = <FormArray>this.formLiveCampaign.controls['Details'];
          control.removeAt(index);
        }
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
    }
    else {
      const control = <FormArray>this.formLiveCampaign.controls['Details'];
      control.removeAt(index);
    }
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model = this.prepareModel();

      if(this.isEdit) {
        this.update(model);
      }
      else {
        this.create(model);
      }
    }
  }

  create(model: SaleOnline_LiveCampaignDTO) {
    this.isLoading = true;
    this.liveCampaignService.create(model)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.ManipulationSuccessful);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  update(model: SaleOnline_LiveCampaignDTO) {
    this.isLoading = true;
    this.liveCampaignService.update(model, false)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.message.success(Message.ManipulationSuccessful);
      }, error => {
        this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
      });
  }

  prepareModel() {
    let formValue = this.formLiveCampaign.value;

    let model = {} as SaleOnline_LiveCampaignDTO;

    model.Id = (this.isEdit && this.liveCampaignId) ? this.liveCampaignId : undefined;
    model.Config = formValue.Config?.value;
    model.Name = formValue.Name;
    model.Users = formValue.Users || [];
    model.Note = formValue.Note;
    model.ResumeTime = formValue.ResumeTime;
    model.StartDate = formValue.StartDate;
    model.EndDate = formValue.EndDate;
    model.Preliminary_Template = formValue.Preliminary_Template;
    model.ConfirmedOrder_Template = formValue.ConfirmedOrder_Template;
    model.MinAmountDeposit = formValue.MinAmountDeposit;
    model.MaxAmountDepositRequired = formValue.MaxAmountDepositRequired;
    model.EnableQuantityHandling = formValue.EnableQuantityHandling;
    model.IsAssignToUserNotAllowed = formValue.IsAssignToUserNotAllowed;
    // model.IsShift = formValue.IsShift;

    if (TDSHelperArray.hasListValue(formValue.Details)) {
      formValue.Details.forEach((detail: SaleOnlineLiveCampaignDetailDTO, index: number) => {
        detail["Index"] = index;
        detail.Tags = detail?.Tags.toString();
      });
    }

    model.Details = formValue.Details;

    return model;
  }

  isCheckValue() {
    let formValue = this.formLiveCampaign.value;

    let details = formValue.Details;

    if(TDSHelperArray.hasListValue(details)) {
      let find = details.findIndex((x: any) => !this.isNumber(x.Quantity) || !this.isNumber(x.LimitedQuantity) || !this.isNumber(x.Price));
      if(find > -1) {
        this.message.error(Message.LiveCampaign.ErrorNumberDetail);
        return 0;
      }
    }

    return 1;
  }

  isNumber(value: TDSSafeAny): boolean {
    return Number.isInteger(value);
  }

}
