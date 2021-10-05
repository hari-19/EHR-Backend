import Web3 from 'web3'
import { Account } from 'web3-core'

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

export const sendEthTransaction = async (from: string, to: string, value: number, gas: number) => {
    connectEth();
    const config = {
        from, to, value, gas
    }
    const response = await web3.eth.sendTransaction(config);
    console.log(response);
}

export const sendEthSignedTransaction = async (fromAcc: Account, to: string, value: string, gas: number) => {
    connectEth();
    const config = {
        from: fromAcc.address, to, value, gas
    }

    const transaction = await fromAcc.signTransaction(config);
    const response = await web3.eth.sendSignedTransaction(transaction.rawTransaction);
    console.log(response);
    return response;
}