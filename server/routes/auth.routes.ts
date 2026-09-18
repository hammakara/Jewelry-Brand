import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { hashPassword, comparePassword, generateToken, ensureDefaultAdmin } from '../lib/auth';

const router = Router();

router.post('/auth/register', async (req, res) => {
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

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    const assignedRole = adminCount === 0 ? 'ADMIN' : (role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER');

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

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pranith.luxury';
    if (!user && normalizedEmail === adminEmail) {
      await ensureDefaultAdmin();
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    }

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

router.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
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

router.put('/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
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

router.post('/auth/change-password', authenticateToken, async (req: AuthenticatedRequest, res) => {
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

router.get('/auth/users', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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

router.post('/auth/users', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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
        role: role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER',
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

router.delete('/auth/users/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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

export default router;