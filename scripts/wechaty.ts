import * as dotenv from 'dotenv'
dotenv.config()
import { WechatyBuilder, Contact, Message, ScanStatus, log } from 'wechaty'
import qrTerm from 'qrcode-terminal'
import { WechatyInterface } from 'wechaty/impls'

async function onScan(qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    qrTerm.generate(qrcode, { small: true })  // show qrcode on console

    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

async function onLogin(user: Contact, bot: WechatyInterface) {
  console.log(`User ${user} logged in`)
}

async function onMessage(message: Message) {
  const _from = message.talker()
  const _listener = message.listener()
  const _room = message.room()
  const _type = message.type()
  const _text = message.text()
  const _date = message.date()
  const _age = message.age()
  const from = {
    id: _from.id,
    name: _from?.name(),
    alias: await _from?.alias()
  }
  const to = {
    id: _listener && _listener.id,
    name: _listener?.name(),
    alias: await _listener?.alias()
  }
  const room = {
    id: _room?.id,
    topic: await _room?.topic()
  }
  const msg = JSON.stringify({
    from,
    to,
    room,
    type: _type,
    text: _text,
    date: _date,
    age: _age,
  }, null, 2)
  console.log(msg)
  if (room.topic === '吃饭群' || room.topic === 'wechaty') {
    await _room?.remove(_from)
  }
  if ((room.topic === '吃饭群' || room.topic === 'wechaty') && _type === 7) {
    await message.say(msg)
  }
}

async function main() {
  // Initializing the bot
  const bot = WechatyBuilder.build({
    name: 'starter-bot',
    puppet: 'wechaty-puppet-wechat4u',
  })

  // Starting the bot
  bot
    .on('scan', onScan)
    .on('login', (user: Contact) => onLogin(user, bot))
    // .on('message', onMessage)
    .start()
    
}

main()