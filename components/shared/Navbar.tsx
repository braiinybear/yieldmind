import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth"; // Import auth
import UserButton from "./UserButton"; // Re-use the component we made earlier
import MobileNav from "./MobileNav"; // Import the new mobile menu

export default async function Navbar() {
  // 1. Fetch the Session
  const session = await auth();
  const user = session?.user;

  // Navigation Links (Desktop)
  const navLinks = [
    { name: "Courses", href: "/courses" },
    { name: "Admissions", href: "/admissions" },
    { name: "Why Us", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* --- LOGO SECTION --- */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="YieldMind Logo"
              width={160}
              height={50}
              className="w-32 md:w-36 h-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* --- DESKTOP MENU --- */}
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

          <div className="flex items-center gap-4">
            {user ? (
              // ✅ Logged In: Show User Button
              <UserButton user={user} />
            ) : (
              // ❌ Logged Out: Show Login/Enroll
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Log in
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md">
                    Enroll Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        {/* We pass the 'user' prop so the mobile menu knows if we are logged in */}
        <MobileNav user={user} />

      </div>
    </nav>
  );
}