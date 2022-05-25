import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Observable, Subject } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { FacebookPostItem } from "src/app/main-app/dto/facebook-post/facebook-post.dto";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService, TDSSafeAny } from "tmt-tang-ui";

@Component({
  selector: 'post-order-config',
  templateUrl: './post-order-config.component.html'
})

export class PostOrderConfigComponent implements OnInit, OnDestroy {
  _form!: FormGroup;
  @Input() data!: FacebookPostItem;
  tags: any[] = [];
  fbid: any;
  isLoading: boolean = false;
  dataModel: any;
  private destroy$ = new Subject();

  constructor(private fb: FormBuilder,
    private message: TDSMessageService,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService) {
      this.createForm();
  }

  createForm() {
    this._form = this.fb.group({
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

  ngOnInit(): void {
    this.fbid = this.data?.fbid;
    this.facebookPostService.getAutoLabelConfigs(this.fbid)
      .pipe(takeUntil(this.destroy$)).pipe(finalize(() => { this.isLoading = false }))
      .subscribe((res: any) => {
          this.dataModel = res;;
          this.updateForm(res);
    });
    this.crmTagService.dataActive$.subscribe((res: any) => {
      this.tags = res;
    })
  }

  updateForm(data: any) {
    if (data.TagOnPattern) {
      data.TagOnPattern.forEach((element: any) => {
          element["CrmKey"] = element["CrmKey"].split(",");
          this.addCRMKeyTag(element)
      });
    }
    this._form.patchValue(data);
  }

  addCRMKeyTag(data :any) {
    const model = <FormArray>this._form.controls['TagOnPattern'];
    model.push(this.initCRMKeyTag(data));
  }

  initCRMKeyTag(data: any | null) {
    if (data != null) {
      return this.fb.group({
        CrmTag: [data.CrmTag],
        CrmKey: [data.CrmKey]
      });
    } else {
      return this.fb.group({
        CrmTag: [null],
        CrmKey: [[]],
      });
    }
  }

  getControls(){
    return (<FormArray>this._form.controls['TagOnPattern'] as any).controls;
  }

  deleteCRMKeyTag(i: number) {
    const model = <FormArray>this._form.controls['TagOnPattern'];
    model.removeAt(i);
  }

  onSave(): any {
    let model = this.prepareModel() as any;
    if(this._form.controls['AssignOnPattern'].value == true) {
      let checkArr = this._form.controls["TagOnPattern"].value;
      if (checkArr.length == 0 ) {
          return this.message.error("Vui lòng nhập đầy đủ nhãn và nội dung.");
      }
      checkArr.filter((x: any): any => {
        if (x["CrmKey"].length == 0 || !x["CrmTag"]) {
           this.message.error("Vui lòng nhập đầy đủ nhãn và nội dung.");
           return false;
        }
      });
      model.TagOnPattern = model.TagOnPattern.map((element: any, i: number) => {
        return {
            CrmKey: element["CrmKey"].join(","),
            CrmTag: element["CrmTag"],
        }
      });
    }

    this.facebookPostService.updateAutoLabelConfigs(this.fbid, model).subscribe((res: any) => {
      this.message.success("Cập nhật cấu hình thành công");
    });
  }

  changeTagOnPhone(event: any): void {

  }

  prepareModel(): any {
    let formModel = this._form.value;
    let model: any = {
      AssignOnPhone: formModel.AssignOnPhone as boolean,
      AssignOnOrder: formModel.AssignOnOrder as boolean,
      AssignOnPattern: formModel.AssignOnPattern as boolean,
      AssignOnBillDraft: formModel.AssignOnBillDraft as boolean,
      AssignOnBillPrint: formModel.AssignOnBillPrint as boolean,
      AssignOnBillPrintShip: formModel.AssignOnBillPrintShip as boolean,
      TagOnPattern: formModel.TagOnPattern,
      TagOnPhone: formModel.TagOnPhone,
      TagOnOrder: formModel.TagOnOrder,
      TagOnBillDraft: formModel.TagOnBillDraft,
      TagOnBillPrint: formModel.TagOnBillPrint,
      TagOnBillPrintShip: formModel.TagOnBillPrintShip
    };

    return model;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public listSelected =[1,2];

  public listData = [
      { id: 1, name: 'Nguyễn Minh Quân' },
      { id: 2, name: 'Nguyễn Vinh Quang' },
      { id: 3, name: 'Paul McCartney' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'Elvis Presley' },
      { id: 6, name: 'Paul McCartney' }
  ]

  onModelChange(e:TDSSafeAny)
    {
        console.log(e)
    }

}
