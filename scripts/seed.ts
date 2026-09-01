import { Pool } from "pg";
import * as bcrypt from "bcryptjs";
import slugify from "slugify";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local file
config({ path: resolve(process.cwd(), ".env.local") });

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log("🌱 Starting database seed...\n");

    // ========================================
    // 1. SEED USERS
    // ========================================
    console.log("👥 Seeding users...");
    
    const adminPassword = await bcrypt.hash("admin123", 10);
    const agentPassword = await bcrypt.hash("agent123", 10);
    
    const users = await client.query(`
      INSERT INTO users (email, password_hash, name, role, phone, bio, specialty)
      VALUES 
        ($1, $2, 'Admin User', 'super_admin', '+251911234567', 'Platform administrator', NULL),
        ($3, $4, 'Sarah Anderson', 'sales_manager', '+251911234568', 'Experienced sales manager with 10+ years in real estate', 'Sales Management'),
        ($5, $6, 'Michael Chen', 'agent', '+251911234569', 'Specializing in luxury apartments in Bole area', 'Luxury Apartments'),
        ($7, $8, 'Amira Hassan', 'agent', '+251911234570', 'Expert in commercial properties', 'Commercial Real Estate'),
        ($9, $10, 'David Teshome', 'agent', '+251911234571', 'Focused on affordable housing solutions', 'Residential Properties')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, role
    `, [
      'admin@mekiya.com', adminPassword,
      'sarah@mekiya.com', agentPassword,
      'michael@mekiya.com', agentPassword,
      'amira@mekiya.com', agentPassword,
      'david@mekiya.com', agentPassword
    ]);
    
    console.log(`✅ Created ${users.rows.length} users`);
    users.rows.forEach(u => console.log(`   - ${u.name} (${u.role})`));

    // Get agent IDs for property assignments
    const agentIds = users.rows.filter(u => u.role === 'agent').map(u => u.id);
    const managerId = users.rows.find(u => u.role === 'sales_manager')?.id;

    // ========================================
    // 2. SEED NEIGHBORHOODS
    // ========================================
    console.log("\n🏘️  Seeding neighborhoods...");
    
    const neighborhoods = await client.query(`
      INSERT INTO neighborhoods (name, slug, description, avg_price, block, lat, lng)
      VALUES 
        ('Bole', 'bole', 'Prime location with modern amenities, close to Bole International Airport', 15000000, 'Bole', 8.9983, 38.7883),
        ('Old Airport', 'old-airport', 'Established neighborhood with excellent infrastructure', 12000000, 'Old Airport', 9.0192, 38.7525),
        ('Sarbet', 'sarbet', 'Quiet residential area perfect for families', 8000000, 'Sarbet', 9.0125, 38.7253),
        ('CMC', 'cmc', 'Developing area with great investment potential', 6000000, 'CMC', 8.9806, 38.7300),
        ('Gerji', 'gerji', 'Growing commercial and residential district', 10000000, 'Gerji', 9.0458, 38.7814)
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, name
    `);
    
    console.log(`✅ Created ${neighborhoods.rows.length} neighborhoods`);

    // ========================================
    // 3. SEED PROPERTIES
    // ========================================
    console.log("\n🏢 Seeding properties...");
    
    const properties = [
      {
        title: 'Modern 3BR Apartment in Bole',
        type: 'apartment',
        listing: 'sale',
        price: 18500000,
        bedrooms: 3,
        bathrooms: 2,
        size: 180,
        description: 'Beautiful modern apartment with stunning city views. Features include a spacious living room, modern kitchen with appliances, master bedroom with en-suite bathroom, and two additional bedrooms. The property includes one parking space and 24/7 security.',
        address: 'Bole, near Edna Mall',
        neighborhood: 'Bole',
        amenities: ['Parking', 'Security', 'Elevator', 'Balcony', 'Modern Kitchen'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Luxury Penthouse at Old Airport',
        type: 'apartment',
        listing: 'sale',
        price: 28000000,
        bedrooms: 4,
        bathrooms: 3,
        size: 250,
        description: 'Exclusive penthouse offering panoramic views of the city. This luxurious property features high-end finishes, a spacious terrace, modern amenities, and comes fully furnished. Perfect for those seeking luxury living in the heart of Addis Ababa.',
        address: 'Old Airport Road',
        neighborhood: 'Old Airport',
        amenities: ['Gym', 'Pool', 'Parking', 'Security', 'Elevator', 'Terrace', 'Furnished'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Commercial Space in Bole',
        type: 'commercial',
        listing: 'rent',
        price: 250000,
        bedrooms: null,
        bathrooms: 2,
        size: 350,
        description: 'Prime commercial space ideal for offices, retail, or showrooms. Located on a main road with high foot traffic. Features include ample parking, modern facilities, and excellent visibility.',
        address: 'Bole Road, Atlas Area',
        neighborhood: 'Bole',
        amenities: ['Parking', 'Security', 'Reception Area', 'High Speed Internet'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Affordable 2BR Apartment in Sarbet',
        type: 'apartment',
        listing: 'sale',
        price: 7500000,
        bedrooms: 2,
        bathrooms: 1,
        size: 95,
        description: 'Perfect starter home in a quiet neighborhood. This cozy apartment features two bedrooms, a functional kitchen, and a comfortable living area. Great for small families or first-time buyers.',
        address: 'Sarbet, near Stadium',
        neighborhood: 'Sarbet',
        amenities: ['Parking', 'Security'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Investment Opportunity in CMC',
        type: 'apartment',
        listing: 'sale',
        price: 5800000,
        bedrooms: 1,
        bathrooms: 1,
        size: 65,
        description: 'Studio apartment in developing area with high growth potential. Ideal for investors or young professionals. Close to public transportation and local amenities.',
        address: 'CMC, near Megenagna',
        neighborhood: 'CMC',
        amenities: ['Security', 'Water Tank'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Family Home in Gerji',
        type: 'apartment',
        listing: 'rent',
        price: 45000,
        bedrooms: 3,
        bathrooms: 2,
        size: 160,
        description: 'Spacious family apartment in a growing neighborhood. Features include three comfortable bedrooms, two bathrooms, large living and dining areas, and a modern kitchen. Close to schools and shopping centers.',
        address: 'Gerji, near Millennium Hall',
        neighborhood: 'Gerji',
        amenities: ['Parking', 'Security', 'Balcony', 'Storage'],
        featured: false,
        status: 'published'
      },
      {
        title: 'Executive Office Suite in Old Airport',
        type: 'commercial',
        listing: 'rent',
        price: 180000,
        bedrooms: null,
        bathrooms: 3,
        size: 280,
        description: 'Premium office space perfect for corporate headquarters or professional services. Features include modern design, conference rooms, private offices, and a reception area. Located in a prestigious business district.',
        address: 'Old Airport, near UNECA',
        neighborhood: 'Old Airport',
        amenities: ['Parking', 'Security', 'Elevator', 'Conference Room', 'Kitchen'],
        featured: true,
        status: 'published'
      },
      {
        title: 'Under Construction - Bole Luxury Complex',
        type: 'apartment',
        listing: 'sale',
        price: 22000000,
        bedrooms: 3,
        bathrooms: 2,
        size: 195,
        description: 'Pre-sale opportunity in upcoming luxury development. Expected completion in 6 months. Features will include high-end finishes, smart home technology, and world-class amenities.',
        address: 'Bole, near Airport',
        neighborhood: 'Bole',
        amenities: ['Gym', 'Pool', 'Parking', 'Security', 'Elevator', 'Smart Home'],
        featured: false,
        status: 'draft'
      }
    ];

    let propertyCount = 0;
    for (const prop of properties) {
      const slug = slugify(prop.title, { lower: true, strict: true }) + '-' + Date.now().toString(36);
      const agentId = agentIds[propertyCount % agentIds.length];
      
      await client.query(`
        INSERT INTO properties (
          title, slug, property_type, listing_type, status, price, currency,
          bedrooms, bathrooms, size, size_unit, description, address,
          city, neighborhood, amenities, agent_id, featured, verified
        ) VALUES (
          $1, $2, $3, $4, $5, $6, 'ETB', $7, $8, $9, 'sqm', $10, $11,
          'Addis Ababa', $12, $13, $14, $15, true
        )
      `, [
        prop.title, slug, prop.type, prop.listing, prop.status, prop.price,
        prop.bedrooms, prop.bathrooms, prop.size, prop.description, prop.address,
        prop.neighborhood, JSON.stringify(prop.amenities), agentId, prop.featured
      ]);
      
      propertyCount++;
    }
    
    console.log(`✅ Created ${propertyCount} properties`);

    // ========================================
    // 4. SEED TESTIMONIALS
    // ========================================
    console.log("\n💬 Seeding testimonials...");
    
    const testimonials = await client.query(`
      INSERT INTO testimonials (name, role, content, rating, featured)
      VALUES 
        ('Yohannes Bekele', 'Property Buyer', 'Mekiya made finding my dream home so easy. The team was professional, responsive, and helped me through every step of the process. Highly recommend!', 5, true),
        ('Rebecca Alemayehu', 'First-time Buyer', 'As a first-time buyer, I was nervous about the process. Mekiya''s agents were patient, knowledgeable, and found me the perfect apartment within my budget.', 5, true),
        ('Ahmed Mohamed', 'Commercial Investor', 'I''ve worked with many real estate agencies, but Mekiya stands out for their professionalism and market knowledge. They helped me secure excellent commercial properties.', 5, true),
        ('Helen Tadesse', 'Apartment Seller', 'Sold my property in record time thanks to Mekiya''s marketing expertise. The entire process was smooth and stress-free.', 4, false)
      RETURNING id, name
    `);
    
    console.log(`✅ Created ${testimonials.rows.length} testimonials`);

    // ========================================
    // 5. SEED SITE SETTINGS
    // ========================================
    console.log("\n⚙️  Seeding site settings...");
    
    await client.query(`
      INSERT INTO site_settings (key, value)
      VALUES 
        ('site_name', 'Mekiya Real Estate'),
        ('site_tagline', 'Your Gateway to Premium Properties in Addis Ababa'),
        ('contact_email', 'info@mekiya.com'),
        ('contact_phone', '+251911234567'),
        ('office_address', 'Bole Road, Atlas Area, Addis Ababa, Ethiopia'),
        ('social_facebook', 'https://facebook.com/mekiyarealestate'),
        ('social_instagram', 'https://instagram.com/mekiyarealestate'),
        ('social_twitter', 'https://twitter.com/mekiyarealestate'),
        ('social_linkedin', 'https://linkedin.com/company/mekiya-real-estate')
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
    `);
    
    console.log(`✅ Created site settings`);

    // ========================================
    // SUMMARY
    // ========================================
    console.log("\n✅ Database seeded successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • ${users.rows.length} users created`);
    console.log(`   • ${neighborhoods.rows.length} neighborhoods created`);
    console.log(`   • ${propertyCount} properties created`);
    console.log(`   • ${testimonials.rows.length} testimonials created`);
    console.log(`   • Site settings configured`);
    console.log("\n🔐 Login Credentials:");
    console.log("   Admin: admin@mekiya.com / admin123");
    console.log("   Manager: sarah@mekiya.com / agent123");
    console.log("   Agents: michael@mekiya.com / agent123");
    console.log("           amira@mekiya.com / agent123");
    console.log("           david@mekiya.com / agent123\n");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
