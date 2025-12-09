export const FEATURED_CATEGORIES = [
  { name: "Bàn phím", slug: "ban-phim" },
  { name: "Case", slug: "case" },
  { name: "Chuột", slug: "chuot" },
  { name: "CPU", slug: "cpu" },
  { name: "Laptop", slug: "laptop" },
  { name: "Mainboard", slug: "mainboard" },
  { name: "Màn hình", slug: "man-hinh" },
  { name: "Ổ cứng", slug: "o-cung" },
  { name: "Phụ kiện", slug: "phu-kien" },
  { name: "Nguồn", slug: "psu" },
  { name: "RAM", slug: "ram" },
  { name: "Tai nghe", slug: "tai-nghe" },
  { name: "Tản nhiệt", slug: "tan-nhiet" },
  { name: "Card màn hình", slug: "card-man-hinh" },
] as const;

export const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
    disabled: false,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
    disabled: true,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
    disabled: true,
  },
];
