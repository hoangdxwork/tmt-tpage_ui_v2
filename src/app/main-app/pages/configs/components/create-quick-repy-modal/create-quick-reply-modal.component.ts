import { TDSDestroyService } from 'tds-ui/core/services';
import { CRMTeamDTO } from '../../../../dto/team/team.dto';
import { CRMTeamService } from '../../../../services/crm-team.service';
import { Observable } from 'rxjs';
import { QuickReplyService } from '../../../../services/quick-reply.service';
import { CreateQuickReplyDTO, QuickReplyDTO, AdvancedTemplateDTO, ButtonsDTO, PagesMediaDTO } from '../../../../dto/quick-reply.dto.ts/quick-reply.dto';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { TDSHelperObject, TDSHelperString, TDSSafeAny } from 'tds-ui/shared/utility';
import { TDSModalRef } from 'tds-ui/modal';
import { TDSMessageService } from 'tds-ui/message';


@Component({
  selector: 'create-quick-reply-modal',
  templateUrl: './create-quick-reply-modal.component.html',
  providers: [TDSDestroyService]
})

export class CreateQuickReplyModalComponent implements OnInit {
  @Input() valueEditId!: TDSSafeAny;

  data$!: Observable<Array<CRMTeamDTO> | null>;

  params!: TDSSafeAny;
  nameTagList: Array<TDSSafeAny> = [
    { id: "Mã đơn hàng", value: "{order.code}" },
    { id: "Mã vận đơn", value: "{order.tracking_code}" },
    { id: "Mã đặt hàng", value: "{placeholder.code}" },
  ];

  contentTagList: Array<TDSSafeAny> = [
    {
      name: 'Khách hàng',
      data: [
        { id: "Tên KH", value: "{partner.name}" },
        { id: "Mã KH", value: "{partner.code}" },
        { id: "Điện thoại KH", value: "{partner.phone}" },
        { id: "Địa chỉ KH", value: "{partner.address}" },
        { id: "Công nợ KH", value: "{partner.debt}}" },
      ]
    },
    {
      name: 'Đơn hàng',
      data: [
        { id: "Mã đơn hàng", value: "{order.code}" },
        { id: "Mã vận đơn", value: "{order.tracking_code}" },
        { id: "Tổng tiền đơn hàng", value: "{order.total_amount}" },
      ]
    },
    {
      name: 'Đặt hàng',
      data: [
        { id: "Mã đặt hàng", value: "{placeholder.code}" },
        { id: "Ghi chú đặt hàng", value: "{placeholder.note}" },
        { id: "Chi tiết đặt hàng", value: "{placeholder.details}" },
        { id: "Tag facebook", value: "{tag}" },
        { id: "Yêu cầu gửi số điện thoại", value: "{required.phone}" },
        { id: "Yêu cầu gửi địa chỉ", value: "{required.address}" },
        { id: "Yêu cầu điện thoại, địa chỉ", value: "{required.phone_address}" },
      ]
    },
  ];

  MessageFormList: Array<TDSSafeAny> = [
    { id: 'generic', value: 'Mẫu chung' },
    { id: 'button', value: 'Mẫu nút' },
    { id: 'media', value: 'Mẫu phương tiện' }
  ];

  buttonTypeList: Array<TDSSafeAny> = [
    { id: "Post Back", value: "postback" },
    { id: "Web Url", value: "web_url" },
    { id: "Phone Number", value: "phone_number" },
  ];

  data: CreateQuickReplyDTO = {
    Active: false,
    SubjectHtml: '',
  };

  dataAdvancedTemplate: AdvancedTemplateDTO = {
    SubTitle: '',
    TemplateType: '',
    Title: '',
    Url: '',
    Buttons: [],
    Pages: [],
    Text: ''
  };

  mediaChannelList: Array<CRMTeamDTO> = [];
  dataMeidaRes: Array<CRMTeamDTO> = [];

