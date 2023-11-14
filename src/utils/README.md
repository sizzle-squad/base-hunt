### Setting up IYK Chip

- scan the chip and copy the url parameters e.g. e,c,d
- Use the parameters to get the UID of tag with following curl command:

 curl -X GET 'https://api.iyk.app/chips/find?e=3FEBA89D63474B9C8A602E1663E86111&c=E1B10E6840A83739&d=101'

 {"uid":"1293660434600336","isValidTap":false,"linkedToken":{"contractAddress":"0x1a910cc3614d30927e83c2f7d1116dc7072caa2b","chainId":137,"tokenId":"1"}}

<UID>=1293660434600336

# Set redirect url :
  curl -X PATCH 'https://api.iyk.app/chips'  --data-raw  '{
    "tagUIDs": [<UID>],
    "updates": {
        "redirectUrl": "https://go.cb-w.com/dapp?cb_url=https%3A%2F%2Fairdrop-template-one.vercel.app%2F%3Fdata%3DzTNKL5ZUaoygHXcmyZZwczdvmvjsLbB3JcgzwrKw8a45tzfiQWt5QRENzdDWzpAufLXASNNMLrMPwgQEuLCTfSf7vSvr9HweuPon9BMUs9Q4qRgCS9XUWH7D"}            
}' -H 'x-iyk-api-key: <API_KEY>' -H 'Content-Type: application/json'

# Get otp code for tap

- After the redirect url is set, every tap of the chip generates a unique iykRef that is appended to the redirect Url

GET /otps/:id

curl -X GET 'https://api.iyk.app/otps/1311252620644752'  -H 'x-iyk-api-key: b4b6b80f971c028d937f60d5f83e933eb0a1c669c44a4cb81cb4eb4173635b14' 


