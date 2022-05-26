import { CRMTagDTO } from './../../../../dto/crm-tag/odata-crmtag.dto';
import { CRMTagService } from './../../../../services/crm-tag.service';
import { TDSMessageService, TDSSafeAny } from 'tmt-tang-ui';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Message } from 'src/app/lib/consts/message.const';
import { TagOnPatternDTO } from 'src/app/main-app/dto/configs/page-config.dto';

@Component({
  selector: 'app-config-pages-divide-task',
  templateUrl: './config-pages-divide-task.component.html'
})
export class ConfigPagesDivideTaskComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();

  formAutoLabelConfig!: FormGroup;
  isLoading: boolean = false;
  lstTags!: Observable<CRMTagDTO[]>;
  pageId!: string;

  constructor(
    private crmTeamService: CRMTeamService,
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private crmTagService: CRMTagService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.loadTags();
    this.changeTeam();
  }

  get tagOnPatternFormGroups() {
    return (this.formAutoLabelConfig.get('TagOnPattern') as FormArray).controls;
  }

  createForm() {
    let formArrayTagOnPattern = this.formBuilder.group({
      CrmKey: [[], [Validators.required]],
      CrmTag: [null, [Validators.required]],
    });

    this.formAutoLabelConfig = this.formBuilder.group({
      AssignOnPhone: [false],
      AssignOnOrder: [false],
      AssignOnBillDraft: [false],
      AssignOnBillPrint: [false],
      AssignOnBillPrintShip: [false],
      AssignOnPattern: [false],
      TagOnPhone: [null],
      TagOnOrder: [null],
      TagOnBillDraft: [null],
      TagOnBillPrint: [null],
      TagOnBillPrintShip: [null],
      TagOnPattern: this.formBuilder.array([formArrayTagOnPattern])
    });
  }

  loadTags() {
    this.lstTags = this.crmTagService.dataActive$;
  }

  changeTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if(res && res.Facebook_PageId) {
        this.pageId = res.Facebook_PageId;
        this.loadData(res.Facebook_PageId);
      }
    });
  }

  loadData(pageId: string) {
    this.isLoading = true;
    this.crmTeamService.getChannelAutoLabelConfig(pageId).subscribe(res => {
      this.formAutoLabelConfig.patchValue(res);
      res.TagOnPattern && this.patchValueTagOnPattern(res.TagOnPattern);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }

  patchValueTagOnPattern(tagOnPatterns: TagOnPatternDTO[]) {
    const value = <FormArray>this.formAutoLabelConfig.controls['TagOnPattern'];
    value.clear();

    tagOnPatterns.forEach((tag: TagOnPatternDTO) => {
      let formTag = {
        CrmKey: tag.CrmKey.split(','),
        CrmTag: tag.CrmTag
      }
      this.addCRMKeyTag(formTag);
    });
  }

  onSave() {
    let model = this.prepareAutoLabelConfig();

    this.isLoading = true;
    this.crmTeamService.insertOrUpdateChannelAutoLabelConfig(this.pageId, model).subscribe(res => {
      this.message.success(Message.SaveSuccess);
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      if(error?.error?.message) this.message.error(error?.error?.message);
      else this.message.error(Message.ErrorOccurred);
    });
  }

  prepareAutoLabelConfig() {
    let formValue = this.formAutoLabelConfig.value;

    let model: any = {
      AssignOnPhone: formValue.AssignOnPhone as boolean,
      AssignOnOrder: formValue.AssignOnOrder as boolean,
      AssignOnBillDraft: formValue.AssignOnBillDraft as boolean,
      AssignOnBillPrint: formValue.AssignOnBillPrint as boolean,
      AssignOnBillPrintShip: formValue.AssignOnBillPrintShip as boolean,
      AssignOnPattern: formValue.AssignOnPattern as boolean,
      TagOnPattern: null,
      TagOnPhone: formValue.TagOnPhone,
      TagOnOrder: formValue.TagOnOrder,
      TagOnBillDraft: formValue.TagOnBillDraft,
      TagOnBillPrint: formValue.TagOnBillPrint,
      TagOnBillPrintShip: formValue.TagOnBillPrintShip
    };

    if(formValue.TagOnPattern) {
      model.TagOnPattern = formValue.TagOnPattern.map((tag: TDSSafeAny) => {
        tag.CrmKey = tag.CrmKey.toString();
        return tag;
      });
    }

    return model;
  }

  initCRMKeyTag(data: TDSSafeAny | null) {
    let result = this.formBuilder.group({
      CrmTag: [data?.CrmTag],
      CrmKey: [data?.CrmKey]
    });

    return result;
  }

  addCRMKeyTag(data: TDSSafeAny | null) {
    const value = <FormArray>this.formAutoLabelConfig.controls['TagOnPattern'];
    value.push(this.initCRMKeyTag(data));
  }

  deleteCRMKeyTag(index: number) {
    const value = <FormArray>this.formAutoLabelConfig.controls['TagOnPattern'];
    value.removeAt(index);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
