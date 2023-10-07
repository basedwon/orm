const Storage = require('@plaindb/storage/mock')
const Orm = require('../lib/orm')

describe('Orm', () => {
  let orm
  beforeEach(() => {
    orm = new Orm(new Storage(), { user: { name: 'string', age: 'number' }})
  })

  describe('#create()', () => {
    it('should create an entity of a specific type', async () => {
      const entity = await orm.create('user', { name: 'John Doe', age: 30 })

      expect(entity).to.have.property('id')
      expect(entity).to.have.property('name', 'John Doe')
      expect(entity).to.have.property('age', 30)
    })
  })

  describe('#update()', () => {
    it('should update an existing entity', async () => {
      const entity = await orm.create('user', { name: 'John Doe', age: 30 })
      const updated = await orm.update('user', entity.id, { age: 31 })

      expect(updated).to.have.property('id', entity.id)
      expect(updated).to.have.property('age', 31)
    })
  })

  describe('#delete()', () => {
    it('should delete an existing entity', async () => {
      const entity = await orm.create('user', { name: 'John Doe', age: 30 })
      const deleted = await orm.delete('user', entity.id)
      const afterDelete = await orm.read('user', entity.id)

      expect(deleted).to.have.property('id', entity.id)
      expect(afterDelete).to.be.null
    })
  })

  describe('#read()', () => {
    it('should read an existing entity', async () => {
      const entity = await orm.create('user', { name: 'John Doe', age: 30 })
      const readEntity = await orm.read('user', entity.id)

      expect(readEntity).to.have.property('id', entity.id)
      expect(readEntity).to.have.property('name', 'John Doe')
    })
  })

  describe('@todo - #findBy()', () => {
    it('should find entities by query', async () => {
      // await orm.create('user', { name: 'John', age: 30 })
      // await orm.create('user', { name: 'Jane', age: 40 })

      // const entities = await orm.findBy('user', { age: 30 })

      // expect(entities).to.be.an('array')
      // expect(entities).to.have.length(1)
      // expect(entities[0]).to.have.property('name', 'John')
    })
  })

  describe('#find()', () => {
    it('should find entities by complex query', async () => {
      await orm.create('user', { name: 'John', age: 30 })
      await orm.create('user', { name: 'Jane', age: 40 })

      const entities = await orm.find('user', { age: { $gt: 35 } })
      expect(entities).to.be.an('array')
      expect(entities).to.have.length(1)
      expect(entities[0]).to.have.property('name', 'Jane')
    })
  })

  describe('#findOne()', () => {
    it('should find one entity by query', async () => {
      await orm.create('user', { name: 'John', age: 30 })
      await orm.create('user', { name: 'Jane', age: 40 })

      const entity = await orm.findOne('user', { age: { $gt: 35 } })

      expect(entity).to.have.property('name', 'Jane')
    })
  })
})
