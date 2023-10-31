import { CHAINS_ID_TO_NETWORK, CHAIN_ID, CHAIN_ID_MAP, CONTRACT_MAP, MAIN_CHAIN, MAIN_CHAIN_ID, ZERO_ADDRESS } from '@/shared/constant';
import { keccak256 } from '@/shared/helper';
import { Wallet } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, address, chainId } = req.query

  const commitment = {
    chainId: Number(chainId),
    nodehash: keccak256(name as string),
    owner: address || ZERO_ADDRESS,
    deadline: 999999999999,
  }

  const signer = new Wallet(process.env.PRIVATE_KEY as string)
  const signature = await signer._signTypedData(
    {
      name: "RelayerCommunityRegistryInterfaceMintCommitment",
      version: "1",
      chainId: CHAIN_ID,
      verifyingContract: CONTRACT_MAP[MAIN_CHAIN_ID].RelayerCommunityRegistryInterface,
    },
    {
      Commitment: [
        { name: "chainId", type: "uint256" },
        { name: "nodehash", type: "bytes32" },
        { name: "owner", type: "address" },
        { name: "deadline", type: "uint256" },
      ],
    },
    commitment
  );

  return res.status(200).json({
    code: 0,
    data: signature
  })
}
