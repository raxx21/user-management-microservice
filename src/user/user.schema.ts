import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  surname: String,
  username: String,
  birthdate: String,
  email: String,
  blockList: [String],
});
