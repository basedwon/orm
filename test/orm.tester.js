const Storage = require('@plaindb/storage/mock')
const MemoryDB = require('../../memory')
const LevelDB = require('../../level')
const { _, log } = require('basd')
const Orm = require('../lib/orm')

async function test() {
  models = {
    user: { fields: { name: 'string', age: 'number' }, index: ['name']},
  }
  const db = new LevelDB(true)
  const orm = new Orm(db, models)

  user = await orm.create('user', { name: 'Alice', age: 33 })

  // _.print(await orm.read('user', user.id))

  _.print(await orm.findOneBy('user', 'name', 'Alice'))
}

async function testV3() {
  models = {
    // user: { name: 'string', age: 'number', pet: '~pet' },
    // pet: { name: 'string', age: 'number', owner: '~user' },

    user: { name: 'string', age: 'number', pets: { list: '~pet' }}, // required array
    // user: { name: 'string', age: 'number', pets: { list: '...pet' }}, // required spread
    // user: { name: 'string', age: 'number', pet: '~pet' },
    // user: { name: 'string', age: 'number', pets: { list: '~...pet' }}, // optional spread
    // user: { name: 'string', age: 'number', pets: { list: '~pet' }}, // optional array
    // pet: { name: 'string', age: 'number', owner: '~user' },
    pet: { name: 'string', age: 'number', owners: { list: '~user' }},
    // pet: { name: 'string', age: 'number', owners: { list: '~...user' }},
    // pet: { name: 'string', age: 'number' },
  }
  const db = new LevelDB(true)
  const orm = new Orm(db, models)

  // pet = await orm.create('pet', { name: 'Spot', age: 3 })
  user = await orm.create('user', { name: 'Alice', age: 33 })
  // user = await orm.create('user', { name: 'Alice', age: 33, pet })
  pet = await orm.create('pet', { name: 'Spot', age: 3, owners: [user] })
  // user = await orm.create('user', { name: 'Alice', age: 33, pets: [pet] })
  // await orm.update('user', user.id, { pets: [pet] })
  // await orm.update('user', user.id, { pet })
  // await orm.update('pet', pet.id, { owner: user })


  // await orm.delete('pet', pet.id)
  await orm.delete('user', user.id)

  // await orm.insert('user', 'pets', user.id, pet.id)

  // await orm.update('user', user.id, { pets })
  // await orm.insert('pet', 'owners', pet.id, user)
  // await orm.update('user', user.id, { pet })

  // _.print(await orm.read('user', user.id).load('pets.owners'))
  // _.print(await orm.read('user', user.id).collect())
  // _.print(await orm.read('pet', pet.id).load('owners.pets.owners'))
  // _.print(await orm.read('user', user.id))
  // _.print(await orm.read('pet', pet.id))
  _.print(await orm.read('user', user.id).load())
  _.print(await orm.read('pet', pet.id).load())

  // _.print(orm)
  // await db.listAll()
}

async function testOneToOneV2() {
  models = {
    user: { name: 'string', age: 'number', pet: '~pet' },
    pet: { name: 'string', age: 'number', owner: '~user' },
  }
  const db = new LevelDB(true)
  const orm = new Orm(db, models)

  pet = await orm.create('pet', { name: 'Spot', age: 3 })
  user = await orm.create('user', { name: 'Alice', age: 33 })
  // user = await orm.create('user', { name: 'Alice', age: 33, pet })

  await orm.update('user', user.id, { pet })

  _.print(await orm.read('user', user.id).load('pet.owner'))
  _.print(await orm.read('pet', pet.id).load('owner.pet.owner'))

  // _.print(orm)
}

async function testVarious() {
  models = {
    // user: { name: 'string', age: 'number', pets: { list: 'pet' }}, // required array
    user: { name: 'string', age: 'number', pets: { list: '...pet' }}, // required spread
    // user: { name: 'string', age: 'number', pets: { list: '~...pet' }}, // optional spread
    // user: { name: 'string', age: 'number', pets: { list: '~pet' }}, // optional array
    pet: { name: 'string', age: 'number' },
  }
  const db = new LevelDB(true)
  const orm = new Orm(db, models)

  petA = await orm.create('pet', { name: 'Spot', age: 3 })
  petB = await orm.create('pet', { name: 'Dune', age: 10 })
  user = await orm.create('user', { name: 'Alice', age: 33, pets: [petA, petB] })
  // user = await orm.create('user', { name: 'Alice', age: 33 })

  // await orm.insert('user', 'pets', user, petB)
  // await orm.remove('user', 'pets', user, petA)
  // await orm.remove('user', 'pets', user, petB)
  // await orm.insert('user', 'pets', user, petA)

  // log(await orm.findOne('user', {}).collect())
  // log(await orm.read('user', user.id).collect('pets'))
  // log(await orm.read('user', user.id).collect())
  // log(await orm.read('user', user.id).collect().load())
  // log(await orm.read('user', user.id).load('pets'))
  // log(await orm.read('user', user.id).load())
  // log(await orm.read('user', user.id))
  log(await orm.findIn('user', 'pets', user.id, { age: { $gte: 3 }}))

  // await db.listAll()
  // _.print(orm)
}

async function testOneToNone() {
  models = {
    user: { name: 'string', age: 'number', pet: 'pet' },
    pet: { name: 'string', age: 'number' },
  }

  const db = new LevelDB(true)
  const orm = new Orm(db, models)

  pet = await orm.create('pet', { name: 'Spot', age: 3 })
  user = await orm.create('user', { name: 'Alice', age: 33, pet })

  _.print(orm)
  // log(await orm.find('user', {}).load())
  log(await orm.findOne('user', {}).load())
  // await db.listAll()
  // _.print(models)
}

_.executor(test)
