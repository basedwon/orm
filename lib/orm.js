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
  async insert(entityId, childId, ops = [], visited = new Set()) {
    log('insert!!')
    // childId = this.orm.reduce(childId)
    // const entity = await this.orm.read(this.model.type, entityId)
    // const existing = _.get(entity, this.field.name, [])
    // if (_.includes(existing, childId)) return { entity, ops }
    // const list = _.uniq(existing.concat(childId))
    // const update = {}
    // _.setWith(update, this.field.name, list, Object)
    // _.setWith(entity, this.field.name, list, Object)
    // await this.orm.buildUpdate(this.model.type, entityId, update, ops, visited)
    // return { entity, ops }
  }
  async remove(entityId, childId, ops = [], visited = new Set()) {
    childId = this.orm.reduce(childId)
    const entity = await this.orm.read(this.model.type, entityId)
    const existing = _.get(entity, this.field.name)
    if (!_.includes(existing, childId)) return { entity, ops }
    const list = _.pull(existing, childId)
    const update = {}
    _.setWith(update, this.field.name, list, Object)
    _.setWith(entity, this.field.name, list, Object)
    await this.orm.buildUpdate(this.model.type, entityId, update, ops, visited)
    return { entity, ops }
  }
  async find(entity, query) {
    const list = await this.collect(entity)
    const iterator = async function *iterator() {
      for (const item of list) {
        yield [item.id, item]
      }
    }
    return OrmQueryEngine.find(query, iterator())
  }
  async collect(entity) {
    return _.get(entity, this.field.name, [])
  }
  async load(entity) {
    log('load entity', entity, this.field.name)
    // if (!_.isObj(entity))
    //   entity = await this.orm.read(this.model.type, entity)
    // await this.orm.populate(this.model.type, entity, this.field.name)
    // return _.get(entity, this.field.name, [])
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
    const path = ['list', this.model.type, entityId, this.field.name]
    ops.push(this.model.createOp(path, 'put', value, true))
    return { entity: null, ops }
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
}

class OneToOneRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
  }
}

class OneToManyRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
  }
}

