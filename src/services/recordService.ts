// import { ConfigModel, ConfigSchema } from "../schemas/config";

// export async function getNewRecordId() {
//     const config: ConfigSchema = await ConfigModel.findById(0);

//     if (!config) {
//         throw new Error("Config document not found");
//     }

//     const { hospitalId, recordSl } = config;
//     const recordId: string = ("00000000" + (recordSl + 1)).slice(-8);
//     return hospitalId + "-" + recordId;
// }

// export async function 