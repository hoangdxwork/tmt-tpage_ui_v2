import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { AutoLabelConfigDTO, TagControlLabelDTO } from "src/app/main-app/dto/configs/post/order-config.dto";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSHelperArray, TDSHelperObject, TDSHelperString, TDSMessageService, TDSModalRef } from "tmt-tang-ui";

@Component({
  selector: 'auto-label-config',
  templateUrl: './auto-label-config.component.html'
})

export class AutoLabelConfigComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data!: FacebookPostItem;

  formLabelConfig!: FormGroup;
  isLoading: boolean = false;

  lstTags$!: Observable<CRMTagDTO[]>;
  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService
  ) {
  }

  get tagOnPatternFormGroups() {
    return (this.formLabelConfig.get('TagOnPattern') as FormArray).controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes?.data?.firstChange === true) this.createForm();
    else this.resetForm();

    if(changes?.data?.currentValue) {
      this.loadAutoLabelConfigs(this.data.fbid);
    }
  }

  ngOnInit(): void {
    this.loadCRMTag();
  }

  loadCRMTag() {
    this.lstTags$ = this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadAutoLabelConfigs(pageId: string) {
    this.isLoading = true;
    this.facebookPostService.getAutoLabelConfigs(pageId)
      .pipe(finalize(() => { this.isLoading = false }))
      .subscribe(res => {
        this.updateForm(res);
      });
  }

  createForm() {
    this.formLabelConfig = this.fb.group({
      AssignOnPhone: [false],
      AssignOnOrder: [false],
      AssignOnPattern: [false],
      AssignOnBillDraft: [false],
      AssignOnBillPrint: [false],
      AssignOnBillPrintShip: [false],
      TagOnPhone: [null],
      TagOnOrder: [null],
      TagOnPattern: this.fb.array([]),
      TagOnBillDraft: [null],
      TagOnBillPrint: [null],
      TagOnBillPrintShip: [null]
    })
  }

  resetForm() {
    this.formLabelConfig.reset();
  }

  updateForm(data: AutoLabelConfigDTO) {
    this.formLabelConfig.patchValue(data);

    if (TDSHelperArray.hasListValue(data?.TagOnPattern)) {
      data.TagOnPattern.forEach(Tag => {
          this.addCRMKeyTag(Tag);
      });
    }
  }

  addCRMKeyTag(data: TagControlLabelDTO | null) {
    const model = <FormArray>this.formLabelConfig.controls['TagOnPattern'];
    model.push(this.initCRMKeyTag(data));
  }

  initCRMKeyTag(data: TagControlLabelDTO | null) {
    let crmKey = data?.CrmKey?.split(',');

    let result = this.fb.group({
      CrmTag: [data?.CrmTag],
      CrmKey: [crmKey || []]
    });

    return result;
  }

  deleteCRMKeyTag(i: number) {
    const model = <FormArray>this.formLabelConfig.controls['TagOnPattern'];
    model.removeAt(i);
  }

  onSave(): any {
    let model = this.prepareModel();
    let postId = this.data?.fbid;

    if(this.isCheckValue() === 1) {
      this.isLoading = true;
      this.facebookPostService.updateAutoLabelConfigs(postId, model)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe((res: any) => {
          this.message.success(Message.UpdatedSuccess);
        }, error => {
          this.message.error(`${error?.error?.message || JSON.stringify(error)}`);
        });
    }
  }

  prepareModel(): any {
    let formValue = this.formLabelConfig.value;

    let model = {} as AutoLabelConfigDTO;

    model.AssignOnPhone = formValue.AssignOnPhone;
    model.AssignOnOrder = formValue.AssignOnOrder;
    model.AssignOnPattern = formValue.AssignOnPattern;
    model.AssignOnBillDraft = formValue.AssignOnBillDraft;
    model.AssignOnBillPrint = formValue.AssignOnBillPrint;
    model.AssignOnBillPrintShip = formValue.AssignOnBillPrintShip;
    model.TagOnPattern = formValue.TagOnPattern;
    model.TagOnPhone = formValue.TagOnPhone;
    model.TagOnOrder = formValue.TagOnOrder;
    model.TagOnBillDraft = formValue.TagOnBillDraft;
    model.TagOnBillPrint = formValue.TagOnBillPrint;
    model.TagOnBillPrintShip = formValue.TagOnBillPrintShip;

    if(TDSHelperArray.hasListValue(formValue.TagOnPattern)) {
      model.TagOnPattern = formValue.TagOnPattern.map((tag: TagControlLabelDTO) => {
        tag.CrmKey = tag.CrmKey.toString();
        return tag;
      });
    }

    return model;
  }

  isCheckValue(): number {
    let isAssignOnPattern = this.formLabelConfig.value.AssignOnPattern;

    if(isAssignOnPattern === true) {
      let tagOnPattern: TagControlLabelDTO[] = this.formLabelConfig.value.TagOnPattern;

      if(!TDSHelperArray.hasListValue(tagOnPattern)) {
        this.message.error(Message.ConversationPost.TagOnPatternEmpty);
        return 0;
      }

      let checkTagOnPattern = tagOnPattern.findIndex(x => !TDSHelperString.hasValueString(x.CrmKey) || !TDSHelperObject.hasValue(x.CrmTag));

      if(checkTagOnPattern > -1) {
        this.message.error(Message.ConversationPost.TagOnPatternEmpty);
        return 0;
      }
    }

    return 1;
  }

  onCannel() {
    this.modalRef.destroy(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
