const { _, log } = require('basd')
const Encoder = require('@basd/encoder')
const Query = require('@basd/query')
const Search = require('@basd/search')
const Index = require('@plaindb/index')

class OrmForeignField extends Encoder.Field.Bs58 {
  _validType() {
    return true
  }
}

// Lists

class ListHandler {
  constructor(model, field) {
    _.objProp(this, 'orm', model.codex)
    _.objProp(this, 'model', model)
    _.objProp(this, 'field', field)
    _.objProp(this, 'engine', new OrmQueryEngine())
  }
  reduce(arr, listOps = []) {
    throw new Error('Must implement reduce() method')
  }
  async insert(entityId, childId, ops = []) {
    throw new Error('Must implement insert() method')
  }
  async remove(entityId, childId, ops = []) {
    throw new Error('Must implement remove() method')
  }
  async find(entityId, query) {
    throw new Error('Must implement find() method')
  }
  async collect() {
    throw new Error('Must implement collect() method')
  }
  async load() {
    throw new Error('Must implement load() method')
  }
}

class ArrayList extends ListHandler {
  reduce(arr = [], listOps = []) {
    return arr.map(val => this.orm.reduce(val))
  }
  async insert(entityId, value, ops = [], visited = new Set()) {
    entityId = this.orm.reduce(entityId)
    if (this.field.model)
      value = this.orm.reduce(value)
    const compoundKey = `${this.model.type}-${entityId}`
    if (visited.has(compoundKey)) return { ops }
    // visited.add(compoundKey) // @todo - may not need?
    const entity = await this.orm.read(this.model.type, entityId)
    if (!entity)
      throw new Error(`Parent entity "${entityId}" does not exist`)
    const existing = _.get(entity, this.field.name, [])
    if (_.includes(existing, value)) return { entity, ops }
    const list = _.uniq(existing.concat(value))
    const update = {}
    _.setWith(update, this.field.name, list, Object)
    _.setWith(entity, this.field.name, list, Object)
    await this.orm.buildUpdate(this.model.type, entityId, update, ops, visited)
    return { entity, ops }
  }
  async remove(entityId, value, ops = [], visited = new Set()) {
    entityId = this.orm.reduce(entityId)
    if (this.field.model)
      value = this.orm.reduce(value)
    const entity = await this.orm.read(this.model.type, entityId)
    if (!entity)
      throw new Error(`Parent entity "${entityId}" does not exist`)
    const existing = _.get(entity, this.field.name)
    if (!_.includes(existing, value)) return { entity, ops }
    const list = _.pull(existing, value)
    const update = {}
    _.setWith(update, this.field.name, list, Object)
    _.setWith(entity, this.field.name, list, Object)
    await this.orm.buildUpdate(this.model.type, entityId, update, ops, visited)
    return { entity, ops }
  }
  async collect(entity) {
    return _.get(entity, this.field.name, [])
  }
  async populate(entity) {
    const arr = _.get(entity, this.field.name, [])
    return Promise.all(arr.map(id => this.orm.read(this.field.model, id)))
  }
  async find(entityId, query) {
    const entity = await this.model.read(entityId).load(this.field.name)
    if (!entity)
      throw new Error(`Entity could not be found`)
    const list = _.get(entity, this.field.name)
    const iterator = async function *iterator() {
      for (const item of list) {
        yield [item.id, item]
      }
    }
    return this.engine.find(query, iterator())
  }
}

