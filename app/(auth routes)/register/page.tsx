"use client";

import { registerUser } from "@/actions/register";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react"; // 1. Import signIn helper

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);

        // 2. First, create the account in the database
        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
        } else {
            // 3. ✅ SUCCESS! Account created.
            // Now, instead of redirecting to /login, we log them in immediately.

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            // We use the 'signIn' function with the credentials they just typed
            const loginResult = await signIn("credentials", {
                email,
                password,
                redirect: false, // Don't redirect automatically, we want to control it
            });

            if (loginResult?.error) {
                // This theoretically shouldn't happen if register succeeded, but just in case:
                setError("Account created, but auto-login failed. Please try logging in manually.");
                router.push("/login");
            } else {
                // 4. Auto-login worked! Send them to the home page.
                router.push("/");
                router.refresh();
            }
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-card p-8 shadow-lg rounded-lg space-y-4 border border-border"
            >
                <h2 className="text-2xl font-bold text-center text-foreground">Create Account</h2>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Full Name</label>
                    <input name="name" type="text" required className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="John Doe" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                    <input name="email" type="email" required className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="john@example.com" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Phone</label>
                    <input name="phone" type="tel" className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="9876543210" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
                    <input name="password" type="password" required className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" placeholder="******" />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transition font-semibold shadow-md"
                >
                    Sign Up
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}