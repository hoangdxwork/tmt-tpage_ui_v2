import { SharedService } from 'src/app/main-app/services/shared.service';
import { CRMTeamType } from '@app/dto/team/chatomni-channel.dto';
import { ChatmoniSocketEventName } from '@app/services/socket-io/soketio-event';
import { SocketOnEventService, SocketEventSubjectDto } from '@app/services/socket-io/socket-onevent.service';
import { TDSDestroyService } from 'tds-ui/core/services';
import { PrinterService } from 'src/app/main-app/services/printer.service';
import { TDSMessageService } from 'tds-ui/message';
import { ExcelExportService } from 'src/app/main-app/services/excel-export.service';
import { takeUntil, finalize } from 'rxjs';
import { GetSharedDto, PrintSharesDto, PartnerShareDto } from './../../../dto/conversation/post/get-shared.dto';
import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TDSModalRef } from 'tds-ui/modal';

@Component({
  selector: 'app-shares-detail-modal',
  templateUrl: './shares-detail-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})
export class SharesDetailModalComponent implements OnInit {
  @Input() lstShared: GetSharedDto[] = [];
  @Input() objectId: any;
  @Input() team: any;

  data: PartnerShareDto[] = [];
  ids: string[] = [];

  countTotal: number = 0;
  countPerson: number = 0;
  countSharedGroup: number = 0;
  countSharedPersonal: number = 0;
  
  isLoading: boolean = false;

  constructor(private modalRef: TDSModalRef,
    private socketOnEventService: SocketOnEventService,
    private message: TDSMessageService,
    private excelService: ExcelExportService,
    private printerService: PrinterService,
    private sharedService: SharedService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    if(this.lstShared && this.lstShared.length > 0) {
      this.loadData();
    }

    this.onEventSocket();
  }

  onEventSocket() {
    this.socketOnEventService.onEventSocket().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: SocketEventSubjectDto) => {
          if(!res) return;

          switch(res?.EventName) {
            case ChatmoniSocketEventName.facebookShareds:
              let fbShared = res.Data?.Data;
              let exist = fbShared && this.data && fbShared.ObjectId == this.objectId && fbShared.ChannelId == fbShared.ChannelId && this.team?.Type ==  CRMTeamType._Facebook;
              if(exist) {
                  this.loadSimpleShareds();
              }
              break;
            default: break;
          }
        }
      })
  }

  loadData() {
    this.lstShared.map((x: GetSharedDto) => {
      let personalShares = 0;
      let groupShares = 0;

      if(x?.permalink_url?.includes('/groups/')) {
        groupShares = 1;
      } else {
        personalShares = 1;
      }
     
      this.countTotal = this.countTotal + (groupShares + personalShares);
      this.countSharedGroup = this.countSharedGroup + groupShares;
      this.countSharedPersonal = this.countSharedPersonal + personalShares;

      if(!this.ids.includes(x.from?.id)) {
        this.countPerson = this.countPerson + 1;
        this.ids.push(x.from?.id);

        let item = {
          FbName: x.from?.name,
          FbId: x.from?.id,
          CountSharedGroup: groupShares,
          CountSharedPersonal: personalShares,
          TotalShares: groupShares + personalShares
        } as PartnerShareDto;

        this.data.push({...item});
      } else {
        let index = this.data.findIndex(a => a.FbId == x.from?.id);

        if(index >= 0) {
          this.data[index].CountSharedGroup = this.data[index].CountSharedGroup + groupShares;
          this.data[index].CountSharedPersonal = this.data[index].CountSharedPersonal + personalShares;
          this.data[index].TotalShares = this.data[index].TotalShares + groupShares + personalShares;
        }
      }
    })
  }

  loadSimpleShareds() {
    this.isLoading = true;
    this.sharedService.getSimpleShareds(this.objectId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: GetSharedDto[]) => {
        if(res) {
          this.lstShared = [...res || []];
          this.loadData();
        }

        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message.error(err?.error?.message);
      }
    })
  }

  printFacebookShares(isList: boolean) {
    let model: PrintSharesDto[] = this.data.map((x: PartnerShareDto) => {
      let sharedInfo = this.lstShared.filter(a => a.from?.id == x.FbId);

      return {
        from: sharedInfo[0].from,
        shareds: sharedInfo,
        CountSharedGroup: x.CountSharedGroup || 0,
        CountSharedPersonal: x.CountSharedPersonal || 0
      } as PrintSharesDto;
    })

    this.isLoading = true;

    if(isList) {
      this.printerService.printIP('Facebook/PrintListPartnerShared', model).subscribe({
        next: (res: any) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
        }
      })
    } else {
      this.printerService.printIP('Facebook/PrintPartnerShared', model[0]).subscribe({
        next: (res: any) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.message.error(err?.error?.message);
        }
      })
    }
  }

  printExcelShares() {
    let model = {
      model: { PartnerShares: this.data }
    }

    this.isLoading = true;
    this.excelService.exportPost('/facebook/ExcelShares', model, 'report-shares')
      .pipe(finalize(() => this.isLoading = false)).pipe(takeUntil(this.destroy$)).subscribe();
  }

  onCancel() {
    this.modalRef.destroy(null);
  }
}
