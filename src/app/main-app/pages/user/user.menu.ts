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
        link: '/user/firebase-notification',
    },
    {
        name: "Hoạt động",
        icon: "tdsi-restore-fill",
        link: '/user/activities',
    },
    {
        name: "Thông báo 2",
        icon: "tdsi-notification-fill",
        link: '/user/notification',
    },
]
