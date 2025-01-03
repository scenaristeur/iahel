import { createHelia } from 'helia'
import { dagJson } from '@helia/dag-json'
import { CID } from 'multiformats/cid'

import { extractJsonFromString } from '../lib/extract-json.js'
import chalk from "chalk";

const helia = await createHelia()
const d = dagJson(helia)

const object1 = { hello: 'world' }
const myImmutableAddress1 = await d.add(object1)

const object2 = { link: myImmutableAddress1 }
const myImmutableAddress2 = await d.add(object2)

const retrievedObject = await d.get(myImmutableAddress2)
console.log(retrievedObject)
// { link: CID(baguqeerasor...) }

console.log(await d.get(retrievedObject.link))
// { hello: 'world' }


let string = myImmutableAddress1.toString()
console.log("STRING",string)

let json = myImmutableAddress1.toJSON()
console.log("JSON",json)

let stringCid = CID.parse(string)
console.log(stringCid)
let res  = await d.get(stringCid)
console.log("from string",res)


let prompt_with_json = `ceci est un prompt et tu es un assistant qui a accès aux outils suivants:
tools = [{"name": "create_entities", "description": "Create multiple entities in a knowledge Graph"},
{"name": "get_entities", "description": "Get multiple entities in a knowledge Graph"}],

et voici tes instructions:
instructions: [{"id": 123, "action": "truc"},{"id": 456, "action": "faire la vaisselle"}]


et voici le contexte:
messages : [
{"role": "system", "content": "You are a helpful assistant"},
{"role": "user", "content": "Salut"},
{"role": "assistant", "content": "Bonjour, comment vas-tu ?"}    
]

là c'est un json directe sans tableau
json : {
"un": "json",
"dans": "un",
"tableau": ["on", "marche", "sur", "la ", "tête"]
}

et là c'est du texte de fin
text : "et là c'est du texte de fin"

`

console.info("\n### Recherche de json dans une chaine de caracteres, prompt")
console.log(prompt_with_json)
// let mystring = prompt_with_json

// // todo find the regex to extract arrays and objects  https://regex101.com/library/rA2aM6?orderBy=RELEVANCE&page=1&search=json&filterFlavors=dotnet&filterFlavors=pcre
// var matches = mystring.match(/\[(.*?)\]/g);

// console.log("\n##")
// if (matches) {
//     console.log(matches)
//     // var submatch = matches[1];
// }

const result = extractJsonFromString(prompt_with_json)
// console.log(result)

let start_index = 0
let end_index = 0
let last_res_length = 0
let prompt_parts = []

for (const res of result) {
    console.log("\n------------------\n",res, typeof res);
let cid = await d.add(res)
console.log(cid)

end_index = res.start+last_res_length

let prompt_part = prompt_with_json.slice(start_index, end_index);
console.log("\n##\nsub",chalk.blue(prompt_part))
// index = index + res.length
prompt_parts.push(prompt_part)
prompt_parts.push(cid)
start_index = res.start + res.length
last_res_length = res.length

}

console.log(prompt_parts)