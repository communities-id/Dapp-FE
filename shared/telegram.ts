import axios from 'axios';
import { recoverPersonalSignature } from '@metamask/eth-sig-util'
import { prisma } from '@/shared/prisma';
import { TG_BOT_ID, TG_BOT_NAME, ZERO_ADDRESS } from './constant';
import { Community } from '@prisma/client';
import { execSearch } from './helper';
// import { checkInCommunity } from './alchemy';

interface TGMsg {
  chatId: number
  chatTitle: string
  fromId: number
  type: 'private' | 'group' | 'supergroup'
  text: string
  new_chat_participant?: any
}

const domain = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'https://testnet\\.communities\\.id' : 'https://communities\\.id'

const escape = (str: string) => {
  return str.replaceAll('-', '\\-').replaceAll('.', '\\.').replaceAll('!', '\\!').replaceAll('>', '\\>').replaceAll('_', '\\_')
}

export const callTGAPI = async (method: string, data?: any) => {
  const token = process.env.TG_BOT_TOKEN
  const url = `https://api.telegram.org/bot${token}/${method}`
  try {
    const res = await axios.post(url, data)
    return res.data
  } catch (e: any) {
    console.log(url, e.response.data)
  }
}

export const parseMessage = (msg: any): TGMsg | undefined => {
  if (!msg || !msg.chat || !msg.from) {
    return
  }
  const { text, chat, from, new_chat_participant } = msg
  return {
    chatId: chat.id,
    chatTitle: chat.title,
    fromId: from.id,
    type: chat.type,
    text: text || '',
    new_chat_participant,
  }
}

const isCommand = (text: string, cmd: string) => {
  return text === cmd || text === `${cmd}@${TG_BOT_NAME}`
}

const isGroupMsg = (msg: TGMsg) => {
  return msg.type === 'group' || msg.type === 'supergroup'
}

export const handleMessage = async (msg: TGMsg) => {
  if (msg.new_chat_participant) {
    if (msg.new_chat_participant.id === TG_BOT_ID) {
      await handleBotJoinNewGroup(msg)
    } else {
      await handleOtherJoinGrouop(msg)
    }
    return
  }
  const textArr = msg.text.trim().split(/\s+/)
  const command = textArr[0]
  const args = textArr.slice(1)

  if (isCommand(command, '/start')) {
    await sendMessage(msg.chatId, 'Greetings! Welcome to the world of communities, I’m the guardian and your personal assistant. Press the “Menu” beblow to start our journeys.')
    if (msg.type === 'private') {
      await handleGetme(msg.fromId)
    }
  }

  if (isCommand(command, '/help')) {
    let content = 'Wanna know more about Communities ID? All secrets are here: [doc](https://docs.communities.id/)'
    content += '\n\nThree steps to create a token\\-gated community:'
    content += '\n1\\. Create a telegram group;'
    content += '\n2\\. Invite me and Set me as a group admin;'
    content += '\n3\\. Use the command /getgroup in the group chat, and then paste the group ID in your Brand ID setting page;'
    content += '\nDone\\! Now you will have me as your community guardian to only keep those who hold your Communities ID\\.'
    await sendMessage(msg.chatId, content, {
      parse_mode: 'MarkdownV2'
    })
  }

  if (isCommand(command, '/getme')) {
    if (isGroupMsg(msg)) {
      await sendMessage(msg.chatId, `So many people here! Please DM me to use this command.`)
      return
    }
    await handleGetme(msg.fromId)
  }

  if (isCommand(command, '/getgroup')) {
    if (!isGroupMsg(msg)) {
      await sendMessage(msg.chatId, `GroupID … Hmmm … Please use this command in a group.`)
    } else {
      const chatId = msg.chatId.toString().replaceAll('-', '\\-')
      const community = await prisma.community.findUnique({
        where: {
          tgGroupID: msg.chatId.toString()
        }
      })
      let content = `The ID of this group is: *${chatId}*`
      if (community) {
        content += `\nThe brand DID of this group bind is: [${escape(community.name)}](${domain}/community/${escape(community.name)})`
      }
      await sendMessage(msg.chatId, content, {
        parse_mode: 'MarkdownV2'
      })
    }
  }
}

