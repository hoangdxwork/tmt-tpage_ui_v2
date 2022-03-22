import { TDSMenuDTO } from "tmt-tang-ui";

export const ReportMenu: Array<TDSMenuDTO> = [
    {
        name: "Hội thoại",
        icon: "tdsi-chat-fill",
        link: '/report/conversations',
    },
    {
        name: "Bài viết",
        icon: "tdsi-edit-paper-fill",
        link: '/report/articles',
    },
    {
        name: "Bán hàng",
        icon: "tdsi-cart-fill",
        link: '/report/sales',
    },
    {
        name: "Trang Facebook",
        icon: "tdsi-facebook-2-fill",
        link: '/report/facebook',
    },
    {
        name: "Nhân viên",
        icon: "tdsi-group-people-fill",
        link: '/report/staffs',
    },
    {
        name: "Nhãn hội thoại",
        icon: "tdsi-tag-fill",
        link: '/report/labels',
    },
]