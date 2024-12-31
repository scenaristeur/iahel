import { createHelia } from 'helia'
import { dagJson } from '@helia/dag-json'

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