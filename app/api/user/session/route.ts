import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    console.error('session route error', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
