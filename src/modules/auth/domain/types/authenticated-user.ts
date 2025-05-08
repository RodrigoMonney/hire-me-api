import { Role } from '../../domain/enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}
