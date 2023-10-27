import * as dotenv from 'dotenv'
dotenv.config()
import { prisma } from '@/shared/prisma';
import axios from 'axios';

const domain = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'https://testnet.communities.id' : 'https://www.communities.id'
async function callTGAPI(method: string, data?: any) {
  const token = process.env.TG_BOT_TOKEN
  const url = `https://api.telegram.org/bot${token}/${method}`
  try {
    const res = await axios.post(url, data)
    return res.data
  } catch (e: any) {
    console.log(e)
  }
}

export const setWebhook = async () => {
  return await callTGAPI('setWebhook', {
    url: `${domain}/api/telegram/webhook`
  })
}

export const sendMessage = async (chatId: number | string, text: string, options: Object = {}) => {
  await callTGAPI('sendMessage', {
    chat_id: Number(chatId),
    text,
    ...options
  })
}

export const setCommands = async () => {
  const res = await callTGAPI('setMyCommands', {
    commands: [
      {
        command: 'start',
        description: 'Show welcome info'
      },
      {
        command: 'help',
        description: 'Help info for communitiesID bot'
      },
      {
        command: 'getme',
        description: 'Get your info'
      },
      {
        command: 'getgroup',
        description: 'Get the info of this group'
      },
    ],
  })
  console.log(res)
}

async function removeMember() {
  const res = await callTGAPI('banChatMember', {
    chat_id: -4039435565,
    user_id: 5251667030,
    revoke_messages: true
  })
  console.log(JSON.stringify(res, null, 2))
}

async function test() {
  const res = await callTGAPI('getChatAdministrators', {
    chat_id: -4039435565
  })
  console.log(res.result.map((v: any) => v.user.id))
}

async function main() {
  // await setWebhook()
  // await setCommands()
  await sendMessage(5879750850, `Welcome *@${"wgfwe"}*, the owner of [${'a\\.jtest1'}](${domain}/member/${'a\\.jtest1'})", join this group`, {
    parse_mode: 'MarkdownV2'
  })
}

main()