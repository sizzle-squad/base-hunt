import axios from 'axios'
import {ethers, Wallet} from 'ethers'


const domain = {
    name: 'AirdropCommand',
    version: '1.0.0',
    chainId: 8453,
    verifyingContract: '0x0000000000000000000000000000000000000000'
  };
  
  const types = {           
    "AirdropCommandData": [
      { name: 'userAddress', type: 'address' },
      { name: 'command', type: 'string' }
    ]
  };

export async function AirdropNft(userAddress:string, command:string){
    const wallet = new Wallet(process.env.AUTHORIZER_PK as string,new ethers.JsonRpcProvider("https://mainnet.base.org"));
    console.log("[AirdropNft] loaded wallet:",wallet.address);
  
    const message ={
      "userAddress":userAddress,
      "command": command
    };

    const signature = ethers.Signature.from(await  wallet.signTypedData(domain, types, message));      
    console.log(JSON.stringify(signature))

    const postData =  { 
       ...message,
        signature:{
            r:signature.r,
            s:signature.s,
            v:signature.v
        }
    };

    console.log("[AirdropNft] postData:",postData)
    if (process.env.AIRDROP_ENABLED){
      const response = await axios.post("https://api.wallet.coinbase.com/rpc/v2/bot/mint",postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })    
      if (response.status != 200) {
        console.error("[AirdropNft] error airdropping:",response.data)
        return
      }
    }else{
      console.log("[AirdropNft] airdrop disabled")
    }
    console.log("[AirdropNft] airdrop completed")
}