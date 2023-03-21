import fetch from 'node-fetch';

const NODE_URL = 'http://127.0.0.1:9053';

export async function info(){
    const response = await fetch(NODE_URL+'/info', {
    	//method: 'post',
    	headers: {'Accept': 'application/json'}
    });
    const data = await response.json();
    return data;
}

export async function fetchHeight(){
    return (await info()).fullHeight;
}


export async function walletStatus(){
    const response = await fetch(NODE_URL+'/wallet/status', {
        headers: {
            'Accept': 'application/json',
            "api_key": "fuckyourdickfucker"
        }
    });
    const data = await response.json();
    return data;
}

export async function lastHeaders(){
    const response = await fetch(NODE_URL+'/blocks/lastHeaders/10', {
        headers: {'Accept': 'application/json'}
    });
    const data = await response.json();
    return data;
}

export async function unspentBoxes(){
    const response = await fetch(NODE_URL+'/wallet/boxes/unspent?minConfirmations=0&maxConfirmations=-1&minInclusionHeight=0&maxInclusionHeight=-1', {
        //method: 'post',
        headers: {
            'Accept': 'application/json',
            "api_key": "fuckyourdickfucker"
        }
    });
    const data = await response.json();
    return data;
}

export async function incomingUnconfirmedOutputBoxes(ergoTree){
    const response = await fetch(NODE_URL+'/transactions/unconfirmed/outputs/byErgoTree?limit=100&offset=0', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(ergoTree)
    });
    const data = await response.json();
    return data;
}

export async function signTx(tx){
    const response = await fetch(NODE_URL+'/wallet/transaction/sign', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "api_key": "fuckyourdickfucker"
        },
        body: JSON.stringify({tx})
    });
    const data = await response.json();
    return data;
}

export async function sendTx(tx){
    const response = await fetch(NODE_URL+'/transactions', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "api_key": "fuckyourdickfucker"
        },
        body: JSON.stringify(tx)
    });
    const data = await response.json();
    return data;
}

export async function getUnconfirmedTx(txId){
    const response = await fetch('https://api.ergoplatform.com/transactions/unconfirmed/'+txId, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}

export async function getAllUnconfirmedTx(){
    const response = await fetch(NODE_URL+'/transactions/unconfirmed?limit=100&offset=0', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });
    const data = await response.json();
    return data;
}


//console.dir(await unspentBoxes(), {depth:100})
// what api do i need to use to get a tx
