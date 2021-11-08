import { UserModel, UserSchema } from '../schemas/user';
import { Request, Response } from 'express';
import { Joi } from 'express-validation';
import { sendError } from "../helpers/errorHelper";
import bcrypt from 'bcrypt';
import * as authService from '../services/authService';

/**
 * SignUp Patient User Controller Validator Config
 */
export const signUpValidation = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        contactNumber: Joi.string().required(),
        address: Joi.string().required(),
        password: Joi.string().required()
    }),
};

/**
 * Function to SignUp Patient Users Controller.
 * id, name, contactNumber, address, password are the required body values for the controller.
 */
export async function signUp(req: Request, res: Response, next: any) {
    try {
        const { id, name, contactNumber, address, password } = req.body;
        const sameUserCheck = await UserModel.find({
            name, contactNumber
        });

        if(sameUserCheck.length > 0) {
            sendError(res, 400, "User Already Exist");
        }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        const hashedPassword = await bcrypt.hash(password, salt);

        await UserModel.create({
            _id: id, name, contactNumber, address, password: hashedPassword
        })

        res.status(201).send({
            message: "User Created Successfully"
        });
    }
    catch(err) {
        next(err);
    }
}

/**
 * SignIn Patient User Controller Validator Config
 */
export const signInValidation = {
   body: Joi.object({
        id: Joi.string().required(),
        password: Joi.string().required()
    }),
};

/**
 * Function to SignIn Patient Users Controller.
 * id, password are the required body values for the controller.
 */
export async function signIn(req: Request, res: Response, next: any) {
    try {
        const { id, password } = req.body;
        const user = await UserModel.findById(id);

        if(!user) {
            sendError(res, 400, "User doesn't exist");
            return;
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            sendError(res, 401, "Incorrect Password");
            return;
        }

        const tokenData = {
            id: user.id,
            name: user.name,
            contactNumber: user.contactNumber,
            address: user.address
        };

        const token = authService.generateAccessToken(tokenData);
        res.status(200).send({
            token
        })
    }
    catch(err) {
        next(err);
    }
}