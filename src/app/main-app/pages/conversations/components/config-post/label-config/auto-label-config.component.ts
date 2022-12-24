import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { ChatomniObjectsItemDto } from "@app/dto/conversation-all/chatomni/chatomni-objects.dto";
import { Observable } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { Message } from "src/app/lib/consts/message.const";
import { CRMTagDTO } from "src/app/main-app/dto/crm-tag/odata-crmtag.dto";
import { CRMTagService } from "src/app/main-app/services/crm-tag.service";
import { FacebookPostService } from "src/app/main-app/services/facebook-post.service";
import { TDSMessageService } from "tds-ui/message";
import { TDSModalRef } from "tds-ui/modal";
import { TDSHelperArray, TDSHelperObject, TDSHelperString } from "tds-ui/shared/utility";
import { AutoLabelConfigDTO, TagOnPatternDTO } from '@app/dto/configs/post/post-order-config.dto';

@Component({
  selector: 'auto-label-config',
  templateUrl: './auto-label-config.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TDSDestroyService]
})

export class AutoLabelConfigComponent implements OnInit {

  @Input() data!: ChatomniObjectsItemDto;

  dataModel!: AutoLabelConfigDTO;
  postId!: string;
  lstTagOnPattern: any[] = [];
  isLoading: boolean = false;

  lstTags$!: Observable<CRMTagDTO[]>;

  constructor(private message: TDSMessageService,
    private modalRef: TDSModalRef,
    private facebookPostService: FacebookPostService,
    private crmTagService: CRMTagService,
    private destroy$: TDSDestroyService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.postId = this.data?.ObjectId;
    if(!this.postId) return;
    
    this.loadData();
    this.loadCRMTag();
  }

  loadCRMTag() {
    this.lstTags$ = this.crmTagService.dataActive$.pipe(takeUntil(this.destroy$));
  }

  loadData() {
    this.isLoading = true;

    this.facebookPostService.getAutoLabelConfigs(this.postId).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataModel = {...res};

          if (TDSHelperArray.hasListValue(this.dataModel?.TagOnPattern)) {
            this.lstTagOnPattern = this.dataModel.TagOnPattern?.map(tag => {
              return {
                CrmTag: tag.CrmTag,
                CrmKey: tag.CrmKey?.split(",") || []
              }
            });
          }
          
          this.isLoading = false;
          this.cdRef.detectChanges();
        },
        error:(err) => {
          this.isLoading = false;
          this.message.error(err?.error?.message || Message.ConversationPost.CanNotLoadLabelConfig);
        }
      });
  }

  addCRMKeyTag(){
    this.lstTagOnPattern?.push({
      CrmTag: null,
      CrmKey: []
    })
  }

  deleteCRMKeyTag(index: number) {
    this.lstTagOnPattern?.splice(index, 1);
  }

  changeTagOnPattern(event:string[], index: number) {
    event.forEach(x => {
      if(x.includes(',')){
        this.message.error('Ký tự không hợp lệ');
        event.pop();
      }
    });

    this.lstTagOnPattern[index]!.CrmKey = [...event];
  }

  onSave() {
    if(!this.postId) {
      this.message.error('Cập nhật thất bại');
      return;
    }

    let model = this.prepareModel();

    if(this.isCheckValue(model) === 1) {
      this.isLoading = true;
      this.facebookPostService.onChangeDisable$.emit(true);

      this.facebookPostService.updateAutoLabelConfigs(this.postId, model).pipe(takeUntil(this.destroy$))
        .subscribe({
          next:(res: any) => {
            this.message.success(Message.UpdatedSuccess);
            this.isLoading = false;
            
            this.facebookPostService.onChangeDisable$.emit(false);
            this.cdRef.detectChanges();
          },
          error:(err) => {
            this.isLoading = false;
            this.facebookPostService.onChangeDisable$.emit(false);
            this.message.error(`${err?.error?.message || JSON.stringify(err)}` || Message.ConversationPost.updateConfigFail);
          }
        });
    }
  }

  prepareModel() {
    let model = {...this.dataModel} as AutoLabelConfigDTO;
    model.TagOnPattern = this.lstTagOnPattern?.map((tag: any) => {
      return {
        CrmTag: tag.CrmTag,
        CrmKey: tag.CrmKey?.join(",") || null
      }
    });

    return model;
  }

  isCheckValue(model: AutoLabelConfigDTO): number {
    let isAssignOnPattern = model?.AssignOnPattern;

    if(isAssignOnPattern === true) {
      if(!TDSHelperArray.hasListValue(model?.TagOnPattern)) {
        this.message.error(Message.ConversationPost.TagOnPatternEmpty);
        return 0;
      }

      let checkTagOnPattern = model?.TagOnPattern?.findIndex(x => !TDSHelperString.hasValueString(x.CrmKey) || !TDSHelperObject.hasValue(x.CrmTag)) as number;

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
}
