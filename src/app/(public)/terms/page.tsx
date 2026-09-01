import { LegalPage } from "@/components/public/LegalPage";

export const metadata = { title: "Terms of Service — Mekiya Real Estate" };

export default function TermsPage() {
  return (
    <LegalPage
      breadcrumb="Terms"
      eyebrow="Legal"
      title="Terms of"
      accent="Service."
      updated="February 2025"
      intro="The terms that govern your use of the Mekiya Real Estate platform and our brokerage services."
      sections={[
        {
          heading: "Acceptance of terms",
          body: [
            "By accessing the Mekiya Real Estate website, submitting an enquiry, or engaging our brokerage services, you agree to these terms. If you do not accept them, please do not use the platform.",
            "These terms apply alongside any separate written agreement you sign with us for a specific transaction. Where a signed agreement conflicts with these terms, the signed agreement takes precedence.",
          ],
        },
        {
          heading: "About our listings",
          body: [
            "We take reasonable steps to verify every listing, including reviewing title documents and physically inspecting the property. Listings that pass this process display a Verified badge.",
            "Property details such as size, year built, and amenities are provided by owners and confirmed where possible. Measurements are approximate and should be independently verified before you commit to a purchase.",
            "Prices are indicative and subject to change or withdrawal by the owner at any time. A listing does not constitute a binding offer to sell.",
          ],
        },
        {
          heading: "Viewings and enquiries",
          body: [
            "Scheduling a viewing through the platform creates no obligation on either side. Viewings are free and may be rescheduled or cancelled at any time.",
            "You agree to provide accurate contact information so we can confirm appointments. Repeated failure to attend confirmed viewings without notice may result in us declining further bookings.",
            "Our agents accompany all viewings. Please do not contact property owners or occupants directly outside of arrangements we facilitate.",
          ],
        },
        {
          heading: "Offers, deposits, and reservations",
          body: [
            "Submitting an offer through the platform is an expression of interest, not a legally binding contract. A binding agreement arises only when a written sale agreement is signed by both parties.",
            "Reservation deposits secure a property while paperwork is completed. The amount, holding period, and refund conditions are set out in a written reservation agreement provided before you pay.",
            "We do not accept cash deposits. Payments must be made through Chapa, Stripe, bank transfer, or certified cheque to our corporate account.",
          ],
        },
        {
          heading: "Fees and commission",
          body: [
            "Buyers do not pay Mekiya a listing fee to browse or enquire about properties.",
            "For sellers, commission is agreed in writing before a property is listed and becomes payable only on successful completion of a sale. There are no upfront marketing or photography charges.",
            "Government transfer taxes, notary charges, and registration fees are separate from our commission and are payable by the party specified in the sale agreement.",
          ],
        },
        {
          heading: "Accounts and acceptable use",
          body: [
            "You are responsible for the accuracy of information you submit and for keeping any account credentials confidential.",
            "You may not scrape, republish, or commercially exploit our listing data, photography, or descriptions without written permission.",
            "You may not use the platform to post misleading information, harass our staff or clients, or attempt to gain unauthorised access to any part of the system.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "We provide the platform and our brokerage services with reasonable care and skill. We do not guarantee that a property will be sold, purchased, or leased within any particular timeframe.",
            "To the extent permitted by Ethiopian law, Mekiya Real Estate PLC is not liable for indirect or consequential loss arising from your use of the platform, including lost opportunity or lost profit.",
            "Nothing in these terms limits our liability for fraud or for any liability that cannot lawfully be excluded.",
          ],
        },
        {
          heading: "Governing law",
          body: [
            "These terms are governed by the laws of the Federal Democratic Republic of Ethiopia.",
            "Any dispute arising from these terms or our services will first be addressed through good-faith negotiation. Where that fails, the matter falls under the jurisdiction of the competent courts of Addis Ababa.",
          ],
        },
      ]}
    />
  );
}
