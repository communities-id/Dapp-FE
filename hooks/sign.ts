import { utils } from "ethers"

import { ZERO_ADDRESS } from "@/shared/constant"
import { getCommunitySignPayload, getCommunityOmninodeSignPayload, getMemberSignPayload } from "@/shared/helper"

export const useSignUtils = () => {
  const verifyCommunityTypedMessage = (signature: string, master: string, node: string, owner: string, verifyingContract: string, config: { deadline?: number;  chainId?: number } = {}) => {
    const { domain, types, commitment } = getCommunitySignPayload(node, owner, verifyingContract, config)
    const { commitment: powerfulCommitment } = getCommunitySignPayload(node, ZERO_ADDRESS, verifyingContract, config)
    try {
      return {
        // is powerful signature, only mint to self
        powerful: utils.verifyTypedData(domain, types, powerfulCommitment, signature) === master,
        // is designated signature, only mint to designated address
        designated: utils.verifyTypedData(domain, types, commitment, signature) === master,
      }
    } catch (e) {
      return {
        powerful: false,
        designated: false,
      }
    }
  }

  const verifyCommunityOmninodeTypedMessage = (signature: string, master: string, node: string, owner: string, config: { deadline?: number;  chainId?: number } = {}) => {
    const { domain, types, commitment } = getCommunityOmninodeSignPayload(node, owner, config)
    const { commitment: powerfulCommitment } = getCommunityOmninodeSignPayload(node, ZERO_ADDRESS, config)
    try {
      return {
        // is powerful signature, only mint to self
        powerful: utils.verifyTypedData(domain, types, powerfulCommitment, signature) === master,
        // is designated signature, only mint to designated address
        designated: utils.verifyTypedData(domain, types, commitment, signature) === master,
      }
    } catch (e) {
      return {
        powerful: false,
        designated: false,
      }
    }
  }

  const verifyMemberTypedMessage = (signature: string, communityOwner: string, node: string, owner: string, registry: string, verifyingContract: string, config: { day?: number; deadline?: number;  chainId?: number } = {}) => {
    const { domain, types, commitment } = getMemberSignPayload(node, owner, registry, verifyingContract, config)
    const { commitment: powerfulCommitment } = getMemberSignPayload(node, ZERO_ADDRESS, registry, verifyingContract, config)
    console.log('= owner', owner)
    try {
      return {
        // is powerful signature, only mint to self
        powerful: utils.verifyTypedData(domain, types, powerfulCommitment, signature) === communityOwner,
        // is designated signature, only mint to designated address
        designated: utils.verifyTypedData(domain, types, commitment, signature) === communityOwner,
      }
    } catch (e) {
      return {
        powerful: false,
        designated: false,
      }
    }
  }

  return {
    getCommunitySignPayload,
    getCommunityOmninodeSignPayload,
    getMemberSignPayload,
    verifyCommunityTypedMessage,
    verifyCommunityOmninodeTypedMessage,
    verifyMemberTypedMessage
  };
};
