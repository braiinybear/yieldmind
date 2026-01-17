"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

interface MobileNavProps {
    user?: User;
}

export default function MobileNav({ user }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Courses", href: "/courses" },
        { name: "Admissions", href: "/admissions" },
        { name: "Why Us", href: "/about" },
    ];

    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-[300px] border-l border-border bg-background sm:w-[350px]">
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

                    <div className="flex flex-col gap-6 mt-6">
                        {/* Mobile Logo */}
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="YieldMind Logo"
                                width={140}
                                height={40}
                                className="w-32 h-auto object-contain"
                            />
                        </div>

                        {/* Links */}
                        <div className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Auth Buttons */}
                        <div className="mt-4 flex flex-col gap-3">
                            {user ? (
                                // If Logged In
                                <>
                                    <div className="flex flex-col gap-1 mb-2">
                                        <span className="text-sm font-medium text-muted-foreground">Signed in as</span>
                                        <span className="text-sm font-bold">{user.name}</span>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => signOut()}
                                    >
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                // If Logged Out
                                <>
                                    <Link href="/courses" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-accent text-accent-foreground font-bold hover:bg-accent/90" size="lg">
                                            Enroll Now
                                        </Button>
                                    </Link>
                                    <Link href="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full border-primary/20" size="lg">
                                            Log in
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}