import { breed, breedWooden } from "./breed/breed_inferno.js"
import { addLayersToBob } from "./magic/addlayers.js"
import { generateMagic, generateMagicWooden } from "./magic/magic.js"
import { loadScrollsAndCreatures, loadWoodenScrollsAndCreatures } from "./db/loadScrollsAndCreatures.js"
import { storeBlob } from "./ipfs.js"

import fs from "fs";
import util from 'util';
import cp from 'child_process';
import { folders } from "./conf.js"
const exec = util.promisify(cp.exec);

async function main(){
    const args = process.argv;
    const scrollId = args[2];
    const aliceId = args[3];
    const bobId = args[4];

    if(scrollId > 666){
      const data = await loadWoodenScrollsAndCreatures('inferno');
      const creature = breedWooden(aliceId, bobId, scrollId, data.creatures, data.scrolls);

      const magicLines = generateMagicWooden(creature);
      fs.writeFileSync(`${folders.nftizer}public/wooden/experiment/${creature.name}.sh`, magicLines.join('\n'));
      await exec(`sh "${folders.nftizer}public/wooden/experiment/${creature.name}.sh"`);
     
      const sha256 = await exec(`sha256sum "${folders.nftizer}public/wooden/experiment/${creature.name}.png"`);
      creature.sha256 = sha256.stdout.split(' ')[0];

      await exec(`cp "${folders.nftizer}public/wooden/experiment/${creature.name}.png" "${folders.infernonfts}${creature.name}.png"`);
      const cid = await storeBlob(`${folders.nftizer}public/wooden/experiment/${creature.name}.png`);

      creature.ipfs = `ipfs://${cid}`;
      const creatureString = JSON.stringify(creature);    
      console.log(creatureString)

    }else{
        const data = await loadScrollsAndCreatures();
        const creature = breed(aliceId, bobId, scrollId, data.creatures, data.scrolls);
        const layeredCreature = addLayersToBob(JSON.parse(JSON.stringify(creature)));

        const magicLines = generateMagic(layeredCreature);
        fs.writeFileSync(`${folders.nftizer}public/infernos/experiment/${creature.name}.sh`, magicLines.join('\n'));
        await exec(`sh "${folders.nftizer}public/infernos/experiment/${creature.name}.sh"`);
        
        const sha256 = await exec(`sha256sum "${folders.nftizer}public/infernos/experiment/${creature.name}.png"`);
        await exec(`cp "${folders.nftizer}public/infernos/experiment/${creature.name}.png" "${folders.infernonfts}${creature.name}.png"`);

        creature.sha256 = sha256.stdout.split(' ')[0];
        const cid = await storeBlob(`${folders.nftizer}public/infernos/experiment/${creature.name}.png`);
        creature.ipfs = `ipfs://${cid}`;
        const creatureString = JSON.stringify(creature);    
        console.log(creatureString)
    }

}

await main();
