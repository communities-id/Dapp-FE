import { CHAIN_ID, CHAINS_ID_TO_NETWORK, CHAIN_ID_MAP, CONTRACT_MAP, ZERO_ADDRESS } from '@/shared/constant';
import { Wallet } from 'ethers';
import { keccak256, getCommunitySignPayload, getCommunityOmninodeSignPayload, getMemberSignPayload } from "@/shared/helper"
import type { NextApiRequest, NextApiResponse } from 'next'

import qs from 'querystring'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, address, owner, chainId, secret, isUrl } = req.query as Record<string, string>
  
  if (process.env.NEXT_PUBLIC_IS_TESTNET !== 'true' && secret !== process.env.SIGNATURE_SECRET) {
    return res.status(200).json({
      code: 0,
    })
  }

  // const commitment = {
  //   node: name,
  //   owner: address || ZERO_ADDRESS,
  //   deadline: 999999999999,
  // }

  const _chainId = Number(chainId)

  const isMainnetChain = _chainId === CHAIN_ID

  const signer = new Wallet(process.env.PRIVATE_KEY as string)

  const { domain, types, commitment } = getCommunitySignPayload(name, address, CONTRACT_MAP[_chainId].CommunityRegistryInterface, {
    chainId: _chainId
  })
  const mintSignature = await signer._signTypedData(
    domain,
    types,
    commitment
  );

  // const omninodeCommitment = {
  //   chainId: _chainId,
  //   nodehash: keccak256(name as string),
  //   owner: owner || ZERO_ADDRESS,
  //   deadline: 999999999999,
  // }

  const { domain: omniDomain, types: omniTypes, commitment: omniCommitment } = getCommunityOmninodeSignPayload(name, owner, {
    chainId: _chainId
  })
  // const omninodeSigner = new Wallet(process.env.PRIVATE_KEY as string)
  const omninodeSignature = !isMainnetChain ? await signer._signTypedData(
    omniDomain,
    omniTypes,
    omniCommitment
  ) : '';

  const signature = isMainnetChain ? mintSignature : `${mintSignature}_${omninodeSignature}`

  const params = {
    signature,
    chainId,
    owner,
    address,
  }

  const url = `https://www.communities.id/community/.${name}?${qs.stringify(params)}`

  return res.status(200).json({
    code: 0,
    data: {
      url: isUrl === '1' && url,
      signature
    }
  })
}
