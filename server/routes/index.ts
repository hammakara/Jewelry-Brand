import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import settingsRoutes from './settings.routes';
import uploadRoutes from './upload.routes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use(authRoutes);
apiRouter.use(categoryRoutes);
apiRouter.use(productRoutes);
apiRouter.use(orderRoutes);
apiRouter.use(settingsRoutes);
apiRouter.use(uploadRoutes);

export default apiRouter;