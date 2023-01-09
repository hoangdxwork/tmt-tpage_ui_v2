import { Product } from './../../dto/order/so-orderlines.dto';

export enum SocketIoEvent {
  onEvents = "on-events",
}

export enum ChatmoniSocketEventName {
  chatomniOnMessage = "chatomni.on-message",
  chatomniOnUpdate = "chatomni.on-update",
  chatomniMarkseen = "chatomni.on-markseen",
  onCreatedSaleOnline_Order = "created",
  onUpdateSaleOnline_Order = "updated",
  onDeleteSaleOnline_Order = "deleted",
  livecampaign_Quantity_Order_Pending_Checkout = "livecampaign.quantity-order-pending-checkout",
  livecampaign_Quantity_AvailableToBuy = "livecampaign.quantity-available-to-buy",
  livecampaign_CartCheckout = "livecampaign.cart-checkout",
  chatomniPostLiveEnd = "chatomni.post-live-end",
  inventory_updated = "inventory_updated",
  producttemplate_create = "created",
}