class SpreadList extends ListHandler {
  reduce(arr = [], listOps = []) {
    if (this.field.model)
      arr = arr.map((value) => this.orm.reduce(value))
    arr.map(value => listOps.push({ prop: this.field.name, value }))
    return []
  }
  async insert(entityId, value, ops = [], visited = new Set()) {
    entityId = this.orm.reduce(entityId)
    if (this.field.model)
      value = this.orm.reduce(value)

    // log('here?')
    // const compoundKey = `${this.model.type}-${entityId}`
    // if (visited.has(compoundKey)) return { ops }
    // visited.add(compoundKey)


    const path = ['list', this.model.type, entityId, this.field.name]
    ops.push(this.model.createOp(path, 'put', value, true))
    return { entity: null, ops }
  }
  async remove(entityId, value, ops = [], visited = new Set()) {
    entityId = this.orm.reduce(entityId)
    if (this.field.model)
      value = this.orm.reduce(value)
    const path = ['list', this.model.type, entityId, this.field.name]
    ops.push(this.model.createOp(path, 'del', value))
    return { entity: null, ops }
  }
  async populate(entity) {
    const arr = []
    const entityId = this.orm.reduce(entity)
    const path = ['list', this.model.type, entityId, this.field.name]
    const db = this.orm.storage.sub(path)
    for await (const [id] of db.iterator())
      arr.push(this.orm.read(this.field.model, id))
    return Promise.all(arr)
  }
  async collect(entity) {
    const arr = []
    const entityId = this.orm.reduce(entity)
    const path = ['list', this.model.type, entityId, this.field.name]
    const db = this.orm.storage.sub(path)
    for await (const [value] of db.iterator())
      arr.push(value)
    return arr
  }
  async find(entityId, query) {
    entityId = this.orm.reduce(entityId)
    const path = ['list', this.model.type, entityId, this.field.name]
    const db = this.orm.storage.sub(path)
    const self = this
    const iterator = async function *iterator() {
      for await (const [id] of db.iterator()) {
        const entity = await self.orm.read(self.field.model, id)
        yield [id, entity]
      }
    }
    return this.engine.find(query, iterator())
  }
}

// Relations

class RelationHandler {
  constructor(model, field, otherField) {
    _.objProp(this, 'orm', model.codex)
    _.objProp(this, 'model', model)
    _.objProp(this, 'field', field)
    _.objProp(this, 'otherField', otherField)
  }
  async create(entity, field, value, visited) {
    throw new Error(`Must implement create() method`)
  }
  async update(entity, field, value, visited) {
    throw new Error(`Must implement update() method`)
  }
  async delete(entity, field, value, visited) {
    throw new Error(`Must implement delete() method`)
  }
}

class OneToOneRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    if (_.isNil(value)) return
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
  }
  async update(entityId, value, ops, visited) {
    if (_.isNil(value)) return
    entityId = this.orm.reduce(entityId)
    const otherId = this.model.reduce(value)
    const update = {}
    _.setWith(update, this.field.link, entityId, Object)
    await this.orm.buildUpdate(this.field.model, otherId, update, ops, visited)
  }
  async delete(id, value, ops, visited) {
    const childId = this.orm.reduce(value)
    const update = {}
    _.setWith(update, this.field.link, null, Object)
    await this.orm.buildUpdate(this.field.model, childId, update, ops, visited)
  }
}

class OneToManyRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    if (_.isNil(value)) return
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
  }
  async update(entityId, value, ops, visited) {
    if (_.isEmpty(value)) return
    entityId = this.orm.reduce(entityId)
    const otherId = this.model.reduce(value)
    await this.otherField.listHandler.insert(otherId, entityId, ops, visited)
  }
  async delete(entity, value, ops, visited) {
    const entityId = this.orm.reduce(entity)
    await this.otherField.listHandler.remove(value, entityId, ops, visited)
  }
}

class ManyToOneRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    if (_.isEmpty(value)) return
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
  }
  async update(entityId, value, ops, visited) {
    if (_.isEmpty(value)) return
    entityId = this.orm.reduce(entityId)
    const update = {}
    _.setWith(update, this.field.link, entityId, Object)
    await Promise.all(value.map(otherId => 
      this.orm.buildUpdate(this.field.model, this.orm.reduce(otherId), update, ops, visited)))
  }
  async delete(entity, value, ops, visited) {
    const entityId = this.orm.reduce(entity)
    for (const child of value || []) {
      const childId = this.orm.reduce(child)
      const update = {}
      _.setWith(update, this.field.link, null, Object)
      await this.orm.buildUpdate(this.field.model, childId, update, ops, visited)
    }
  }
}

class ManyToManyRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    const entityId = this.orm.reduce(entity)
    for (let otherId of value) {
      otherId = this.model.reduce(otherId)
      await this.otherField.listHandler.insert(otherId, entityId, ops, visited)
    }
  }
  async update(entityId, value, ops, visited) {
    entityId = this.orm.reduce(entityId)
    for (let otherId of value) {
      otherId = this.model.reduce(otherId)
      await this.otherField.listHandler.insert(otherId, entityId, ops, visited)
    }
  }
  async delete(entity, value, ops, visited) {
    const entityId = this.orm.reduce(entity)
    for (const child of value || []) {
      const childId = this.orm.reduce(child)
      await this.otherField.listHandler.remove(childId, entityId, ops, visited)
    }
  }
}

