import { TDSMenuDTO } from "tds-ui/menu";

export const ConfigsMenu: Array<TDSMenuDTO> = [
    {
        name: "Cấu hình chung",
        icon: "tdsi-gear-2-fill",
        link: '/configs',
        listChild:[
          {
              name: "Cấu hình chốt đơn",
              link: '/configs/saleorder',
          },
          {
              name: "Cấu hình giỏ hàng",
              link: '/configs/facebook-cart',
          },
          {
              name: "Đối tác giao hàng",
              link: '/configs/delivery-carrier',
          },
      ]
    },
    {
        name: "Thẻ hội thoại",
        icon: "tdsi-tag-fill",
        link: '/configs/conversation-tags',
    },
    {
        name: "Trả lời nhanh",
        icon: "tdsi-chat-fill",
        link: '/configs/auto-reply',
    },
    {
        name: "Tin nhắn SMS",
        icon: "tdsi-email-fill",
        link: '/configs/sms-messages',
    },
    {
        name: "Biến thể sản phẩm",
        icon: "tdsi-variant-fill",
        link: '/configs/product-variant',
    },
    {
        name: "Sản phẩm",
        icon: "tdsi-box-fill",
        link: '/configs/products',
    },
    {
        name: "Hoạt động",
        icon: "tdsi-restore-fill",
        link: '/configs/activities',
    },
    {
        name: "Chương trình khuyến mãi",
        icon: "tdsi-discount-fill",
        link: '/configs/promotions',
    },
    {
        name: "Người dùng",
        icon: "tdsi-group-people-fill",
        link: '/configs/users',
        listChild:[
            {
                name: "Quản lý người dùng",
                link: '/configs/users/operation',
            },
            {
                name: "Phân công hội thoại",
                link: '/configs/users/divide-task',
            },
            {
                name: "Ca làm việc",
                link: '/configs/users/shift',
            },
        ]
    },
    {
        name: "Cài đặt trang",
        icon: "tdsi-facebook-2-fill",
        link: '/configs/pages',
        listChild:[
            {
                name: "Basic",
                link: '/configs/pages/basic',
            },
            {
                name: "Phân công hội thoại",
                link: '/configs/pages/divide-task',
            },
        ]
    },
    {
      name: "Đối tác giao hàng",
      icon: "tdsi-transport-fill",
      link: '/configs/delivery',
  },
]
