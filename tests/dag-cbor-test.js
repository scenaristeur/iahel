import { createHelia } from 'helia'
import { dagCbor } from '@helia/dag-cbor'

const helia = await createHelia()
const d = dagCbor(helia)

const object1 = { hello: 'world' }
const myImmutableAddress1 = await d.add(object1)

const object2 = { link: myImmutableAddress1 }
const myImmutableAddress2 = await d.add(object2)

const retrievedObject = await d.get(myImmutableAddress2)
console.log(retrievedObject)
// { link: CID(baguqeerasor...) }

console.log(await d.get(retrievedObject.link))
// { hello: 'world' }