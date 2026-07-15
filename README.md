# Izzy & Louis — Wedding Website

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI-7-007FFF?logo=mui&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white)

A full-stack wedding website designed and built for our guests. It brings the practical details, personalised invitations, RSVPs, menu selections, gift registry, and guest management into one elegant, mobile-friendly experience.

# Check it out [here](https://izzyandlouiswedding.com)

![Izzy and Louis at Ufton Court](public/images/izzyandlouis_ufton.jpg)

## Highlights

- **Personalised RSVPs** — invitation links can identify an individual guest or an entire household.
- **Menu and dietary choices** — attending guests select each course and can add dietary requirements.
- **Guest dashboard** — add, edit, delete, filter, and bulk-import guests from an admin view.
- **CSV exports** — download RSVP and menu data for easy venue coordination.
- **Gift registry** — manage registry items and prevent already-purchased gifts from being selected twice.
- **Guest information hub** — itinerary, menu, hotels, travel advice, embedded directions, and FAQs.
- **Responsive design** — adaptive navigation and layouts for phones, tablets, and desktops.
- **Personal touches** — a live countdown, animated page transitions, and a photo timeline.

## Built with

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 App Router |
| UI | React 19, Material UI, Emotion |
| Language | TypeScript |
| Data | PostgreSQL, Prisma ORM |
| Integrations | Google Maps Embed API, EmailJS |
| Styling | Custom MUI theme, responsive `sx` styles, Playfair Display |

## How it works

Invitation URLs use an ID such as `/rsvp?id=...`. The API resolves that ID to either one guest or a shared address, allowing everyone in a household to respond together. Submitted attendance, meal choices, and dietary requirements are stored through Prisma.

The `/admin` dashboard provides the operational side of the site: guest-list management, bulk CSV import, response filtering, CSV export, and registry management.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Wedding overview and countdown |
| `/itinerary` | Schedule for the day |
| `/registry` | Gift list and purchase flow |
| `/menu` | Wedding breakfast and evening food |
| `/travel` | Directions, transport advice, and map |
| `/hotels` | Nearby accommodation suggestions |
| `/faqs` | Common questions and contact form |
| `/photos` | Photo timeline |
| `/rsvp` | Guest RSVP and menu selection |
| `/admin` | Guest and registry management |

## Run locally

### Prerequisites

- Node.js 20 or later
- npm
- A PostgreSQL database
- A Google Maps Embed API key for the travel map

### 1. Clone and install

```bash
git clone git@github.com:l-rushton/Wedding-Frontend.git
cd Wedding-Frontend
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE"
ADMIN_PASSWORD="choose-a-password"
NEXT_PUBLIC_GOOGLE_MAPS="your-google-maps-api-key"
```

`DATABASE_URL` is used by Prisma, `ADMIN_PASSWORD` unlocks the admin UI, and `NEXT_PUBLIC_GOOGLE_MAPS` enables the embedded venue map.

### 3. Prepare the database

```bash
npx prisma generate
npx prisma migrate deploy
```

For local schema development, use `npx prisma migrate dev` instead.

### 4. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Generate Prisma Client and create a production build
npm run start    # Run the production server
npm run lint     # Run the configured linter
```

## Project structure

```text
src/
├── app/
│   ├── api/          # RSVP, guest, registry, and admin endpoints
│   ├── components/   # Shared interactive components
│   ├── header/       # Responsive site navigation
│   └── */page.tsx    # App Router pages
└── theme/            # Material UI theme
prisma/
├── migrations/       # Database migrations
└── schema.prisma     # Guest, menu, address, and registry models
public/images/        # Site photography and artwork
```
