import * as mongoose from 'mongoose';
import mongodb from 'mongodb';

export interface UserSchema {
    _id: string,
    name: string,
    contactNumber: string,
    address: string,
}

const userSchema = new mongoose.Schema<UserSchema>({
    _id: String,
    name: String,
    contactNumber: String,
    address: String,
});

export const UserModel = mongoose.model<UserSchema>('User', userSchema);