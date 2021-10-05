import Web3 from 'web3'
import { Account } from 'web3-core'
import * as RecordContract from '../../contracts/artifacts/Record.json'
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
        if(bal >= Web3.utils.toWei('5', 'ether')) {
            return await sendEthTransaction(acc, process.env.ADDR, Web3.utils.toWei('5', 'ether'), 21000);
        }
    }
    throw new Error('Not Enough funds in any account');
}

export const getRecord = async (key: string) => {
    connectEth();
    const recordContract = new web3.eth.Contract(RecordContract.abi as AbiItem[], process.env.RECORD_ADDR)
    const response: string = await recordContract.methods.getRecord(key).call()
    return response;
}

export const postRecord = async (key: string, data: string) => {
    connectEth();
    const recordContract = new web3.eth.Contract(RecordContract.abi as AbiItem[], process.env.RECORD_ADDR)
    const abi = recordContract.methods.postRecord(data, key).encodeABI();
    const signedTx = await web3.eth.accounts.signTransaction({
        data: abi,
        from: process.env.ADDR,
        to: recordContract.options.address,
        gas: 210000
    }, process.env.P_KEY);
    const response = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return response
}