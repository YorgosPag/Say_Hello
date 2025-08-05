import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/header/theme-toggle";
import { UserMenu } from "@/components/header/user-menu";
import { HeaderSearchBar } from "@/components/header/search-bar";
import { QuickAddMenu } from "@/components/header/quick-add-menu";
import { NotificationsPopover } from "@/components/header/notifications-popover";
import { AIAssistantButton } from "@/components/header/ai-assistant-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center px-4 md:px-6 gap-4">
        <SidebarTrigger className="-ml-2" />
        <HeaderSearchBar />
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <QuickAddMenu />
          <Separator orientation="vertical" className="h-6" />
          <AIAssistantButton />
          <NotificationsPopover />
          <ThemeToggle />
          <Separator orientation="vertical" className="h-6" />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
