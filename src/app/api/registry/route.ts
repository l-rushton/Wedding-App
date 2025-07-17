import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all purchased registry items
export async function GET() {
  try {
    const purchases = await prisma.registryPurchase.findMany({
      where: {
        status: 'purchased'
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching registry purchases:', error);
    return NextResponse.json({ message: 'Failed to fetch registry purchases' }, { status: 500 });
  }
}

// POST - Mark an item as purchased
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemName, itemUrl, itemImageUrl, purchaserName, purchaserMessage } = body;

    if (!itemName || !itemUrl || !itemImageUrl || !purchaserName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the available item and mark it as purchased
    const existingItem = await prisma.registryPurchase.findFirst({
      where: {
        itemName: itemName,
        itemUrl: itemUrl,
        status: 'available'
      }
    });

    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found or already purchased' }, { status: 404 });
    }

    // Update the item to mark it as purchased
    const purchase = await prisma.registryPurchase.update({
      where: { id: existingItem.id },
      data: {
        status: 'purchased',
        purchaserName,
        purchaserMessage: purchaserMessage || null,
        purchasedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Item marked as purchased successfully',
      purchase 
    });

  } catch (error) {
    console.error('Error creating registry purchase:', error);
    return NextResponse.json({ message: 'Failed to mark item as purchased' }, { status: 500 });
  }
} 