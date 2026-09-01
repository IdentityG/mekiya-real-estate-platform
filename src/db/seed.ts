import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const pool = new Pool({
    connectionString: "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  });
  const db = drizzle(pool, { schema });

  const adminHash = await bcrypt.hash("admin123", 10);
  const agentHash = await bcrypt.hash("agent123", 10);

  const [admin] = await db
    .insert(schema.users)
    .values({
      email: "admin@mekiya.com",
      passwordHash: adminHash,
      name: "Abebe Kebede",
      role: "super_admin",
      phone: "+251911234567",
      bio: "Founder and CEO of Mekiya Real Estate with over 15 years of experience in the Addis Ababa market.",
      specialty: "CMC Apartments & Commercial",
    })
    .returning();

  const [agent1] = await db
    .insert(schema.users)
    .values({
      email: "sara@mekiya.com",
      passwordHash: agentHash,
      name: "Sara Haile",
      role: "agent",
      phone: "+251922345678",
      bio: "Specialized in apartment sales and rentals across CMC, Bole, and surrounding areas.",
      specialty: "Apartments",
    })
    .returning();

  const [agent2] = await db
    .insert(schema.users)
    .values({
      email: "dawit@mekiya.com",
      passwordHash: agentHash,
      name: "Dawit Tesfaye",
      role: "agent",
      phone: "+251933456789",
      bio: "Commercial real estate expert with deep knowledge of CMC business districts and office buildings.",
      specialty: "Commercial",
    })
    .returning();

  const [agent3] = await db
    .insert(schema.users)
    .values({
      email: "helen@mekiya.com",
      passwordHash: agentHash,
      name: "Helen Mekonnen",
      role: "sales_manager",
      phone: "+251944567890",
      bio: "Sales Manager overseeing all property transactions across CMC and the surrounding neighborhoods.",
      specialty: "Sales Management",
    })
    .returning();

  // ===== Apartment listings (CMC + surrounding areas, by block) =====
  const propertyData = [
    {
      title: "3-Bedroom Apartment in CMC Block 9",
      slug: "apartment-cmc-block-9",
      propertyType: "apartment" as const,
      listingType: "sale" as const,
      status: "published" as const,
      price: 18500000,
      bedrooms: 3, bathrooms: 2, size: 145,
      description:
        "Spacious three-bedroom apartment in a quiet, secure CMC Block 9 building. Bright living and dining area with balcony, modern kitchen with breakfast bar, and a master suite with walk-in closet. Walking distance to CMC Hospital and St. Joseph School. 24/7 security and dedicated parking.",
      address: "CMC Block 9, near CMC Hospital",
      neighborhood: "CMC Block 9",
      block: "CMC Block 9",
      lat: 9.0305, lng: 38.8090,
      amenities: ["Parking", "Elevator", "Security", "Generator", "Water Tank", "Balcony"],
      media: ["/images/prop-apartment.jpg"],
      agentId: agent1.id,
      featured: true, verified: true, views: 412, yearBuilt: 2022, furnished: false,
    },
    {
      title: "Furnished 2-Bedroom in CMC Block 10",
      slug: "apartment-cmc-block-10",
      propertyType: "apartment" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 65000,
      bedrooms: 2, bathrooms: 2, size: 110,
      description:
        "Fully furnished two-bedroom apartment available for long-term rent in CMC Block 10. Open-plan living, equipped kitchen, fast fibre internet, and dedicated parking. Ideal for expats and professionals. Walking distance to CMC Plaza.",
      address: "CMC Block 10, near CMC Plaza",
      neighborhood: "CMC Block 10",
      block: "CMC Block 10",
      lat: 9.0310, lng: 38.8095,
      amenities: ["Furnished", "WiFi", "Parking", "Security", "Elevator", "Generator"],
      media: ["/images/prop-apartment.jpg"],
      agentId: agent1.id,
      featured: false, verified: true, views: 287, yearBuilt: 2021, furnished: true,
    },
    {
      title: "Modern 4-Bedroom in CMC Block 11",
      slug: "apartment-cmc-block-11",
      propertyType: "apartment" as const,
      listingType: "sale" as const,
      status: "published" as const,
      price: 28000000,
      bedrooms: 4, bathrooms: 3, size: 195,
      description:
        "Brand-new four-bedroom apartment on a high floor with panoramic city views. Premium finishes, separate maid's room, two balconies, and a closed kitchen. Building amenities include gym, rooftop terrace, and underground parking.",
      address: "CMC Block 11, near St. Joseph",
      neighborhood: "CMC Block 11",
      block: "CMC Block 11",
      lat: 9.0315, lng: 38.8100,
      amenities: ["Parking", "Elevator", "Gym", "Security", "Generator", "Rooftop Terrace", "Servant Quarters"],
      media: ["/images/prop-penthouse.jpg"],
      agentId: agent1.id,
      featured: true, verified: true, views: 534, yearBuilt: 2023, furnished: false,
    },
    {
      title: "1-Bedroom Apartment in Sarbet",
      slug: "apartment-sarbet",
      propertyType: "apartment" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 35000,
      bedrooms: 1, bathrooms: 1, size: 65,
      description:
        "Cozy one-bedroom apartment in a well-maintained Sarbet building, ten minutes' drive from CMC. Open kitchen, dedicated parking, and a quiet south-facing balcony. Furnished option available for a small premium.",
      address: "Sarbet, near Edna Mall",
      neighborhood: "Sarbet",
      block: "Sarbet",
      lat: 9.0080, lng: 38.7450,
      amenities: ["Parking", "Security", "Water Tank", "Generator"],
      media: ["/images/prop-apartment.jpg"],
      agentId: agent1.id,
      featured: false, verified: true, views: 198, yearBuilt: 2019, furnished: false,
    },
    {
      title: "Executive Studio in Bole Atlas",
      slug: "apartment-bole-atlas",
      propertyType: "apartment" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 48000,
      bedrooms: 0, bathrooms: 1, size: 55,
      description:
        "Bright executive studio with sleeping area, lounge, and a fully equipped kitchenette. Bole Atlas location, walking distance to restaurants and the airport road. Building has backup generator, elevator, and 24/7 security.",
      address: "Bole Atlas, near Edna Mall",
      neighborhood: "Bole Atlas",
      block: "Bole Atlas",
      lat: 9.0054, lng: 38.7636,
      amenities: ["Furnished", "WiFi", "Parking", "Elevator", "Security", "Generator"],
      media: ["/images/prop-apartment.jpg"],
      agentId: agent1.id,
      featured: false, verified: true, views: 312, yearBuilt: 2020, furnished: true,
    },
    {
      title: "Penthouse Apartment, CMC Block 8",
      slug: "apartment-cmc-block-8",
      propertyType: "apartment" as const,
      listingType: "sale" as const,
      status: "published" as const,
      price: 45000000,
      bedrooms: 4, bathrooms: 4, size: 260,
      description:
        "Signature penthouse on the top floor of CMC Block 8's most exclusive tower. Wraparound terrace, four ensuite bedrooms, gourmet kitchen, and a private rooftop with 360° city views. Concierge, gym, and triple parking included.",
      address: "CMC Block 8, premium tower",
      neighborhood: "CMC Block 8",
      block: "CMC Block 8",
      lat: 9.0300, lng: 38.8085,
      amenities: ["Parking", "Elevator", "Gym", "Security", "Generator", "Rooftop Terrace", "Concierge", "WiFi"],
      media: ["/images/prop-penthouse.jpg"],
      agentId: agent1.id,
      featured: true, verified: true, views: 678, yearBuilt: 2024, furnished: false,
    },

    // ===== Commercial listings (CMC + surrounding) =====
    {
      title: "Office Space on Bole Road",
      slug: "commercial-bole-road",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 180000,
      bedrooms: 0, bathrooms: 2, size: 220,
      description:
        "Premium corner office on the main Bole Road, ten minutes from CMC. Open floor plan with executive glass partitions, two private meeting rooms, and a reception area. High-speed fibre, backup generator, and dedicated parking.",
      address: "Bole Road, near Friendship Square",
      neighborhood: "Bole Road",
      block: "Bole Road",
      lat: 9.0054, lng: 38.7636,
      amenities: ["Parking", "Elevator", "Security", "Generator", "Internet Ready", "Conference Room"],
      media: ["/images/prop-commercial.jpg"],
      agentId: agent2.id,
      featured: true, verified: true, views: 421, yearBuilt: 2021, furnished: false,
    },
    {
      title: "Retail Shopfront, CMC Plaza",
      slug: "commercial-cmc-plaza",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 95000,
      bedrooms: 0, bathrooms: 1, size: 95,
      description:
        "Ground-floor shopfront inside the busy CMC Plaza mall. High foot traffic, large display window, air-conditioned, and a back-office stockroom. Ideal for retail, mobile operators, or service businesses.",
      address: "CMC Plaza, Block 9",
      neighborhood: "CMC Plaza",
      block: "CMC Block 9",
      lat: 9.0308, lng: 38.8093,
      amenities: ["Security", "Generator", "Power Supply", "Air Conditioning"],
      media: ["/images/prop-commercial.jpg"],
      agentId: agent2.id,
      featured: false, verified: true, views: 256, yearBuilt: 2018, furnished: false,
    },
    {
      title: "Medical Office in CMC Block 9",
      slug: "commercial-medical-cmc-9",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 120000,
      bedrooms: 0, bathrooms: 2, size: 140,
      description:
        "Purpose-built medical office next to CMC Hospital in Block 9. Reception, two consultation rooms, treatment room, and a private office. Clean water, sterilisation area, and parking for staff and patients.",
      address: "CMC Block 9, near CMC Hospital",
      neighborhood: "CMC Block 9",
      block: "CMC Block 9",
      lat: 9.0306, lng: 38.8091,
      amenities: ["Parking", "Elevator", "Security", "Generator", "Water Tank"],
      media: ["/images/prop-commercial.jpg"],
      agentId: agent2.id,
      featured: true, verified: true, views: 189, yearBuilt: 2020, furnished: false,
    },
    {
      title: "Co-working Floor, Sarbet Heights",
      slug: "commercial-coworking-sarbet",
      propertyType: "commercial" as const,
      listingType: "rent" as const,
      status: "published" as const,
      price: 75000,
      bedrooms: 0, bathrooms: 2, size: 110,
      description:
        "Modern co-working floor in Sarbet Heights, fully equipped with private booths, two meeting rooms, lounge, and a pantry. Twenty minutes from CMC, with shuttle access. Plug-and-play for teams of 10–30.",
      address: "Sarbet Heights, near Edna Mall",
      neighborhood: "Sarbet",
      block: "Sarbet",
      lat: 9.0082, lng: 38.7452,
      amenities: ["WiFi", "Furnished", "Conference Room", "Power Supply", "Generator"],
      media: ["/images/prop-office.jpg"],
      agentId: agent2.id,
      featured: false, verified: true, views: 145, yearBuilt: 2022, furnished: true,
    },
    {
      title: "Showroom, Bole Atlas Commercial Block",
      slug: "commercial-showroom-bole",
      propertyType: "commercial" as const,
      listingType: "sale" as const,
      status: "published" as const,
      price: 42000000,
      bedrooms: 0, bathrooms: 2, size: 320,
      description:
        "Double-height showroom with mezzanine office in the Bole Atlas commercial block. Floor-to-ceiling glass, customer parking, loading access, and a private rear yard. Excellent for vehicle display, furniture, or appliance brands.",
      address: "Bole Atlas commercial block",
      neighborhood: "Bole Atlas",
      block: "Bole Atlas",
      lat: 9.0056, lng: 38.7640,
      amenities: ["Parking", "Security", "Generator", "Loading Dock", "Power Supply"],
      media: ["/images/prop-commercial.jpg"],
      agentId: agent2.id,
      featured: false, verified: true, views: 234, yearBuilt: 2019, furnished: false,
    },
  ];

  await db.insert(schema.properties).values(propertyData);

  // ===== Neighborhoods: CMC + surrounding areas (each area gets a "block" identifier) =====
  await db.insert(schema.neighborhoods).values([
    {
      name: "CMC",
      slug: "cmc",
      description: "Central commercial district with numbered blocks from Block 8 to Block 12",
      avgPrice: 22000000,
      imageUrl: "/images/prop-apartment.jpg",
      lat: 9.0310, lng: 38.8095,
    },
    {
      name: "CMC Block 8",
      slug: "cmc-block-8",
      description: "Premium residential tower zone",
      avgPrice: 38000000,
      imageUrl: "/images/prop-penthouse.jpg",
      lat: 9.0300, lng: 38.8085,
    },
    {
      name: "CMC Block 9",
      slug: "cmc-block-9",
      description: "Hospital and medical district",
      avgPrice: 25000000,
      imageUrl: "/images/prop-apartment.jpg",
      lat: 9.0305, lng: 38.8090,
    },
    {
      name: "CMC Block 10",
      slug: "cmc-block-10",
      description: "Furnished apartments and small offices",
      avgPrice: 19000000,
      imageUrl: "/images/prop-apartment.jpg",
      lat: 9.0310, lng: 38.8095,
    },
    {
      name: "CMC Block 11",
      slug: "cmc-block-11",
      description: "New-build residential with rooftop amenities",
      avgPrice: 28000000,
      imageUrl: "/images/prop-penthouse.jpg",
      lat: 9.0315, lng: 38.8100,
    },
    {
      name: "Bole Atlas",
      slug: "bole-atlas",
      description: "Mixed-use towers near the airport corridor",
      avgPrice: 26000000,
      imageUrl: "/images/prop-apartment.jpg",
      lat: 9.0054, lng: 38.7636,
    },
    {
      name: "Bole Road",
      slug: "bole-road",
      description: "Main commercial spine with retail and office",
      avgPrice: 30000000,
      imageUrl: "/images/prop-commercial.jpg",
      lat: 9.0050, lng: 38.7630,
    },
    {
      name: "Sarbet",
      slug: "sarbet",
      description: "Quiet residential pocket, 10 min from CMC",
      avgPrice: 14000000,
      imageUrl: "/images/prop-apartment.jpg",
      lat: 9.0080, lng: 38.7450,
    },
    {
      name: "CMC Plaza",
      slug: "cmc-plaza",
      description: "Mall retail, mostly shopfronts and services",
      avgPrice: 95000,
      imageUrl: "/images/prop-commercial.jpg",
      lat: 9.0308, lng: 38.8093,
    },
    {
      name: "Sarbet Heights",
      slug: "sarbet-heights",
      description: "Modern co-working and office towers",
      avgPrice: 75000,
      imageUrl: "/images/prop-office.jpg",
      lat: 9.0082, lng: 38.7452,
    },
  ]);

  await db.insert(schema.testimonials).values([
    { name: "Dr. Mulugeta Assefa", role: "Buyer · CMC Block 9", content: "Mekiya helped us find our apartment in CMC Block 9. Their professionalism and knowledge of the market is unmatched. The entire process was smooth and transparent.", rating: 5, featured: true },
    { name: "Tigist Worku", role: "Office Tenant · Bole Road", content: "As a small business, I appreciate Mekiya's honesty. They showed us three office spaces in Bole Road and helped us negotiate a fair lease.", rating: 5, featured: true },
    { name: "Michael Chen", role: "Expat Renter · Bole Atlas", content: "Moving to Addis Ababa was daunting, but Mekiya made finding a furnished apartment effortless. They understood exactly what I needed.", rating: 5, featured: true },
  ]);

  await db.insert(schema.visitRequests).values([
    { propertyId: 1, name: "Yohannes Getachew", email: "yohannes@example.com", phone: "+251911111111", requestedDate: "2025-03-15", requestedTime: "10:00", message: "I would like to see the CMC Block 9 apartment this weekend.", status: "pending", assignedAgentId: agent1.id },
    { propertyId: 6, name: "Meron Tadesse", email: "meron@example.com", phone: "+251922222222", requestedDate: "2025-03-16", requestedTime: "14:00", message: "Interested in the penthouse.", status: "confirmed", assignedAgentId: agent1.id },
  ]);

  await db.insert(schema.leads).values([
    { propertyId: 1, name: "Bekele Hailu", email: "bekele@example.com", phone: "+251933333333", leadType: "buy", pipelineStatus: "new", source: "website", notes: [{ date: "2025-03-01", text: "Inquired about the CMC Block 9 apartment via the website form" }], assignedAgentId: agent1.id },
    { propertyId: 7, name: "Kidist Real Estate Dev", email: "kidist@devco.com", phone: "+251944444444", leadType: "buy", pipelineStatus: "negotiating", source: "referral", notes: [{ date: "2025-02-20", text: "Referred by existing client" }, { date: "2025-03-01", text: "Office visit completed, very interested" }], assignedAgentId: agent2.id },
    { propertyId: 5, name: "James Wilson", email: "james@company.com", phone: "+251955555555", leadType: "rent", pipelineStatus: "contacted", source: "website", notes: [{ date: "2025-03-05", text: "Expat looking for furnished studio in Bole Atlas" }], assignedAgentId: agent1.id },
  ]);

  console.log("✅ Seed complete!");
  await pool.end();
}

seed().catch(console.error);