class RelationFactory {
  static get ONE_TO_ONE() { return 'one-to-one' }
  static get ONE_TO_MANY() { return 'one-to-many' }
  static get MANY_TO_ONE() { return 'many-to-one' }
  static get MANY_TO_MANY() { return 'many-to-many' }
  static getHandler(relation, model, field, otherField) {
    switch (relation) {
      case this.ONE_TO_ONE:
        return new OneToOneRelation(model, field, otherField)
      case this.ONE_TO_MANY:
        return new OneToManyRelation(model, field, otherField)
      case this.MANY_TO_ONE:
        return new ManyToOneRelation(model, field, otherField)
      case this.MANY_TO_MANY:
        return new ManyToManyRelation(model, field, otherField)
      default:
        throw new Error(`Unknown relation type: ${relation}`)
    }
  }
  static getType(field, otherField) {
    let type
    if (field.list) type = otherField.list ? this.MANY_TO_MANY : this.MANY_TO_ONE
    else type = otherField.list ? this.ONE_TO_MANY : this.ONE_TO_ONE
    return type
  }
}

class Aggregator {
  constructor(orm) {
    this.orm = orm
  }
  splitProperty(type, prop) {
    const model = this.orm.getModel(type)
    const parts = prop.split('.')
    const result = []
    let key = parts.shift()
    while (parts.length > 0 && !model.getField(key, false))
      key += '.' + parts.shift()
    result.push(key)
    if (parts.length > 0) {
      result.push(...parts)
    }
    return result
  }
  async populateProperty(model, entity, prop) {
    if (_.isNil(entity))
      return
    model = this.orm.getModel(model)
    const parts = this.splitProperty(model, prop)
    const firstProp = parts[0]
    const restProp = parts.slice(1).join('.')
    const field = model.getField(firstProp, false)
    if (!field || !field.model)
      throw new Error(`Invalid property "${firstProp}"`)
    let value = null
    if (field.list) {
      value = await field.listHandler.populate(entity)
    } else {
      const id = _.get(entity, firstProp)
      if (!_.isNil(id))
        value = await this.orm.read(field.model, id)
    }
    _.setWith(entity, firstProp, value)
    // If there are nested parts, call populateProperty recursively
    if (restProp && value) {
      if (_.isArray(value)) {
        await Promise.all(value.map(item => this.populateProperty(field.model, item, restProp)))
      } else {
        await this.populateProperty(field.model, value, restProp)
      }
    }
  }
  async populate(type, entity, ...props) {
    props = _.flatten(props)
    const model = this.orm.getModel(type)
    if (_.isEmpty(props)) {
      await Promise.all(_.entries(model.fields)
        .filter(([prop, field]) => field.model)
        .map(([prop, field]) => this.populateProperty(model, entity, prop)))
    } else {
      await Promise.all(props.map(prop => this.populateProperty(model, entity, prop)))
    }
    return entity
  }
  async collectProperty(model, entity, prop) {
    model = this.orm.getModel(model)
    const field = model.getField(prop, false)
    if (!field || !field.model)
      throw new Error(`Invalid property "${prop}"`)
    let value
    value = await field.listHandler.collect(entity)
    _.setWith(entity, prop, value)
  }
  async collect(type, entity, ...props) {
    props = _.flatten(props)
    const model = this.orm.getModel(type)
    if (_.isEmpty(props)) {
      await Promise.all(_.entries(model.fields)
        .filter(([prop, field]) => field.model)
        .map(([prop, field]) => this.collectProperty(model, entity, prop)))
    } else {
      await Promise.all(props.map(prop => this.collectProperty(model, entity, prop)))
    }
    return entity
  }
}

// Orm

class OrmQueryEngine {
  constructor(opts = {}) {
    const search = opts.search || new Search()
    opts = _.defaults(opts, {
      prepare (config) {
        const searches = config.operators.filter(o => o.op === '$contains')
        for (const { value } of searches)
          _.setWith(config, ['contains', value], search.evaluator(value), Object)
      },
      builders: {
        contains (constraint) {
          return this.addCondition('$contains', constraint)
        },
      },
      visitors: {
        contains (property, constraint, config) {
          if (config.contains && config.contains[constraint])
            return config.contains[constraint](property)
          return search.evaluate(constraint, property)
        },
      },
      async filter (entity, config) {
        // log('filter', entity)
      },
      refine (results, config) {
        return results
      },
    })
    _.objProp(this, 'engine', new Query.Engine(opts))
  }
  find(...args) {
    return this.engine.find(...args)
  }
}

