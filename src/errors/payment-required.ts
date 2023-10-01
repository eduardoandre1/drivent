import { ApplicationError } from '@/protocols';

export function PaymentRequired(): ApplicationError {
  return {
    name: 'Payment Required',
    message: 'you must pay the ticket or you ticket must be included hotel',
  };
}
