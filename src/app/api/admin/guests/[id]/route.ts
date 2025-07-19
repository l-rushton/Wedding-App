import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch single guest
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const guest = await prisma.guest.findUnique({
      where: { id: id },
      include: {
        address: true,
        menuChoices: true,
      },
    });

    if (!guest) {
      return NextResponse.json({ message: 'Guest not found' }, { status: 404 });
    }

    return NextResponse.json(guest);
  } catch (error) {
    console.error('Error fetching guest:', error);
    return NextResponse.json({ message: 'Failed to fetch guest' }, { status: 500 });
  }
}

// PUT - Update guest
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, address, addressId } = body;

    let finalAddressId = addressId;

    // If address is provided but no addressId, try to find or create the address
    if (address && !addressId) {
      const existingAddress = await prisma.address.findFirst({
        where: { address: address }
      });

      if (existingAddress) {
        finalAddressId = existingAddress.id;
      } else {
        const newAddress = await prisma.address.create({
          data: { address }
        });
        finalAddressId = newAddress.id;
      }
    }

    const updatedGuest = await prisma.guest.update({
      where: { id: id },
      data: {
        name,
        addressId: finalAddressId || null,
      },
      include: {
        address: true,
        menuChoices: true,
      },
    });

    return NextResponse.json(updatedGuest);
  } catch (error) {
    console.error('Error updating guest:', error);
    return NextResponse.json({ message: 'Failed to update guest' }, { status: 500 });
  }
}

// DELETE - Delete guest
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Delete menu choices first (due to foreign key constraint)
    await prisma.menu.deleteMany({
      where: { guestId: id }
    });

    // Delete the guest
    await prisma.guest.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json({ message: 'Failed to delete guest' }, { status: 500 });
  }
} 