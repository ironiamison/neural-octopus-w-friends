import { NextResponse } from 'next/server';
import prisma from '@/lib/mongodb';

export async function GET() {
  try {
    // Test Prisma connection by performing a simple query
    await prisma.user.findFirst();

    return NextResponse.json({
      success: true,
      message: 'Database connection successful'
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 