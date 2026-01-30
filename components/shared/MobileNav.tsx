"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

interface MobileNavProps {
    user?: User;
}

export default function MobileNav({ user }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const navLinks = [
        { name: "Courses", href: "/courses" },
        { name: "Admissions", href: "/admissions" },
        { name: "Why Us", href: "/about" },
        { name: "Careers", href: "/careers" },
    ];

    useEffect(() => {
        let mounted = true;
        const loadRole = async () => {
            if (!user?.email && !user?.id) {
                if (mounted) setIsAdmin(false);
                return;
            }

            try {
                const res = await fetch('/api/user/session');
                if (!res.ok) {
                    if (mounted) setIsAdmin(false);
                    return;
                }
                const data = await res.json();
                const role = data?.user?.role ?? null;
                if (mounted) setIsAdmin(role === 'ADMIN');
            } catch (err) {
                console.log(err);
                
                if (mounted) setIsAdmin(false);
            }
        };

        loadRole();
        return () => { mounted = false; };
    }, [user?.id, user?.email]);

    return (
        <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-foreground">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-75 border-l border-border bg-background sm:w-87.5">
                    <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>

                    <div className="flex flex-col gap-6 mt-20 p-4">

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
                                    {isAdmin && (
                                        <Link href="/admin/hiring" onClick={() => setIsOpen(false)}>
                                            <Button className="w-full mb-2 bg-accent text-accent-foreground font-bold hover:bg-accent/90" size="lg">
                                                Admin Panel
                                            </Button>
                                        </Link>
                                    )}
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