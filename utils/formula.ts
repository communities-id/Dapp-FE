import { BigNumber, ethers } from 'ethers'

import { PriceMode, CommunityPrice } from '@/types/contract'
import { formatNumToWei, formatWeiToNum, formatDecimalsPrice, formatToUnitPrice, formatToFormPrice, formatToDecimal } from '@/utils/format'
import { mathEvaluate, mathMul, mathDiv } from '@/utils/math'

export const priceModeFormulaMap: Record<PriceMode, string> = {
  [PriceMode.CONSTANT]: 'a',
  [PriceMode.LINEAR]: 'a + b * x',
  [PriceMode.EXPONENTIAL]: 'a + (b * x) / (c * x + d)',
  [PriceMode.SQUARE]: 'a + ((x ^ 2) * b) / c',
}

// to do
// export const calcFormula = (x: number, params: PriceFormulaCalcParams) => {
//   const { a, b, c, d } = params
//   const _a = Number(a ?? 0)
//   const _b = Number(b ?? 0)
//   const _c = Number(c ?? 0)
//   const _d = Number(d ?? 0)
//   if (params.mode === PriceMode.CONSTANT) return x * _a
//   if (params.mode === PriceMode.LINEAR) return _a + _b * x
//   if (params.mode === PriceMode.EXPONENTIAL) return _a + ((_b * x) / (_c * x + _d))
//   if (params.mode === PriceMode.SQUARE) return _a + (((x ** 2) * _b) / _c)
// }

export type PriceFormulaCalcParams = Partial<Omit<CommunityPrice<string>, 'commissionRate'>> & { mode: CommunityPrice['mode'] }

/**
 * 
 * @param x tokenID
 * @param params CommunityPrice
 * @returns 
 */
export const calcCurrentMintPrice = (x: number, params: PriceFormulaCalcParams, decimals = 18) => {
  const formula = priceModeFormulaMap[params.mode]

  const coefficients = formula.match(/[abcd]+/g) || []
  const _formula = `_${formula}_`
  const words = _formula.split(/[abcd]+/g)

  const afterFormula = words.map((word, idx) => {
    if (!coefficients[idx]) return word.replace('_', '')
    return word.replace('_', '') + params[coefficients[idx] as keyof PriceFormulaCalcParams]
  }).join('').replace(/x/g, String(x))


  let price = mathEvaluate(afterFormula)
  // (x / 0) will be Infinity
  if ((price === 'Infinity' || price === 'NaN')) {
    price = params.a ?? '0'
  }

  return {
    price,
    priceWei: formatNumToWei(price, decimals)
  }
}

interface ConstantModeParams {
  a: number
}

/**
 * x: tokenID
 * y = a_
 *   = a * 10^decimals
 *  => a_ -> a * 10^decimals
 * @param {number} params.a the price for durationUnit
 * @param decimals 
 * @returns 
 */
export const parseToConstantFormulaUnitPrice = (params: ConstantModeParams, durationUnit = 1, decimals = 18) => {
  const { a } = params
  return {
    // unit price is number of wei divided by durationUnit: a_ = a * 10^decimals / durationUnit
    a_: formatToUnitPrice(a, durationUnit, decimals),
    b_: '0',
    c_: '0',
    d_: '0'
  }
}

interface ConstantModeWeiParams {
  a_: BigNumber
}
/**
 * x: tokenID
 * y = a_
 *   = a * 10^decimals
 *  => a -> formatWeiToNum(a_)
 * @param {number} params.a_
 * @param decimals 
 * @returns 
 */
export const parseToConstantFormulaDurationPrice = (params: ConstantModeWeiParams, durationUnit = 1, decimals = 18) => {
  const { a_ } = params
  const a = formatToFormPrice(a_, durationUnit, decimals)
  return {
    // form price is the integer value after being multiplied by durationUnit: a = a_ * durationUnit / 10^decimals
    a: formatDecimalsPrice(a, 6),
    b: '0',
    c: '0',
    d: '0',
  }
}

interface LinearModeParams {
  a: number
  b: number
}

