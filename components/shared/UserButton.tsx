"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface UserButtonProps {
  user: {
    name?: string | null;
    email?: string | null;
    id?: string | undefined;
  };
}

export default function UserButton({ user }: UserButtonProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const mounted = true;
    const getRole = async () => {
      try {
        const res = await fetch("/api/user/session");
        if (!res.ok) {
          if (mounted) setIsAdmin(false);
          return;
        }
        const data = await res.json();
        const role = data?.user?.role ?? null;
        if (mounted) setIsAdmin(role === "ADMIN");
      } catch (err) {
        console.log(err);
        
        if (mounted) setIsAdmin(false);
      }
    };
    getRole();
  }, [user.id]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full bg-primary hover:bg-primary/90 transition-colors"
        >
          <span className="text-primary-foreground font-bold text-sm">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 bg-card border-border"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        {/* Conditional navigation */}
        <DropdownMenuItem
          asChild
          className="cursor-pointer focus:bg-secondary focus:text-foreground"
        >
          <Link href={isAdmin ? "/admin" : "/dashboard"}>
            {isAdmin ? "Admin Panel" : "Dashboard"}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut()}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
