import * as mongoose from 'mongoose';

export interface UserSchema {
    _id: string,
    name: string,
    contactNumber: string,
    address: string,
    password: string
}

const userSchema = new mongoose.Schema<UserSchema>({
    _id: String,
    name: String,
    contactNumber: String,
    address: String,
    password: String
});

export const UserModel = mongoose.model<UserSchema>('User', userSchema);