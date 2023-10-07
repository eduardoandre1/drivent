import { Router } from 'express';
import { bookingController } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingRouter = Router();
bookingRouter.all('/*', authenticateToken);
bookingRouter.get('/', bookingController.getBookingbyid);
bookingRouter.post('/', bookingController.postBooking);
bookingRouter.put('/:bookingId', bookingController.putBooking);

export { bookingRouter };
