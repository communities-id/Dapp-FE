import { BigNumber, ethers } from "ethers"

function formToApi(value: string, durationUnit: number) {
  if (value === '0') {
    return '0'
  }
  const numberBN = ethers.utils.parseUnits((value || 0).toString(), 18);
  return numberBN.div(durationUnit).add(1).toString()
}

function apiToForm(value: BigNumber, durationUnit: number) {
  const str = (Number(value.mul(durationUnit)) / 1e18).toString()
  const dotPosition = str.indexOf('.')
  if (dotPosition === -1) {
    return str
  }
  return Number(str.slice(0, dotPosition + 7)).toString()
}

console.log(formToApi('0', 365))
console.log(formToApi('1', 365))
console.log(formToApi('1.2', 365))
console.log(formToApi('1234567.89', 365))
console.log(formToApi('1.2345678', 365))

const a = formToApi('1', 365)
const b = formToApi('1.2', 365)
const c = formToApi('1234567.89', 365)
const d = formToApi('1.2345678', 365)

console.log(apiToForm(BigNumber.from('0'), 365))
console.log(apiToForm(BigNumber.from(a), 365))
console.log(apiToForm(BigNumber.from(b), 365))
console.log(apiToForm(BigNumber.from(c), 365))
console.log(apiToForm(BigNumber.from(d), 365))
