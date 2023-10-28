import { BigNumber, ethers } from "ethers"
import * as math from 'mathjs'

const bnMath = math.create(math.all, {
  number: 'BigNumber',
  precision: 18,
})

export const formatToDecimal = (num: number | string, minimumFractionDigits = 0, maximumFractionDigits = 0) => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(num as number)
}

export const formatToCompact = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(num)
}

export const formatNumber = (num: number | string, digits = 0) => {
  if (isNaN(Number(num))) return num
  num = Number(num)
  if (num < 1000 * 10) return formatToDecimal(num, digits, digits)
  return formatToCompact(num)
}

export const formatNumToWei = (num: number | string, decimals = 18) => {
  const strNum = formatToDecimal(num as number, 0, decimals)
  return ethers.utils.parseUnits(strNum, decimals)
}

export const formatWeiToNum = (num: BigNumber, decimals = 18) => {
  if (Number(num) === 0) return '0'
  // eg: 100.0 -> 100
  return ethers.utils.formatEther(num).replace(/\.0$/g, '')
}

export const formatDecimalsPrice = (num: number | string, digits = 6) => {
  if (Number(num) === 0) {
    return '0'
  }
  const strNum = formatToDecimal(num as number, 0, digits)
  if (Number(strNum) < 1e-6) return '0.000001'
  return strNum
}

export const toBN = (num: BigNumber | number | string) => {
  return BigNumber.from(num)
}

export const mathEvaluate = (formula: string) => {
  return bnMath.evaluate(formula).toString()
}

export const formatInfo = (info: any) => {
  if (info.pool) {
    info.pool = BigNumber.from(info.pool.hex)
  }
  if (info.priceModel) {
    info.priceModel.a = BigNumber.from(info.priceModel.a.hex)
    info.priceModel.b = BigNumber.from(info.priceModel.b.hex)
    info.priceModel.c = BigNumber.from(info.priceModel.c.hex)
    info.priceModel.d = BigNumber.from(info.priceModel.d.hex)
    info.priceModel.commissionRate = BigNumber.from(info.priceModel.commissionRate.hex)
  }
  return info
}

// unit price = (wei price / durationUnit) + 1 wei
export const formatToUnitPrice = (price: number, durationUnit = 365, decimals = 18) => {
  return formatNumToWei(price, decimals).div(durationUnit).add(1).toString()
}

// form price = unit price / durationUnit
export const formatToFormPrice = (unit: BigNumber, durationUnit = 365,  decimals = 18) => {
  return formatWeiToNum(unit.mul(durationUnit), decimals)
}