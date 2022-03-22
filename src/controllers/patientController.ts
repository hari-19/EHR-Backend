import { PatientModel, PatientSchema } from "../schemas/patient";
import { Request, Response } from "express";
import { Joi } from "express-validation";
import { sendError } from "../helpers/errorHelper";
import bcrypt from "bcrypt";
import * as authService from "../services/authService";
import GunDB from "../gun";
import * as encryptionService from "../services/encryptionService";


async function generateAndCheckIdPatientId(): Promise<string> {
  const id: string = ( "0000000000" + (Math.floor(Math.random() * 10000000000)).toString()).slice(-10);
  const patientNode = GunDB.root.get("EHR-Patient");
  const val = await patientNode.get(id).promise();
  console.log(val.put);
  if(val.put) {
    return generateAndCheckIdPatientId();
  }
  return id;
}

export async function registerPatient(req: Request, res: Response, next: any) {
  const patientNode = GunDB.root.get("EHR-Patient");
  const id = await generateAndCheckIdPatientId();
  const keyPair = encryptionService.generateKey();
  console.log(keyPair);
  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  const password = await bcrypt.hash(keyPair.privateKey, salt);
  const hashedPassword = await bcrypt.hash(password, salt);

  patientNode.get(id).put({
    id,
    password: hashedPassword,
    ethPublicKey: keyPair.publicKey
  });

  res.status(201);
  res.json({
    id,
    keyPair,
    password
  });
}

/**
 * SignUp Patient User Controller Validator Config
 */
export const signUpValidation = {
  body: Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    contactNumber: Joi.string().required(),
    emailId: Joi.string().email(),
    address: Joi.string().required(),
    dob: Joi.string().isoDate().required(),
  }),
};
// 6414287577

/**
 * Function to SignUp Patient Users Controller.
 * id, name, contactNumber, address, password are the required body values for the controller.
 */
export async function signUp(req: Request, res: Response, next: any) {
  try {
    const {
      id,
      name,
      contactNumber,
      address,
      emailId,
      dob,
    } = req.body;

    const patientNode = GunDB.root.get("EHR-Patient");
    const p = await patientNode.get(id).promise();
    let user;
    if(p.put) {
      user = {
        ethPublicKey: p.put.ethPublicKey,
        id,
        password: p.put.password
      }
    }

    if(!user) {
      sendError(res, 400, "User not registered");
      return;
    }

    const sameUserCheck = await PatientModel.findById(id);

    if (sameUserCheck) {
      sendError(res, 400, "User Already Exist");
      return;
    }

    const dobObj = new Date(dob);
    await PatientModel.create({
      _id: id,
      name,
      contactNumber,
      address,
      ethPublicKey: user.ethPublicKey,
      emailId,
      dob: dobObj,
    });

    res.status(201).send({
      message: "Patient Added Successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * SignIn Patient User Controller Validator Config
 */
export const signInValidation = {
  body: Joi.object({
    id: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

/**
 * Function to SignIn Patient Users Controller.
 * id, password are the required body values for the controller.
 */
export async function signIn(req: Request, res: Response, next: any) {
  try {
    const { id, password } = req.body;
    const patientNode = GunDB.root.get("EHR-Patient");
    const p = await patientNode.get(id).promise();
    console.log(p.put);
    let user;
    if(p.put) {
      user = {
        ethPublicKey: p.put.ethPublicKey,
        id,
        password: p.put.password
      }
    }

    if (!user) {
      sendError(res, 400, "User doesn't exist");
      return;
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      sendError(res, 401, "Incorrect Password");
      return;
    }

    const tokenData = {
      id: user.id,
      ethPublicKey: user.ethPublicKey
    };

    const token = authService.generateAccessToken(tokenData);
    res.status(200).send({
      token,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * getPatientDetails User Controller Validator Config
 */
export const getPatientDetailsValidation = {
  body: Joi.object({
    id: Joi.string().required(),
  }),
};

/**
 * Function to Return Patient Details.
 * id is the required body values for the controller.
 */
export async function getPatientDetails(
  req: Request,
  res: Response,
  next: any
) {
  try {
    const { id } = req.body;
    const user = await PatientModel.findById(id);

    if (!user) {
      sendError(res, 400, "User doesn't exist");
      return;
    }

    const responseData = {
      id: user.id,
      name: user.name,
      contactNumber: user.contactNumber,
      address: user.address,
      dob: user.dob.toISOString(),
    };

    res.status(200).send(responseData);
  } catch (err) {
    next(err);
  }
}

/**
 * patientSearch User Controller Validator Config
 */
export const patientSearchValidation = {
  body: Joi.object({
    key: Joi.string().required(),
  }),
};

/**
 * Function to Return Patient Details with key.
 * id is the required body values for the controller.
 */
export async function patientSearch(req: Request, res: Response, next: any) {
  try {
    const { key } = req.body;
    let responseData: any[] = [];
    let user = await PatientModel.find({
      name: { $regex: ".*" + key + ".*", $options: 'i' },
    });

    responseData = responseData.concat(
      user.map((u) => {
        return {
          id: u._id,
          name: u.name,
          contactNumber: u.contactNumber,
          address: u.address,
          dob: u.dob.toISOString(),
        };
      })
    );

    user = await PatientModel.find({
        _id: { $regex: "^" + key + ".*" },
    });

    console.log(user);

    responseData = responseData.concat(
        user.map((u) => {
          return {
            id: u._id,
            name: u.name,
            contactNumber: u.contactNumber,
            address: u.address,
            dob: u.dob.toISOString(),
          };
        })
      );

    res.status(200).send({
        data: responseData
    });
  } catch (err) {
    next(err);
  }
}
