
import { v4 as uuidV4 } from "uuid";
import chalk from "chalk";
import { createHelia } from 'helia'
// import { json } fro0m '@helia/json'
import { strings } from '@helia/strings'
import { dagJson } from '@helia/dag-json'

import llamaTokenizer from 'llama-tokenizer-js'

// console.log(llamaTokenizer.encode("Hello world!").length)

const helia = await createHelia()
const s = strings(helia)
// const j = json(helia) //for  objects https://github.com/ipfs/helia?tab=readme-ov-file#-json
const d = dagJson(helia) // for nested CID https://github.com/ipfs/helia?tab=readme-ov-file#-dag-json

export class JSONParser {
  constructor(options) {
    this.options = options;

  }

  async encode(input, level = 0) {

console.log(llamaTokenizer.encode(input).length)
return
    let inputType = null
    if (Array.isArray(input)) {
      inputType = "array"
    } else {
      inputType = typeof input
    }

    console.log(chalk.blue.bgRed.bold(inputType), level, input);
    const newLevel = level + 1
    let result = null
    switch (inputType) {
      case 'array':
        result = await this.encodeArray(input, newLevel)
        break;
      case 'object':
        result = await this.encodeObject(input, newLevel)
        break;
      case 'string':
        console.log("############the string", input)
        result = await this.encodeString(input, newLevel)
        console.log("result STRING", result)
        break;
      default:
        console.log("\n\t--> TYPE INCONNU", chalk.red.bgBlue.bold(inputType), level, input);
        result = "TYPE inconnu"

    }
    return result

  }

  async encodeArray(input, level) {
    console.log("\n\t--> encode", level, input);
    let encodedArray = []
    for (let element of input) {
      const partial = await this.encode(element, level)
      encodedArray.push(partial)
    }
    return encodedArray
  }



  async encodeObject(input, level=0) {
    console.log("encode", input)
    let deepCloned = Object.assign({}, input);
    for (const [key, value] of Object.entries(deepCloned)) {
      console.log(key + "->" + value);
      deepCloned[key] = await this.encode(value, level)
    }
    return await d.add(deepCloned) 
  }

  async decodeObject(CID){
    const retrievedObject = await d.get(CID)
console.log(retrievedObject)
let deepCloned = Object.assign({}, retrievedObject);
for (const [key, value] of Object.entries(deepCloned)) {
  console.log(key + "->" + value);
  console.log(typeof value)
   deepCloned[key] = await s.get(deepCloned[key])
}
return await d.get(deepCloned.name)
  }

  async encodeString(input, level = 0) {
    // console.log("encodingString ",input)
       return  await s.add(input) // should we add an option to trim  .trim() ?
  }

  async decodeString(CID, level = 0) {
    // console.log("decodeString ",CID)
        return await s.get(CID)
  }


  async encode1(input, level = 0) {

    console.log("\n\t-->", level, input);
    let type = null
    if (Array.isArray(input)) {
      type = "array"
      let encodedArray = []
      const newlevel = level + 1
      for (let element of input) {
        let result = await this.encode(element, newlevel)
        console.log(result)
        encodedArray.push(result)
      }
      return encodedArray
    } else if (typeof input == "object") {
      const newlevel = level + 1
      for (const [key, value] of Object.entries(input)) {
        console.log(key + "->" + value);
        let result = await this.encode(value, newlevel)
        console.log(result)
        return result
      }
    } else if (typeof input == "string") {
      let result = await this.encodeString(input)
      console.log(result)
      return result
    } else {
      console.log(chalk.yellow("unknown", input))
      return "unknown"
    }



  }

  // async encodeString(str) {
  //   const myImmutableAddress = await s.add(str)
  //   console.log(chalk.yellow("str", str))
  //   return myImmutableAddress
  // }



  async splitok(input) {

    const natCid = await d.add({ name: "Nat" })
    const samCid = await d.add({ name: "Sam" })

    const treePostCid = await d.add({ content: "trees", author: samCid })
    const computerPostCid = await d.add({ content: "computers", author: natCid })

    console.log([treePostCid, computerPostCid])

    const computerPost = await d.get(computerPostCid)
    console.log(computerPost)
    let auth = await d.get(computerPost.author)
    console.log(typeof auth, auth, auth.name)


    console.log("tokens length", llamaTokenizer.encode(input).length)

    let tok = llamaTokenizer.encode("Hello world!")
    let detok = llamaTokenizer.decode(tok)
    console.log(tok, detok)

  }

  async split2(input) {
    // const object1 = { hello: 'world' }
    const myImmutableAddress1 = await d.add(input)
    console.log(myImmutableAddress1)


    const retrievedObject = await d.get(myImmutableAddress1)
    console.log("ret", retrievedObject)
    // { link: CID(baguqeerasor...) }

    console.log("ret2", await d.get(retrievedObject.instructions))

  }

  split1(input) {
    let output = {}
    let isArray = Array.isArray(input)
    if (isArray) {
      let parsedArray = this.parseArray(input)
      console.log("parsed Array", parsedArray)
      output.array = parsedArray
    }
    let type = typeof (input)
    console.log(type)

    output.input = input

    return output
  }


  parseArray1(input) {
    console.log("isArray", input)
    let output = []
    for (let i of input) {
      let splitted = this.split(i)
      output.push(splitted)
    }

    return output
  }

  parseObject1(input) {
    let output = {}
    return output
  }
  parseLink1(input) {
    let output = {}
    return output
  }
  encodeString1(input) {
    let output = {}
    return output
  }
}