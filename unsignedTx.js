import { TransactionBuilder, OutputBuilder, ErgoAddress, SConstant, SColl, SByte, SInt } from "@fleet-sdk/core";
import { stringToBytes } from "@scure/base";

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

function createMintTx(details) {
    const output = new OutputBuilder(
        details.outputValue,
        ErgoAddress.fromBase58(details.recipientAddress).ergoTree
    ).mintToken({
        amount: "1",
        name: "foobar",
    }).setAdditionalRegisters(eip0004Regs(details.eip4Regs));

    const unsignedMintTransaction = new TransactionBuilder(details.height)
        .from([details.inputBox])
        .to(output)
        .sendChangeTo(details.changeAddress)
        .payFee(details.txFee)
        .build()
        .toPlainObject();

    return unsignedMintTransaction
}

BigInt.prototype.toJSON = function() { return this.toString() }
// get json srting from input params, decode it, call createMintTx, return it
function main(){
    const args = process.argv.slice(2);
    const mintParams = JSON.parse(args[0]);
    const unsignedTx = createMintTx(mintParams);
    const response = JSON.stringify({tx:unsignedTx});
    console.log(response);
}

main();
