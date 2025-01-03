import * as assert from 'assert';
import { JSONParser } from "../lib/json-parser.js";
let jsonparser = new JSONParser()
let object = {
  "role": "user",
  "content": "salut",
  "name": "Bob"
}
let CID = null
let object_CID = "baguqeeragjjdxdh266uanubzpv7ch4zzr5olttagkvlzipiuaiie7hcs5ojq"

describe('Object', function () {
  describe('encode', async function () {

    it('should be equal to object_CID', async function () {
      CID = await jsonparser.encodeObject(object)
      console.log(CID)
      assert.equal(CID.toString(), object_CID);
    });
  });
  describe('decode', async function () {
    it('should return ', async function () {
      let decoded = await jsonparser.decodeObject(CID)
      console.log("decoded", decoded)
      assert.equal(decoded, object);
    });
  });
});






