export const Message = {
  InsertSuccess: 'Thêm thành công.',
  InsertFail: 'Thêm thất bại!',
  SaveSuccess: 'Lưu thành công.',
  SaveFail: 'Lưu thất bại!',
  DeleteSuccess: 'Xóa thành công.',
  DeleteFail: 'Xóa thất bại.',
  UpdatedSuccess: 'Cập nhật thành công.',
  UpdateQuantitySuccess: 'Cập nhật số lượng thành công',
  UpdateQuantityFail: 'Cập nhật số lượng thất bại',
  UpdatedActiveSuccess: 'Cập nhật trạng thái thành công.',
  UpdatedFail: 'Cập nhật thất bại.',
  ManipulationSuccessful: 'Thao tác thành công.',
  EmptyData: 'Không có dữ liệu!',
  SelectOneLine: 'Vui lòng chọn tối thiểu 1 dòng!',
  ErrorOccurred: 'Đã có lỗi xảy ra',
  PageNotExist: 'Không có kênh nào đang được kết nối.',
  FunctionNotWorking: 'Chức năng chưa hoạt động!',
  CanNotLoadData: 'Không thể tải dữ liệu',
  PartnerNotInfo: 'Không có thông tin khách hàng',
  Error: {
    SeverError: 'Lỗi máy chủ. Vui lòng thử lại sau.'
  },
  Tag: {
    InsertSuccess: 'Gán nhãn thành công!',
    InsertFail: 'Gán nhãn thất bại!',
    UpdateSuccess: 'Cập nhật nhãn thành công!',
    UpdateFail: 'Cập nhật nhãn thất bại!',
  },
  Order: {
    UpdateSuccess: 'Cập nhật đơn hàng thành công.',
    InsertSuccess: 'Thêm đơn hàng thành công.',
    EmptyProduct: 'Hãy nhập sản phẩm!',
    DeleteSuccess: 'Xóa thành công đơn hàng',
    LoadUpdatePartnerFail: 'Không thể cập nhật không tin khách hàng',
    UpdateTax: 'Cập nhật thuế cho đơn hàng thành công.'
  },
  Bill: {
    InsertSuccess: 'Tạo hóa đơn thành công.',
    UpdateSuccess: 'Cập nhật hóa đơn thành công.',
    EmptyProduct: 'Hãy nhập sản phẩm!',
    ErrorEmptyCarrier: 'Vui lòng chọn đối tác giao hàng!',
    ErrorEmptyPartner: 'Vui lòng điền thông tin khách hàng!',
    ErrorConfirmedSate: 'Chỉ xác nhận thanh toán với hóa đơn trạng thái đã xác nhận.',
    PaymentSuccess: 'Thanh toán thành công',
  },
  Message: {
    SendSuccess: 'Gửi tin nhắn thành công.',
  },
  Template: {
    EmptyContent: 'Vui lòng nhập đủ tên và nội dung'
  },
  Product: {
    CanNotLoadData: 'Không thể tải danh sách sản phẩm',
    InsertSuccess: 'Thêm sản phẩm thành công.',
    UpdateListPriceSuccess: 'Cập nhật bảng giá thành công.',
    DefaultProductEmpty: 'Chưa có sản phẩm mặc định'
  },
  ProductCategory: {
    InsertSuccess: 'Thêm nhóm sản phẩm thành công.'
  },
  ProductUOM: {
    InsertSuccess: 'Thêm đơn vị tính thành công.'
  },
  ComboProduct:{
    CanNotLoadData: 'Không thể tải danh sách combo'
  },
  Carrier: {
    EmptyCarrier: "Vui lòng chọn đối tác giao hàng."
  },
  Upload: {
    Failed: 'Tải tệp không thành công.',
    Success: 'Tải tệp thành công.',
    RemoveImageSuccess: 'Xóa ảnh thành công.',
    RemoveCollectionSuccess: 'Xóa bộ sưu tập thành công.',
    NameEmpty: 'Tên không được để trống.',
    SelectAttachmentSuccess: 'Chọn ảnh thành công.',
    CollectionEmpty: 'Chưa chọn bộ sư tập'
  },
  Partner: {
    UpdateStatus: 'Cập nhật trạng thái khách hàng thành công.',
    AddNoteSuccess: 'Thêm ghi chú thành công.',
    RemoveNoteSuccess: 'Xóa ghi chú thành công.',
    ReasonEmpty: 'Hãy nhập lí do.',
    BlockSuccess: 'Chặn thành công.',
    PhoneEmpty: 'Chưa có số điện thoại.',
    UnReportSuccess: 'Bỏ chặn thành công.'
  },
  ConnectionChannel: {
    NotFoundUserPage: 'Không tìm thấy kênh kết nối nào',
    TokenExpires: 'Kết nối trang hết hạn.',
    ChannelExist: 'Kênh đã tồn tại.',
    RefreshTokenSuccess: 'Cập nhật token thành công.',
    RefreshTokenFail: 'Cập nhật token thất bại!',
  },
  Config: {
    PageConfig: {
      ProfileMessagesLimit: 'Menu tương tác đã đạt giới hạn.',
      InfoEmpty: 'Có thông tin bị trống',
      Saved: 'Đã lưu'
    },
    Promotion: {
      PromotionNameEmpty: 'Vui lòng nhập tên chương trình khuyến mãi.',
      ProductBuyEmpty: 'Vui lòng chọn sản phẩm mua.',
      RuleBasedOnEmpty: 'Nhóm sản phẩm không tồn tại.'
    }
  },
  Chatbot: {
    CreateChatbotSuccess: 'Tạo chatbot thành công.',
    OnChatbotSuccess: 'Bật chatbot thành công.',
    OffChatbotSuccess: 'Tắt chatbot thành công.',
  },
  ConversationPost: {
    AddTemplateSuccess: 'Thêm mẫu thành công.',
    ErrorNumberMoreTemplate: 'Số sau không được lớn hơn số trước.',
    AddMoreTemplateSuccess: 'Tạo thành công, nhớ [Lưu cấu hình] trước khi thực hiện thao tác khác.',
    FileNotFormat: 'File không đúng định dạng.',
    TextContentProductEmpty: 'Vui lòng nhập đầy đủ nội dung mẫu.',
    LoadConfigSuccess: 'Tải cấu hình thành công.',
    CanNotLoadOrderConfig: 'Không thể tải cấu hình chốt đơn',
    CanNotLoadInteractionConfig: 'Không thể tải cấu hình tương tác chốt đơn',
    CanNotLoadHiddenCommentConfig: 'Không thể tải cấu hình ẩn bình luận',
    CanNotLoadLabelConfig: 'Không thể tải cấu hình gán thẻ hội thoại',
    CanNotLoadReplyConfig: 'Không thể tải cấu hình phản hồi bình luận',
    updateConfigFail: 'Cập nhật cấu hình thất bại',
    TagOnPatternEmpty: 'Vui lòng nhập đầy đủ nhãn và nội dung.',
    CanNotLoadLiveCampaign: 'Không thể tải dữ liệu chiến dịch',
    CanNotGetProduct: 'Không thể gán sản phẩm'
  },
  LiveCampaign: {
    ErrorNumberDetail: 'Số lượng, số tiền, giới hạn trên đơn không được để trống.',
    ErrorRemoveLine: 'Sản phẩm đã có hóa đơn không thể xóa.',
    MethodPaymentEmpty: 'Chưa có phương thức thanh toán.'
  },
  Inventory: {
    CanNotLoadData: 'Không thể tải danh sách kho',
    CanNotLoadInfo: 'Không thể tải thông tin kho'
  },
  TShop: {
    LoginSuccess: 'Đăng nhập thành công.',
    LoginFail: 'Đăng nhập thất bại.',
  }
}
