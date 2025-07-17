import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all available registry items (not purchased)
export async function GET() {
  try {
    const items = await prisma.registryPurchase.findMany({
      where: {
        status: 'available'
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching registry items:', error);
    return NextResponse.json({ message: 'Failed to fetch registry items' }, { status: 500 });
  }
}

// POST - Add a new registry item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemName, itemUrl, itemImageUrl } = body;

    if (!itemName || !itemUrl || !itemImageUrl) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if item already exists
    const existingItem = await prisma.registryPurchase.findFirst({
      where: {
        itemName: itemName,
        itemUrl: itemUrl,
        status: 'available'
      }
    });

    if (existingItem) {
      return NextResponse.json({ message: 'Item already exists' }, { status: 409 });
    }

    // Create new registry item
    const item = await prisma.registryPurchase.create({
      data: {
        itemName,
        itemUrl,
        itemImageUrl,
        status: 'available'
      },
    });

    return NextResponse.json({ 
      message: 'Registry item added successfully',
      item 
    });

  } catch (error) {
    console.error('Error creating registry item:', error);
    return NextResponse.json({ message: 'Failed to add registry item' }, { status: 500 });
  }
} 