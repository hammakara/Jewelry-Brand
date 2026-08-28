import pg from 'pg';
const { Pool } = pg;

const DEFAULT_DATABASE_URL = 'postgresql://neondb_owner:npg_LhsE7QOG5Pab@ep-lingering-term-aysveogv-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('[Neon PostgreSQL] Connecting to database...');

    // Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_khmer VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        description_khmer TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        sku VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        name_khmer VARCHAR(255) NOT NULL,
        category_id VARCHAR(100) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
        price NUMERIC(10, 2) NOT NULL,
        original_price NUMERIC(10, 2),
        description TEXT,
        description_khmer TEXT,
        pearl_type VARCHAR(100) NOT NULL,
        color VARCHAR(100) NOT NULL,
        size VARCHAR(100) NOT NULL,
        material VARCHAR(100) NOT NULL,
        lustre VARCHAR(100) NOT NULL,
        availability VARCHAR(100) NOT NULL DEFAULT 'in_stock',
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        is_featured BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        rating NUMERIC(3, 2) DEFAULT 5.0,
        review_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        product_id VARCHAR(100) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_price NUMERIC(10, 2) NOT NULL,
        product_image TEXT,
        pearl_type VARCHAR(100),
        size VARCHAR(100),
        material VARCHAR(100),
        quantity INTEGER NOT NULL DEFAULT 1,
        total_amount NUMERIC(10, 2) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(100) NOT NULL,
        customer_telegram VARCHAR(100),
        customer_address TEXT NOT NULL,
        customer_city VARCHAR(100) NOT NULL,
        notes TEXT,
        admin_notes TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Store Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS store_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('[Neon PostgreSQL] Schema verified successfully.');

    // Check if initial categories exist
    const { rows: catRows } = await client.query('SELECT COUNT(*) FROM categories');
    if (parseInt(catRows[0].count, 10) === 0) {
      console.log('[Neon PostgreSQL] Seeding initial database data...');
      await seedInitialData(client);
    }
  } catch (error) {
    console.error('[Neon PostgreSQL] Database initialization error:', error);
  } finally {
    client.release();
  }
}

