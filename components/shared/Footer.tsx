"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border mt-auto">
            <div className="container px-4 md:px-6 py-12 mx-auto max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="YieldMind Logo"
                                width={140}
                                height={45}
                                className="w-32 h-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Dehradun's premier institute for Graphic Design, Web Development, and VFX. Empowering the next generation of creators.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <Link href="#" className="bg-card p-2 rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all border border-border">
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="bg-card p-2 rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all border border-border">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="bg-card p-2 rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all border border-border">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="bg-card p-2 rounded-full shadow-sm hover:shadow-md hover:text-primary transition-all border border-border">
                                <Twitter className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Programs</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/courses/graphic-design" className="hover:text-primary transition-colors">Graphic Design</Link></li>
                            <li><Link href="/courses/web-development" className="hover:text-primary transition-colors">Web Development</Link></li>
                            <li><Link href="/courses/video-editing" className="hover:text-primary transition-colors">Video Editing</Link></li>
                            <li><Link href="/courses/vfx" className="hover:text-primary transition-colors">VFX & 3D</Link></li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Institute</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/admissions" className="hover:text-primary transition-colors">Admissions</Link></li>
                            <li><Link href="/campus" className="hover:text-primary transition-colors">Campus Life</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>YieldMind Institute, Rajpur Road, Dehradun, Uttarakhand, India 248001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span>admissions@yieldmind.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} YieldMind Institute. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
