import { folders } from "../conf.js";

const PUBLIC_DIR = `${folders.nftizer}public`;

function rand(max) {
    return Math.floor(Math.random() * max);
}

const project = 'infernos';
const NFT_WIDTH = 666;
const NFT_HEIGHT = 666;

export function generateMagicWooden(mask){
    const magicLines = layersToMagicWooden(mask.fragments, 'wooden', NFT_WIDTH, NFT_HEIGHT, `${mask.name}.png`)
    return magicLines;
}

export function generateMagic(mask){
    const layers = mask.layers.sort((a,b)=> Number(a.order) - Number(b.order))
    const magicLines = layersToMagic(layers, project, NFT_WIDTH, NFT_HEIGHT, `${mask.name}.png`)
    return magicLines;
}

function layersToMagicWooden(layers, project, NFT_WIDTH, NFT_HEIGHT, name){
    const LAYER_EXPORT_DIR = `${PUBLIC_DIR}/${project}/export/`;
    const BACKGROUND_DIR   = `${PUBLIC_DIR}/${project}/background/`;
    const EXPERIMENT_DIR   = `${PUBLIC_DIR}/${project}/experiment/`;

    const magicInstructionLines = []
    const bg = `cp "${BACKGROUND_DIR+["bloodred.png", "firered.png", "hellred.png"][rand(3)]}" ${EXPERIMENT_DIR}nft.png`;
    magicInstructionLines.push(bg)
    
    for (let i = 0; i < layers.length; i++) {
        const c = `composite "${LAYER_EXPORT_DIR}${layers[i]}" ${EXPERIMENT_DIR}nft.png ${EXPERIMENT_DIR}nft.png`;
        magicInstructionLines.push(c)
    }
    magicInstructionLines.push(`cp "${EXPERIMENT_DIR}nft.png" "${EXPERIMENT_DIR}${name}"`)
    magicInstructionLines.push(`rm "${EXPERIMENT_DIR}nft.png"`)
    return magicInstructionLines;
}

function layersToMagic(layers, project, NFT_WIDTH, NFT_HEIGHT, name){
    const LAYER_EXPORT_DIR = `${PUBLIC_DIR}/${project}/export/`;
    const LAYER_CHANGE_DIR = `${PUBLIC_DIR}/${project}/change/`;
    const BACKGROUND_DIR   = `${PUBLIC_DIR}/${project}/background/`;
    const EXPERIMENT_DIR   = `${PUBLIC_DIR}/${project}/experiment/`;

    const magicInstructionLines = []
    for (let i = 0; i < layers.length; i++) {
        const l = layers[i];
        if (l.change) {
            const changeFileName = l.change.replace(
                /\.png$/,
                `_${l.color}.png`
            );
            // colorchange + outline
            const c1 = `composite "${LAYER_EXPORT_DIR}${l.outline}" "${LAYER_CHANGE_DIR}${changeFileName}" "${EXPERIMENT_DIR}${l.outline}"`;
            // resize
            const c2 = `convert "${EXPERIMENT_DIR}${l.outline}" -resize ${(
                (l.copterScale ?? 1) * 100
            ).toFixed(2)}% "${EXPERIMENT_DIR}${l.outline}"`;
            magicInstructionLines.push(c1, c2);
        } else {
            const c = `convert "${LAYER_EXPORT_DIR}${l.outline}" -resize ${(
                (l.copterScale ?? 1) * 100
            ).toFixed(2)}% "${EXPERIMENT_DIR}${l.outline}"`;
            magicInstructionLines.push(c);
        }
    }
    magicInstructionLines.push("");
    
    const bg1 = `cp ${LAYER_EXPORT_DIR}blank.png ${EXPERIMENT_DIR}blank.png`;
    const bg = `cp "${BACKGROUND_DIR+["bloodred.png", "firered.png", "hellred.png"][rand(3)]}" ${EXPERIMENT_DIR}nft.png`;
    magicInstructionLines.push(bg1)
    magicInstructionLines.push(bg)
    //combine all layers
    for (let i = 0; i < layers.length; i++) {
        const l = layers[i];

        const c1 = `composite -size ${NFT_WIDTH}x${NFT_HEIGHT} "${EXPERIMENT_DIR}${
            l.outline
        }" -geometry +${(NFT_WIDTH * (l.copterOffsetX ?? 0)).toFixed(4)}+${(
            NFT_HEIGHT * (l.copterOffsetY ?? 0)
        ).toFixed(4)} ${EXPERIMENT_DIR}nft.png "${EXPERIMENT_DIR}${l.outline}"`;
        magicInstructionLines.push(c1);

        if (l.outline.startsWith("head") || l.outline.startsWith("body")) {
            const c2 = `composite "${EXPERIMENT_DIR}${l.outline}" -compose Darken ${EXPERIMENT_DIR}nft.png ${EXPERIMENT_DIR}nft.png`;
            magicInstructionLines.push(c2);
        } else {
            const c2 = `composite "${EXPERIMENT_DIR}${l.outline}" ${
                i == 0 ? `${EXPERIMENT_DIR}nft.png` : `${EXPERIMENT_DIR}nft.png`
            } ${EXPERIMENT_DIR}nft.png`;
            magicInstructionLines.push(c2);
        }
    }
    if(name){
        magicInstructionLines.push(`cp ${EXPERIMENT_DIR}nft.png ${EXPERIMENT_DIR}${name}`)
        magicInstructionLines.push(`rm ${EXPERIMENT_DIR}nft.png`)
    }

    for (let i = 0; i < layers.length; i++) {
        const l = layers[i];
        magicInstructionLines.push(`rm "${EXPERIMENT_DIR}${l.outline}"`)
    }

    return magicInstructionLines;
}