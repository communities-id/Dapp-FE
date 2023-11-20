import { useState } from 'react'

import Button from "@/components/_common/button"
import Input from "@/components/_common/input"

export default function BrandMannageSocialLink() {
  const [groupId, setGroupId] = useState('')
  
  return (
    <div className="modal-content-container modal-content">
      <h1 className='text-main-black text-xl'>Link Telegram Group</h1>
      <div className='w-full mt-[30px] p-[30px] bg-gray-6 rounded-md'>
        <div className="flex flex-col gap-[30px]">
          <div>
            <div>
              <b>Step 1:</b>
              <span>Add CommunitiesID Telegram bot to your group and set it as an administrator.</span>
            </div>
            <div className="mt-[14px] flex items-center gap-[14px]">
              <div className="w-20 h-20 bg-main-black rounded-lg"></div>
              <Button size="medium" className="w-[292px]">Add</Button>
            </div>
          </div>
          <div className="w-full h-[1px] bg-gray-3"></div>
          <div>
            <div>
              <b>Step 2:</b>
              <span>Fill the group ID you got from the Telegram bot:</span>
            </div>
            <p className="mt-2 text-xs text-black-tr-40">Note: To change your group, just link the new group ID;</p>
            <div className="mt-[14px] flex items-center gap-[10px]">
              <Input inputclassname='!w-[260px]' value={groupId} placeholder="Enter Telegram GroupID" />
              <Button size="medium" className="w-30">Link</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}