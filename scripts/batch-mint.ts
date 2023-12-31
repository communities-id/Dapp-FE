import * as dotenv from 'dotenv'
dotenv.config()
import CommunitiesID from '@communitiesid/id';
import { ethers } from 'ethers';
import fs from 'fs'
import { getSDKOptions } from '@/utils/provider';

const COMMUNITIY_NAME = 'jtest1'
const FILE_NAME = 'data.csv'

const sdkOptions = getSDKOptions(process.env.RPC_KEYS)
for (let i in sdkOptions) {
  if ((sdkOptions as any)[i].RPCUrl) {
    (sdkOptions as any)[i].generateSigner = (provider: any) => new ethers.Wallet(process.env.PRIVATE_KEY || '', provider)
  }
}
const communitiesidSDK = new CommunitiesID(sdkOptions)

async function main() {
  const brandDID = await communitiesidSDK.collector.searchBrandDID(COMMUNITIY_NAME)
  if (!brandDID?.node) {
    console.log(`Brand DID ${COMMUNITIY_NAME} not found!`)
    return
  }
  const content = fs.readFileSync(`${__dirname}/${FILE_NAME}`, 'utf-8')
  const lines = content.split('\n').slice(1)
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i]
    const [name, address] = row.split(',')
    if (!name || !address) {
      continue
    }
    console.log(`[${new Date().toISOString()}] Minting user DID ${name}.${COMMUNITIY_NAME}`)
    await communitiesidSDK.operator.mintUserDID(`${name}.${COMMUNITIY_NAME}`, address, { brandDID })
    console.log(`[${new Date().toISOString()}] Mint user DID ${name}.${COMMUNITIY_NAME} successed`)
  }
}

main()