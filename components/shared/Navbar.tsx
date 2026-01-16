"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle, // Accessibility requirement
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation Links
  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Admissions", href: "/admissions" },
    { name: "Why Us", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      {/* Container: Controls max-width for Big Screens */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* --- LOGO SECTION --- */}
        <div className="flex items-center gap-2">
          {/* Replace this with <Image /> when you have the logo file */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Y</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Yield<span className="text-primary">Mind</span>
            </span>
          </Link>
        </div>

        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Log in
            </Button>
            {/* The GOLD Action Button */}
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md">
              Enroll Now
            </Button>
          </div>
        </div>

        {/* --- MOBILE MENU (Visible only on small screens) --- */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            {/* The Slide-Out Drawer */}
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background sm:w-[350px]">
              <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle> {/* Accessibility Fix */}

              <div className="flex flex-col gap-6 mt-6">
                {/* Mobile Logo */}
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white font-bold">Y</span>
                  </div>
                  <span className="text-lg font-bold text-foreground">YieldMind</span>
                </div>

                <div className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)} // Close menu on click
                      className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <Button
                    className="w-full bg-accent text-accent-foreground font-bold hover:bg-accent/90"
                    size="lg"
                  >
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full border-primary/20" size="lg">
                    Log in
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}