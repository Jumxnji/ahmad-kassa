import { PRIMARY_NAV } from "@/constants/navigation";
import { NavLink } from "@/components/navigation/nav-link";

export function MainNav() {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.href} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
