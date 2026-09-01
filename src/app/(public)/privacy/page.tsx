import { LegalPage } from "@/components/public/LegalPage";

export const metadata = { title: "Privacy Policy — Mekiya Real Estate" };

export default function PrivacyPage() {
  return (
    <LegalPage
      breadcrumb="Privacy"
      eyebrow="Legal"
      title="Privacy"
      accent="Policy."
      updated="February 2025"
      intro="How Mekiya Real Estate PLC collects, uses, and protects the information you share with us."
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you enquire about a property, schedule a visit, request a valuation, or subscribe to alerts, we collect the details you provide: your name, email address, phone number, and any message or property preferences you include.",
            "We also collect limited technical information automatically, such as which listings you view and how you arrived at our site. This helps us understand which properties are in demand and improve search results.",
            "We do not collect payment card details on our website. All deposit and reservation payments are processed by our payment partners, Chapa and Stripe, who handle card data under their own security standards.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "Your contact details are used to respond to your enquiry, arrange viewings, send the property alerts you requested, and keep you informed about a transaction you are part of.",
            "We use aggregated, non-identifying data to analyse market trends, measure which listings perform well, and improve the platform.",
            "We will never sell your personal information to third parties, and we do not share your details with other buyers, sellers, or advertisers.",
          ],
        },
        {
          heading: "Who has access",
          body: [
            "Within Mekiya, access is limited by role. An agent can see the leads and visit requests assigned to them. Sales managers can see their team's records. Only administrators can access account-level settings.",
            "We share your details with third parties only where necessary to complete a service you have asked for — for example, passing your application to a partner bank when you request mortgage pre-qualification, or to our legal team during a title transfer.",
            "We may disclose information where required by Ethiopian law, a court order, or a lawful request from a regulatory authority.",
          ],
        },
        {
          heading: "Data retention",
          body: [
            "Enquiry and visit records are kept for three years so we can maintain an accurate service history and comply with our record-keeping obligations.",
            "Transaction records relating to completed property sales are retained for the period required under Ethiopian commercial and tax law.",
            "Newsletter subscriptions are kept until you unsubscribe. Every alert email includes a one-click unsubscribe link.",
          ],
        },
        {
          heading: "Your rights",
          body: [
            "You may request a copy of the personal information we hold about you, ask us to correct anything inaccurate, or request deletion where we are not legally required to retain it.",
            "You can opt out of marketing communications at any time without affecting any active transaction or enquiry.",
            "To exercise any of these rights, email legal@mekiya.com. We respond to verified requests within thirty days.",
          ],
        },
        {
          heading: "Cookies",
          body: [
            "We use essential cookies to keep you signed in and remember saved properties on your device. These are required for the site to function.",
            "We use limited analytics cookies to understand aggregate traffic patterns. These do not identify you personally, and you can block them through your browser settings without losing access to any feature.",
          ],
        },
        {
          heading: "Security",
          body: [
            "Data is transmitted over encrypted connections and stored on access-controlled infrastructure. Administrative accounts require authentication, and permissions are enforced at the database level rather than only in the interface.",
            "No system is perfectly secure. If a breach affecting your personal data occurs, we will notify affected individuals and the relevant authorities promptly.",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "We may update this policy as our services change or as regulations evolve. The revision date at the top of this page always reflects the current version.",
            "Where changes materially affect how we handle your information, we will notify subscribers by email before the changes take effect.",
          ],
        },
      ]}
    />
  );
}
