import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        programs: [
            { name: "Graphic Design", href: "/courses" },
            { name: "Web Development", href: "/courses" },
            { name: "Video Editing", href: "/courses" },
            { name: "VFX & Animation", href: "/courses" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Admissions", href: "/admissions" },
            { name: "Contact", href: "/contact" },
            { name: "Careers", href: "/careers" },
        ],
        resources: [
            { name: "Student Portal", href: "/dashboard" },
            { name: "Course Catalog", href: "/courses" },
            { name: "FAQs", href: "/faqs" },
            { name: "Blog", href: "/blog" },
        ],
    };

    return (
        <footer className="bg-card py-4 border-t border-primary/10 relative overflow-hidden">
            {/* Gold Accent Line */}
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-premium opacity-20" />

            <div className="container-premium relative z-10 py-20">

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="inline-block">
                            <Image
                                src="/logo.png"
                                alt="YieldMind Academy"
                                width={200}
                                height={70}
                                className="h-auto w-48 object-contain"
                            />
                        </Link>
                        <p className="text-muted-foreground leading-relaxed max-w-sm">
                            Transforming creative passion into professional excellence since 2016.
                            India's premier institute for design, development, and digital arts.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Linkedin, href: "#", label: "LinkedIn" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-3 border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group"
                                >
                                    <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold-gradient">Programs</h3>
                        <ul className="space-y-3">
                            {footerLinks.programs.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm underline-animated inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold-gradient">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm underline-animated inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-gold-gradient">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm underline-animated inline-block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Contact Info Bar */}
                <div className="border-t border-primary/10 pt-12 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 border border-primary/20">
                                <MapPin className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Visit Us</h4>
                                <p className="text-sm text-muted-foreground">
                                    Dehradun, Uttarakhand<br />India
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 border border-primary/20">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Call Us</h4>
                                <p className="text-sm text-muted-foreground">
                                    +91 XXXXX XXXXX
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary/10 border border-primary/20">
                                <Mail className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Email Us</h4>
                                <p className="text-sm text-muted-foreground">
                                    info@yieldmind.academy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} YieldMind Academy. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
