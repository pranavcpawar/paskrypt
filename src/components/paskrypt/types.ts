import { z } from 'zod';
import { userSchema } from '../schema/users';

export type User = z.infer<typeof userSchema>;