export async function seedInitialData(client: pg.PoolClient) {
  // Initial Categories
  const categories = [
    {
      id: 'cat-necklace',
      name: 'Pearl Necklaces',
      name_khmer: 'ខ្សែកគុជខ្យង',
      slug: 'pearl-necklace',
      description: 'Timeless single and double strand necklaces featuring radiant freshwater and saltwater pearls.',
      description_khmer: 'ខ្សែកគុជខ្យងខ្សែទោល និងខ្សែភ្លោះដ៏ប្រណីតជាមួយគុជខ្យងទឹកសាប និងទឹកប្រៃធម្មជាតិ។',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-earrings',
      name: 'Pearl Earrings',
      name_khmer: 'ក្រវិលគុជខ្យង',
      slug: 'pearl-earrings',
      description: 'From minimalist studs to cascading chandelier drops in pure gold and sterling silver.',
      description_khmer: 'ចាប់ពីក្រវិលតូចៗរហូតដល់ម៉ូដទម្លាក់យ៉ាងប្រណីត ស្រោបដោយមាស និងប្រាក់សុទ្ធ 925។',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-bracelet',
      name: 'Pearl Bracelets',
      name_khmer: 'កងដៃគុជខ្យង',
      slug: 'pearl-bracelet',
      description: 'Refined tennis bracelets, bangles, and braided silk strands with hand-selected pearls.',
      description_khmer: 'កងដៃគុជខ្យងរចនាឡើងយ៉ាងល្អិតល្អន់ សាកសមគ្រប់កាលៈទេសៈ។',
      image: 'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-ring',
      name: 'Pearl Rings',
      name_khmer: 'ចិញ្ចៀនគុជខ្យង',
      slug: 'pearl-ring',
      description: 'Statement cocktail and engagement rings featuring South Sea, Tahitian, and Akoya pearls.',
      description_khmer: 'ចិញ្ចៀនគុជខ្យងសមុទ្រខាងត្បូង និងតាហ៊ីទី ជាមួយពេជ្រលម្អយ៉ាងឆើតឆាយ។',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-set',
      name: 'Bridal & Luxury Sets',
      name_khmer: 'ឈុតគុជខ្យងកូនក្រមុំ & ប្រណីត',
      slug: 'pearl-set',
      description: 'Complete matched suites of necklace, earrings, and bracelet for weddings and grand galas.',
      description_khmer: 'ឈុតពេញលេញរួមមានខ្សែក ក្រវិល និងកងដៃ សម្រាប់ពិធីមង្គលការ និងកម្មវិធីធំៗ។',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'cat-accessories',
      name: 'Accessories & Brooches',
      name_khmer: 'គ្រឿងតុបតែង & ម្ជុលខ្ទាស់',
      slug: 'accessories',
      description: 'Bespoke pearl hairpins, royal brooches, and convertible pearl clasps.',
      description_khmer: 'ម្ជុលខ្ទាស់អាវគុជខ្យង និងស្នៀតសក់រចនាម៉ូដបែបបុរាណ និងសម័យ។',
      image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const cat of categories) {
    await client.query(`
      INSERT INTO categories (id, name, name_khmer, slug, description, description_khmer, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        name_khmer = EXCLUDED.name_khmer,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        description_khmer = EXCLUDED.description_khmer,
        image = EXCLUDED.image;
    `, [cat.id, cat.name, cat.name_khmer, cat.slug, cat.description, cat.description_khmer, cat.image]);
  }

  // Initial Products
  const products = [
    {
      id: 'prod-01',
      sku: 'MDP-NK-001',
      name: 'Aura Princess Freshwater Pearl Necklace',
      name_khmer: 'ខ្សែកគុជខ្យងទឹកសាប Aura Princess',
      category_id: 'cat-necklace',
      price: 120,
      original_price: 150,
      description: 'A classic 18-inch princess length single strand necklace featuring luminous near-round freshwater pearls with exceptional high lustre and delicate 925 sterling silver filigree clasp.',
      description_khmer: 'ខ្សែកប្រវែង ១៨ អ៊ីញបែបព្រះនាង ធ្វើឡើងពីគុជខ្យងទឹកសាបរលោងចែងចាំង ជាមួយគន្លឹះប្រាក់សុទ្ធ ៩២៥ រចនាយ៉ាងប្រណីត។',
      pearl_type: 'Freshwater',
      color: 'Classic White',
      size: '8.0 - 8.5 mm',
      material: '925 Sterling Silver',
      lustre: 'AAA Grade',
      availability: 'in_stock',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: true,
      is_bestseller: true,
      rating: 4.9,
      review_count: 42,
    },
    {
      id: 'prod-02',
      sku: 'MDP-ER-002',
      name: 'Solitaire Akoya Pearl Drop Earrings',
      name_khmer: 'ក្រវិលគុជខ្យងតំណក់ទឹក Akoya Solitaire',
      category_id: 'cat-earrings',
      price: 85,
      original_price: 110,
      description: 'Flawless Japanese Akoya cultured pearls suspended on delicate 18K yellow gold leverbacks with microscopic cubic zirconia accents for an ethereal shimmer.',
      description_khmer: 'គុជខ្យងជប៉ុន Akoya រាងមូលឥតខ្ចោះ ព្យួរលើជើងក្រវិលមាសលឿង 18K ជាមួយគ្រាប់ពេជ្រតូចៗរលោងចែងចាំង។',
      pearl_type: 'Akoya',
      color: 'Classic White',
      size: '7.5 - 8.0 mm',
      material: '18K Yellow Gold',
      lustre: 'Hanadama Equivalent',
      availability: 'in_stock',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: true,
      is_bestseller: true,
      rating: 5.0,
      review_count: 38,
    },
    {
      id: 'prod-03',
      sku: 'MDP-BR-003',
      name: 'Golden South Sea Pearl Cuff Bracelet',
      name_khmer: 'កងដៃគុជខ្យងសមុទ្រខាងត្បូងពណ៌មាស Golden South Sea',
      category_id: 'cat-bracelet',
      price: 240,
      original_price: 290,
      description: 'An opulent open cuff bracelet showcasing two natural Champagne Gold South Sea pearls mounted on heavy 18K gold-plated sterling silver.',
      description_khmer: 'កងដៃចំហដ៏ប្រណីតដាំគុជខ្យងសមុទ្រខាងត្បូងពណ៌មាសធម្មជាតិ ២ គ្រាប់ ស្រោបដោយមាស 18K ក្រាស់ល្អិតល្អន់។',
      pearl_type: 'South Sea',
      color: 'Golden South Sea',
      size: '10.0 - 11.0 mm',
      material: '18K Yellow Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'limited',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: true,
      is_bestseller: true,
      rating: 4.95,
      review_count: 29,
    },
    {
      id: 'prod-04',
      sku: 'MDP-RG-004',
      name: 'Imperial Tahitian Black Pearl Crown Ring',
      name_khmer: 'ចិញ្ចៀនគុជខ្យងខ្មៅតាហ៊ីទី Imperial Tahitian',
      category_id: 'cat-ring',
      price: 185,
      original_price: 220,
      description: 'A breathtaking dark peacock Tahitian cultured pearl set atop an intricate 18K white gold crown filigree band.',
      description_khmer: 'គុជខ្យងខ្មៅតាហ៊ីទីពណ៌ស្លាបក្ងោកដ៏កម្រ ដាំលើតួចិញ្ចៀនរាងម្កុដមាសស 18K យ៉ាងស្រស់ស្អាត។',
      pearl_type: 'Tahitian',
      color: 'Peacock Tahitian',
      size: '9.5 - 10.0 mm',
      material: '18K White Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'in_stock',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: true,
      is_bestseller: true,
      rating: 4.88,
      review_count: 31,
    },
    {
      id: 'prod-05',
      sku: 'MDP-ST-005',
      name: 'Royal Monarchy Baroque Bridal Suite (3-Piece)',
      name_khmer: 'ឈុតកូនក្រមុំរាជវង្ស Baroque Royal Suite (៣ មុខ)',
      category_id: 'cat-set',
      price: 460,
      original_price: 550,
      description: 'Exclusive 3-piece matched jewelry set featuring organic undulating baroque pearls, sparkling zircons, and hand-knotted silk thread.',
      description_khmer: 'ឈុតគ្រឿងអលង្ការ ៣ មុខរួមមានខ្សែក ក្រវិល និងកងដៃ ជាមួយគុជខ្យង Baroque ធម្មជាតិដ៏កម្រសម្រាប់ពិធីមង្គលការ។',
      pearl_type: 'Baroque',
      color: 'Classic White',
      size: '12.0 - 15.0 mm',
      material: '18K Yellow Gold',
      lustre: 'Baroque Lustre',
      availability: 'made_to_order',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: true,
      is_bestseller: false,
      rating: 5.0,
      review_count: 14,
    },
    {
      id: 'prod-06',
      sku: 'MDP-AC-006',
      name: 'Victoria Palace Pearl Bouquet Brooch',
      name_khmer: 'ម្ជុលខ្ទាស់អាវគុជខ្យងផ្កាចង្កោម Victoria Palace',
      category_id: 'cat-accessories',
      price: 75,
      original_price: 95,
      description: 'Vintage-inspired floral brooch adorned with six natural lavender-rose freshwater seed pearls and micro-pave crystals.',
      description_khmer: 'ម្ជុលខ្ទាស់អាវរចនាបថផ្កាបុរាណ ដាំគុជខ្យងទឹកសាប ៦ គ្រាប់ និងត្បូងភ្លឺផ្លេកៗយ៉ាងប្រណីត។',
      pearl_type: 'Freshwater',
      color: 'Soft Rose Pink',
      size: '5.5 - 6.5 mm',
      material: 'Platinum Plated',
      lustre: 'AAA Grade',
      availability: 'in_stock',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: false,
      is_bestseller: false,
      rating: 4.75,
      review_count: 19,
    },
    {
      id: 'prod-07',
      sku: 'MDP-NK-007',
      name: 'Double Strand Opera Akoya Pearl Choker',
      name_khmer: 'ខ្សែកគុជខ្យង Akoya ២ ខ្សែរចនាបថ Opera',
      category_id: 'cat-necklace',
      price: 320,
      original_price: 380,
      description: 'Sophisticated graduated double strand necklace featuring Japanese Akoya pearls with 18K white gold locking centerpiece.',
      description_khmer: 'ខ្សែក ២ ខ្សែរៀបតាមទំហំយ៉ាងស្រស់ស្អាត ជាមួយគុជខ្យង Akoya ជប៉ុន និងគន្លឹះមាសស 18K។',
      pearl_type: 'Akoya',
      color: 'Classic White',
      size: '6.5 - 7.5 mm',
      material: '18K White Gold',
      lustre: 'Hanadama Equivalent',
      availability: 'limited',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: false,
      is_bestseller: true,
      rating: 4.92,
      review_count: 22,
    },
    {
      id: 'prod-08',
      sku: 'MDP-ER-008',
      name: 'Tahitian Night Peacock Pearl Studs',
      name_khmer: 'ក្រវិលអំបោះដាំគុជខ្យងខ្មៅ Tahitian Night',
      category_id: 'cat-earrings',
      price: 135,
      original_price: 165,
      description: 'Near-round Tahitian pearls with iridescent green-aubergine overtone, secured on 18K yellow gold posts.',
      description_khmer: 'ក្រវិលដាំគុជខ្យងខ្មៅតាហ៊ីទីពន្លឺបៃតងរលោងស្រស់ស្អាត ជាមួយជើងមាស 18K។',
      pearl_type: 'Tahitian',
      color: 'Peacock Tahitian',
      size: '8.5 - 9.0 mm',
      material: '18K Yellow Gold',
      lustre: 'AAAA Gem Grade',
      availability: 'in_stock',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
      ]),
      is_featured: false,
      is_bestseller: true,
      rating: 4.85,
      review_count: 27,
    },
  ];

  for (const prod of products) {
    await client.query(`
      INSERT INTO products (
        id, sku, name, name_khmer, category_id, price, original_price,
        description, description_khmer, pearl_type, color, size,
        material, lustre, availability, images, is_featured, is_bestseller,
        rating, review_count
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      ON CONFLICT (id) DO UPDATE SET
        sku = EXCLUDED.sku,
        name = EXCLUDED.name,
        name_khmer = EXCLUDED.name_khmer,
        category_id = EXCLUDED.category_id,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        description = EXCLUDED.description,
        description_khmer = EXCLUDED.description_khmer,
        pearl_type = EXCLUDED.pearl_type,
        color = EXCLUDED.color,
        size = EXCLUDED.size,
        material = EXCLUDED.material,
        lustre = EXCLUDED.lustre,
        availability = EXCLUDED.availability,
        images = EXCLUDED.images,
        is_featured = EXCLUDED.is_featured,
        is_bestseller = EXCLUDED.is_bestseller,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count;
    `, [
      prod.id, prod.sku, prod.name, prod.name_khmer, prod.category_id, prod.price, prod.original_price,
      prod.description, prod.description_khmer, prod.pearl_type, prod.color, prod.size,
      prod.material, prod.lustre, prod.availability, prod.images, prod.is_featured, prod.is_bestseller,
      prod.rating, prod.review_count
    ]);
  }

  // Initial Orders
  const initialOrders = [
    {
      id: 'PRL-8492',
      product_id: 'prod-01',
      product_name: 'Aura Princess Freshwater Pearl Necklace',
      product_price: 120,
      product_image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
      pearl_type: 'Freshwater',
      size: '8.0 - 8.5 mm',
      material: '925 Sterling Silver',
      quantity: 1,
      total_amount: 120,
      customer_name: 'Sokha Chea',
      customer_phone: '012 555 789',
      customer_telegram: '@sokhachea_kh',
      customer_address: 'St. 214, Sangkat Boeung Raing',
      customer_city: 'Phnom Penh',
      notes: 'Please wrap with luxury velvet ribbon box for anniversary gift.',
      admin_notes: 'Customer confirmed via Telegram. VIP gift wrapping applied.',
      status: 'CONFIRMED',
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
    {
      id: 'PRL-3914',
      product_id: 'prod-03',
      product_name: 'Golden South Sea Pearl Cuff Bracelet',
      product_price: 240,
      product_image: 'https://images.unsplash.com/photo-1611591475155-428800936735?auto=format&fit=crop&w=1000&q=85',
      pearl_type: 'South Sea',
      size: '10.0 - 11.0 mm',
      material: '18K Yellow Gold',
      quantity: 1,
      total_amount: 240,
      customer_name: 'Bopha Vann',
      customer_phone: '098 333 222',
      customer_telegram: '@bopha_v',
      customer_address: 'Villa 18, Borey Peng Huoth The Star Platinum',
      customer_city: 'Phnom Penh',
      notes: 'Need delivery on Saturday afternoon.',
      admin_notes: 'Pending final dispatch call.',
      status: 'CONTACTED',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
    },
  ];

  for (const o of initialOrders) {
    await client.query(`
      INSERT INTO orders (
        id, product_id, product_name, product_price, product_image,
        pearl_type, size, material, quantity, total_amount,
        customer_name, customer_phone, customer_telegram,
        customer_address, customer_city, notes, admin_notes, status, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (id) DO NOTHING;
    `, [
      o.id, o.product_id, o.product_name, o.product_price, o.product_image,
      o.pearl_type, o.size, o.material, o.quantity, o.total_amount,
      o.customer_name, o.customer_phone, o.customer_telegram,
      o.customer_address, o.customer_city, o.notes, o.admin_notes, o.status, o.created_at
    ]);
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

  await client.query(`
    INSERT INTO store_settings (id, data, updated_at)
    VALUES (1, $1, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      data = EXCLUDED.data,
      updated_at = CURRENT_TIMESTAMP;
  `, [JSON.stringify(initialSettings)]);

  console.log('[Neon PostgreSQL] Seed completed successfully.');
}
