import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all guests
export async function GET() {
  try {
    const guests = await prisma.guest.findMany({
      include: {
        address: true,
        menuChoices: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests:', error);
    return NextResponse.json({ message: 'Failed to fetch guests' }, { status: 500 });
  }
}

// POST - Bulk import guests
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { guests } = body;

    console.log('Received guest data:', guests);

    if (!guests || !Array.isArray(guests)) {
      console.error('Invalid guest data:', guests);
      return NextResponse.json({ message: 'Invalid guest data' }, { status: 400 });
    }

    const results = {
      created: 0,
      updated: 0,
      errors: [] as string[],
    };

    for (const guestData of guests) {
      try {
        const { name, address, addressId } = guestData;

        if (!name) {
          results.errors.push(`Guest missing name: ${JSON.stringify(guestData)}`);
          continue;
        }

        let finalAddressId = addressId;

        // If address is provided but no addressId, try to find or create the address
        if (address && !addressId) {
          // First, try to find existing address (exact match)
          const existingAddress = await prisma.address.findFirst({
            where: {
              address: address
            }
          });

          if (existingAddress) {
            finalAddressId = existingAddress.id;
          } else {
            // Create new address
            const newAddress = await prisma.address.create({
              data: { address }
            });
            finalAddressId = newAddress.id;
          }
        }

        // Check if guest already exists (by name and address)
        const existingGuest = await prisma.guest.findFirst({
          where: {
            name: name,
            ...(finalAddressId && { addressId: finalAddressId })
          }
        });

        if (existingGuest) {
          // Update existing guest
          await prisma.guest.update({
            where: { id: existingGuest.id },
            data: {
              name,
              addressId: finalAddressId || null,
            }
          });
          results.updated++;
        } else {
          // Create new guest
          const newGuest = await prisma.guest.create({
            data: {
              name,
              addressId: finalAddressId || null,
            }
          });
          results.created++;
          
          // Log the QR code URL for this guest/address
          if (finalAddressId) {
            console.log(`QR Code for ${name}: /rsvp?id=${finalAddressId}`);
          } else {
            console.log(`Individual QR Code for ${name}: /rsvp?id=${newGuest.id}`);
          }
        }
      } catch (error) {
        console.error('Error processing guest:', guestData, error);
        results.errors.push(`Error processing guest ${guestData.name}: ${error}`);
      }
    }

    return NextResponse.json({
      message: 'Bulk import completed',
      results
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ message: 'Failed to import guests' }, { status: 500 });
  }
} 