import { Router } from 'express';
import { bookingController } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();
bookingRouter.get('/', bookingController.getBookingbyid);
bookingRouter.post('/', bookingController.postBooking);
bookingRouter.put('/', bookingController.putBooking);
bookingRouter.all('/*', authenticateToken);

export { bookingRouter };
