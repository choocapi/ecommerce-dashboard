import { IUser } from "@/types/user";
import { filterSidebarItemsByPermission } from "@/utils/sidebar-permissions";
import {
  Box,
  Boxes,
  CirclePercent,
  Command,
  Forklift,
  GalleryHorizontalEnd,
  HelpCircle,
  IdCard,
  LayoutDashboard,
  LayoutList,
  MonitorCog,
  Newspaper,
  Package,
  PackageX,
  Rocket,
  Settings,
  ShoppingBag,
  Trello,
  Truck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";
import { type SidebarData } from "../types";

export const getSidebarData = (user: IUser | null): SidebarData => {
  const baseNavGroups = [
    {
      title: "Quản lý",
      items: [
        {
          title: "Bảng điều khiển",
          url: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Bán hàng",
          icon: ShoppingBag,
          items: [
            {
              title: "Đơn hàng",
              url: "/orders",
              icon: Package,
            },
            {
              title: "Yêu cầu trả hàng",
              url: "/return-requests",
              icon: PackageX,
            },
          ],
        },
        {
          title: "Sản phẩm",
          icon: Box,
          items: [
            {
              title: "Sản phẩm",
              url: "/products",
              icon: Boxes,
            },
            {
              title: "Danh mục sản phẩm",
              url: "/categories",
              icon: LayoutList,
            },
            {
              title: "Thương hiệu",
              url: "/brands",
              icon: Trello,
            },
          ],
        },
        {
          title: "Kho hàng",
          icon: Warehouse,
          items: [
            {
              title: "Tồn kho",
              url: "/inventory",
              icon: Forklift,
            },
            {
              title: "Nhà cung cấp",
              url: "/suppliers",
              icon: Truck,
            },
          ],
        },
        {
          title: "Marketing",
          icon: Rocket,
          items: [
            {
              title: "Banner",
              url: "/banners",
              icon: GalleryHorizontalEnd,
            },
            {
              title: "Bài viết",
              url: "/articles",
              icon: Newspaper,
            },
            {
              title: "Mã giảm giá",
              url: "/coupons",
              icon: CirclePercent,
            },
          ],
        },
        {
          title: "Khách hàng",
          url: "/customers",
          icon: Users,
        },
        {
          title: "Nhân viên",
          url: "/staffs",
          icon: IdCard,
        },
      ],
    },
    {
      title: "Khác",
      items: [
        {
          title: "Cài đặt",
          icon: Settings,
          items: [
            {
              title: "Hồ sơ",
              url: "/settings/profile",
              icon: UserCog,
            },
            {
              title: "Cài đặt hệ thống",
              url: "/settings/system",
              icon: MonitorCog,
            },
          ],
        },
        {
          title: "Trợ giúp",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ];

  // Filter all items based on VIEW permissions
  const filteredNavGroups = baseNavGroups
    .map((group) => ({
      ...group,
      items: filterSidebarItemsByPermission(group.items, user),
    }))
    .filter((group) => group.items.length > 0);

  return {
    user: {
      name: "Châu Minh Đương",
      email: "chauminhduong.cmd@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "ACB Computer",
        logo: Command,
        plan: "Cửa hàng bán lẻ máy tính",
      },
    ],
    navGroups: filteredNavGroups,
  };
};
