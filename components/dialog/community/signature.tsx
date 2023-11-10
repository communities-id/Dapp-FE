import { FC, useState } from 'react'

import { execSearch } from '@/shared/helper'

import { useWallet } from '@/hooks/wallet'
import { useSignUtils } from '@/hooks/sign'
import { useRoot } from '@/contexts/root'
import { useDetails } from '@/contexts/details'

import Dialog from '@/components/common/dialog'
import CommunitySignature, { CommunitySignatureLabels } from '@/components/settings/community/signature'
import { ZERO_ADDRESS } from '@/shared/constant'

interface Props {
  open: boolean
  handleClose?: () => void
}

const CommunitySignatureDialog: FC<Props> = ({ open, handleClose }) => {

  const { communityInfo } = useDetails()
  const { message } = useRoot()
  const { getSigner } = useWallet()
  const { getMemberSignPayload } = useSignUtils()

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [validation, setValidation] = useState<Record<string, string | undefined>>({})

  const [form, setForm] = useState<Record<CommunitySignatureLabels, string>>({
    address: '',
    name: ''
  })

  function validateForm() {
    const rules: Record<string, (value: string) => string | undefined> = {
      name: (value: string) => {
        if (!value) {
          return 'Please enter a member name'
        }
      },
    }
    const results: Record<string, string | undefined> = {}
    for(let i in rules) {
      const result = rules[i]?.((form as any)[i])
      if (result) {
        results[i] = result
      }
    }
    return results
  }

  const handleSign = async () => {
    setValidation({})
    const validateResult = validateForm()
    if (Object.keys(validateResult).length > 0) {
      setValidation(validateResult)
      return
    }
    if (!communityInfo || !communityInfo.node) return
    try {
      setLoading(true)
      const signer = await getSigner()
      if (!signer) {
        return
      }
      const { member } = execSearch(form.name)
      const name = member || form.name // if member name is not found, use the name directly

      // sign member to account, default to zero address (powerful)
      const { domain, types, commitment } = getMemberSignPayload(name, form.address || ZERO_ADDRESS, communityInfo.node.registry, communityInfo.node.registryInterface, { chainId: communityInfo._chaninId })
      const result = await signer._signTypedData(
        domain,
        types,
        commitment
      );
      setResult(result)
      setLoading(false)
    } catch (e: any) {
      console.log(e)
      message({
        type: 'error',
        content: 'Failed to generate signature: ' + e.message,
      }, { t: 'brand-generate-signature', k: form.name })
      setLoading(false)
    }
  }

  
  return (
    <Dialog
      open={open}
      title='Generate Invited Code'
      loading={loading}
      confirmText='Generate'
      disableCloseBtn
      handleClose={handleClose}
      handleConfirm={handleSign}>
      <CommunitySignature
        community={communityInfo?.tokenUri?.name || ''}
        loading={loading}
        form={form}
        validation={validation}
        handleChange={(name, value) => {
          setForm({ ...form, [name]: value })
        }}
      />
      { result && <div className="mt-2">
        <h3 className="font-bold">Invited code:</h3>
        <p className="break-words">{result}</p>
      </div> }
    </Dialog>
  )
}

export default CommunitySignatureDialog
