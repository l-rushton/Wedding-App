import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// DELETE - Remove a registry purchase
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Missing ID' }, { status: 400 });
    }

    // Delete the registry purchase
    await prisma.registryPurchase.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Registry purchase deleted successfully' });
  } catch (error) {
    console.error('Error deleting registry purchase:', error);
    return NextResponse.json({ message: 'Failed to delete registry purchase' }, { status: 500 });
  }
} 