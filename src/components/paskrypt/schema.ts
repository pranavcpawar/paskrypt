import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(1, 'username is required').min(3, 'username must be at least 3 characters'),
  password: z.string().min(1, 'password is required').min(8, 'password must be at least 8 characters'),
});
