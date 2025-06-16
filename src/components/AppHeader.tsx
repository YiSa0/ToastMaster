
"use client";

import { ChefHat, Info, UserCircle, Home, FlaskConical, Trophy, LogIn, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';


export default function AppHeader() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/auth');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold text-foreground hover:text-primary transition-colors">
          <ChefHat className="h-7 w-7 text-primary" />
          <span>Toast Master</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2 flex-wrap justify-end">
           <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              點餐
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/adventurous-toasts" className="flex items-center gap-1">
              <FlaskConical className="h-4 w-4" />
              獵奇圖鑑
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/leaderboards" className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              排行榜
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              關於我們
            </Link>
          </Button>
          
          {loading ? (
             <Button variant="ghost" size="sm" disabled className="flex items-center gap-1">
              載入中...
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || "User"} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.displayName ? user.displayName[0].toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U')}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "使用者"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <UserCircle className="h-4 w-4" />
                    個人資料
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  登出
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={handleLoginClick} className="flex items-center gap-1">
              <LogIn className="h-4 w-4" />
              登入/註冊
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
