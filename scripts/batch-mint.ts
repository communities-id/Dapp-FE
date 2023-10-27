import * as dotenv from 'dotenv'
dotenv.config()
import CommunitiesID from '@communitiesid/id';
import axios from 'axios';
import { ethers } from 'ethers';
import fs from 'fs'
import { SDK_OPTIONS } from '@/shared/constant';

const COMMUNITIY_NAME = 'jtest1'
const FILE_NAME = 'data.csv'

for (let i in SDK_OPTIONS) {
  if ((SDK_OPTIONS as any)[i].RPCUrl) {
    (SDK_OPTIONS as any)[i].generateSigner = (provider: any) => new ethers.Wallet(process.env.PRIVATE_KEY || '', provider)
  }
}
const communitiesidSDK = new CommunitiesID(SDK_OPTIONS)

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