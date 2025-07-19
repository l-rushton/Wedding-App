import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all addresses
export async function GET() {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: {
        address: 'asc',
      },
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ message: 'Failed to fetch addresses' }, { status: 500 });
  }
} 