/**
 * x: tokenID
 * y = b_ * (x - 1) + a_
 *   = b * 10^decimals * (x - 1) + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b_ -> b * 10^decimals
 * 
 * @param {number} params.a
 * @param {number} params.b
 * @param decimals 
 * @returns 
 */
export const parseToLinearFormulaUnitPrice = (params: LinearModeParams, durationUnit = 1, decimals = 18) => {
  const { a, b } = params
  return {
    // unit price is number of wei divided by durationUnit: a_ = a * 10^decimals / durationUnit
    a_: formatToUnitPrice(a, durationUnit, decimals),
    // b_ = b * 10^decimals / durationUnit
    b_: formatToUnitPrice(b, durationUnit, decimals),
    c_: '0',
    d_: '0'
  }
}

interface LinearModeWeiParams {
  a_: BigNumber
  b_: BigNumber
}

/**
 * x: tokenID
 * y = b_ * (x - 1) + a_
 *   = b * 10^decimals * (x - 1) + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b_ -> b * 10^decimals
 * 
 * @param {number} params.a_
 * @param {number} params.b_
 * @param decimals 
 * @returns 
 */
export const parseToLinearFormulaDurationPrice = (params: LinearModeWeiParams, durationUnit = 1, decimals = 18) => {
  const { a_, b_ } = params
  return {
    // form price is the integer value after being multiplied by durationUnit: a = a_ * durationUnit / 10^decimals
    a: formatDecimalsPrice(formatToFormPrice(a_, durationUnit, decimals), 6),
    // b = b_ * durationUnit / 10^decimals
    b: formatDecimalsPrice(formatToFormPrice(b_, durationUnit, decimals), 6),
    c: '0',
    d: '0'
  }
}

interface ExponentialModeParams {
  a: number
  b: number
  c: number
  d: number
}

/**
 * x: tokenID
 * y = (b_ * (x - 1)) / (c_ * (x - 1) + d_) + a_
 *   = (b * 10^decimals * (x - 1)) / (c * (x - 1) + d) + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b_ -> b * 10^decimals; c_ -> c; d_ -> d
 * 
 * @param {number} params.a
 * @param {number} params.b
 * @param {number} params.c
 * @param {number} params.d
 * @param decimals 
 * @returns 
 */
export const parseToExponentialFormulaUnitPrice = (params: ExponentialModeParams, durationUnit = 1, decimals = 18) => {
  const { a, b, c, d } = params
  return {
    // unit price is number of wei divided by durationUnit: a_ = a * 10^decimals / durationUnit
    a_: formatToUnitPrice(a, durationUnit, decimals),
    // b_ = b * 10^decimals / durationUnit
    b_: formatToUnitPrice(b, durationUnit, decimals),
    c_: formatDecimalsPrice(c, 6),
    d_: formatDecimalsPrice(d, 6),
  }
}

interface ExponentialModeWeiParams {
  a_: BigNumber
  b_: BigNumber
  c_: BigNumber
  d_: BigNumber
}

/**
 * x: tokenID
 * y = (b_ * (x - 1)) / (c_ * (x - 1) + d_) + a_
 *   = (b * 10^decimals * (x - 1)) / (c * (x - 1) + d) + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b_ -> b * 10^decimals; c_ -> c; d_ -> d
 * 
 * @param {number} params.a_
 * @param {number} params.b_
 * @param {number} params.c_
 * @param {number} params.d_
 * @param decimals 
 * @returns 
 */
export const parseToExponentialFormulaDurationPrice = (params: ExponentialModeWeiParams, durationUnit = 1, decimals = 18) => {
  const { a_, b_, c_, d_ } = params
  return {
    // form price is the integer value after being multiplied by durationUnit: a = a_ * durationUnit / 10^decimals
    a: formatDecimalsPrice(formatToFormPrice(a_, durationUnit, decimals), 6),
    // b = b_ * durationUnit / 10^decimals
    b: formatDecimalsPrice(formatToFormPrice(b_, durationUnit, decimals), 6),
    c: formatDecimalsPrice(c_.toNumber(), 6),
    d: formatDecimalsPrice(d_.toNumber(), 6),
  }
}

interface SquareModeParams {
  a: number
  b: number
  c: number
}

