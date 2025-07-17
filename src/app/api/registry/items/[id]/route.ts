import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove a registry item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    }
    await prisma.registryPurchase.delete({ where: { id } });
    return NextResponse.json({ message: 'Registry item deleted successfully' });
  } catch (error) {
    console.error('Error deleting registry item:', error);
    return NextResponse.json({ message: 'Failed to delete registry item' }, { status: 500 });
  }
}

// PUT - Update a registry item (status, name, url, image, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    }
    const body = await request.json();
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if ('purchaserName' in body) updateData.purchaserName = body.purchaserName;
    if ('purchaserMessage' in body) updateData.purchaserMessage = body.purchaserMessage;
    if ('purchasedAt' in body) updateData.purchasedAt = body.purchasedAt;
    if (body.itemName) updateData.itemName = body.itemName;
    if (body.itemUrl) updateData.itemUrl = body.itemUrl;
    if (body.itemImageUrl) updateData.itemImageUrl = body.itemImageUrl;
    const updated = await prisma.registryPurchase.update({ where: { id }, data: updateData });
    return NextResponse.json({ message: 'Registry item updated', item: updated });
  } catch (error) {
    console.error('Error updating registry item:', error);
    return NextResponse.json({ message: 'Failed to update registry item' }, { status: 500 });
  }
} 