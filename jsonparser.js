const parseComma = input => {
  input = input.trim()
  if (input.startsWith(',')) {
    return [',', input.slice(1)]
  } else {
    return ['', input]
  }
}

const parseColon = (input) => {
  input = input.trim()
  if (input.startsWith(':')) {
    return [':', input.slice(1)]
  } else {
    return ['', input]
  }
}

const parseSpace = (input) => {
  if (input.startsWith(' ')) {
    return [' ', input.substring(1, input.length)]
  } else {
    return ['', input]
  }
}

const parseNull = (input) => {
  input = input.trim()

  if (input.indexOf('null') === 0) {
    return [null, input.substring(4, input.length)]
  }
  return null
}

const parseBoolean = (input) => {
  input = input.trim()

  if (input.indexOf('true') === 0) {
    return [true, input.substring(4, input.length)]
  }
  if (input.indexOf('false') === 0) {
    return [false, input.substring(5, input.length)]
  }
  return null
}

const parseString = (input) => {
  input = input.trim()
  let endIndx = getEndIndex(input)

  if (input.charAt(0) === '\'' && endIndx !== -1) {
    let str = input.substring(1, endIndx)

    return [str, input.substring(endIndx + 1, input.length)]
  }
  return null
}

const parseNumber = (input) => {
  input = input.trim()
  let num = getNumber(input)

  if (num !== null) {
    let endIndx = num.length
    return [parseFloat(num), input.substring(endIndx, input.length)]
  }
  return null
}

const parseArray = (input) => {
  input = input.trim()
  let TempArray = []

  if (input.charAt(0) === '[') {
    input = input.slice(1)

    while (!input.startsWith(']')) {
      let op = parse(input)

      if (op !== null && op !== undefined) {
        TempArray.push(op[0])
        let tempop = parseComma(op[1])
        input = tempop[1]
      } else {
        break
      }
    }
    if (input.startsWith(']')) {
      input = input.slice(1)

      return [TempArray, input]
    }
  }
  return null
}

const parseObject = (input) => {
  input = input.trim()
  let keys = []
  let vals = []
  let iskey = true

  let TempObj = {}

  if (input.charAt(0) === '{') {
    input = input.slice(1)

    while (!input.startsWith('}')) {
      let op = parse(input)

      if (op !== null && op !== undefined) {
        if (iskey) {
          keys.push(op[0])
          iskey = false
        } else {
          vals.push(op[0])
          iskey = true
        }
        let tempop = parseColon(op[1])
        let tempop1 = parseComma(tempop[1])
        input = tempop1[1]
      } else {
        break
      }
    }
    if (input.startsWith('}')) {
      input = input.slice(1)
    }
    for (let i = 0; i < keys.length; ++i) {
      TempObj[keys[i]] = vals[i]
    }
    return [TempObj, input]
  }
  return null
}

const parse = (input) => {
  let parserType = getParser(input.trim())
  let op

  switch (parserType) {
    case 'string':
      op = parseString(input)
      break
    case 'number':
      op = parseNumber(input)
      break
    case 'boolean':
      op = parseBoolean(input)
      break
    case 'null':
      op = parseNull(input)
      break
    case 'array':
      op = parseArray(input)
      break
    case 'object':
      op = parseObject(input)
      break
  }
  return op
}

const getParser = (str) => {
  if (str.startsWith('\'')) {
    return 'string'
  }
  if (str.startsWith('true') || str.startsWith('false')) {
    return 'boolean'
  }

  if (str.startsWith('null')) {
    return 'null'
  }

  if (str.startsWith('{')) {
    return 'object'
  }

  if (str.startsWith('[')) {
    return 'array'
  }

  if (str.startsWith(' ')) {
    return 'space'
  }

  if (getNumber(str) !== null) {
    return 'number'
  }
  return null
}

const getNumber = (input) => {
  let rgx = /^[-+]?(\d+(\.\d*)?|\.\d+)([e][+-]?\d+)?/i
  let nums = input.match(rgx)

  if (nums !== null) {
    return nums[0]
  }
  return null
}

const getEndIndex = (input) => {
  let commaIndex = input.indexOf(',',1)
  let endIndex = input.indexOf('\'',1)

  if (commaIndex < endIndex) {
    endIndex = -1
  }
  return endIndex
}

/*
// Object
let sampleip1 = '{\'name\':null,\'age\':0, \'section\':\'A\', \'flag\':true, \'nums\':[1,2,\'3\',],},\'test1\':20,\'test2\':30'
let sampleop1 = parse(sampleip1)
console.log('----------------------------------Start Testcase 1---------------------------------------------')
console.log(sampleip1)
console.log(sampleop1)
console.log('----------------------------------End Testcase 1-----------------------------------------------')
*/

/*
// Array
let sampleip2 = '[\'1\',\'2\',\'3\',\'4\',\'5\'], \'eca\':\'football\''
let sampleop2 = parse(sampleip2)
console.log('----------------------------------Start Testcase 2---------------------------------------------')
console.log(sampleip2)
console.log(sampleop2)
console.log('----------------------------------End Testcase 2-----------------------------------------------')
*/

/*
// Array Inside Object
let sampleip3 = '{\'class\':[\'1\',\'2\',\'3\',\'4\',\'5\'], \'eca\':\'football\'}'
let sampleop3 = parse(sampleip3)
console.log('----------------------------------Start Testcase 3---------------------------------------------')
console.log(sampleip3)
console.log(sampleop3)
console.log('----------------------------------End Testcase 3-----------------------------------------------')
*/

/*
// Object Inside Array
let sampleip4 = '[1,\'nice\',{\'test\':\'this\',\'good\':\'lord\'},10,\'meow\'],\'eat\':\'pizza\''
let sampleop4 = parse(sampleip4)
console.log('----------------------------------Start Testcase 4---------------------------------------------')
console.log(sampleip4)
console.log(sampleop4)
console.log('----------------------------------End Testcase 4-----------------------------------------------')
*/

/*
// Empty Array
let sampleip5 = '[]'
let sampleop5 = parse(sampleip5)
console.log('----------------------------------Start Testcase 5---------------------------------------------')
console.log(sampleip5)
console.log(sampleop5)
console.log('----------------------------------End Testcase 5-----------------------------------------------')
*/

/*
// Nested Array with object element
let sampleip6 = '[1,2,3,[4,5,6],{\'test\':\'this\',\'good\':\'lord\'},100],\'drink\':\'coffee\''
let sampleop6 = parse(sampleip6)
console.log('----------------------------------Start Testcase 6---------------------------------------------')
console.log(sampleip6)
console.log(sampleop6)
console.log('----------------------------------End Testcase 6-----------------------------------------------')
*/

/*
// Nested Object
let sampleip7 = '{\'name\':null,\'age\':0, \'section\':\'A\', \'flag\':true,\'mytest\':{\'test\':\'this\',\'good\':\'lord\'}},\'test1\':20,\'test2\':30'
let sampleop7 = parse(sampleip7)
console.log('----------------------------------Start Testcase 7---------------------------------------------')
console.log(sampleip7)
console.log(sampleop7)
console.log('----------------------------------End Testcase 7-----------------------------------------------')
*/
