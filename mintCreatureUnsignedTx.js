import { TransactionBuilder, OutputBuilder, ErgoAddress, SConstant, SColl, SByte, SInt } from "@fleet-sdk/core";
import { stringToBytes } from "@scure/base";
import { incomingUnconfirmedOutputBoxes, fetchHeight, signTx, sendTx, getUnconfirmedTx, unspentBoxes } from "./ergonode/ergonodeapi.js";

export function eip0004Regs(o){
    return eip0004ArtworkRegisters(o.name, o.description, o.sha256, o.url)
}

export function eip0004ArtworkRegisters(name, description, sha256, url){
    return {
        R4: SConstant(SColl(SByte, stringToBytes("utf8", name))),
        R5: SConstant(SColl(SByte, stringToBytes("utf8", description))),
        R6: SConstant(SColl(SByte, stringToBytes("utf8", "0"))),
        R7: "0e020101",
        R8: SConstant(SColl(SByte, stringToBytes("hex", sha256))),
        R9: SConstant(SColl(SByte, stringToBytes("utf8", url)))
    }
}


function createCreateMintTx(txMeta) {
    const output = new OutputBuilder(
        txMeta.outputValue,
        ErgoAddress.fromBase58(txMeta.recipientAddress).ergoTree
    ).addTokens([{ 
        tokenId: txMeta.token1Id, 
        amount: "1" 
    },{ 
        tokenId: txMeta.token2Id, 
        amount: "1" 
    }]).mintToken({
        amount: "1",
        name: txMeta.eip4Regs.name,
    }).setAdditionalRegisters(eip0004Regs(txMeta.eip4Regs));

    const unsignedMintTransaction = new TransactionBuilder(txMeta.height)
        .burnTokens({ 
            tokenId: txMeta.scrollTokenId, 
            amount: "1"
        })
        .from([txMeta.inputBox])
        .to(output)
        .sendChangeTo(txMeta.changeAddress)
        .payFee(txMeta.txFee)
        .build()
        .toPlainObject();

    return unsignedMintTransaction
}

function main(){
    const args = process.argv.slice(2);
    const mintParams = JSON.parse(args[0]);
    const unsignedTx = createCreateMintTx(mintParams);
    const response = JSON.stringify({tx:unsignedTx});
    console.log(response);
}

main();
