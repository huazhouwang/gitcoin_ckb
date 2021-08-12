import Web3 from 'web3';
import * as SimpleNFTJson from '../../../build/contracts/SimpleNFT.json';
import { SimpleNFT } from '../../types/SimpleNFT';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class SimpleNFTWrapper {
    web3: Web3;

    contract: SimpleNFT;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(SimpleNFTJson.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async createNFT(imgUrl: string, fromAddress: string) {
        const tx = await this.contract.methods.awardItem(fromAddress, imgUrl).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async getBalanceOf(fromAddress: string) {
        const data = await this.contract.methods.balanceOf(fromAddress).call({ from: fromAddress });
        return data;
    }

    async getListNFT(address: string) {
        const totalNft = await this.getBalanceOf(address);
        console.log(totalNft);
        const arrNFT = new Array(Number(totalNft)).fill(0).map((_, index) => index + 1);
        const data = await Promise.all(
            arrNFT.map(_nftId =>
                this.contract.methods.tokenURI(_nftId.toString()).call({
                    from: address
                })
            )
        );
        return data;
    }

    // async getStoredValue(fromAddress: string) {
    //     const data = await this.contract.methods.get().call({ from: fromAddress });

    //     return parseInt(data, 10);
    // }

    // async setStoredValue(value: number, fromAddress: string) {
    //     const tx = await this.contract.methods.set(value).send({
    //         ...DEFAULT_SEND_OPTIONS,
    //         from: fromAddress,
    //         value
    //     });

    //     return tx;
    // }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: SimpleNFTJson.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}