
import { v4 as uuidV4 } from "uuid";
import chalk from "chalk";
import { createHelia } from 'helia'
// import { json } fro0m '@helia/json'
// import { strings } from '@helia/strings'
import { dagJson } from '@helia/dag-json'

import llamaTokenizer from 'llama-tokenizer-js'

console.log(llamaTokenizer.encode("Hello world!").length)

const helia = await createHelia()
// const s = strings(helia)
// const j = json(helia) //for  objects https://github.com/ipfs/helia?tab=readme-ov-file#-json
const d = dagJson(helia) // for nested CID https://github.com/ipfs/helia?tab=readme-ov-file#-dag-json

export class JSONParser {
  constructor(options) {
    this.options = options;

  }

  async split(input) {

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


  parseArray(input) {
    console.log("isArray", input)
    let output = []
    for (let i of input) {
      let splitted = this.split(i)
      output.push(splitted)
    }

    return output
  }

  parseObject(input) {
    let output = {}
    return output
  }
  parseLink(input) {
    let output = {}
    return output
  }
  encodeString(input) {
    let output = {}
    return output
  }
}