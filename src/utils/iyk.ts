import axios from 'axios';


export async function getTapRef(iykRef:string){
    
    const data = await axios.get(`https://api.iyk.app/refs/${iykRef}`,{
        headers: {
            'x-iyk-api-key': process.env.IYK_API_KEY as string,
        }
    })

    /*
    {
        "uid": "1111111111144444",
        "isValidRef": false,
        "linkedToken": {
            "contractAddress": "0x067f20be8e84c8fed733578e7249ea911111111",
            "chainId": 1,
            "tokenId": "1",
            "otp": "unique-21char-Nano_Id"
        },
        "poapEvents": [
            {
            "id": 1,
            "poapEventId": 123456,
            "otp": "unique-21char-Nano_Id",
            "status": "active"
            }
        ]
    }
    */
    return data;
}
