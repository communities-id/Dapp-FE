
export const constantsLMin = 1
export const constantsLMax = 10
export const constantsRule = new RegExp(`^[0-9]{${constantsLMin},${constantsLMax}}$`)

export const decimalsLMin = 1
export const decimalsLMax = 10
export const decimalsRMin = 0
export const decimalsRMax = 6
export const decimalsRule = new RegExp(`^[0-9]{${decimalsLMin},${decimalsLMax}}[\.]?[0-9]{${decimalsRMin},${decimalsRMax}}$`)

export const minimumDecimalsPrice = Math.pow(10, -decimalsRMax)
export const minimumDecimalsPriceStr = '0.000001'
export const maximumPrice = Math.pow(10, decimalsLMax) + 1