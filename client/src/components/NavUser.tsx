import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { checkUser } from "./Auth/Check";
import { useState } from "react";
import AccountDetailModal from "@/pages/Login/AccountDetailModal";
import { getUserByIdAPI, type User } from "@/services/CRUD/CRUD_API_User";
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const users = checkUser();
  const [showDetailAccountModal, setShowDetailAccountModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const handleGetUserByIdAPI = async (id: number) => {
    const data = await getUserByIdAPI(id);
    setSelectedUser(data.data);
    setShowDetailAccountModal(true);
  };
  return (
    <SidebarMenu>
      <AccountDetailModal
        showDetailAccountModal={showDetailAccountModal}
        handleClose={() => setShowDetailAccountModal(false)}
        selectedUser={selectedUser}
      />
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={users?.username} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{users?.username}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {users?.phone}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={users?.username} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {users?.username}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {users?.phone}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  if (users) handleGetUserByIdAPI(users?.id);
                }}
              >
                <IconUserCircle />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Hóa đơn
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Thông báo
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
            >
              <IconLogout />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
