import { PrismaClient, Role, PropertyType, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (for idempotent seeding)
  await prisma.adminLog.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@emlak.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+90 533 123 4567',
      role: Role.ADMIN,
    },
  });

  const agent = await prisma.user.create({
    data: {
      email: 'agent@emlak.com',
      password: hashedPassword,
      name: 'Real Estate Agent',
      phone: '+90 533 234 5678',
      role: Role.AGENT,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@emlak.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '+90 533 345 6789',
      role: Role.USER,
    },
  });

  console.log('✅ Created users (admin, agent, user)');

  // KKTC Districts and Locations
  const locations = [
    // Famagusta District
    {
      lat: 35.125,
      lng: 33.95,
      district: 'Famagusta',
      neighborhood: 'Salamis',
      address: 'Salamis Road, Famagusta',
    },
    {
      lat: 35.13,
      lng: 33.96,
      district: 'Famagusta',
      neighborhood: 'Bogaz',
      address: 'Bogaz Area, Famagusta',
    },
    {
      lat: 35.12,
      lng: 33.94,
      district: 'Famagusta',
      neighborhood: 'Iskele',
      address: 'Iskele Main Street, Famagusta',
    },
    // Kyrenia District
    {
      lat: 35.34,
      lng: 33.32,
      district: 'Kyrenia',
      neighborhood: 'Girne Merkez',
      address: 'Girne Center, Kyrenia',
    },
    {
      lat: 35.33,
      lng: 33.31,
      district: 'Kyrenia',
      neighborhood: 'Alsancak',
      address: 'Alsancak Beach Road, Kyrenia',
    },
    {
      lat: 35.35,
      lng: 33.33,
      district: 'Kyrenia',
      neighborhood: 'Lapta',
      address: 'Lapta Hills, Kyrenia',
    },
    {
      lat: 35.32,
      lng: 33.30,
      district: 'Kyrenia',
      neighborhood: 'Catalkoy',
      address: 'Catalkoy Village, Kyrenia',
    },
    // Nicosia District
    {
      lat: 35.18,
      lng: 33.36,
      district: 'Nicosia',
      neighborhood: 'Lefkosa Merkez',
      address: 'Nicosia Center, Nicosia',
    },
    {
      lat: 35.17,
      lng: 33.35,
      district: 'Nicosia',
      neighborhood: 'Gonyeli',
      address: 'Gonyeli Area, Nicosia',
    },
    {
      lat: 35.19,
      lng: 33.37,
      district: 'Nicosia',
      neighborhood: 'Hamitkoy',
      address: 'Hamitkoy District, Nicosia',
    },
  ];

  const createdLocations = await Promise.all(
    locations.map((loc) =>
      prisma.location.create({
        data: loc,
      })
    )
  );

  console.log(`✅ Created ${createdLocations.length} locations`);

  // Sample Properties
  const properties = [
    {
      title: 'Luxury Villa with Sea View in Alsancak',
      description:
        'Beautiful 4-bedroom villa with stunning sea views, private pool, and modern amenities. Located in the prestigious Alsancak area of Kyrenia.',
      price: 450000,
      propertyType: PropertyType.VILLA,
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      furnished: true,
      available: true,
      featured: true,
      userId: agent.id,
      locationId: createdLocations[4].id, // Alsancak
    },
    {
      title: 'Modern Apartment in Girne Center',
      description:
        'Spacious 2-bedroom apartment in the heart of Girne. Walking distance to shops, restaurants, and the harbor. Fully furnished and ready to move in.',
      price: 125000,
      propertyType: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 1,
      area: 95,
      furnished: true,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[3].id, // Girne Merkez
    },
    {
      title: 'Beachfront Property in Salamis',
      description:
        'Stunning beachfront villa with direct access to the beach. 5 bedrooms, large garden, and private pool. Perfect for families or rental investment.',
      price: 650000,
      propertyType: PropertyType.VILLA,
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      furnished: false,
      available: true,
      featured: true,
      userId: agent.id,
      locationId: createdLocations[0].id, // Salamis
    },
    {
      title: 'Cozy Studio Apartment in Nicosia',
      description:
        'Affordable studio apartment in Nicosia center. Ideal for students or young professionals. Close to universities and city amenities.',
      price: 45000,
      propertyType: PropertyType.STUDIO,
      bedrooms: 0,
      bathrooms: 1,
      area: 35,
      furnished: true,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[7].id, // Lefkosa Merkez
    },
    {
      title: 'Family House in Lapta',
      description:
        'Traditional 3-bedroom house in the hills of Lapta. Beautiful mountain views, large garden, and peaceful neighborhood. Great for families.',
      price: 180000,
      propertyType: PropertyType.HOUSE,
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      furnished: false,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[5].id, // Lapta
    },
    {
      title: 'Commercial Space in Bogaz',
      description:
        'Prime commercial space in Bogaz area. Perfect for restaurant, cafe, or retail business. High foot traffic location with parking.',
      price: 220000,
      propertyType: PropertyType.COMMERCIAL,
      bedrooms: 0,
      bathrooms: 2,
      area: 200,
      furnished: false,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[1].id, // Bogaz
    },
    {
      title: 'Luxury Apartment in Catalkoy',
      description:
        'Modern 3-bedroom apartment in Catalkoy with sea and mountain views. Gated community with pool and security. High-end finishes throughout.',
      price: 285000,
      propertyType: PropertyType.APARTMENT,
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      furnished: true,
      available: true,
      featured: true,
      userId: agent.id,
      locationId: createdLocations[6].id, // Catalkoy
    },
    {
      title: 'Land for Sale in Iskele',
      description:
        'Prime building plot in Iskele area. 500m² plot with planning permission. Great investment opportunity for building your dream home.',
      price: 95000,
      propertyType: PropertyType.LAND,
      bedrooms: 0,
      bathrooms: 0,
      area: 500,
      furnished: false,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[2].id, // Iskele
    },
    {
      title: 'Townhouse in Gonyeli',
      description:
        'Spacious 4-bedroom townhouse in Gonyeli. Modern design, large living areas, and private garden. Close to schools and amenities.',
      price: 195000,
      propertyType: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 3,
      area: 180,
      furnished: false,
      available: true,
      featured: false,
      userId: agent.id,
      locationId: createdLocations[8].id, // Gonyeli
    },
    {
      title: 'Penthouse in Hamitkoy',
      description:
        'Exclusive penthouse apartment with panoramic views. 3 bedrooms, large terrace, and premium finishes. Located in upscale Hamitkoy district.',
      price: 320000,
      propertyType: PropertyType.APARTMENT,
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      furnished: true,
      available: true,
      featured: true,
      userId: agent.id,
      locationId: createdLocations[9].id, // Hamitkoy
    },
  ];

  const createdProperties = await Promise.all(
    properties.map((prop) =>
      prisma.property.create({
        data: prop,
      })
    )
  );

  console.log(`✅ Created ${createdProperties.length} properties`);

  // Create some sample bookings
  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 3);
  futureDate1.setHours(14, 0, 0, 0);

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 5);
  futureDate2.setHours(10, 0, 0, 0);

  await prisma.booking.createMany({
    data: [
      {
        userId: user.id,
        propertyId: createdProperties[0].id,
        date: futureDate1,
        status: BookingStatus.PENDING,
        notes: 'Interested in viewing this property',
      },
      {
        userId: user.id,
        propertyId: createdProperties[2].id,
        date: futureDate2,
        status: BookingStatus.APPROVED,
        notes: 'Confirmed viewing appointment',
      },
    ],
  });

  console.log('✅ Created sample bookings');

  // Create admin log entry
  await prisma.adminLog.create({
    data: {
      adminId: admin.id,
      action: 'SEED_DATABASE',
      entity: 'Database',
      entityId: 'seed',
      details: {
        propertiesCreated: createdProperties.length,
        locationsCreated: createdLocations.length,
        usersCreated: 3,
      },
    },
  });

  console.log('✅ Created admin log entry');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📝 Sample credentials:');
  console.log('   Admin: admin@emlak.com / password123');
  console.log('   Agent: agent@emlak.com / password123');
  console.log('   User:  user@emlak.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

