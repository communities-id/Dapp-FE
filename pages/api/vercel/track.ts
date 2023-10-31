import type { NextApiRequest, NextApiResponse } from 'next'
import { track } from '@vercel/analytics/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const query = req.query

  try {
    const msg = JSON.parse(query.v as string)
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
    const refer = req.headers.referer || ''
    await track(msg.event, {
      msg: msg.msg,
      ua: msg.ua,
      url: msg.url,
      ip,
      refer
    })
  } catch (e) { }
  
  return res.status(200).json({
    code: 0,
    data: 'ok'
  })
}