export const handleBotJoinNewGroup = async (msg: TGMsg) => {
  const chatId = msg.chatId.toString().replaceAll('-', '\\-')
  await sendMessage(msg.chatId, `The ID of this group is: *${chatId}*`, {
    parse_mode: 'MarkdownV2'
  })
}

export const handleOtherJoinGrouop = async (msg: TGMsg) => {
  if (msg.new_chat_participant.is_bot) {
    return
  }
  const tgUsers = await prisma.telegramUser.findMany({
    where: {
      userId: msg.new_chat_participant.id.toString()
    }
  })
  const community = await prisma.community.findUnique({
    where: {
      tgGroupID: msg.chatId.toString()
    }
  })
  if (!community) {
    return
  }
  if (tgUsers.length === 0) {
    await sendMessage(msg.new_chat_participant.id, `Please link your telegram account in your profile: ${domain}/address/<your wallet address\\>`, {
      parse_mode: 'MarkdownV2'
    })
    await removeUserFromGroup(Number(community.tgGroupID), msg.new_chat_participant.id)
    return
  }
  const member = await prisma.member.findFirst({
    where: {
      chainId: community.chainId,
      registry: community.registry,
      to: {
        in: tgUsers.map(v => v.address)
      }
    }
  })

  if (!member) {
    await sendMessage(msg.new_chat_participant.id, `Also, make sure you have the DID needed for this group: "${community.name}"`)
    await removeUserFromGroup(Number(community.tgGroupID), msg.new_chat_participant.id)
    return
  }
  const name = escape(msg.new_chat_participant.username || msg.new_chat_participant.first_name)
  const { member: memberName,community: brandName } = execSearch(member.name)
  await sendMessage(msg.chatId, `Welcome @${name}, the owner of [${escape(member.name)}](${domain}/community/${escape(brandName)}?member=${escape(memberName)}), join this group`, {
    parse_mode: 'MarkdownV2'
  })
}

export const handleGetme = async (userId: number) => {
  const tgUsers = await prisma.telegramUser.findMany({
    where: {
      userId: userId.toString()
    },
    select: {
      address: true
    }
  })
  const wallets = tgUsers.map(v => v.address).join('\n')
  let content = `Let’s see\\.\\.\\. Your userID is: *${userId}*`
  if (tgUsers.length > 0) {
    content += `\nAnd your wallets addresses are: \n*${wallets}*\n`
  }
  content += `\nJust simply paste your userID in [Connect Telegram](${domain}/transit/connect) to bind more wallets`
  await sendMessage(userId, content, {
    parse_mode: 'MarkdownV2'
  })
}

export const banUserWithNoPermission = async (community: Community, address: string) => {
  const tgUser = await prisma.telegramUser.findFirst({
    where: {
      address: address.toLowerCase()
    }
  })
  if (!tgUser) {
    return
  }
  const tgUsers = await prisma.telegramUser.findMany({
    where: {
      userId: tgUser?.userId
    }
  })
  const addresses = tgUsers.map(v => v.address)
  const members = await prisma.member.findFirst({
    where: {
      chainId: community.chainId,
      registry: community.registry,
      to: {
        in: addresses
      }
    }
  })
  if (!members) {
    await removeUserFromGroup(Number(community.tgGroupID), Number(tgUser?.userId))
  }
}


export const sendMessage = async (chatId: number | string, text: string, options: Object = {}) => {
  await callTGAPI('sendMessage', {
    chat_id: Number(chatId),
    text,
    ...options
  })
}

async function removeUserFromGroup(chatId: number, userId: number) {
  await callTGAPI('banChatMember', {
    chat_id: chatId,
    user_id: userId,
    revoke_messages: true
  })
}

export const isBotAdmin = async (chatId: number | string) => {
  const res = await callTGAPI('getChatAdministrators', {
    chat_id: Number(chatId)
  })
  if (!res) {
    return false
  }
  const admins = res.result.map((v: any) => v.user.id)
  return admins.indexOf(TG_BOT_ID) > -1
}
