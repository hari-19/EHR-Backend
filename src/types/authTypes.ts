import { Request, Response } from 'express';

export interface UserRequest extends Request{
    user: any;
};