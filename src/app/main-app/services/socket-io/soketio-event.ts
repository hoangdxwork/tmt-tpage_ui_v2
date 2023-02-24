
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
  chatomniCreatePost = "chatomni.create-post",
  producttemplate_create = "created",
  chatomniPostLiveConnected = "chatomni.post-live-connected",
  chatomniPostNotExist = "chatomni.post-not-exist",
  chatomniPostLiveDisconnected = "chatomni.post-live-disconnected",
  facebookShareds = "facebook.shareds"
}
