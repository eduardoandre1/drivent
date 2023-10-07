import { ApplicationError } from '@/protocols';

export function ForbiddenError(message?: string): ApplicationError {
  return {
    name: 'Forbidden',
    message: message ? message : 'you are not allowed to access this application whitout  permission ',
  };
}