class OrmModel extends Encoder.Model {
  constructor(type, fields, config, codex) {
    super(type, fields, config, codex)
    _.objProp(this, 'orm', this.codex)
    _.objProp(this, 'db', {
      model: this.orm.db.models.sub(this.type),
      entity: this.orm.db.entity,
    })
    const indexDb = this.orm.storage.sub('index').sub(this.type)
    const index = new Index(indexDb, config.index)
    _.objProp(this, 'index', index)
    _.objProp(this, 'engine', new OrmQueryEngine({
      getIterator: this.iterator.bind(this),
    }))
    _.objProp(this, 'aggregator', new Aggregator(this.orm))
  }
  get path() {
    return this.orm.storage.path.slice()
  }
  createOp(path, type, key, value) {
    return { path: [...this.path, ...path], type, key, value }
  }
  async dispatch(op, ...args) {
    const { ops, entity } = await this[`build${_.ucf(op)}`](...args)
    await this.commit(ops)
    return entity
  }
  commit(ops) {
    return this.orm.commit(ops)
  }
  reduce(entity) {
    return this.orm.reduce(entity)
  }
  reduceFields(entity, listOps = []) {
    for (const [prop, field] of _.entries(this.fields)) {
      let value = _.get(entity, prop)
      if (field.list) {
        value = field.listHandler.reduce(value, listOps)
      } else if (field.model) {
        value = this.reduce(value)
      }
      _.setWith(entity, prop, value, Object)
    }
    return listOps
  }
  async _mergeListOps(entityId, listOps = [], ops, visited = new Set()) {
    if (listOps.length)
    for (const listOp of listOps) {
      const field = this.fields[listOp.prop]
      await field.listHandler.insert(entityId, listOp.value, ops, visited)
    }
  }
  async _iterateRelationFields(entity, callback) {
    for (const [prop, field] of _.entries(this.fields)) {
      if (!field.relation) continue
      const value = _.get(entity, prop)
      await callback(field, value)
    }
  }
  async buildCreate(data, ops = [], visited = new Set()) {
    const clone = _.cloneDeep(data)
    clone.id = clone.id || _.uuid()
    const listOps = this.reduceFields(clone)
    const entity = super.create(clone, true)
    const entityId = this.reduce(entity)
    const compoundKey = `${this.type}-${entityId}`
    if (visited.has(compoundKey)) return { ops, entity }
    visited.add(compoundKey)
    await this._mergeListOps(entityId, listOps, ops, visited)
    const encoded = this.encode(entity)
    ops.push(this.createOp(['entity'], 'put', entityId, this.type))
    ops.push(this.createOp(['models', this.type], 'put', entityId, encoded))
    this.index.buildAdd(entity, ops)
    await this._iterateRelationFields(entity, async (field, value) => {
      if (field.list) {
        const val = _.get(data, field.name, []).map(v => this.reduce(v))
        await field.relationHandler.create(entity, val, ops, visited)
      } else {
        await field.relationHandler.create(entity, value, ops, visited)
      }
    })
    return { ops, entity }
  }
  async create(data) {
    return this.dispatch('create', data)
  }
  async buildUpdate(entityId, origUpdate, ops = [], visited = new Set()) {
    entityId = this.reduce(entityId)
    const update = _.cloneDeep(origUpdate)
    const compoundKey = `${this.type}-${entityId}`
    if (visited.has(compoundKey)) return { ops }
    visited.add(compoundKey)
    const listOps = this.reduceFields(update)
    const oldEntity = await this.read(entityId)
    await this._mergeListOps(entityId, listOps, ops, visited)
    const entity = {}
    for (const [prop, field] of _.entries(this.fields)) {
      const oldValue = _.get(oldEntity, prop)
      const newValue = _.get(update, prop)
      const value = newValue === undefined ? oldValue : newValue
      _.setWith(entity, prop, value, Object)
    }
    const encoded = this.encode(entity)
    ops.push(this.createOp(['entity'], 'put', entity.id, this.type))
    ops.push(this.createOp(['models', this.type], 'put', entity.id, encoded))
    this.index.buildUpdate(oldEntity, entity, ops)

    await this._iterateRelationFields(entity, async (field, value) => {
      if (field.list) {
        const val = _.get(origUpdate, field.name, []).map(v => this.reduce(v))
        await field.relationHandler.update(entityId, val, ops, visited)
      } else {
        await field.relationHandler.update(entityId, value, ops, visited)
      }
    })
    return { ops, entity }
  }
  async update(id, update) {
    return this.dispatch('update', id, update)
  }
  async buildDelete(id, ops = [], visited = new Set()) {
    const entity = await this.read(id)

    const listOps = this.reduceFields(entity)

    const entityId = this.reduce(entity)

    const compoundKey = `${this.type}-${entityId}`
    if (visited.has(compoundKey)) return { ops, entity }
    visited.add(compoundKey)
    await this._mergeListOps(entityId, listOps, ops, visited)

    ops.push(this.createOp(['entity'], 'del', entity.id))
    ops.push(this.createOp(['models', this.type], 'del', entity.id))
    this.index.buildRemove(entity, ops)

    await this._iterateRelationFields(entity, async (field, value) => {
      if (field.list) {
        const val = _.get(entity, field.name, []).map(v => this.reduce(v))
        await field.relationHandler.delete(entity, val, ops, visited)
      } else {
        await field.relationHandler.delete(entity, value, ops, visited)
      }
    })

    return { ops, entity }
  }
  async delete(id) {
    return this.dispatch('delete', id)
  }
  async buildInsert(prop, parentId, childId, ops = [], visited = new Set()) {
    const field = this.getField(prop)
    parentId = this.reduce(parentId)
    childId = this.reduce(childId)
    const { entity } = await field.listHandler.insert(parentId, childId, ops, visited)

    await this._iterateRelationFields(entity, async (field, value) => {
      // @todo - put all of this into relation insert?
      if (field.list) {
        const otherModel = this.orm.getModel(field.model)
        const otherField = otherModel.getField(field.link)
        if (otherField.list) {
        } else {
          const update = {}
          _.setWith(update, field.link, parentId, Object)
          await this.orm.buildUpdate(field.model, childId, update, ops, visited)
        }
      } else {
        // await field.relationHandler.update(entityId, value, ops, visited)
      }
    })

    // await this.iterateRelationFields(model, entity, async (field, value) => {
    //   await field.relationHandler.insert(entityId, childId, ops, visited)
    // })

    return { ops, entity }
  }
  async insert(prop, parentId, childId) {
    return this.dispatch('insert', prop, parentId, childId)
  }
  async buildRemove(prop, entityId, childId, ops = [], visited = new Set()) {
    const field = this.getField(prop)
    entityId = this.reduce(entityId)
    childId = this.reduce(childId)
    const { entity } = await field.listHandler.remove(entityId, childId, ops, visited)

    // await this.iterateRelationFields(model, entity, async (field, value) => {
    //   await field.relationHandler.remove(entityId, childId, ops, visited)
    // })

    return { ops, entity }
  }
  async remove(prop, entityId, childId) {
    return this.dispatch('remove', prop, entityId, childId)
  }
  populate(entity, ...props) {
    return this.aggregator.populate(this.type, entity, ...props)
  }
  collect(entity, ...props) {
    return this.aggregator.collect(this.type, entity, ...props)
  }
  read(id) {
    id = this.reduce(id)
    const promise = this.db.model.get(id).then(encoded => this.decode(encoded))
    const populate = (...props) => promise.then(entity => this.populate(entity, ...props))
    const collect = (...props) => {
      const prom = promise.then(entity => this.collect(entity, ...props))
      prom.populate = prom.load = populate
      return prom
    }
    promise.populate = promise.load = populate
    promise.collect = collect
    return promise
  }
  async *iterator(opts = {}) {
    for await (const [id, encoded] of this.db.model.iterator(opts))
      yield [id, this.decode(encoded)]
  }
  find(query) {
    if (!query)
      return this.engine.find()
    const promise = this.engine.find(query)
    promise.populate = promise.load = (...props) => {
      const prom = promise.then(async results => {
        return Promise.all(results.map(entity => this.populate(entity, ...props)))
      })
      return prom
    }
    return promise
  }
  findOne(query) {
    if (!query)
      return this.engine.find().limit(1)

    query.$limit = 1
    const promise = this.engine.find(query)
      .then(results => !_.isNil(results[0]) ? results[0] : null)

    promise.populate = promise.load = (...props) => {
      const prom = promise.then(entity => this.populate(entity, ...props))
      return prom
    }
    return promise
  }
  findBy(query, ...values) {
    return this.index.find(query, ...values)
      .then(results => Promise.all(results.map(id => this.read(id))))
  }
  findOneBy(query, ...values) {
    const promise = this.findBy(query, ...values)
      .then(results => !_.isNil(results[0]) ? results[0] : null)
    promise.populate = promise.load = (...props) => {
      return promise.then(entity => this.populate(entity, ...props))
    }
    return promise
  }
  findIn(prop, entityId, query) {
    const field = this.getField(prop)
    return field.listHandler.find(entityId, query)
  }
}