/**
 * x: tokenID
 * y = ((x - 1) * (x - 1) * b_) / c_ + a_
 *   = ((x - 1) * (x - 1) * b * 10^decimals) / c + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b -> b * 10^decimals; c_ -> c;
 * 
 * @param {number} params.a
 * @param {number} params.b
 * @param {number} params.c
 * @param decimals 
 * @returns 
 */
export const parseToSquareFormulaUnitPrice = (params: SquareModeParams, durationUnit = 1, decimals = 18) => {
  const { a, b, c } = params
  return {
    // unit price is number of wei divided by durationUnit: a_ = a * 10^decimals / durationUnit
    a_: formatToUnitPrice(a, durationUnit, decimals),
    // b_ = b * 10^decimals / durationUnit
    b_: formatToUnitPrice(b, durationUnit, decimals),
    c_: formatDecimalsPrice(c, 6),
    d_: '0'
  }
}

interface SquareModeWeiParams {
  a_: BigNumber
  b_: BigNumber
  c_: BigNumber
}

/**
 * x: tokenID
 * y = ((x - 1) * (x - 1) * b_) / c_ + a_
 *   = ((x - 1) * (x - 1) * b * 10^decimals) / c + (a * 10^decimals)
 *  => a_ -> a * 10^decimals; b -> b * 10^decimals; c_ -> c;
 * 
 * @param {number} params.a
 * @param {number} params.b
 * @param {number} params.c
 * @param decimals 
 * @returns 
 */
export const parseToSquareFormulaDurationPrice = (params: SquareModeWeiParams, durationUnit = 1, decimals = 18) => {
  const { a_, b_, c_ } = params
  return {
    // form price is the integer value after being multiplied by durationUnit: a = a_ * durationUnit / 10^decimals
    a: formatDecimalsPrice(formatToFormPrice(a_, durationUnit, decimals), 6),
    // b = b_ * durationUnit / 10^decimals
    b: formatDecimalsPrice(formatToFormPrice(b_, durationUnit, decimals), 6),
    c: formatDecimalsPrice(c_.toNumber(), 6),
    d: '0'
  }
}

interface FormulaToWeiParams {
  a: number
  b: number
  c: number
  d: number
}
export const parseToUnitPrice = (mode: PriceMode, params: FormulaToWeiParams, durationUnit = 1, decimals = 18) => {
  if (mode === PriceMode.CONSTANT) return parseToConstantFormulaUnitPrice(params, durationUnit, decimals)
  if (mode === PriceMode.LINEAR) return parseToLinearFormulaUnitPrice(params, durationUnit, decimals)
  if (mode === PriceMode.EXPONENTIAL) return parseToExponentialFormulaUnitPrice(params, durationUnit, decimals)
  if (mode === PriceMode.SQUARE) return parseToSquareFormulaUnitPrice(params, durationUnit, decimals)
  return {
    a_: '0',
    b_: '0',
    c_: '0',
    d_: '0',
  }
}

interface WeiToFormulaParams {
  a_: BigNumber
  b_: BigNumber
  c_: BigNumber
  d_: BigNumber
}
export const parseToDurationPrice = (mode: PriceMode = PriceMode.CONSTANT, params: WeiToFormulaParams, durationUnit = 1, decimals = 18) => {
  if (mode === PriceMode.CONSTANT) return parseToConstantFormulaDurationPrice(params, durationUnit, decimals)
  if (mode === PriceMode.LINEAR) return parseToLinearFormulaDurationPrice(params, durationUnit, decimals)
  if (mode === PriceMode.EXPONENTIAL) return parseToExponentialFormulaDurationPrice(params, durationUnit, decimals)
  if (mode === PriceMode.SQUARE) return parseToSquareFormulaDurationPrice(params, durationUnit, decimals)
  return {
    a: '0',
    b: '0',
    c: '0',
    d: '0',
  }
}

export const parseNumericFormula = (mode: PriceMode, params: WeiToFormulaParams, durationUnit = 1, decimals = 18) => {
  const { a, b, c, d } = parseToDurationPrice(mode, params, durationUnit, decimals)
  const formula = priceModeFormulaMap[mode]
  return formula.replace('a', a).replace('b', b).replace('c', c).replace('d', d)
}