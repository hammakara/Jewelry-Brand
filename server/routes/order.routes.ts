import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/orders', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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

router.post('/orders', async (req, res) => {
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

router.patch('/orders/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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

router.delete('/orders/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthenticatedRequest, res) => {
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

export default router;