import type { NextApiRequest, NextApiResponse } from 'next'

import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomBytes } from 'crypto'

// size参数表示要生成的字节数
function generateRandomHex(size = 16) {
  // randomBytes方法用于异步生成随机数据
  return randomBytes(size).toString('hex');
}

const client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY as string,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { mimetype = 'image/png' } = req.query as Record<string, string>

  const randomId = generateRandomHex(16)

  const mimeTypeArr = mimetype.split('/')

  const key = `uploads/${randomId}.${mimeTypeArr[mimeTypeArr.length - 1]}`
  const param = {
    Bucket: "sgp-ccp-material",
    Key: key,
    // Expires: 60
  }
  const putCmd = new PutObjectCommand(param)
  const presignedUrl = await getSignedUrl(client, putCmd, {
    expiresIn: 3600,
  });

  const url = `https://sgp-ccp-material.s3.ap-southeast-1.amazonaws.com/${key}`

  return res.status(200).json({
    code: 0,
    data: {
      presignedUrl,
      url
    }
  })
}
