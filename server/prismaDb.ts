import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { ensureDefaultAdmin } from './auth';

const DEFAULT_DATABASE_URL = 'postgresql://neondb_owner:npg_LhsE7QOG5Pab@ep-lingering-term-aysveogv-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    },
  },
});

export async function initPrismaDatabase() {
  try {
    console.log('[Prisma + Neon] Connecting to database...');
    const catCount = await prisma.category.count();
    console.log(`[Prisma + Neon] Verified connected. Found ${catCount} categories.`);
    
    if (catCount === 0) {
      console.log('[Prisma + Neon] Database is empty. Seeding initial luxury collection...');
      await seedPrismaData();
    }

    // Ensure default super admin account is securely created
    await ensureDefaultAdmin();
  } catch (error) {
    console.error('[Prisma + Neon] Database initialization error:', error);
  }
}

export async function seedPrismaData() {
  // Categories
  const categories = [
    {
      id: 'cat-necklace',
      name: 'Pearl Necklaces',
      nameKhmer: 'ខ្សែកគុជខ្យង',
      slug: 'pearl-necklace',
      description: 'Timeless single and double strand necklaces featuring radiant freshwater and saltwater pearls.',
      descriptionKhmer: 'ខ្សែកគុជខ្យងខ្សែទោល និងខ្សែភ្លោះដ៏ប្រណីតជាមួយគុជខ្យងទឹកសាប និងទឹកប្រៃធម្មជាតិ។',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-earrings',
      name: 'Pearl Earrings',
      nameKhmer: 'ក្រវិលគុជខ្យង',
      slug: 'pearl-earrings',
      description: 'From minimalist studs to cascading chandelier drops in pure gold and sterling silver.',
      descriptionKhmer: 'ចាប់ពីក្រវិលតូចៗរហូតដល់ម៉ូដទម្លាក់យ៉ាងប្រណីត ស្រោបដោយមាស និងប្រាក់សុទ្ធ 925។',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-bracelet',
      name: 'Pearl Bracelets',
      nameKhmer: 'កងដៃគុជខ្យង',
      slug: 'pearl-bracelet',
      description: 'Refined tennis bracelets, bangles, and braided silk strands with hand-selected pearls.',
      descriptionKhmer: 'កងដៃគុជខ្យងរចនាឡើងយ៉ាងល្អិតល្អន់ សាកសមគ្រប់កាលៈទេសៈ។',
      image: 'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-ring',
      name: 'Pearl Rings',
      nameKhmer: 'ចិញ្ចៀនគុជខ្យង',
      slug: 'pearl-ring',
      description: 'Statement cocktail and engagement rings featuring South Sea, Tahitian, and Akoya pearls.',
      descriptionKhmer: 'ចិញ្ចៀនគុជខ្យងសមុទ្រខាងត្បូង និងតាហ៊ីទី ជាមួយពេជ្រលម្អយ៉ាងឆើតឆាយ។',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-set',
      name: 'Bridal & Luxury Sets',
      nameKhmer: 'ឈុតគុជខ្យងកូនក្រមុំ & ប្រណីត',
      slug: 'pearl-set',
      description: 'Complete matched suites of necklace, earrings, and bracelet for weddings and grand galas.',
      descriptionKhmer: 'ឈុតពេញលេញរួមមានខ្សែក ក្រវិល និងកងដៃ សម្រាប់ពិធីមង្គលការ និងកម្មវិធីធំៗ។',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-accessories',
      name: 'Accessories & Brooches',
      nameKhmer: 'គ្រឿងតុបតែង & ម្ជុលខ្ទាស់',
      slug: 'accessories',
      description: 'Bespoke pearl hairpins, royal brooches, and convertible pearl clasps.',
      descriptionKhmer: 'ម្ជុលខ្ទាស់អាវគុជខ្យង និងស្នៀតសក់រចនាម៉ូដបែបបុរាណ និងសម័យ។',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: cat,
      create: cat,
    });
  }

  // Products
  const products = [
    {
      id: 'prod-01',
      sku: 'MDP-NK-001',
      name: 'Aura Princess Freshwater Pearl Necklace',
      nameKhmer: 'ខ្សែកគុជខ្យងទឹកសាប Aura Princess',
      categoryId: 'cat-necklace',
      price: 120,
      originalPrice: 150,
      description: 'A classic 18-inch princess length single strand necklace featuring luminous near-round freshwater pearls with exceptional high lustre and delicate 925 sterling silver filigree clasp.',
      descriptionKhmer: 'ខ្សែកប្រវែង ១៨ អ៊ីញបែបព្រះនាង ធ្វើឡើងពីគុជខ្យងទឹកសាបរលោងចែងចាំង ជាមួយគន្លឹះប្រាក់សុទ្ធ ៩២៥ រចនាយ៉ាងប្រណីត។',
      pearlType: 'Freshwater',
      color: 'Classic White',
      size: '8.0 - 8.5 mm',
      material: '925 Sterling Silver',
      lustre: 'AAA Grade',
      availability: 'in_stock',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: true,
      isBestseller: true,
      rating: 4.9,
      reviewCount: 42,
    },
    {
      id: 'prod-02',
      sku: 'MDP-ER-002',
      name: 'Solitaire Akoya Pearl Drop Earrings',
      nameKhmer: 'ក្រវិលគុជខ្យងតំណក់ទឹក Akoya Solitaire',
      categoryId: 'cat-earrings',
      price: 85,
      originalPrice: 110,
      description: 'Flawless Japanese Akoya cultured pearls suspended on delicate 18K yellow gold leverbacks with microscopic cubic zirconia accents for an ethereal shimmer.',
      descriptionKhmer: 'គុជខ្យងជប៉ុន Akoya រាងមូលឥតខ្ចោះ ព្យួរលើជើងក្រវិលមាសលឿង 18K ជាមួយគ្រាប់ពេជ្រតូចៗរលោងចែងចាំង។',
      pearlType: 'Akoya',
      color: 'Classic White',
      size: '7.5 - 8.0 mm',
      material: '18K Yellow Gold',
      lustre: 'Hanadama Equivalent',
      availability: 'in_stock',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: true,
      isBestseller: true,
      rating: 5.0,
      reviewCount: 38,
    },
    {
      id: 'prod-03',
      sku: 'MDP-BR-003',
      name: 'Golden South Sea Pearl Cuff Bracelet',
      nameKhmer: 'កងដៃគុជខ្យងសមុទ្រខាងត្បូងពណ៌មាស Golden South Sea',
      categoryId: 'cat-bracelet',
      price: 240,
      originalPrice: 290,
      description: 'An opulent open cuff bracelet showcasing two natural Champagne Gold South Sea pearls mounted on heavy 18K gold-plated sterling silver.',
      descriptionKhmer: 'កងដៃចំហដ៏ប្រណីតដាំគុជខ្យងសមុទ្រខាងត្បូងពណ៌មាសធម្មជាតិ ២ គ្រាប់ ស្រោបដោយមាស 18K ក្រាស់ល្អិតល្អន់។',
      pearlType: 'South Sea',
      color: 'Golden South Sea',
      size: '10.0 - 11.0 mm',
      material: '18K Yellow Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'limited',
      images: [
        'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: true,
      isBestseller: true,
      rating: 4.95,
      reviewCount: 29,
    },
    {
      id: 'prod-04',
      sku: 'MDP-RG-004',
      name: 'Imperial Tahitian Black Pearl Crown Ring',
      nameKhmer: 'ចិញ្ចៀនគុជខ្យងខ្មៅតាហ៊ីទី Imperial Tahitian',
      categoryId: 'cat-ring',
      price: 185,
      originalPrice: 220,
      description: 'A breathtaking dark peacock Tahitian cultured pearl set atop an intricate 18K white gold crown filigree band.',
      descriptionKhmer: 'គុជខ្យងខ្មៅតាហ៊ីទីពណ៌ស្លាបក្ងោកដ៏កម្រ ដាំលើតួចិញ្ចៀនរាងម្កុដមាសស 18K យ៉ាងស្រស់ស្អាត។',
      pearlType: 'Tahitian',
      color: 'Peacock Tahitian',
      size: '9.5 - 10.0 mm',
      material: '18K White Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'in_stock',
      images: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: true,
      isBestseller: true,
      rating: 4.88,
      reviewCount: 31,
    },
    {
      id: 'prod-05',
      sku: 'MDP-ST-005',
      name: 'Royal Monarchy Baroque Bridal Suite (3-Piece)',
      nameKhmer: 'ឈុតកូនក្រមុំរាជវង្ស Baroque Royal Suite (៣ មុខ)',
      categoryId: 'cat-set',
      price: 460,
      originalPrice: 550,
      description: 'Exclusive 3-piece matched jewelry set featuring organic undulating baroque pearls, sparkling zircons, and hand-knotted silk thread.',
      descriptionKhmer: 'ឈុតគ្រឿងអលង្ការ ៣ មុខរួមមានខ្សែក ក្រវិល និងកងដៃ ជាមួយគុជខ្យង Baroque ធម្មជាតិដ៏កម្រសម្រាប់ពិធីមង្គលការ។',
      pearlType: 'Baroque',
      color: 'Classic White',
      size: '12.0 - 15.0 mm',
      material: '18K Yellow Gold',
      lustre: 'Baroque Lustre',
      availability: 'made_to_order',
      images: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: true,
      isBestseller: false,
      rating: 5.0,
      reviewCount: 14,
    },
    {
      id: 'prod-06',
      sku: 'MDP-AC-006',
      name: 'Victoria Palace Pearl Bouquet Brooch',
      nameKhmer: 'ម្ជុលខ្ទាស់អាវគុជខ្យងផ្កាចង្កោម Victoria Palace',
      categoryId: 'cat-accessories',
      price: 75,
      originalPrice: 95,
      description: 'Vintage-inspired floral brooch adorned with six natural lavender-rose freshwater seed pearls and micro-pave crystals.',
      descriptionKhmer: 'ម្ជុលខ្ទាស់អាវរចនាបថផ្កាបុរាណ ដាំគុជខ្យងទឹកសាប ៦ គ្រាប់ និងត្បូងភ្លឺផ្លេកៗយ៉ាងប្រណីត។',
      pearlType: 'Freshwater',
      color: 'Soft Rose Pink',
      size: '5.5 - 6.5 mm',
      material: 'Platinum Plated',
      lustre: 'AAA Grade',
      availability: 'in_stock',
      images: [
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: false,
      isBestseller: false,
      rating: 4.75,
      reviewCount: 19,
    },
    {
      id: 'prod-07',
      sku: 'MDP-NK-007',
      name: 'Double Strand Opera Akoya Pearl Choker',
      nameKhmer: 'ខ្សែកគុជខ្យង Akoya ២ ខ្សែរចនាបថ Opera',
      categoryId: 'cat-necklace',
      price: 320,
      originalPrice: 380,
      description: 'Sophisticated graduated double strand necklace featuring Japanese Akoya pearls with 18K white gold locking centerpiece.',
      descriptionKhmer: 'ខ្សែក ២ ខ្សែរៀបតាមទំហំយ៉ាងស្រស់ស្អាត ជាមួយគុជខ្យង Akoya ជប៉ុន និងគន្លឹះមាសស 18K។',
      pearlType: 'Akoya',
      color: 'Classic White',
      size: '6.5 - 7.5 mm',
      material: '18K White Gold',
      lustre: 'Hanadama Equivalent',
      availability: 'limited',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: false,
      isBestseller: true,
      rating: 4.92,
      reviewCount: 22,
    },
    {
      id: 'prod-08',
      sku: 'MDP-ER-008',
      name: 'Tahitian Night Peacock Pearl Studs',
      nameKhmer: 'ក្រវិលអំបោះដាំគុជខ្យងខ្មៅ Tahitian Night',
      categoryId: 'cat-earrings',
      price: 135,
      originalPrice: 165,
      description: 'Near-round Tahitian pearls with iridescent green-aubergine overtone, secured on 18K yellow gold posts.',
      descriptionKhmer: 'ក្រវិលដាំគុជខ្យងខ្មៅតាហ៊ីទីពន្លឺបៃតងរលោងស្រស់ស្អាត ជាមួយជើងមាស 18K។',
      pearlType: 'Tahitian',
      color: 'Peacock Tahitian',
      size: '8.5 - 9.0 mm',
      material: '18K Yellow Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'in_stock',
      images: [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
      ],
      isFeatured: false,
      isBestseller: true,
      rating: 4.85,
      reviewCount: 27,
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        sku: prod.sku,
        name: prod.name,
        nameKhmer: prod.nameKhmer,
        categoryId: prod.categoryId,
        price: prod.price,
        originalPrice: prod.originalPrice,
        description: prod.description,
        descriptionKhmer: prod.descriptionKhmer,
        pearlType: prod.pearlType,
        color: prod.color,
        size: prod.size,
        material: prod.material,
        lustre: prod.lustre,
        availability: prod.availability,
        images: prod.images,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
      create: {
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        nameKhmer: prod.nameKhmer,
        categoryId: prod.categoryId,
        price: prod.price,
        originalPrice: prod.originalPrice,
        description: prod.description,
        descriptionKhmer: prod.descriptionKhmer,
        pearlType: prod.pearlType,
        color: prod.color,
        size: prod.size,
        material: prod.material,
        lustre: prod.lustre,
        availability: prod.availability,
        images: prod.images,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
      },
    });
  }

  // Initial Orders
  const initialOrders = [
    {
      id: 'PRL-8492',
      productId: 'prod-01',
      productName: 'Aura Princess Freshwater Pearl Necklace',
      productPrice: 120,
      productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      pearlType: 'Freshwater',
      size: '8.0 - 8.5 mm',
      material: '925 Sterling Silver',
      quantity: 1,
      totalAmount: 120,
      customerName: 'Sokha Chea',
      customerPhone: '012 555 789',
      customerTelegram: '@sokhachea_kh',
      customerAddress: 'St. 214, Sangkat Boeung Raing',
      customerCity: 'Phnom Penh',
      notes: 'Please wrap with luxury velvet ribbon box for anniversary gift.',
      adminNotes: 'Customer confirmed via Telegram. VIP gift wrapping applied.',
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 3600000 * 8),
    },
    {
      id: 'PRL-3914',
      productId: 'prod-03',
      productName: 'Golden South Sea Pearl Cuff Bracelet',
      productPrice: 240,
      productImage: 'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=1000&q=85',
      pearlType: 'South Sea',
      size: '10.0 - 11.0 mm',
      material: '18K Yellow Gold',
      quantity: 1,
      totalAmount: 240,
      customerName: 'Bopha Vann',
      customerPhone: '098 333 222',
      customerTelegram: '@bopha_v',
      customerAddress: 'Villa 18, Borey Peng Huoth The Star Platinum',
      customerCity: 'Phnom Penh',
      notes: 'Need delivery on Saturday afternoon.',
      adminNotes: 'Pending final dispatch call.',
      status: 'CONTACTED',
      createdAt: new Date(Date.now() - 3600000 * 26),
    },
  ];

  for (const o of initialOrders) {
    await prisma.order.upsert({
      where: { id: o.id },
      update: o,
      create: o,
    });
  }

  // Initial Store Settings
  const initialSettings = {
    brandName: 'ប្រណិត (PRANITH)',
    tagline: 'ប្រណិត — ភាពថ្លៃថ្នូរ និងភាពល្អឥតខ្ចោះនៃគុជខ្យងធម្មជាតិ | Timeless Luxury Pearl Jewelry',
    hotline: '+855 (0) 12 888 999',
    telegramUsername: 'Pranith_Official',
    telegramGroupLink: 'https://t.me/Pranith_Official',
    email: 'concierge@pranith.luxury',
    boutiqueAddress: 'Grand Boulevard, Vattanac Capital Luxury Mall, Phnom Penh, Cambodia',
    boutiqueAddressKhmer: 'មហាវិថីព្រះមុនីវង្ស អគារពាណិជ្ជកម្ម វឌ្ឍនៈ កាពីតាល់ រាជធានីភ្នំពេញ',
    currencySymbol: '$',
    exchangeRateKhr: 4100,
    businessHours: 'Mon - Sun: 9:30 AM – 8:00 PM (Boutique & Online Concierge)',
    instagramUrl: 'https://instagram.com/pranith_pearls',
    facebookUrl: 'https://facebook.com/pranith.luxury',
    allowDirectTelegramOrders: true,
  };

  await prisma.storeSettingsModel.upsert({
    where: { id: 1 },
    update: { data: initialSettings },
    create: { id: 1, data: initialSettings },
  });

  console.log('[Prisma + Neon] Seed completed successfully.');
}
