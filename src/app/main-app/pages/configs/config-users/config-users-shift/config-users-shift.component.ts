import { addDays, getISODay, getISOWeek } from 'date-fns';
import { ModalListShiftComponent } from './../../components/modal-list-shift/modal-list-shift.component';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { startOfWeek, endOfWeek } from 'date-fns';
import { formatDate } from '@angular/common';
import { ApplicationUserService } from 'src/app/main-app/services/application-user.service';
import { ApplicationUserDTO, ApplicationUserShiftDTO, ShiftDTO, UserUpdateShiftDTO } from 'src/app/main-app/dto/account/application-user.dto';
import { Message } from 'src/app/lib/consts/message.const';
import { finalize } from 'rxjs/operators';
import { TDSModalService } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';
import { TDSHelperArray, TDSHelperObject, TDSSafeAny } from 'tds-ui/shared/utility';

@Component({
  selector: 'app-config-users-shift',
  templateUrl: './config-users-shift.component.html'
})
export class ConfigUsersShiftComponent implements OnInit {
  visible: boolean = false;
  indClickTag = "";
  isChooseWeek = -1;
  isChooseDayOfWeek = -1;

  public listFilter: Array<{ text: string, value: number }> = [
    { text: "Tuần này", value: 1 },
    { text: "Tuần trước", value: 2 },
    { text: "Tuần sau", value: 3 },
    { text: "Tháng này", value: 4 },
    { text: "Quý này", value: 5 }
  ];

  listDataWeek = [
    { id: 0, week: 12, date: '21/03', dayOfWeek: 'Thứ 2', workingDay: new Date() },
    { id: 1, week: 12, date: '22/03', dayOfWeek: 'Thứ 3', workingDay: new Date() },
    { id: 2, week: 12, date: '23/03', dayOfWeek: 'Thứ 4', workingDay: new Date() },
    { id: 3, week: 12, date: '24/03', dayOfWeek: 'Thứ 5', workingDay: new Date() },
    { id: 4, week: 12, date: '25/03', dayOfWeek: 'Thứ 6', workingDay: new Date() },
    { id: 5, week: 12, date: '26/03', dayOfWeek: 'Thứ 7', workingDay: new Date() },
    { id: 6, week: 12, date: '27/03', dayOfWeek: 'Chủ nhật', workingDay: new Date() },
  ];
  public modelShifts = [];

  startOFWeek!: Date;
  endOFWeek!: Date;

  currentDateFormat: string = formatDate(new Date(), 'dd/MM', 'en-US');
  dayOFWeek: Date = new Date();

  lstShifts: ShiftDTO[] = [];
  lstUserShifts: ApplicationUserDTO[] = [];

  isLoading: boolean = false;

  constructor(
    private modalService: TDSModalService,
    private message: TDSMessageService,
    private applicationUserService: ApplicationUserService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.loadDate();
    this.loadUserShifts();
    this.loadShifts();
  }

  loadUserShifts() {
    this.isLoading = true;
   
    this.applicationUserService.getUserShifts()
      .pipe(finalize(() => {this.isLoading = false }))
      .subscribe(res => {
        this.lstUserShifts = res;
      });
  }

  loadShifts() {
    this.applicationUserService.getShifts().subscribe(res => {
      this.lstShifts = res.value;
    });
  }

  loadDate(date = new Date) {
    this.startOFWeek = startOfWeek(date, { weekStartsOn: 1 });
    this.endOFWeek = endOfWeek(date, { weekStartsOn: 1 });

    let dayOFWeek = this.getLastWeek(this.endOFWeek);

    dayOFWeek.forEach((x, index) => {
      this.listDataWeek[index].date = formatDate(x, 'dd/MM', 'en-US');
      this.listDataWeek[index].workingDay = x;
    });
    this.listDataWeek[6].date = formatDate(this.endOFWeek, 'dd/MM', 'en-US');
    this.listDataWeek[6].workingDay = this.endOFWeek;
  }

  getLastWeek(date: Date) {
    let weekdays = [...Array(6).keys()].map((i: any) => startOfWeek(date, { weekStartsOn: i + 1}) );
    return weekdays;
  }

  onLastWeek() {
    this.dayOFWeek = addDays(this.dayOFWeek, -7);
    this.loadDate(this.dayOFWeek);
  }

  onNextWeek() {
    this.dayOFWeek = addDays(this.dayOFWeek, +7);
    this.loadDate(this.dayOFWeek);
  }

  formatDate(day: Date | undefined) {
    return day && formatDate(day, 'dd/MM', 'en-US');
  }

  onFilter(value: TDSSafeAny) {
    console.log(value);
    this.message.info(Message.FunctionNotWorking);
  }

  close(): void {
    this.visible = false;
  }

  apply(): void {
    this.visible = false;
  }

  change(value: boolean): void {
    console.log(value);
  }

  openTag(id: string, week: number, dayOfWeek: number) {
    this.indClickTag = id;
    this.isChooseWeek = week;
    this.isChooseDayOfWeek = dayOfWeek;
  }

  closeTag() {
    this.indClickTag = "";
    this.modelShifts = [];
  }

  assignTags(user: ApplicationUserDTO, workingDay: Date) {
    if(!TDSHelperArray.hasListValue(this.modelShifts)) {
      this.message.error(Message.EmptyData);
      return;
    }

    let model: UserUpdateShiftDTO = {
      WorkingDay: new Date(workingDay.setDate(workingDay.getDate() + 1)),
      Shifts: this.modelShifts
    }

    this.isLoading = true;

    this.applicationUserService.updateUserShifts(user.Id, model)
      .pipe(finalize(() => {this.isLoading = false }))
      .subscribe(res => {
        this.message.success(Message.SaveSuccess);
        this.closeTag();
        this.loadUserShifts();
      }, error => {
        if(error?.error?.message) this.message.error(error?.error?.message);
        else this.message.error(Message.ErrorOccurred);
      });
  }

  showModalListShift() {
    const modal = this.modalService.create({
      title: 'Danh sách ca làm việc',
      content: ModalListShiftComponent,
      size: 'lg',
      viewContainerRef: this.viewContainerRef,
    });
    modal.afterOpen.subscribe(() => console.log('[afterOpen] emitted!'));
    modal.afterClose.subscribe((result) => {
      console.log('[afterClose] The result is:', result);
      if (TDSHelperObject.hasValue(result)) {
      }
    });
  }
}
