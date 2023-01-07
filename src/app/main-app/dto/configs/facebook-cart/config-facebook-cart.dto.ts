
export interface ConfigFacebookCartDTO {
  IsApplyConfig: boolean;// Bật cho phép áp dụng cấu hình giỏ hàng - Chỉ xem
  IsUpdatePartnerInfo: boolean;// Cập nhật thông tin khách hàng
  IsUpdateQuantity: boolean;// Cập nhật số lượn
  IsCheckout: boolean;// Cho phép thanh toán
  IsCancelCheckout: boolean;// Cho phép hủy thanh toán (xóa đơn hàng)
  IsBuyMore: boolean;// Cho phép mua thêm
  IsUpdate: boolean;// Chp phép cập nhật giỏ hàng
  IsUpdateNote: boolean;// Cập nhật ghi chú
  IsRemoveProduct: boolean;//Cho phép xóa sản phẩm mua được
  IsRemoveProductInValid: boolean;// Cho phép xóa sản phẩm không hợp lệ
  IsDisplayInventory: boolean;// Cho phép hiện tồn kho
  IsMergeOrder: boolean;// Cho phép khách hàng gộp phiếu bán hàng trên giỏ hàng
  IsShopCart: boolean;// Hiển thị thông tin sản phẩm giỏ hàng
}