  valueEdit!: QuickReplyDTO;
  templateType: string = 'generic';
  messageStructurePart: number = 1;

  selectedIndex = 0;
  imageURL = '';
  currentItem: any;

  formQuickReply!: FormGroup;
  createImageForm!: FormGroup;
  base64textString!: string;
  urlSampleUrl!: string;

  createMessageForm!: FormGroup;
  mediaForm: Array<string> = [];
  buttonFormList: Array<FormGroup> = [];

  isLoading: boolean = false;

  constructor(private modal: TDSModalRef,
    private formBuilder: FormBuilder,
    private message: TDSMessageService,
    private quickReplyService: QuickReplyService,
    private crmTeamService: CRMTeamService,
    private destroy$: TDSDestroyService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadListTeam();
    this.loadData();
    this.getById();
  }

  createForm() {
    this.formQuickReply = this.formBuilder.group({
      active: new FormControl(false),
      command: new FormControl(''),
      bodyHtml: new FormControl(''),
      subjectHtml: new FormControl('', [Validators.required]),
      advancedTemplateRadio: new FormControl(false),
      title: new FormControl(null),
      subTitle: new FormControl(null),
      url: new FormControl(null),
      buttons: new FormControl(null),
      texy: new FormControl(null),
      templateType: new FormControl(null),
      pages: new FormControl(null),
    })

    this.createImageForm = this.formBuilder.group({
      image: new FormControl(''),
    });

    this.createMessageForm = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      subTitle: new FormControl(''),
      text: new FormControl(''),
    });

  }

  loadData() {
    this.currentItem = this.MessageFormList[0];
  }

  getById() {
    if (this.valueEditId) {
      this.isLoading = true
      this.quickReplyService.getById(this.valueEditId).pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (res) => {
            {
              this.valueEdit = res;
              this.updateForm(this.valueEdit);
            }
          },
          error: err => {
              this.isLoading = false
              this.message.error('Load dữ liệu thất bại');
            }
        })
    }
  }

  loadListTeam() {
    this.data$ = this.crmTeamService.onChangeListFaceBook();
    this.data$.pipe(takeUntil(this.destroy$)).subscribe(
      {
        next: dataTeam => {
          if (dataTeam && TDSHelperObject.hasValue(dataTeam)) {
            this.dataMeidaRes = dataTeam;

            this.dataMeidaRes.forEach(data => {

              if (data.Childs!.length == 0) {
                  data.Active = true;
                  data.Facebook_UserName = data.Name
                  this.mediaChannelList.push(data)
              } else {
                data.Active = false;

                data.Childs!.forEach(dataChilds => {
                  dataChilds.Active = false;
                  dataChilds.Facebook_UserName = data.Name
                  this.mediaChannelList.push(dataChilds)
                })
              }
            })
          }
          this.isLoading = false
        },
        error: err => {
          this.isLoading = false
          this.message.error('Lấy dữ liệu page Facebook thất bại !')
        }
      }
    )
  }

  updateForm(data: QuickReplyDTO) {
    const getNormalisedString = (str: any) => (str ?? '').replace(/<\/?[^>]+(>|$)/g, "");
    this.formQuickReply.controls.subjectHtml.setValue(getNormalisedString(data.SubjectHtml) || data.Subject);
    this.formQuickReply.controls.bodyHtml.setValue(getNormalisedString(data.BodyHtml) || data.BodyPlain);
    this.formQuickReply.controls.active.setValue(data.Active);
    this.formQuickReply.controls.command.setValue(data.Command);

    try {
        let templateAd = JSON.parse(data.AdvancedTemplate);

        if (templateAd) {
          this.formQuickReply.controls.advancedTemplateRadio.setValue(true);
          this.createMessageForm.controls.title.setValue(templateAd.Title);
          this.createMessageForm.controls.subTitle.setValue(templateAd.SubTitle);
          this.createMessageForm.controls.text.setValue(templateAd.Text);
          this.createImageForm.controls.image.setValue(templateAd.Url);

          this.templateType = templateAd.TemplateType;

          templateAd.Buttons.forEach((element: ButtonsDTO) => {
            this.addButton(element)
          });
          templateAd.Pages.forEach((element: PagesMediaDTO) => {
            this.addPage(element);
          });
        }

        this.currentItem = this.MessageFormList.find(x=> x.id == this.templateType);

      } catch (error) {
    }

    this.isLoading = false

  }

  addButton(data: ButtonsDTO) {
    const model = this.buttonFormList;
    model.push(this.initButton(data));
  }

  initButton(data: ButtonsDTO) {
    if (data != null) {
      return this.formBuilder.group({
        title: [data.Title],
        payLoad: [data.Payload],
        type: [data.ButtonType],
      });

    } else {
      return this.formBuilder.group({
        title: [null],
        payLoad: [null],
        type: [null],
      });
    }
  }

  addPage(data: PagesMediaDTO) {
    this.mediaForm.push(data.AttachmentId)
  }


  onResetMessageFrom() {
    this.createMessageForm.controls.title.setValue('');
    this.createMessageForm.controls.subTitle.setValue('');
    this.createMessageForm.controls.text.setValue('');
  }

  onChangeRadio(radio: boolean) {
    this.formQuickReply.controls.advancedTemplateRadio.setValue(radio)
    this.mediaForm = []
    this.createImageForm.controls.image.setValue('')
    this.onResetMessageFrom();
  }

  getTemplateType(data: any) {
    this.currentItem = data;
    this.templateType = data.id;
    this.messageStructurePart = 1;
    this.onResetMessageFrom();
    this.createImageForm.controls.image.setValue('')
    this.mediaForm = []

  }

  onCloseActionButton(i: number) {
    this.buttonFormList.splice(i, 1);
  }

  addActionButton() {
    this.buttonFormList.push(
      this.formBuilder.group({
        title: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        payLoad: new FormControl('', [Validators.required]),
      })
    )
  }


  onChangeStructurePart(i: number) {
    this.messageStructurePart = i;
  }

  onChangeTagName(data: string) {
    this.formQuickReply.controls.subjectHtml.setValue(this.formQuickReply.value.subjectHtml.concat(data));
  }

  addTagToContent(listIndex: number, data: string) {
    //add tag to content
    this.formQuickReply.controls.bodyHtml.setValue(this.formQuickReply.value.bodyHtml.concat(data))
  }

  getUrl(ev: any) {
    this.createImageForm.controls.image.setValue(ev)
  }


  cancel() {
    this.modal.destroy(null);
  }

  onSave() {
    let model = this.prepareModel();
    if (!model)
      return

    if (this.valueEditId) {
      this.isLoading = true;
      this.quickReplyService.update(this.valueEditId, model).pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (res: any) => {
            this.isLoading = false;
            this.message.success('Cập nhật trả lời nhanh thành công!');
            this.modal.destroy(true);
          },
          error: error => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Cập nhật trả lời nhanh thất bại!');
            this.modal.destroy(null);
          }
        })
    } else {
      this.isLoading = false;
      this.quickReplyService.insert(model).pipe(takeUntil(this.destroy$)).subscribe(
        {
          next: (res: any) => {
            this.isLoading = false;
            this.message.success('Thêm mới trả lời nhanh thành công!');
            this.modal.destroy(true);
          },
          error: error => {
            this.isLoading = false;
            this.message.error(`${error?.error?.message}` ? `${error?.error?.message}` : 'Thêm mới trả lời nhanh thất bại!');
          }
        })
    }
  }

  prepareModel() {
    let formModelQuickReply = this.formQuickReply.value;
    let formModelCreateMessage = this.createMessageForm.value;
    let formModelCreateImage = this.createImageForm.value

    if (formModelQuickReply.active != null) {
      this.data.Active = formModelQuickReply.active as boolean;
    }
    if (formModelQuickReply.command != null ) {
      this.data.Command = formModelQuickReply.command
    }
    if (formModelQuickReply.bodyHtml != null && !formModelQuickReply.advancedTemplateRadio) {
      this.data.BodyHtml = formModelQuickReply.bodyHtml
    }
    if (formModelQuickReply.subjectHtml != null) {
      this.data.SubjectHtml = formModelQuickReply.subjectHtml;
    }
    if (!TDSHelperString.hasValueString(this.data.SubjectHtml)) {
      this.message.error('Vui lòng nhập tên mẫu');
      return
    }
    if (!TDSHelperString.hasValueString(this.data.BodyHtml) && !formModelQuickReply.advancedTemplateRadio) {
      this.message.error('Vui lòng nhập nội dung');
      return
    }
    if (formModelQuickReply.advancedTemplateRadio) {
      this.dataAdvancedTemplate.Url = formModelCreateImage.image
      if (this.templateType == 'generic') {
        this.dataAdvancedTemplate.Title = formModelCreateMessage.title
        this.dataAdvancedTemplate.SubTitle = formModelCreateMessage.subTitle
      }
      if (this.templateType == 'button') {
        this.dataAdvancedTemplate.Title = formModelCreateMessage.title
        this.dataAdvancedTemplate.Text = formModelCreateMessage.text
      }
      this.dataAdvancedTemplate.TemplateType = this.templateType
      this.dataAdvancedTemplate.Buttons = []
      for (let i = 0; i < this.buttonFormList.length; i++) {
        this.dataAdvancedTemplate.Buttons?.push({
          Title: this.buttonFormList[i].value.title,
          Payload: this.buttonFormList[i].value.payLoad,
          ButtonType: this.buttonFormList[i].value.type,
          Url: ''
        })
      }
      if (this.mediaForm && this.mediaForm.length != 0) {
        this.dataAdvancedTemplate.Pages = []
        this.mediaForm.forEach(el => {
          let data = this.mediaChannelList.find(x => x.ChannelId == el)
          if (data) {
            let model: PagesMediaDTO = {
              AttachmentId: data.ChannelId,
              PageId: data.OwnerId,
              PageName: data.Name
            }
            this.dataAdvancedTemplate.Pages?.push(model)
          }
        })
      }
      if (this.templateType == 'media' && this.dataAdvancedTemplate.Pages?.length == 0) {
        this.message.error('Vui lòng chọn ít nhất 1 kênh cho mẫu phương tiện');
        return
      }
      if (this.templateType == 'generic' && !TDSHelperString.hasValueString(this.dataAdvancedTemplate.Title)) {
        this.message.error("Mẫu chung: Têu đề không được bỏ trống");
        return;
      }

      if (this.templateType == 'button' &&
        (!TDSHelperString.hasValueString(this.dataAdvancedTemplate.Title) || this.dataAdvancedTemplate.Buttons?.length == 0)) {
        this.message.error("Mẫu nút: Têu đề không được bỏ trống và phải có ít nhất một nút");
        return;
      }

      if (this.templateType == 'media' && !TDSHelperString.hasValueString(this.dataAdvancedTemplate.Url)) {
        this.message.error("Mẫu phương tiện: Vui lòng chọn hình ảnh hoặc video");
        return;
      }
      if (this.dataAdvancedTemplate.Buttons) {
        let arrEmpty = this.dataAdvancedTemplate.Buttons?.filter((x) => {
          if (x.Title == '' || x.Payload == '' || x.ButtonType == '') {
            return x
          }
          return
        });
        if (arrEmpty.length > 0) {
          this.message.error("Vui lòng nhập đầy đủ thông tin nút");
          return;
        }
      }
      this.data.AdvancedTemplate = JSON.stringify(this.dataAdvancedTemplate)
    }

    return this.data;
  }
}
