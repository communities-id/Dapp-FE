import {} from 'react'

import { utils } from 'ethers'
import { useConfiguration } from '@/contexts/configuration'

import { readFileBuffer } from '@/utils/media'

export const useIpfs = () => {
  const { ipfs } = useConfiguration()

  const authCode = `Basic ${ipfs.key}`

  const upload = async (buffer: Buffer, filename = '') => {
    const formData = new FormData()
    const _filename = utils.keccak256(utils.toUtf8Bytes(String(utils.randomBytes(12)) + `-${filename}-${Date.now()}`)).slice(2)
    formData.append('file', new Blob([buffer]), _filename)

    const response: { Hash: string; Name: string; Size: string } = await fetch(`${ipfs.gateway}/api/v0/add`, {
      method: 'POST',
      headers: {
        contentType: 'multipart/form-data',
        Authorization: authCode
      },
      body: formData
    }).then(d => d.json())

    return response
  }

  const uploadByFile = async (file: File) => {
    const buffer = await readFileBuffer(file)

    const formData = new FormData()
    const filename = utils.keccak256(utils.toUtf8Bytes(String(utils.randomBytes(12)) + `-${file.name}-${Date.now()}`)).slice(2)
    formData.append('file', new Blob([buffer]), filename)

    const response: { Hash: string; Name: string; Size: string } = await fetch(`${ipfs.gateway}/api/v0/add`, {
      method: 'POST',
      headers: {
        contentType: 'multipart/form-data',
        Authorization: authCode
      },
      body: formData
    }).then(d => d.json())

    return response
  }

  return {
    upload
  }
}