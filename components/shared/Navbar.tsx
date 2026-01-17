import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import UserButton from "./UserButton";
import MobileNav from "./MobileNav";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Admissions", href: "/admissions" },
    { name: "Why Us", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-100 w-full border-b border-primary/10 bg-background/95 backdrop-blur-xl">
      {/* Gold Accent Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent z-10" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="YieldMind Academy"
              width={180}
              height={60}
              className="w-40 md:w-44 h-auto object-contain transition-opacity group-hover:opacity-80"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          <div className="flex gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-accent font-semibold uppercase tracking-wider text-foreground/80 transition-colors hover:text-primary group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-primary to-primary/50 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <UserButton user={user} />
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-foreground hover:text-primary font-accent font-semibold uppercase tracking-wider"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/courses">
                  <button className="btn-gold text-sm py-3 px-6">
                    Enroll Now
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileNav user={user} />

      </div>
    </nav>
  );
}