// Main module
declare module "@plaindb/orm" {
  import { Model as EncoderModel, Encoder } from "@basd/encoder"

  interface IConfig {
    index?: any
    search?: any
    operators?: Array<any>
    [key: string]: any
  }

  interface IField {
    list?: boolean
    model?: string
    relation?: any
    [key: string]: any
  }

  interface IListOp {
    prop: string
    value: any
  }

  class Index {
    constructor(db: any, config: any)
  }

  class Query {
    static Engine: any
  }

  class Aggregator {
    constructor(orm: Orm)
  }

  class OrmModel extends EncoderModel {
    constructor(type: string, fields: { [key: string]: IField }, config: IConfig, codex: any)
    path: string[]
    dispatch(op: string, ...args: any[]): Promise<any>
    commit(ops: any[]): Promise<any>
    reduce(entity: any): any
    reduceFields(entity: any, listOps?: IListOp[]): IListOp[]
    buildCreate(data: any, ops?: any[], visited?: Set<string>): Promise<{ ops: any[], entity: any }>
    create(data: any): Promise<any>
    buildUpdate(id: string, update: any, ops?: any[], visited?: Set<string>): Promise<{ ops: any[], entity: any }>
    update(id: string, update: any): Promise<any>
    buildDelete(id: string, ops?: any[], visited?: Set<string>): Promise<{ ops: any[], entity: any }>
    delete(id: string): Promise<any>
    populate(entity: any, ...props: string[]): Promise<any>
    collect(entity: any, ...props: string[]): Promise<any>
    read(id: string): Promise<any>
    find(query: any): Promise<any[]>
    findOne(query?: any): Promise<any | null>
    findBy(query: any, ...values: any[]): Promise<any[]>
  }

  class Orm extends Encoder {
    static Model: typeof OrmModel
    constructor(storage: any, models: { [key: string]: any }, opts: any)
    reduce(entity: any): any
    buildCreate(type: string, data: any, ops?: any[]): Promise<any>
    create(type: string, data: any): Promise<any>
    buildUpdate(type: string, id: string, update: any, ops?: any[]): Promise<any>
    update(type: string, id: string, update: any): Promise<any>
    buildDelete(type: string, id: string, ops?: any[]): Promise<any>
    delete(type: string, id: string): Promise<any>
    read(type: string, id: string): Promise<any>
    fetch(id: string): Promise<any | null>
    findBy(type: string, query: any, ...values: any[]): Promise<any[]>
    find(type: string, query: any): Promise<any[]>
    findOne(type: string, query?: any): Promise<any | null>
  }
}

// Additional types and classes
type Ops = any[]
type SetType = Set<any>
type EntityType = any
type EntityIdType = string | number

class OrmForeignField extends Encoder.Field.Bs58 {
  _validType(): boolean
}

abstract class ListHandler {
  constructor(model: any, field: any)
  abstract reduce(arr: any[], listOps?: Ops[]): any[]
  abstract insert(entityId: EntityIdType, childId: any, ops?: Ops[]): Promise<{ entity: EntityType, ops: Ops }>
  abstract remove(entityId: EntityIdType, childId: any, ops?: Ops[]): Promise<{ entity: EntityType, ops: Ops }>
  abstract find(entityId: EntityIdType, query: any): Promise<any>
  abstract collect(): Promise<any[]>
  abstract load(): Promise<void>
}

class ArrayList extends ListHandler {
  reduce(arr?: any[], listOps?: Ops[]): any[]
  insert(entityId: EntityIdType, childId: any, ops?: Ops[], visited?: SetType): Promise<void>
  remove(entityId: EntityIdType, childId: any, ops?: Ops[], visited?: SetType): Promise<{ entity: EntityType, ops: Ops }>
  find(entity: EntityType, query: any): Promise<any>
  collect(entity: EntityType): Promise<any[]>
  load(entity: EntityType): Promise<void>
}

class SpreadList extends ListHandler {
  reduce(arr?: any[], listOps?: Ops[]): any[]
  insert(entityId: EntityIdType, value: any, ops?: Ops[], visited?: SetType): Promise<{ entity: null, ops: Ops }>
  collect(entity: EntityType): Promise<any[]>
}

abstract class RelationHandler {
  constructor(model: any, field: any, otherField: any)
  abstract create(entity: EntityType, field: any, value: any, visited: SetType): Promise<void>
}

class OneToOneRelation extends RelationHandler {
  create(entity: EntityType, value: any, ops: Ops, visited: SetType): Promise<void>
}

class OneToManyRelation extends RelationHandler {
  create(entity: EntityType, value: any, ops: Ops, visited: SetType): Promise<void>
}

class ManyToOneRelation extends RelationHandler {
  create(entity: EntityType, value: any, ops: Ops, visited: SetType): Promise<void>
}

class RelationFactory {
  static get ONE_TO_ONE(): string
  static get ONE_TO_MANY(): string
  static get MANY_TO_ONE(): string
  static get MANY_TO_MANY(): string
  static getHandler(relation: string, model: any, field: any, otherField: any): RelationHandler
  static getType(field: any, otherField: any): string
}
