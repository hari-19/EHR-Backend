import { UserModel, UserSchema } from '../schemas/user';
import { Request, Response } from 'express';
import { Joi } from 'express-validation';
import { sendError } from "../helpers/errorHelper";
import { v4 as uuidv4 } from 'uuid';

/**
 * SignUp Patient User Controller Validator Config
 */
export const signUpValidation = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        contactNumber: Joi.string().required(),
        address: Joi.string().required()
    }),
};

/**
 * Function to SignUp Patient Users Controller.
 * id, name, contactNumber, address are the required body values for the controller.
 */
export async function signUp(req: Request, res: Response, next: any) {
    try {
        const { id, name, contactNumber, address } = req.body;
        const sameUserCheck = await UserModel.find({
            name, contactNumber
        });

        if(sameUserCheck.length > 0) {
            sendError(res, 400, "User Already Exist");
        }

        await UserModel.create({
            _id: id, name, contactNumber, address
        })

        res.status(201).send({
            message: "User Created Successfully"
        });
    }
    catch(err) {
        next(err);
    }
}