class Orm extends Encoder {
  static get Model() { return OrmModel }
  constructor(storage, models, opts) {
    super(models, _.merge({
      classes: {
        'model.default': OrmModel,
        'field.foreign': OrmForeignField,
        'list.array': ArrayList,
        'list.spread': SpreadList,
      },
      parseField (config) {
        if (_.isBoolean(config.list)) {
          if (config.type.startsWith('...')) {
            config.type = config.type.slice(3)
            config.list = 'spread'
            config.required = false // because it's not stored in entity, would fail validation
          } else {
            config.list = 'array'
          }
        }
      },
      props: {
        id: 'id',
        created: 'created',
        updated: 'updated',
      },
    }, opts), { storage, db: { entity: storage.sub('entity'), models: storage.sub('models') }})
    if (!_.isEmpty(this.models)) {
      this.setModels()
    }
  }
  reduce(entity) {
    return _.isObj(entity) ? entity.id : entity
  }
  parseModels(models) {
    models = super.parseModels(models)
    for (const [type, model] of _.entries(models)) {
      model.fields = {
        id: 'bs58',
        ...model.fields,
      }
    }
    return super.parseModels(models)
  }
  setModels() {
    for (const [type, model] of _.entries(this.models)) {
      for (const [prop, field] of _.entries(model.fields)) {
        if (field.list) {
          field.listHandler = this.registry.createInstance(['list', field.list], [model, field], ListHandler)
        }
        if (this.models[field.type])
          field.model = field.type
      }
    }
    for (const [type, model] of _.entries(this.models)) {
      for (const [prop, field] of _.entries(model.fields)) {
        if (!field.model) continue
        if (field.list) {
        }
        const otherType = field.model
        const other = this.models[otherType]
        for (const [otherProp, otherField] of _.entries(other.fields)) {
          if (!otherField.model) continue
          if (otherField.model === type) {
            // if link exists and if false then no link, if string then validate, else add
            if (_.isBoolean(field.link) && !field.link) {
              continue
            } else if (_.isString(field.link)) {
              // validate?
              throw new Error(`@todo - validate custom field.link`)
            } else {
              field.link = otherProp
              field.relation = RelationFactory.getType(field, otherField)
            }
            field.relationHandler = RelationFactory.getHandler(field.relation, model, field, otherField)
          }
        }
      }
    }
  }
  buildCreate(type, data, ops, visited) {
    return this.getModel(type).buildCreate(data, ops, visited)
  }
  create(type, data) {
    return this.getModel(type).create(data)
  }
  buildUpdate(type, id, update, ops, visited) {
    return this.getModel(type).buildUpdate(id, update, ops, visited)
  }
  update(type, id, update) {
    return this.getModel(type).update(id, update)
  }
  buildDelete(type, id, ops, visited) {
    return this.getModel(type).buildDelete(id, ops, visited)
  }
  delete(type, id) {
    return this.getModel(type).delete(id)
  }
  buildInsert(type, prop, parentId, childId, ops) {
    return this.getModel(type).buildInsert(prop, parentId, childId, ops)
  }
  insert(type, prop, parentId, childId) {
    return this.getModel(type).insert(prop, parentId, childId)
  }
  buildRemove(type, prop, parentId, childId, ops) {
    return this.getModel(type).buildRemove(prop, parentId, childId, ops)
  }
  remove(type, prop, parentId, childId) {
    return this.getModel(type).remove(prop, parentId, childId)
  }
  commit(ops) {
    return this.storage.root.batch(ops)
  }
  read(type, id) {
    return this.getModel(type).read(id)
  }
  fetch(id) {
    return this.db.entity.get(id).then(type => {
      if (!type) return null
      return this.read(type, id)
    })
  }
  findBy(type, query, ...values) {
    return this.getModel(type).findBy(query, ...values)
  }
  find(type, query) {
    return this.getModel(type).find(query)
  }
  findOne(type, query) {
    return this.getModel(type).findOne(query)
  }
  findOneBy(type, query, ...values) {
    return this.getModel(type).findOneBy(query, ...values)
  }
  findIn(type, prop, entityId, query) {
    return this.getModel(type).findIn(prop, entityId, query)
  }
}

module.exports = Orm
