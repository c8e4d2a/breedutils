import { scrolls } from "./scrolls_inferno.js";
import { creatures } from "./polulation/creatures.js";
import { breed } from "./breed.js";

const ourNFTs = JSON.parse(JSON.stringify(creatures));

scrolls.forEach(s =>{
    const alice = ourNFTs[Math.floor(Math.random() * ourNFTs.length)]
    const bobo  = ourNFTs[Math.floor(Math.random() * ourNFTs.length)]
    const nft   = breed(alice.id, bobo.id, s.id, ourNFTs);
    ourNFTs.push(nft);
})

console.dir(ourNFTs, {maxArrayLength:null})