import Web3 from 'web3'
import { Account } from 'web3-core'
import * as RecordContract from '../../contracts/artifacts/Record.json'
import * as DoctorContract from '../../contracts/artifacts/Doctor.json'
import * as UserContract from '../../contracts/artifacts/User.json'
import * as RecordKeyContract from '../../contracts/artifacts/RecordKey.json'
import { AbiItem } from 'web3-utils'

let web3: Web3;
const connectEth = () => {
    if(!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_HOST))
    }
}

export const createEthAccount = async () => {
    connectEth();
    const acc = web3.eth.accounts.create();
    return acc;
}


export const addAccount = async (privateKey: string) => {
    connectEth();
    const acc = web3.eth.accounts.privateKeyToAccount(privateKey);
    return acc;
}

export const getBalance = async (address: string) => {
    connectEth();
    return await web3.eth.getBalance(address);
}

export const sendEthTransaction = async (from: string, to: string, value: string, gas: number) => {
    connectEth();
    const config = {
        from, to, value, gas
    }
    const response = await web3.eth.sendTransaction(config);
    return response;
}

export const sendEthSignedTransaction = async (fromAcc: Account, to: string, value: string, gas: number) => {
    connectEth();
    const config = {
        from: fromAcc.address, to, value, gas
    }

    const transaction = await fromAcc.signTransaction(config);
    const response = await web3.eth.sendSignedTransaction(transaction.rawTransaction);
    return response;
}

export const addEther = async () => {
    connectEth();
    const accArray = await web3.eth.getAccounts();
    for(const acc of accArray) {
        const bal = await web3.eth.getBalance(acc);
        if(parseInt(bal, 10) >= parseInt(Web3.utils.toWei('11', 'ether'), 10)){
            return await sendEthTransaction(acc, process.env.ADDR, Web3.utils.toWei('10', 'ether'), 21000);
        }
    }
    throw new Error('Not Enough funds in any account');
}

export const postRecord = async (userId:string, key: string, data: string) => {
    connectEth();
    const recordContract = new web3.eth.Contract(RecordContract.abi as AbiItem[], process.env.RECORD_ADDR);
    const abi = recordContract.methods.postRecord(userId, data, key).encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: recordContract.options.address,
        gas: 2882800
    }, process.env.P_KEY);
    try {
        const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return response
    }
    catch(err) {
        console.log(err);
    }
}

export const getRecord = async (key: string) => {
    connectEth();
    const recordContract = new web3.eth.Contract(RecordContract.abi as AbiItem[], process.env.RECORD_ADDR)
    const response: string = await recordContract.methods.getRecord(key).call()
    return response;
}

export const getRecordId = async (patientId: string) => {
    connectEth();
    const recordContract = new web3.eth.Contract(RecordContract.abi as AbiItem[], process.env.RECORD_ADDR)
    const response: string[] = await recordContract.methods.getKeys(patientId).call()
    return response;
}

// Doctor Eth Services

export const postDoctor = async (doctorId: string, hospitalId: string, data: string) => {
    connectEth();
    const doctorContract = new web3.eth.Contract(DoctorContract.abi as AbiItem[], process.env.DOCTOR_ADDR);
    const abi = doctorContract.methods.postRecord(data, hospitalId, doctorId).encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: doctorContract.options.address,
        gas: 2882800
    }, process.env.P_KEY);
    try {
        const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return response
    }
    catch(err) {
        // console.log(err);
        throw err;
    }
}

export const updateDoctorHospital = async (doctorId: string, hospitalId: string) => {
    connectEth();
    const doctorContract = new web3.eth.Contract(DoctorContract.abi as AbiItem[], process.env.DOCTOR_ADDR);
    const abi = doctorContract.methods.updateHospital(hospitalId, doctorId).encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: doctorContract.options.address,
        gas: 2882800
    }, process.env.P_KEY);
    try {
        const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return response
    }
    catch(err) {
        console.log(err);
    }
}

export const getDoctorDetails = async (doctorId: string) => {
    connectEth();
    const doctorContract = new web3.eth.Contract(DoctorContract.abi as AbiItem[], process.env.DOCTOR_ADDR)
    const response: string = await doctorContract.methods.getDoctor(doctorId).call()
    if(response === "") {
        throw new Error("Doctor Details not found");
    }
    return response;
}


export const getDoctorHospital = async (doctorId: string) => {
    connectEth();
    const doctorContract = new web3.eth.Contract(DoctorContract.abi as AbiItem[], process.env.DOCTOR_ADDR)
    const response: string = await doctorContract.methods.getHospital(doctorId).call()
    return response;
}


// User Records

export const postUser = async (userId: string, data: string) => {
    connectEth();
    const userContract = new web3.eth.Contract(UserContract.abi as AbiItem[], process.env.USER_ADDR);
    const abi = userContract.methods.postUser(data, userId).encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: userContract.options.address,
        gas: 2882800
    }, process.env.P_KEY);
    try {
        const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return response
    }
    catch(err) {
        // console.log(err);
        throw err;
    }
}


export const getUser = async (userId: string) => {
    connectEth();
    const userContract = new web3.eth.Contract(UserContract.abi as AbiItem[], process.env.USER_ADDR)
    const response: string = await userContract.methods.getUser(userId).call()
    if(response === "") {
        throw new Error("Doctor Details not found");
    }
    return response;
}

// RecordKeys

export const getRecordKey = async (key: string) => {
    connectEth();
    const recordKeyContract = new web3.eth.Contract(RecordKeyContract.abi as AbiItem[], process.env.RECORD_KEY_ADDR)
    const response: string = await recordKeyContract.methods.getRecordKey(key).call()
    return response;
}

export const postRecordKey = async (recordId: string, data: string) => {
    connectEth();
    const recordKeyContract = new web3.eth.Contract(RecordKeyContract.abi as AbiItem[], process.env.RECORD_KEY_ADDR);
    const abi = recordKeyContract.methods.postRecordKey(data, recordId).encodeABI();

    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: recordKeyContract.options.address,
        gas: 2882800
    }, process.env.P_KEY);
    try {
        const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return response
    }
    catch(err) {
        // console.log(err);
        throw err;
    }
}