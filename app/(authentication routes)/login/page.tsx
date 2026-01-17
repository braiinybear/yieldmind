"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Helper from client-side library
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // We use the NextAuth 'signIn' function here
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // We handle redirect manually to show errors
        });

        if (result?.error) {
            setError("Invalid email or password.");
        } else {
            // Login successful!
            router.push("/"); // Redirect to Home or Dashboard
            router.refresh(); // Refresh to update the UI (show "Logout" button)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-card p-8 shadow-lg rounded-lg space-y-4 border border-border"
            >
                <h2 className="text-2xl font-bold text-center text-foreground">Login</h2>

                {error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Email</label>
                    <input name="email" type="email" required className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">Password</label>
                    <input name="password" type="password" required className="w-full border border-input p-2 rounded bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-all" />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-2 rounded hover:bg-primary/90 transitionfont-semibold shadow-md"
                >
                    Login
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}