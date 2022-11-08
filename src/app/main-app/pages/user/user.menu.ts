import { TDSMenuDTO } from "tds-ui/menu";

export const UserMenu: Array<TDSMenuDTO> = [
    {
        name: "Tài khoản",
        icon: "tdsi-user-fill",
        link: '/user/info',
    },
    {
        name: "Gói cước",
        icon: "tdsi-order-fill",
        link: '/user/pack-of-data',
    },
    {
        name: "Thông báo",
        icon: "tdsi-notification-fill",
        link: '/user/notification',
    },
    {
      name: "Firebase",
      icon: "tdsi-notification-fill",
      link: '/user/firebase-notification',
  },
]
