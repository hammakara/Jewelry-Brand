import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { prisma, initPrismaDatabase, seedPrismaData } from './server/prismaDb';
import {
  authenticateToken,
  requireRole,
  hashPassword,
  comparePassword,
  generateToken,
  AuthenticatedRequest,
} from './server/auth';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize JSON middleware
  app.use(express.json());

  // Initialize Prisma & Neon Database
  await initPrismaDatabase();

  // --- API Routes using PRISMA & SECURE AUTH ---

  // Health / DB connection & Auth status
  app.get('/api/health', async (req: Request, res: Response) => {
    try {
      const [nowResult, productCount, userCount] = await Promise.all([
        prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`,
        prisma.product.count(),
        prisma.user.count(),
      ]);
      res.json({
        status: 'ok',
        orm: 'Prisma Client',
        database: 'Neon PostgreSQL',
        authentication: 'Full JWT + BCrypt + RBAC',
        connected: true,
        serverTime: nowResult[0]?.now || new Date(),
        productCount,
        userCount,
      });
    } catch (err: any) {
      res.status(500).json({
        status: 'error',
        orm: 'Prisma Client',
        database: 'Neon PostgreSQL',
        connected: false,
        error: err.message,
      });
    }
  });

  // ==========================================
  // --- AUTHENTICATION & USER MANAGEMENT ---
  // ==========================================

  // Register New User (Account creation)
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name, phone, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        return res.status(400).json({ error: 'Invalid email address format.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email address already exists.' });
      }

      // First registered user becomes ADMIN if no admins exist
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      const assignedRole = adminCount === 0 ? 'ADMIN' : (role || 'STAFF');

      const passwordHash = await hashPassword(password);
      const userId = `usr-${Date.now()}`;

      const user = await prisma.user.create({
        data: {
          id: userId,
          email: normalizedEmail,
          passwordHash,
          name: name.trim(),
          phone: phone ? phone.trim() : null,
          role: assignedRole,
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        },
      });

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = generateToken(tokenPayload);

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      console.error('Error during registration:', err);
      res.status(500).json({ error: err.message || 'Registration failed' });
    }
  });

  // Login User
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      const token = generateToken(tokenPayload);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      console.error('Error during login:', err);
      res.status(500).json({ error: err.message || 'Login failed' });
    }
  });

  // Get Current Authenticated Profile
  app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      });
    } catch (err: any) {
      console.error('Error fetching auth user:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Update Profile
  app.put('/api/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { name, phone, avatarUrl } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name && { name: name.trim() }),
          ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
          ...(avatarUrl !== undefined && { avatarUrl }),
        },
      });

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Change Password
  app.post('/api/auth/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await comparePassword(currentPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Incorrect current password.' });
      }

      const newPasswordHash = await hashPassword(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      });

      res.json({ success: true, message: 'Password updated successfully.' });
    } catch (err: any) {
      console.error('Error changing password:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: List Users / Staff
  app.get('/api/auth/users', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Create Team Member
  app.post('/api/auth/users', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { email, password, name, phone, role } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and full name are required.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing) {
        return res.status(409).json({ error: 'User with this email already exists.' });
      }

      const passwordHash = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          id: `usr-${Date.now()}`,
          email: normalizedEmail,
          passwordHash,
          name: name.trim(),
          phone: phone ? phone.trim() : null,
          role: role || 'STAFF',
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(normalizedEmail)}`,
        },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
        },
      });

      res.status(201).json(user);
    } catch (err: any) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Admin: Delete User
  app.delete('/api/auth/users/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (id === req.user!.userId) {
        return res.status(400).json({ error: 'Cannot delete your own administrative account.' });
      }

      await prisma.user.delete({
        where: { id },
      });

      res.json({ success: true, message: 'User deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // --- CATEGORIES (Public Read, Protected Write) ---
  // ==========================================
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
      });
      res.json(categories);
    } catch (err: any) {
      console.error('Prisma Error fetching categories:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/categories', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id, name, nameKhmer, slug, description, descriptionKhmer, image } = req.body;
      const catId = id || `cat-${Date.now()}`;
      const category = await prisma.category.create({
        data: {
          id: catId,
          name,
          nameKhmer: nameKhmer || name,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          description: description || '',
          descriptionKhmer: descriptionKhmer || '',
          image: image || '',
        },
      });
      res.status(201).json(category);
    } catch (err: any) {
      console.error('Prisma Error creating category:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/categories/:id', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { name, nameKhmer, slug, description, descriptionKhmer, image } = req.body;
      const category = await prisma.category.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(nameKhmer !== undefined && { nameKhmer }),
          ...(slug !== undefined && { slug }),
          ...(description !== undefined && { description }),
          ...(descriptionKhmer !== undefined && { descriptionKhmer }),
          ...(image !== undefined && { image }),
        },
      });
      res.json(category);
    } catch (err: any) {
      console.error('Prisma Error updating category:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/categories/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.category.delete({
        where: { id },
      });
      res.json({ success: true, message: 'Category deleted' });
    } catch (err: any) {
      console.error('Prisma Error deleting category:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // --- PRODUCTS (Public Read, Protected Write) ---
  // ==========================================
  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const formatted = products.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        nameKhmer: p.nameKhmer,
        categoryId: p.categoryId,
        price: Number(p.price),
        originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
        description: p.description || '',
        descriptionKhmer: p.descriptionKhmer || '',
        pearlType: p.pearlType,
        color: p.color,
        size: p.size,
        material: p.material,
        lustre: p.lustre,
        availability: p.availability as any,
        images: Array.isArray(p.images) ? (p.images as string[]) : [],
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestseller,
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        createdAt: p.createdAt.toISOString(),
      }));

      res.json(formatted);
    } catch (err: any) {
      console.error('Prisma Error fetching products:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/products', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const {
        id, sku, name, nameKhmer, categoryId, price, originalPrice,
        description, descriptionKhmer, pearlType, color, size,
        material, lustre, availability, images, isFeatured, isBestSeller,
        rating, reviewCount,
      } = req.body;

      const prodId = id || `prod-${Date.now()}`;
      const product = await prisma.product.create({
        data: {
          id: prodId,
          sku: sku || `PRL-${Math.floor(1000 + Math.random() * 9000)}`,
          name,
          nameKhmer: nameKhmer || name,
          categoryId,
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : null,
          description: description || '',
          descriptionKhmer: descriptionKhmer || '',
          pearlType: pearlType || 'Freshwater',
          color: color || 'Classic White',
          size: size || '8.0 mm',
          material: material || '925 Sterling Silver',
          lustre: lustre || 'AAA Grade',
          availability: availability || 'in_stock',
          images: Array.isArray(images) ? images : [],
          isFeatured: !!isFeatured,
          isBestseller: !!isBestSeller,
          rating: rating ? Number(rating) : 5.0,
          reviewCount: reviewCount ? Number(reviewCount) : 0,
        },
      });

      res.status(201).json({
        id: product.id,
        sku: product.sku,
        name: product.name,
        nameKhmer: product.nameKhmer,
        categoryId: product.categoryId,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        description: product.description || '',
        descriptionKhmer: product.descriptionKhmer || '',
        pearlType: product.pearlType,
        color: product.color,
        size: product.size,
        material: product.material,
        lustre: product.lustre,
        availability: product.availability,
        images: product.images,
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestseller,
        rating: Number(product.rating),
        reviewCount: product.reviewCount,
        createdAt: product.createdAt.toISOString(),
      });
    } catch (err: any) {
      console.error('Prisma Error creating product:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/products/:id', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        sku, name, nameKhmer, categoryId, price, originalPrice,
        description, descriptionKhmer, pearlType, color, size,
        material, lustre, availability, images, isFeatured, isBestSeller,
        rating, reviewCount,
      } = req.body;

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(sku !== undefined && { sku }),
          ...(name !== undefined && { name }),
          ...(nameKhmer !== undefined && { nameKhmer }),
          ...(categoryId !== undefined && { categoryId }),
          ...(price !== undefined && { price: Number(price) }),
          ...(originalPrice !== undefined && { originalPrice: originalPrice ? Number(originalPrice) : null }),
          ...(description !== undefined && { description }),
          ...(descriptionKhmer !== undefined && { descriptionKhmer }),
          ...(pearlType !== undefined && { pearlType }),
          ...(color !== undefined && { color }),
          ...(size !== undefined && { size }),
          ...(material !== undefined && { material }),
          ...(lustre !== undefined && { lustre }),
          ...(availability !== undefined && { availability }),
          ...(images !== undefined && { images }),
          ...(isFeatured !== undefined && { isFeatured }),
          ...(isBestSeller !== undefined && { isBestseller: isBestSeller }),
          ...(rating !== undefined && { rating: Number(rating) }),
          ...(reviewCount !== undefined && { reviewCount: Number(reviewCount) }),
        },
      });

      res.json({
        id: product.id,
        sku: product.sku,
        name: product.name,
        nameKhmer: product.nameKhmer,
        categoryId: product.categoryId,
        price: Number(product.price),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        description: product.description || '',
        descriptionKhmer: product.descriptionKhmer || '',
        pearlType: product.pearlType,
        color: product.color,
        size: product.size,
        material: product.material,
        lustre: product.lustre,
        availability: product.availability,
        images: product.images,
        isFeatured: product.isFeatured,
        isBestSeller: product.isBestseller,
        rating: Number(product.rating),
        reviewCount: product.reviewCount,
        createdAt: product.createdAt.toISOString(),
      });
    } catch (err: any) {
      console.error('Prisma Error updating product:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/products/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.product.delete({
        where: { id },
      });
      res.json({ success: true, message: 'Product deleted' });
    } catch (err: any) {
      console.error('Prisma Error deleting product:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // --- ORDERS (Public Create, Protected Admin/Staff View & Update) ---
  // ==========================================
  app.get('/api/orders', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      });

      const formatted = orders.map((o) => ({
        id: o.id,
        productId: o.productId,
        productName: o.productName,
        productPrice: Number(o.productPrice),
        productImage: o.productImage || '',
        pearlType: o.pearlType || '',
        size: o.size || '',
        material: o.material || '',
        quantity: o.quantity,
        totalAmount: Number(o.totalAmount),
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        customerTelegram: o.customerTelegram || '',
        customerAddress: o.customerAddress,
        customerCity: o.customerCity,
        notes: o.notes || '',
        adminNotes: o.adminNotes || '',
        status: o.status as any,
        createdAt: o.createdAt.toISOString(),
        updatedAt: o.updatedAt.toISOString(),
      }));

      res.json(formatted);
    } catch (err: any) {
      console.error('Prisma Error fetching orders:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const {
        id, productId, productName, productPrice, productImage,
        pearlType, size, material, quantity, totalAmount,
        customerName, customerPhone, customerTelegram,
        customerAddress, customerCity, notes, adminNotes, status,
      } = req.body;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = id || `PRL-${randomNum}`;
      const qty = quantity || 1;
      const calcTotal = totalAmount || (Number(productPrice) * qty);

      const order = await prisma.order.create({
        data: {
          id: orderId,
          productId,
          productName,
          productPrice: Number(productPrice),
          productImage: productImage || '',
          pearlType: pearlType || '',
          size: size || '',
          material: material || '',
          quantity: qty,
          totalAmount: calcTotal,
          customerName,
          customerPhone,
          customerTelegram: customerTelegram || '',
          customerAddress,
          customerCity,
          notes: notes || '',
          adminNotes: adminNotes || '',
          status: status || 'PENDING',
        },
      });

      res.status(201).json({
        id: order.id,
        productId: order.productId,
        productName: order.productName,
        productPrice: Number(order.productPrice),
        productImage: order.productImage,
        pearlType: order.pearlType,
        size: order.size,
        material: order.material,
        quantity: order.quantity,
        totalAmount: Number(order.totalAmount),
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerTelegram: order.customerTelegram,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        notes: order.notes,
        adminNotes: order.adminNotes,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
    } catch (err: any) {
      console.error('Prisma Error creating order:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.patch('/api/orders/:id', authenticateToken, requireRole('ADMIN', 'STAFF'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      const order = await prisma.order.update({
        where: { id },
        data: {
          ...(status !== undefined && { status }),
          ...(adminNotes !== undefined && { adminNotes }),
        },
      });

      res.json({
        id: order.id,
        productId: order.productId,
        productName: order.productName,
        productPrice: Number(order.productPrice),
        productImage: order.productImage,
        pearlType: order.pearlType,
        size: order.size,
        material: order.material,
        quantity: order.quantity,
        totalAmount: Number(order.totalAmount),
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerTelegram: order.customerTelegram,
        customerAddress: order.customerAddress,
        customerCity: order.customerCity,
        notes: order.notes,
        adminNotes: order.adminNotes,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      });
    } catch (err: any) {
      console.error('Prisma Error updating order:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/orders/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.order.delete({
        where: { id },
      });
      res.json({ success: true, message: 'Order deleted' });
    } catch (err: any) {
      console.error('Prisma Error deleting order:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // --- SETTINGS (Public Read, Admin Write) ---
  // ==========================================
  app.get('/api/settings', async (req: Request, res: Response) => {
    try {
      const settings = await prisma.storeSettingsModel.findUnique({
        where: { id: 1 },
      });
      if (settings) {
        res.json(settings.data);
      } else {
        res.status(404).json({ error: 'Settings not found' });
      }
    } catch (err: any) {
      console.error('Prisma Error fetching settings:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/settings', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const newSettings = req.body;
      const settings = await prisma.storeSettingsModel.upsert({
        where: { id: 1 },
        update: { data: newSettings },
        create: { id: 1, data: newSettings },
      });
      res.json(settings.data);
    } catch (err: any) {
      console.error('Prisma Error updating settings:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- SEED / RESET (Admin only) ---
  app.post('/api/seed', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res: Response) => {
    try {
      await seedPrismaData();
      res.json({ success: true, message: 'Prisma database reset and re-seeded successfully.' });
    } catch (err: any) {
      console.error('Prisma Error seeding database:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // --- Vite / Static Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Live on http://localhost:${PORT} with Secure Prisma + JWT Authentication`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Prisma server:', err);
});
