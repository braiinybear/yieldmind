import { auth } from "@/auth" // adjust path if needed

export async function getCurrentUserId() {
  const session = await auth()
  return session?.user?.id || null
}