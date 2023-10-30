import { BigNumber } from 'ethers'
import * as math from 'mathjs'

import { formatLocaleDecimalsNumber } from '@/utils/format'

const bnMath = math.create(math.all, {
  number: 'BigNumber',
  precision: 18,
})

export const mathEvaluate = (formula: string) => {
  const val = bnMath.evaluate(formatLocaleDecimalsNumber(formula)).toFixed(18)
  if (val === 'NaN') return '0'
  return val
}

export const mathMul = (a: string | number, b: string | number) => {
  return bnMath.multiply(math.bignumber(a), math.bignumber(b)).toString()
}

export const mathDiv = (num: number, divisor: number, precision = 18) => {
  return math.format(num / divisor, { notation: 'fixed', precision }).slice(0, precision)
}