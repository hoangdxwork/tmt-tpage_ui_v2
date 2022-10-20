import { addDays } from 'date-fns';
import { TDSDestroyService } from 'tds-ui/core/services';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterObjSOOrderModel, TabNavsDTO } from 'src/app/main-app/services/mock-odata/odata-saleonlineorder.service';
import { TDSHelperArray, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { AllFacebookChildTO } from '@app/dto/team/all-facebook-child.dto';
import { CRMTeamService } from '@app/services/crm-team.service';
import { map, Observable, takeUntil } from 'rxjs';
import { LiveCampaignModel } from '@app/dto/live-campaign/odata-live-campaign-model.dto';
import { LiveCampaignService } from '@app/services/live-campaign.service';

@Component({
  selector: 'order-filter-options',
  templateUrl: './filter-options.component.html',
  providers: [TDSDestroyService]
})

export class FilterOptionsComponent implements OnInit {

  @Output() onLoadOption = new EventEmitter<TDSSafeAny>();
  @Input() tabNavs!: TabNavsDTO[];
  @Input() summaryStatus: Array<TabNavsDTO> = [];
  @Input() lstDataTag: Array<TDSSafeAny> = [];
  @Input() filterObj!: FilterObjSOOrderModel;
  @Input() isLiveCamp!: boolean;

  datePicker: any[] = [addDays(new Date(), -30), new Date()];
  lstTags: Array<TDSSafeAny> = [];
  selectTags: Array<TDSSafeAny> = [];
  selectTeams: TDSSafeAny;
  selectCampaign: TDSSafeAny;
  listStatus: Array<TDSSafeAny> = [];
  lstTeams!: Observable<AllFacebookChildTO[]>;
  lstCampaign!: LiveCampaignModel[];

  isActive: boolean = false;
  isVisible: boolean = false;

  constructor(
    private cdr : ChangeDetectorRef,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService,
    private liveCampaignService: LiveCampaignService) {
  }

  ngOnInit(): void {
    this.lstTeams = this.loadAllFacebookChilds();
    this.loadLiveCampaign();
  }

  loadSummaryStatus() {
    this.listStatus = this.summaryStatus.map(f => {
      return {
        Name: f.Name,
        Index: f.Index,
        Total: f.Total,
        IsSelected: this.filterObj? (this.filterObj.status?.includes(f.Name)? true: false ) : false
      }
    });

    this.cdr.detectChanges();
  }

  loadAllFacebookChilds() {
    return this.crmTeamService.getAllFacebookChildsV2().pipe(map(res => res));
  }

  // loadCampaign() {
  //     this.odataLiveCampaignService.getView('').subscribe({
  //         next: (res: any) => {
  //             delete res['@odata.context'];
  //             this.lstCampaign = res.value;
  //         },
  //     })
  // }

  loadLiveCampaign(text?: string) {
    this.liveCampaignService.getAvailables(text).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
          delete res['@odata.context'];
          this.lstCampaign = [...res.value];
      },
    })
  }

  onChangeTeams(event: any) {
    this.filterObj.teamId = event;
  }

  onChangeCampaign(event: any) {
    this.filterObj.liveCampaignId = event;
  }

  onSearchLiveCampaign(event: any) {
    let text = '';
    if (TDSHelperString.hasValueString(event)) {
        text = event;
        text = TDSHelperString.stripSpecialChars(text.toLocaleLowerCase()).trim();
    }
    this.loadLiveCampaign(text);
  }

  onChangeDate(event: any[]) {
    this.datePicker = [];
    if(event) {
      event.forEach(x => {
          this.datePicker.push(x);
      })
    }
  }

  onChangeTags(event: Array<TDSSafeAny>): void {
    this.selectTags = [];
    if(event){
      event.forEach(x => {
          this.selectTags.push(x);
      })
    }
    this.filterObj.tags = this.selectTags;
  }

  selectState(event: any): void {
    if(this.filterObj && this.filterObj.status && this.filterObj.status.includes(event.Name)) {
        this.filterObj.status = this.filterObj.status.filter((x: any) => !(x == event.Name));
    } else {
        this.filterObj.status = [...(this.filterObj.status || []), ...[event.Name]];
    }
    this.checkActiveStatus();
  }

  checkActiveStatus(){
    this.listStatus.map(stt=>{
      stt.IsSelected = this.filterObj.status.some(f=>f == stt.Name);
    })
  }

  onApply() {
    if(this.datePicker){
      this.filterObj.dateRange = {
        startDate: this.datePicker[0],
        endDate: this.datePicker[1]
      }
    }

    this.isActive = true;
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  checkActive(): boolean {
    let exist = TDSHelperArray.hasListValue(this.filterObj.tags) || TDSHelperArray.hasListValue(this.filterObj.status);
    if(exist) {
      return true;
    } else {
      return false;
    }
  }

  onCancel() {
    this.datePicker = [addDays(new Date(), -30), new Date()];
    this.selectTags = [];
    this.selectTeams = null;
    this.selectCampaign = null;

    this.filterObj = {
      tags: [],
      status: [],
      searchText: '',
      dateRange:  {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
      },
      liveCampaignId: null,
    };

    this.isActive = false;
    this.checkActiveStatus();
    this.onLoadOption.emit(this.filterObj);
    this.closeMenu();
  }

  closeMenu(): void {
    this.isVisible = false;
  }
}
