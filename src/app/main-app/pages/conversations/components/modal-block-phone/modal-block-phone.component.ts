import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CRMTeamDTO } from 'src/app/main-app/dto/team/team.dto';
import { CRMTeamService } from 'src/app/main-app/services/crm-team.service';
import { Message } from 'src/app/lib/consts/message.const';
import { InputReasonCannelOrderDTO, MDBPhoneReportDTO } from 'src/app/main-app/dto/partner/partner.dto';
import { CRMMatchingService } from 'src/app/main-app/services/crm-matching.service';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperString } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-modal-block-phone',
  templateUrl: './modal-block-phone.component.html'
})
export class ModalBlockPhoneComponent implements OnInit {

  @Input() phone!: string;

  private destroy$ = new Subject();

  reasonBlock!: string;
  currentTeam!: CRMTeamDTO | null;
  isLoading: boolean = false;

  constructor(private crmTeamService: CRMTeamService,
    private modelRef: TDSModalRef,
    private message: TDSMessageService,
    private crmMatchingService: CRMMatchingService) { }

  ngOnInit(): void {
    this.loadCurrentTeam();
  }

  loadCurrentTeam() {
    this.crmTeamService.onChangeTeam().pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.currentTeam = res;
    });
  }

  onSave() {
    if(this.isCheckValue() === 1) {
      let model: InputReasonCannelOrderDTO = {
        phone: this.phone,
        reason: this.reasonBlock,
        company: this.currentTeam?.Name
      }

      this.isLoading = true;
      this.crmMatchingService.addOrUpdatePhoneReport(model)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe(res => {
          this.message.success(Message.Partner.BlockSuccess);
          this.onCancel(res);
        }, error => {
          this.message.error(`${error?.error?.message}` || JSON.stringify(error));
        });
    }
  }

  isCheckValue(): number {
    if(!TDSHelperString.hasValueString(this.reasonBlock)) {
      this.message.error(Message.Partner.ReasonEmpty);
      return 0;
    }
    if(!TDSHelperString.hasValueString(this.currentTeam?.Name)) {
      this.message.error(Message.PageNotExist);
      return 0;
    }
    if(!TDSHelperString.hasValueString(this.phone)) {
      this.message.error(Message.Partner.PhoneEmpty);
      return 0;
    }

    return 1;
  }

  onCancel(result: MDBPhoneReportDTO | undefined = undefined) {
    this.modelRef.destroy(result);
  }

}
