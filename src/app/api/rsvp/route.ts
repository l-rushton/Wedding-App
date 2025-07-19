import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Appetiser, MainCourse, Dessert } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { peopleRSVP, isDirectAccess } = body;

    if (!peopleRSVP || !Array.isArray(peopleRSVP)) {
      return NextResponse.json({ message: 'Invalid RSVP data' }, { status: 400 });
    }

    // Process each person's RSVP
    for (const person of peopleRSVP) {
      const { guestId, name, attending, appetiser, main, dessert, dietaryReqs } = person;

      let currentGuestId = guestId;

      // If this is direct access and no guestId exists, create a new guest
      if (isDirectAccess && !guestId) {
        const newGuest = await prisma.guest.create({
          data: {
            name: name,
            rsvp: attending === 'yes',
            dietaryReqs: attending === 'yes' ? dietaryReqs : null,
            addressId: undefined
          }
        });
        currentGuestId = newGuest.id;
      } else if (guestId) {
        // Update existing guest's RSVP status and dietary requirements
        await prisma.guest.update({
          where: { id: guestId },
          data: {
            rsvp: attending === 'yes',
            dietaryReqs: attending === 'yes' ? dietaryReqs : null
          }
        });
      } else {
        // This shouldn't happen, but handle gracefully
        console.error('No guestId provided and not direct access');
        continue;
      }

      // If attending, update or create menu choices
      if (attending === 'yes') {
        await prisma.menu.upsert({
          where: { guestId: currentGuestId },
          update: {
            appetiser: appetiser as Appetiser,
            main: main as MainCourse,
            dessert: dessert as Dessert
          },
          create: {
            guestId: currentGuestId,
            appetiser: appetiser as Appetiser,
            main: main as MainCourse,
            dessert: dessert as Dessert
          }
        });
      } else {
        // If not attending, remove menu choices if they exist
        await prisma.menu.deleteMany({
          where: { guestId: currentGuestId }
        });
      }
    }

    return NextResponse.json({ 
      message: 'RSVP submitted successfully',
      updatedGuests: peopleRSVP.length
    });

  } catch (error) {
    console.error('RSVP submission error:', error);
    return NextResponse.json({ message: 'Failed to submit RSVP' }, { status: 500 });
  }
} 