export type NavItem = {
  href: string;
  label: string;
  isActive: (pathname: string, hash: string) => boolean;
};

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/kaip-veikia",
    label: "Kaip veikia",
    isActive: (p) => p === "/kaip-veikia",
  },
  {
    href: "/funkcijos",
    label: "Funkcijos",
    isActive: (p) => p === "/funkcijos",
  },
  {
    href: "/kainos",
    label: "Kainos",
    isActive: (p) => p === "/kainos",
  },
  {
    href: "/duk",
    label: "DUK",
    isActive: (p) => p === "/duk",
  },
  {
    href: "/kontaktai",
    label: "Kontaktai",
    isActive: (p) => p === "/kontaktai",
  },
];
