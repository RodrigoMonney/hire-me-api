import { Role } from 'src/modules/auth/domain/enums/role.enum';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }
  }
}