class ManyToOneRelation extends RelationHandler {
  async create(entity, value, ops, visited) {
    const update = {}
    const otherId = this.model.reduce(entity)
    _.setWith(update, this.field.link, otherId, Object)
    await this.orm.buildUpdate(this.field.model, value, update, ops, visited)
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
      // case this.ONE_TO_MANY:
      //   return new OneToManyRelation(model, field, otherField)
      // case this.MANY_TO_ONE:
      //   return new ManyToOneRelation(model, field, otherField)
      // case this.MANY_TO_MANY:
      //   return new ManyToManyRelation(model, field, otherField)
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
    model = this.orm.getModel(model)
    const parts = this.splitProperty(model, prop)
    const firstProp = parts[0]
    const restProp = parts.slice(1).join('.')
    // const field = model.fields[firstProp]
    const field = model.getField(firstProp, false)
    if (!field || !field.model)
      throw new Error(`Invalid property "${firstProp}"`)
    let value
    // @todo - put into list handler?
    if (field.list === 'spread') {
      const db = this.orm.storage.sub(['list', model.type, entity.id, prop])
      const arr = []
      for await (const [id] of db.iterator()) {
        arr.push(this.orm.read(field.model, id))
      }
      value = await Promise.all(arr)
    } else if (field.list) {
      value = await Promise.all(_.get(entity, firstProp, [])
        .map((id, ii) => this.orm.read(field.model, id)))
    } else {
      const id = _.get(entity, firstProp)
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

    } else {
      await Promise.all(props.map(prop => this.populateProperty(model, entity, prop)))
    }
    // if (props.length) {
    //   await Promise.all(props.map(prop => this.populateProperty(model, entity, prop)))
    // } else {
    //   await Promise.all(_.entries(model.fields)
    //     .filter(([prop, field]) => field.model)
    //     .map(([prop, field]) => this.populateProperty(model, entity, prop)))
    // }
    return entity
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

    const search = config.search || new Search()
    _.objProp(this, 'engine', new Query.Engine({
      getIterator: this.iterator.bind(this),
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
        log('filter', entity)
      },
      refine (results, config) {
        return results
      },
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
  async commit(ops) {
    return this.orm.storage.root.batch(ops)
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

  async buildCreate(data, ops = [], visited = new Set()) {
    data = _.cloneDeep(data)
    data.id = data.id || _.uuid()
    const listOps = this.reduceFields(data)
    const entity = super.create(data, true)
    const entityId = this.reduce(entity)

    const compoundKey = `${this.type}-${entityId}`
    if (visited.has(compoundKey)) return { ops, entity }
    visited.add(compoundKey)

    await this._mergeListOps(entityId, listOps, ops)

    const encoded = this.encode(entity)
    ops.push(this.createOp(['entity'], 'put', entityId, this.type))
    ops.push(this.createOp(['models', this.type], 'put', entityId, encoded))
    this.index.buildAdd(entity, ops)

    // do relations
    for (const [prop, field] of _.entries(this.fields)) {
      if (!field.relation) continue
      const value = _.get(entity, prop)
      if (_.isNil(value)) continue
      await field.relationHandler.create(entity, value, ops, visited)
    }

    return { ops, entity }
  }
  async create(data) {
    return this.dispatch('create', data)
  }
  async buildUpdate(id, update, ops = [], visited = new Set()) {
    const oldEntity = await this.read(id)
    const entity = {}
    for (const [prop, field] of _.entries(this.fields)) {
      const oldValue = _.get(oldEntity, prop)
      const newValue = _.get(update, prop)
      const value = !_.isNil(newValue) ? newValue : oldValue
      _.setWith(entity, prop, value, Object)
    }
    const encoded = this.encode(entity)
    ops.push(this.createOp(['entity'], 'put', entity.id, this.type))
    ops.push(this.createOp(['models', this.type], 'put', entity.id, encoded))
    this.index.buildUpdate(oldEntity, entity, ops)
    return { ops, entity }
  }
  async update(id, update) {
    return this.dispatch('update', id, update)
  }
  async buildDelete(id, ops = [], visited = new Set()) {
    const entity = await this.read(id)
    ops.push(this.createOp(['entity'], 'del', entity.id))
    ops.push(this.createOp(['models', this.type], 'del', entity.id))
    this.index.buildRemove(entity, ops)
    return { ops, entity }
  }
  async delete(id) {
    return this.dispatch('delete', id)
  }
  populate(entity, ...props) {
    return this.aggregator.populate(this.type, entity, ...props)
  }
  collect(entity, ...props) {
    return this.aggregator.collect(this.type, entity, ...props)
  }
  read(id) {
    const promise = this.db.model.get(id).then(encoded => this.decode(encoded))
    promise.populate = async (...props) => {
      const entity = await promise
      const populateField = async (field) => {
        const value = _.get(entity, field.name)
        const other = await this.orm.read(field.model, value)
        _.setWith(entity, field.name, other)
      }
      if (_.isEmpty(props)) {
        for (const [prop, field] of _.entries(this.fields)) {
          if (!field.model) continue
          await populateField(field)
        }
      } else {
        for (const prop of props) {
          const field = this.getField(prop)
          if (!field || !field.model)
            throw new Error(`Invalid field property for populating`)
          await populateField(field)
        }
      }
      return entity
    }
    promise.collect = async (...props) => {
      const entity = await promise
      const collectField = async (field) => {
        const value = await field.listHandler.collect(entity)
        _.setWith(entity, field.name, value, Object)
      }
      if (_.isEmpty(props)) {
        for (const [prop, field] of _.entries(this.fields)) {
          if (!field.list) continue
          await collectField(field)
        }
      } else {
        for (const prop of props) {
          const field = this.getField(prop)
          if (!field || !field.list)
            throw new Error(`Invalid field property for collection`)
          await collectField(field)
        }
      }
      return entity
    }
    return promise
  }
  read(id) {
    const promise = this.db.model.get(id).then(encoded => this.decode(encoded))

    const populate = (...props) => {
      const prom = promise.then(entity => this.populate(entity, ...props))
      // prom.collect = collect
      return prom
    }

    promise.populate = populate

    return promise
  }
  async *iterator(opts = {}) {
    for await (const [id, encoded] of this.db.model.iterator(opts))
      yield [id, this.decode(encoded)]
  }
  find(query) {
    return this.engine.find(query)
  }
  findOne(query = {}) {
    query.$limit = 1
    return this.find(query)
      .then(results => !_.isNil(results[0]) ? results[0] : null)
  }
  findBy(query, ...values) {
    return this.index.find(query, ...values)
      .then(results => Promise.all(results.map(id => this.read(id))))
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
      parseField (type, config) {
        if (_.isString(config.list) && !config.type) {
          if (config.list.startsWith('...')) {
            type = config.list.slice(3)
            config.list = 'spread'
          } else {
            type = config.list
            config.list = 'array'
          }
        }
        return type
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
          field.listHandler = this.registry.createInstance(['list', field.list], ListHandler, model, field)
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
  buildCreate(type, data, ops) {
    return this.getModel(type).buildCreate(data, ops)
  }
  create(type, data) {
    return this.getModel(type).create(data)
  }
  buildUpdate(type, id, update, ops) {
    return this.getModel(type).buildUpdate(id, update, ops)
  }
  update(type, id, update) {
    return this.getModel(type).update(id, update)
  }
  buildDelete(type, id, ops) {
    return this.getModel(type).buildDelete(id, ops)
  }
  delete(type, id) {
    return this.getModel(type).delete(id)
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
}

module.exports = Orm
