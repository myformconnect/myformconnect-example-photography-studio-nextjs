# Stillframe Studio

Next.js landing page with integrated forms and appointment scheduling powered by MyFormConnect / MyFormCapture.

## Tech Stack

- Next.js (App Router)
- React
- Vanilla CSS

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Default development server runs at `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` to customize form endpoints:

```bash
cp .env.example .env.local
```

Key variables:

- `NEXT_PUBLIC_FORM_ENV`: Active environment (`staging` or `production`).
- `NEXT_PUBLIC_FORM_STAGING_URL` / `NEXT_PUBLIC_FORM_PRODUCTION_URL`: General forms (Enquiry & Exit Intent).
- `NEXT_PUBLIC_SCHEDULING_STAGING_URL` / `NEXT_PUBLIC_SCHEDULING_PRODUCTION_URL`: Booking widget endpoint.

Components configure default form action URLs so all forms function out of the box even without environment variables (scheduling uses the staging URL; other forms use the standard action URL).

## Project Structure

- `src/app/`: Next.js root layout, main page, and `globals.css`.
- `src/components/`:
  - `Hero.js`, `SelectedWork.js`, `StoriesBehindTheFrame.js`, `StudioIntro.js`: Content sections.
  - `EnquirySection.js`: Main project enquiry form.
  - `ContactModal.js`: Direct contact modal dialog.
  - `BookingModal.js`: Scheduling widget modal.
  - `ExitIntentPopup.js`: Exit-intent lead capture modal.
  - `NewsletterForm.js`: Footer newsletter subscription form.
  - `GlobalModals.js`: Central modal state and event listeners.
- `src/lib/`:
  - `siteConfig.js`: Content and studio configuration.
  - `formConfig.js`: Form endpoints resolution and submission helper.
- `public/`: Static images and custom `booking-widget.css`.
