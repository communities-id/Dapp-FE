import axios from "axios";

export const fetchCommunityInfo = async (name: string) => {
  const res = await axios('/api/community/info', {
    params: {
      name
    }
  })
  return res.data
}

export const fetchMemberInfo = async (name: string) => {
  const res = await axios('/api/member/info', {
    params: {
      name
    }
  })
  return res.data
}

export const fetchPrimaryDID = async (address: string) => {
  const res = await axios('/api/member/getPrimary', {
    params: {
      address
    }
  })
  return res.data
}

export const fetchCommunities = async (ids: Array<Number>) => {
  const res = await axios('/api/community', {
    params: {
      ids: ids.join(',')
    }
  })
  return res.data
}

export const fetchMembersOfCommunity = async (chainId: number, contract: string, page: number, pageSize: number) => {
  const res = await axios.get('/api/community/members', {
    params: {
      chainId,
      contract,
      page,
      pageSize
    }
  })
  return res.data
}

export const fetchAddressCommunities = async (address: string, page: number, pageSize: number) => {
  const res = await axios.get('/api/address/communities', {
    params: {
      page,
      address,
      pageSize
    }
  })
  return res.data
}

export const fetchAddressMembers = async (address: string, page: number, pageSize: number) => {
  const res = await axios.get('/api/address/members', {
    params: {
      page,
      address,
      pageSize
    }
  })
  return res.data
}

export const fetchStatistics = async () => {
  const res = await axios.get('/api/statistics')
  return res.data
}

export const updateCommunity = async (name: string, force?: boolean) => {
  try {
    const res = await axios.get('/api/community/update', {
      params: {
        name,
        force
      }
    })
    return res.data
  } catch (e) {
    console.log(e)
  }
}

export const updateMember = async (name: string, force?: boolean) => {
  try {
    const res = await axios.get('/api/member/update', {
      params: {
        name,
        force
      }
    })
    return res.data
  } catch (e) {
    console.log(e)
  }
}

export const fetchERC20Coin = async (contract: string, chainId: number) => {
  const res = await axios.get('/api/erc20-price', {
    params: {
      contract,
      chainId
    }
  })
  return res.data
}

export const triggerRelayerCron = async (chainId: number = 0) => {
  const res = await axios.get('/api/relayer/cron', {
    params: {
      chainId
    }
  })
  return res.data
}

export const relayerList = async () => {
  const res = await axios.get('/api/relayer/list')
  return res.data
}

export const relayerRetry = async (id: string) => {
  const res = await axios.post('/api/relayer/retry', {
    id
  })
  return res.data
}

export const getTelegramUser = async (address: string) => {
  const res = await axios.get('/api/telegram/get-user', {
    params: {
      address
    }
  })
  return res.data
}

export const bindTelegramUser = async (signature: string, userId: string, address: string) => {
  const res = await axios.post('/api/telegram/bind-user', {
    signature,
    userId,
    address
  })
  return res.data
}

export const bindTelegramGrouop = async (signature: string, brandDID: string, groupId: string) => {
  const res = await axios.post('/api/telegram/bind-group', {
    signature,
    brandDID,
    groupId
  })
  return res.data
}