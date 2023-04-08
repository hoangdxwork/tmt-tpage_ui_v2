import { PrinterService } from './../../../../services/printer.service';
import { takeUntil, finalize } from 'rxjs';
import { ExcelExportService } from './../../../../services/excel-export.service';
import { TDSMessageService } from 'tds-ui/message';
import { TDSModalRef } from 'tds-ui/modal';
import { GetSharedDto, PartnerShareDto, PrintSharesDto } from './../../../../dto/conversation/post/get-shared.dto';
import { TDSDestroyService } from 'tds-ui/core/services';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-modal-post',
  templateUrl: './modal-get-shared.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ TDSDestroyService ]
})
export class ModalGetSharedComponent implements OnInit {
  @Input() lstShares: GetSharedDto[] = [];

  isLoading: boolean = false;
  data: PartnerShareDto[] = [];

  constructor(private modalRef: TDSModalRef,
    private cdr: ChangeDetectorRef,
    private message: TDSMessageService,
    private excelService: ExcelExportService,
    private printerService: PrinterService,
    private destroy$: TDSDestroyService) { }

  ngOnInit(): void {
    if(this.lstShares && this.lstShares.length > 0) {
      this.data = this.lstShares.map(x => {
        return {
          FbName: x.from?.name,
          FbId: x.from?.id,
          CountSharedGroup: x.permalink_url?.includes('/groups/') ? 1 : 0,
          CountSharedPersonal: !x.permalink_url?.includes('/groups/') ? 1 : 0,
          TotalShares: (x.permalink_url?.includes('/groups/') ? 1 : 0) + (!x.permalink_url?.includes('/groups/') ? 1 : 0)
        } as PartnerShareDto
      })
    }
    this.cdr.detectChanges();
  }

  printFacebookShares(shares: GetSharedDto[], isList?: boolean) {
    let data: PrintSharesDto[] = shares.map(x => {
      let sharedInfo = this.lstShares.filter(y => y.id == x.id);
      let countInfo = this.data.find(z => z.FbId == x.from?.id);

      return {
        from: x.from,
        shareds: sharedInfo,
        CountSharedGroup: countInfo?.CountSharedGroup || 0,
        CountSharedPersonal: countInfo?.CountSharedPersonal || 0
      } as PrintSharesDto;
    })

    this.isLoading = true;

    if(isList) {
      this.printerService.printIP('Facebook/PrintListPartnerShared', data).subscribe({
        next: (res: any) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
        },
        error: (error: any) => {
          let err: any;

          if(typeof(error) === "string") {
            err = JSON.parse(error) as any;
          } else {
            err = error;
          }

          this.isLoading = false;
          this.message.error(err?.error?.message || err?.message);
        }
      })
    } else {
      this.printerService.printIP('Facebook/PrintPartnerShared', data[0]).subscribe({
        next: (res: any) => {
          this.printerService.printHtml(res);
          this.isLoading = false;
        },
        error: (error: any) => {
          let err: any;

          if(typeof(error) === "string") {
            err = JSON.parse(error) as any;
          } else {
            err = error;
          }

          this.isLoading = false;
          this.message.error(err?.error?.message || err?.message);
        }
      })
    }
  }

  printExcelShares() {
    let data = {
      model: { PartnerShares: this.data }
    }

    this.isLoading = true;
    this.excelService.exportPost('/facebook/ExcelShares', data, 'report-shares')
      .pipe(finalize(() => this.isLoading = false)).pipe(takeUntil(this.destroy$)).subscribe();
  }

  onCancel() {
    this.modalRef.destroy(null);
  }
}
