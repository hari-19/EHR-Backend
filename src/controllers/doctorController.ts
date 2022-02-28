import { DoctorModel, DoctorSchema } from '../schemas/doctor';
import { Request, Response } from 'express';
import { Joi } from 'express-validation';
import { sendError } from "../helpers/errorHelper";
import bcrypt from 'bcrypt';
import * as authService from '../services/authService';
import { HospitalModel, HospitalSchema } from '../schemas/hospital';
import * as ethService from "../services/ethService";
import GunDB from "../gun";

/**
 * Register Doctor User Controller Validator Config
 */
 export const registerValidation = {
    body: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required()
    }),
};

/**
 * Function to register Doctor Users Controller.
 * id, name are the required body values for the controller.
 */
export async function  register(req: Request, res: Response, next: any) {
    try {
        const { id, name } = req.body;

        const hospitalId = process.env.HOSPITAL_ID;

        await ethService.postDoctor(id, hospitalId, name);

        res.status(201).send({
            message: "Doctor registered successfully"
        });
    }
    catch(err) {
        next(err);
    }
}


/**
 * SignUp Doctor User Controller Validator Config
 */
 export const signUpValidation = {
    body: Joi.object({
        id: Joi.string().required(),
        email_id: Joi.string().email().required(),
        password: Joi.string().required()
    }),
};

/**
 * Function to SignUp Doctor Users Controller.
 * id, name, contactNumber, address, password are the required body values for the controller.
 */
export async function signUp(req: Request, res: Response, next: any) {
    try {
        const { id, email_id, password } = req.body;
        const sameUserCheck = await DoctorModel.findById(id);

        console.log(sameUserCheck);
        // if(sameUserCheck.length > 0) {
        //     sendError(res, 400, "User Already Exist");
        // }

        // get user details from blockchain
        const doctorName = await ethService.getDoctorDetails(id);
        console.log(doctorName);

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        const hashedPassword = await bcrypt.hash(password, salt);

        const hospitalId = process.env.HOSPITAL_ID;

        await ethService.updateDoctorHospital(id, hospitalId);

        await DoctorModel.create({
            _id: id, email_id, password: hashedPassword, hospitalId, name: doctorName
        });

        res.status(201).send({
            message: "Doctor account created Successfully"
        });
    }
    catch(err) {
        next(err);
    }
}

/**
 * SignIn Doctor User Controller Validator Config
 */
 export const signInValidation = {
    body: Joi.object({
         email_id: Joi.string().email().required(),
         password: Joi.string().required()
     }),
 };

/**
 * Function to SignIn Doctor Users Controller.
 * id, password are the required body values for the controller.
 */
 export async function signIn(req: Request, res: Response, next: any) {
    try {
        const { email_id, password } = req.body;
        const userArray = await DoctorModel.find({
            email_id
        });

        if(userArray.length === 0) {
            sendError(res, 400, "User doesn't exist");
            return;
        }

        const user = userArray[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            sendError(res, 401, "Incorrect Password");
            return;
        }

        const tokenData = {
            id: user._id,
            email_id: user.email_id
        };

        const token = authService.generateAccessToken(tokenData);
        console.log(user);

        const hospitalNode = GunDB.root.get("EHR-Hospital");
        const hospitalDataNode = await hospitalNode.get(user.hospitalId).promise();
        res.status(200).send({
            id: user._id,
            name: user.name,
            hospitalId: user.hospitalId,
            hospitalName: hospitalDataNode.put.name,
            token
        })
    }
    catch(err) {
        next(err);
    }
}