import { NFTStorage, File } from 'nft.storage'
import mime from 'mime'
import fs from 'fs'
import path from 'path'
import { config } from './db/config.js'

export async function storeBlob(filePath){
    const nftstorage = new NFTStorage({ token: config.NFT_STORAGE_KEY })

    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    const file = new File([content], path.basename(filePath), { type })

    const cid = await nftstorage.storeBlob(file)
    return cid;
}