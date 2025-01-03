import { readFile, readdir } from 'fs/promises';
import { JSONParser } from "./lib/json-parser.js";

let jsonparser = new JSONParser()

let file = "fichier1"
let folder = "./data/"

let files = await readdir(folder)
// console.log(files)

async function encode(file){
let json = JSON.parse(await readFile(folder + file , "utf8"));

let parsed = await jsonparser.encode(json)
console.log("parsed", parsed)
// console.log(parsed.input)
// console.log(parsed.input.instructions)
}

for await  (let file of files){
  if(file.endsWith(".json")){
    console.log("\n###\tparsing ", file)
    await encode(file)
  }

}