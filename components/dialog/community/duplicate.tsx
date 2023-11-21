import { FC, FormEvent, useState } from 'react'
import Modal from '@/components/common/modal';
import StarIcon from '@/public/icons/star.svg'
import RoundedLogo from '@/public/logo-round.svg'
import CloseIcon from '~@/icons/close.svg'
import { useRouter } from 'next/router';

interface Props {
  open: boolean
  duplicateFrom: string
  handleClose: () => void
}

const CommunityDuplicate: FC<Props> = ({ open, duplicateFrom, handleClose }) => {

  const router = useRouter()
  const [name, setName] = useState('')
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // handleSearch(name)
    router.push(`/community/${name}?duplicateFrom=${duplicateFrom}`)
  }

  function handleClickOutside(e: Event) {
    const searchBox = document.querySelector('.duplicate-content')
    if (!searchBox?.contains(e.target as Node)) {
      handleClose()
    }
  }

  return (
    <Modal open={open} wrapClassName="duplicate-container" onClick={handleClickOutside} slideProps={{
      direction: 'X',
      offset: 800
    }}>
      <div className="fixed w-[800px] max-w-[100vw] top-0 right-0 h-[100vh] bg-white duplicate-content">
        <div className="dapp-page h-full relative">
          <div className="main pt-[70px]  text-center flex flex-col items-center mb-40">
            <h1 className="title font-Saira">Create Your <span><span>Own</span></span> Community</h1>
            <form
              className="mt-7.5 border-[6px] border-primary border-w-3 w-[600px] rounded-full flex justify-between items-center bg-white overflow-hidden px-3 py-3 gap-4"
              onSubmit={(e) => handleSubmit(e)}
            >
              <div className='flex items-center w-full'>
                <RoundedLogo width="58" height="58" className="flex-shrink-0" />
                <input
                  type="text"
                  placeholder='Search for a name'
                  className="text-lg outline-none text-[20px] w-full"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <button className="button-xl bg-primary text-white text-lg w-auto text-[20px] flex-shrink-0">
                <StarIcon width="20" height="20" />
                <span className='ml-2.5'>Create Brand</span>
              </button>
            </form>
          </div>
          <div className="absolute top-[33px] left-5 cursor-pointer bg-white border border-gray-7 rounded-[6px] px-2 py-2">
            <CloseIcon width='16' height='16' onClick={handleClose} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CommunityDuplicate