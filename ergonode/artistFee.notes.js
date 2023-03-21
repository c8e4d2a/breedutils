import { TransactionBuilder, OutputBuilder, SConstant, SColl, SByte, SInt, SBigInt, SLong } from "@fleet-sdk/core";
import { stringToBytes } from "@scure/base";

//const creationHeight = ergo.get_current_height();
const creationHeight = 912397;

//const inputs = await ergo.get_utxos();
const inputs = 
    [
        {
            "boxId": "8898f4b49fc99bb94f43d06a1278ba7ad587edfbf2200206d937984c5e30301e",
            "value": "997890000",
            "ergoTree": "0008cd02a021272a90e03d9c40f1c588a3ab2a91394cba751a1b15b569fae89657e8e034",
            "creationHeight": 912393,
            "assets": [],
            "additionalRegisters": {},
            "transactionId": "5750fefd844a74f3186035c595f355ef4f3580dc3ab424e6a291fa73ef864daa",
            "index": 2,
            "confirmed": true
        }
    ];

//{
//    "tokenId": "0b0304fac8121bc041d467574a0817ca80e31a709b0096330854ec9239c07130",
//    "name": "Zk Genesis #1",
//    "description": "Zk Genesis\nErgo Genesis Bitmasks\n\nhttps://bitmasks.io/",
//    "src": "https://cloudflare-ipfs.com/ipfs/bafkreidxrpcyrvvrnyescckcs6llydpxczzc77sl3zzqberzno3zjwkdpe",
//    fragments: [0, 41],
//    form: FORM_Metamorf
//},

// https://api.ergoplatform.com/api/v0/assets/0b0304fac8121bc041d467574a0817ca80e31a709b0096330854ec9239c07130/issuingBox
// 
const issuingBox = [{
    "id":"dc982d57ba5295cb5460cb24d833f1e177c3e4c4e8509cd2993d2a370ef63f19",
    "txId":"975d681e939381b6f6037d8dd8210cb06c905799ea1296accf641cf2f1b55bc7",
    "value":1000000,
    "index":0,
    "creationHeight":624806,
    "ergoTree":"0008cd032abde6b041021e60995cc7ea9d13eeaf041aaf87c549956a52aeca404f151ac0",
    "address":"9gndUQiimtTFLS95wbzS1Qt6poTg9UK5XuPkbCx4K9YFx57AvH3",
    "assets":[
        {
            "tokenId":"0b0304fac8121bc041d467574a0817ca80e31a709b0096330854ec9239c07130",
            "index":0,
            "amount":1,
            "name":"Zk Genesis #1",
            "decimals":0,
            "type":"EIP-004"
        }
    ],
    "additionalRegisters": {
        "R4":"0e0d5a6b2047656e65736973202331",
        "R5":"0e365a6b2047656e657369730a4572676f2047656e65736973204269746d61736b730a0a68747470733a2f2f6269746d61736b732e696f2f",
        "R6":"0e0130",
        "R7":"0e020101",
        "R8":"0e20778bc588d6b16e092109429796bc0df716722ffe4bde730092396bb794d94379",
        "R9":"0e42697066733a2f2f6261666b726569647872706379727676726e79657363636b6373366c6c79647078637a7a633737736c337a7a716265727a6e6f337a6a776b647065",
    },
        "spentTransactionId":"0beeac8ce99bddd3439470274c628bffa375636619821866b97262955ae3f9f0",
        "mainChain":true
}];

const url = "ipfs://bafkreidxrpcyrvvrnyescckcs6llydpxczzc77sl3zzqberzno3zjwkdpe"

const output = new OutputBuilder(
        "1000000",
        "9gdLSKyzeyB3qQ1LWidALiyyfvQwFCZtcozXqjQ9hRkfGwPFCbR"
    ).mintToken({ 
        amount: "1", // the amount of tokens being minted without decimals 
        name: "Receipe", // the name of the token 
        description: "Wooden Sword recipe." 
    }).setAdditionalRegisters({
        R4: SConstant(SColl(SByte, stringToBytes("utf8", "Zk Genesis #1"))),
        R5: SConstant(SColl(SByte, stringToBytes("utf8",`Zk Genesis
        Ergo Genesis Bitmasks
        
        https://bitmasks.io/`))),
        R6: SConstant(SColl(SByte, stringToBytes("utf8", "0"))),
        R7: "0e020101",
        R8: SConstant(SColl(SByte, stringToBytes("hex", "778bc588d6b16e092109429796bc0df716722ffe4bde730092396bb794d94379"))),
        R9: SConstant(SColl(SByte, stringToBytes("utf8", url)))
    });
    // first lets set the registers then we can think about encoding them properly

//const changeAddress = await ergo.get_change_address();
const changeAddress = '9fjaoqKoTtuFUZMmkeA7quf2WotQwsq8EUYK5ZfCvZjCqWaW5B8';
const unsignedTransaction = new TransactionBuilder(creationHeight)
    .from(inputs)
    .to(output)
    .sendChangeTo(changeAddress)
    .payFee("1110000")
    //.build();
    .build("EIP-12");

// console.dir(unsignedTransaction, {depth: null});
// 80 = 8%
//console.dir(SConstant(SColl(SByte, stringToBytes("utf8", "80"))), {depth: null});

// R4: serializedValue: 0450 sigmaType: SInt  renderedValue: 40
// 0x50 == 80
console.dir(SConstant(SInt(80)), {depth: null});