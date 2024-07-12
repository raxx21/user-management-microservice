import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  name: string;
  surname: string;
  username: string;
  birthdate: string;
  email: string;
  blockList: string[];
}
