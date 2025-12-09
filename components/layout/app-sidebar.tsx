import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { AppTitle } from './app-title'
import { useAuthStore } from "@/stores/useAuthStore";
import { AppTitle } from "./app-title";
import { getSidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { user } = useAuthStore();
  const sidebarData = getSidebarData(user);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        {/* <TeamSwitcher teams={sidebarData.teams} /> */}

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || undefined} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
