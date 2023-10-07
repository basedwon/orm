## Classes

<dl>
<dt><a href="#Orm">Orm</a> ⇐ <code>Encoder</code></dt>
<dd><p>The Orm class extends the Encoder class and provides functionalities
for interacting with a storage system via Object-Relational Mapping.</p>
</dd>
<dt><a href="#OrmModel">OrmModel</a></dt>
<dd><p>Extends the Encoder.Model class to provide ORM functionalities.</p>
</dd>
<dt><a href="#OrmForeignField">OrmForeignField</a> ⇐ <code>Encoder.Field.Bs58</code></dt>
<dd><p>Class to provide ORM functionality for foreign fields.</p>
</dd>
<dt><a href="#ListHandler">ListHandler</a></dt>
<dd><p>Handles List operations for a given model and field. Provides several methods for
manipulating lists within the context of an ORM.</p>
</dd>
<dt><a href="#ArrayList">ArrayList</a> ⇐ <code><a href="#ListHandler">ListHandler</a></code></dt>
<dd><p>ArrayList is a specialized ListHandler that works with arrays.
It implements methods for insertion, removal, and finding elements.</p>
</dd>
<dt><a href="#SpreadList">SpreadList</a> ⇐ <code><a href="#ListHandler">ListHandler</a></code></dt>
<dd><p>SpreadList is a specialized ListHandler that works by spreading elements.
It works with a different storage mechanism for maintaining the list.</p>
</dd>
<dt><a href="#RelationHandler">RelationHandler</a></dt>
<dd><p>Handles relations between models in an ORM context. 
Provides the base for implementing one-to-one, one-to-many, and many-to-one relations.</p>
</dd>
<dt><a href="#OneToOneRelation">OneToOneRelation</a> ⇐ <code><a href="#RelationHandler">RelationHandler</a></code></dt>
<dd><p>OneToOneRelation is a specialized RelationHandler for one-to-one relations.
It provides a method for creating a one-to-one relation between entities.</p>
</dd>
<dt><a href="#OneToManyRelation">OneToManyRelation</a> ⇐ <code><a href="#RelationHandler">RelationHandler</a></code></dt>
<dd><p>OneToManyRelation is a specialized RelationHandler for one-to-many relations.
It provides a method for creating a one-to-many relation between entities.</p>
</dd>
<dt><a href="#ManyToOneRelation">ManyToOneRelation</a> ⇐ <code><a href="#RelationHandler">RelationHandler</a></code></dt>
<dd><p>ManyToOneRelation is a specialized RelationHandler for many-to-one relations.
It provides a method for creating a many-to-one relation between entities.</p>
</dd>
<dt><a href="#RelationFactory">RelationFactory</a></dt>
<dd><p>RelationFactory is a factory class for creating RelationHandler instances.
It supports one-to-one, one-to-many, and many-to-one relation types.</p>
</dd>
<dt><a href="#Aggregator">Aggregator</a></dt>
<dd><p>Aggregator provides methods for populating properties for a given type of model.
It supports nested properties and handles both lists and single references.</p>
</dd>
</dl>

<a name="Orm"></a>

## Orm ⇐ <code>Encoder</code>
The Orm class extends the Encoder class and provides functionalities
for interacting with a storage system via Object-Relational Mapping.

**Kind**: global class  
**Extends**: <code>Encoder</code>  

* [Orm](#Orm) ⇐ <code>Encoder</code>
    * [new Orm(storage, models, opts)](#new_Orm_new)
    * [.reduce(entity)](#Orm+reduce) ⇒ <code>any</code>
    * [.parseModels(models)](#Orm+parseModels) ⇒ <code>Object</code>
    * [.setModels()](#Orm+setModels)
    * [.buildCreate(type, data, ops)](#Orm+buildCreate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.create(type, data)](#Orm+create) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.buildUpdate(type, id, update, ops)](#Orm+buildUpdate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.update(type, id, update)](#Orm+update) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.buildDelete(type, id, ops)](#Orm+buildDelete) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.delete(type, id)](#Orm+delete) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.read(type, id)](#Orm+read) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.fetch(id)](#Orm+fetch) ⇒ <code>Promise.&lt;(Object\|null)&gt;</code>
    * [.find(type, query)](#Orm+find) ⇒ <code>Promise.&lt;Array&gt;</code>

<a name="new_Orm_new"></a>

### new Orm(storage, models, opts)
Constructor for creating a new instance of the Orm class.


| Param | Type | Description |
| --- | --- | --- |
| storage | <code>Object</code> | The storage backend instance. |
| models | <code>Object</code> | The model definitions. |
| opts | <code>Object</code> | Additional options for configuring the ORM. |

<a name="Orm+reduce"></a>

### orm.reduce(entity) ⇒ <code>any</code>
Reduces an entity object to its essential property, usually an ID.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>any</code> - The reduced entity, usually an ID.  

| Param | Type | Description |
| --- | --- | --- |
| entity | <code>Object</code> | The entity object to be reduced. |

<a name="Orm+parseModels"></a>

### orm.parseModels(models) ⇒ <code>Object</code>
Parses the models and augments them with additional fields.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Object</code> - The parsed and augmented model definitions.  

| Param | Type | Description |
| --- | --- | --- |
| models | <code>Object</code> | The model definitions. |

<a name="Orm+setModels"></a>

### orm.setModels()
Initializes the models with extra configurations.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
<a name="Orm+buildCreate"></a>

### orm.buildCreate(type, data, ops) ⇒ <code>Promise.&lt;Object&gt;</code>
Builds the operations required for creating a new entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to an object containing the ops and the new entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to create. |
| data | <code>Object</code> | The data for the entity. |
| ops | <code>Array</code> | An array to collect database operations. |

<a name="Orm+create"></a>

### orm.create(type, data) ⇒ <code>Promise.&lt;Object&gt;</code>
Creates a new entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to the new entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to create. |
| data | <code>Object</code> | The data for the entity. |

<a name="Orm+buildUpdate"></a>

### orm.buildUpdate(type, id, update, ops) ⇒ <code>Promise.&lt;Object&gt;</code>
Builds the operations required for updating an existing entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to an object containing the ops and the updated entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to update. |
| id | <code>string</code> | The ID of the entity to update. |
| update | <code>Object</code> | The new data for the entity. |
| ops | <code>Array</code> | An array to collect database operations. |

<a name="Orm+update"></a>

### orm.update(type, id, update) ⇒ <code>Promise.&lt;Object&gt;</code>
Updates an existing entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to the updated entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to update. |
| id | <code>string</code> | The ID of the entity to update. |
| update | <code>Object</code> | The new data for the entity. |

<a name="Orm+buildDelete"></a>

### orm.buildDelete(type, id, ops) ⇒ <code>Promise.&lt;Object&gt;</code>
Builds the operations required for deleting an existing entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to an object containing the ops and the deleted entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to delete. |
| id | <code>string</code> | The ID of the entity to delete. |
| ops | <code>Array</code> | An array to collect database operations. |

<a name="Orm+delete"></a>

### orm.delete(type, id) ⇒ <code>Promise.&lt;Object&gt;</code>
Deletes an existing entity.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to the deleted entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entity to delete. |
| id | <code>string</code> | The ID of the entity to delete. |

<a name="Orm+read"></a>

### orm.read(type, id) ⇒ <code>Promise.&lt;Object&gt;</code>
Reads an existing entity by its type and ID.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - A promise that resolves to the entity.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the entity. |
| id | <code>string</code> | The ID of the entity. |

<a name="Orm+fetch"></a>

### orm.fetch(id) ⇒ <code>Promise.&lt;(Object\|null)&gt;</code>
Fetches an entity by its ID.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;(Object\|null)&gt;</code> - A promise that resolves to the entity or null.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity. |

<a name="Orm+find"></a>

### orm.find(type, query) ⇒ <code>Promise.&lt;Array&gt;</code>
Finds entities based on a query.

**Kind**: instance method of [<code>Orm</code>](#Orm)  
**Returns**: <code>Promise.&lt;Array&gt;</code> - A promise that resolves to an array of entities.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of entities to search for. |
| query | <code>Object</code> | The search query. |

<a name="OrmModel"></a>

## OrmModel
Extends the Encoder.Model class to provide ORM functionalities.

**Kind**: global class  

* [OrmModel](#OrmModel)
    * [new OrmModel(type, fields, config, codex)](#new_OrmModel_new)
    * [.path](#OrmModel+path) ⇒ <code>Array</code>
    * [.createOp(path, type, key, value)](#OrmModel+createOp) ⇒ <code>Object</code>
    * [.dispatch(op, ...args)](#OrmModel+dispatch) ⇒ <code>Promise</code>
    * [.commit(ops)](#OrmModel+commit) ⇒ <code>Promise</code>
    * [.reduce(entity)](#OrmModel+reduce) ⇒ <code>\*</code>
    * [.reduceFields(entity, listOps)](#OrmModel+reduceFields) ⇒ <code>Array</code>
    * [._mergeListOps(entityId, listOps, ops, visited)](#OrmModel+_mergeListOps)
    * [.buildCreate(data, ops, visited)](#OrmModel+buildCreate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.create(data)](#OrmModel+create) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.buildUpdate(id, update, ops, visited)](#OrmModel+buildUpdate) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.update(id, update)](#OrmModel+update) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.buildDelete(id, ops, visited)](#OrmModel+buildDelete) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.delete(id)](#OrmModel+delete) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.populate(entity, ...props)](#OrmModel+populate) ⇒ <code>\*</code>
    * [.collect(entity, ...props)](#OrmModel+collect) ⇒ <code>\*</code>
    * [.read(id)](#OrmModel+read) ⇒ <code>Promise</code>
    * [.readAll(ids)](#OrmModel+readAll) ⇒ <code>Promise</code>
    * [.query(params)](#OrmModel+query) ⇒ <code>Promise</code>
    * [.find(ids)](#OrmModel+find) ⇒ <code>Promise</code>
    * [.load(ids)](#OrmModel+load) ⇒ <code>Promise</code>

<a name="new_OrmModel_new"></a>

### new OrmModel(type, fields, config, codex)

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of the model |
| fields | <code>Object</code> | Fields configuration object |
| config | <code>Object</code> | General configuration object |
| codex | <code>Object</code> | Encoder codex |

<a name="OrmModel+path"></a>

### ormModel.path ⇒ <code>Array</code>
**Kind**: instance property of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Array</code> - - Returns the storage path as an array  
<a name="OrmModel+createOp"></a>

### ormModel.createOp(path, type, key, value) ⇒ <code>Object</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Object</code> - - The operation object  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>Array</code> | The path to create the operation |
| type | <code>string</code> | The type of operation |
| key | <code>string</code> | The key for the operation |
| value | <code>\*</code> | The value for the operation |

<a name="OrmModel+dispatch"></a>

### ormModel.dispatch(op, ...args) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to an entity after performing the operation  

| Param | Type | Description |
| --- | --- | --- |
| op | <code>string</code> | The operation type |
| ...args | <code>any</code> | The arguments for the operation |

<a name="OrmModel+commit"></a>

### ormModel.commit(ops) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves when commit is done  

| Param | Type | Description |
| --- | --- | --- |
| ops | <code>Array</code> | The batch operations to commit |

<a name="OrmModel+reduce"></a>

### ormModel.reduce(entity) ⇒ <code>\*</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>\*</code> - - The reduced entity  

| Param | Type | Description |
| --- | --- | --- |
| entity | <code>\*</code> | The entity object |

<a name="OrmModel+reduceFields"></a>

### ormModel.reduceFields(entity, listOps) ⇒ <code>Array</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Array</code> - - The list operations  

| Param | Type | Description |
| --- | --- | --- |
| entity | <code>\*</code> | The entity object |
| listOps | <code>Array</code> | The list operations |

<a name="OrmModel+_mergeListOps"></a>

### ormModel.\_mergeListOps(entityId, listOps, ops, visited)
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  

| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | The ID of the entity |
| listOps | <code>Array</code> | The list operations |
| ops | <code>Array</code> | The batch operations |
| visited | <code>Set</code> | Set of visited entities |

<a name="OrmModel+buildCreate"></a>

### ormModel.buildCreate(data, ops, visited) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the created entity  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The entity data |
| ops | <code>Array</code> | The batch operations |
| visited | <code>Set</code> | Set of visited entities |

<a name="OrmModel+create"></a>

### ormModel.create(data) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the created entity  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | The entity data |

<a name="OrmModel+buildUpdate"></a>

### ormModel.buildUpdate(id, update, ops, visited) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the updated entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity to update |
| update | <code>Object</code> | The updated data |
| ops | <code>Array</code> | The batch operations |
| visited | <code>Set</code> | Set of visited entities |

<a name="OrmModel+update"></a>

### ormModel.update(id, update) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the updated entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity to update |
| update | <code>Object</code> | The updated data |

<a name="OrmModel+buildDelete"></a>

### ormModel.buildDelete(id, ops, visited) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the deleted entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity to delete |
| ops | <code>Array</code> | The batch operations |
| visited | <code>Set</code> | Set of visited entities |

<a name="OrmModel+delete"></a>

### ormModel.delete(id) ⇒ <code>Promise.&lt;Object&gt;</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - - Resolves to the deleted entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity to delete |

<a name="OrmModel+populate"></a>

### ormModel.populate(entity, ...props) ⇒ <code>\*</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>\*</code> - - The populated entity  

| Param | Type | Description |
| --- | --- | --- |
| entity | <code>\*</code> | The entity object |
| ...props | <code>string</code> | The properties to populate |

<a name="OrmModel+collect"></a>

### ormModel.collect(entity, ...props) ⇒ <code>\*</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>\*</code> - - The entity with collected properties  

| Param | Type | Description |
| --- | --- | --- |
| entity | <code>\*</code> | The entity object |
| ...props | <code>string</code> | The properties to collect |

<a name="OrmModel+read"></a>

### ormModel.read(id) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to the read entity  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The ID of the entity to read |

<a name="OrmModel+readAll"></a>

### ormModel.readAll(ids) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to an array of read entities  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array</code> | The list of IDs to read |

<a name="OrmModel+query"></a>

### ormModel.query(params) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to an array of queried entities  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> | The parameters for the query |

<a name="OrmModel+find"></a>

### ormModel.find(ids) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to an array of found entities  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array</code> | The list of IDs to find |

<a name="OrmModel+load"></a>

### ormModel.load(ids) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>OrmModel</code>](#OrmModel)  
**Returns**: <code>Promise</code> - - Resolves to an array of found entities  

| Param | Type | Description |
| --- | --- | --- |
| ids | <code>Array</code> | The list of IDs to find |

<a name="OrmForeignField"></a>

## OrmForeignField ⇐ <code>Encoder.Field.Bs58</code>
Class to provide ORM functionality for foreign fields.

**Kind**: global class  
**Extends**: <code>Encoder.Field.Bs58</code>  
<a name="OrmForeignField+_validType"></a>

### ormForeignField.\_validType() ⇒ <code>boolean</code>
Validates the type

**Kind**: instance method of [<code>OrmForeignField</code>](#OrmForeignField)  
**Returns**: <code>boolean</code> - - Returns true if the type is valid  
<a name="ListHandler"></a>

## ListHandler
Handles List operations for a given model and field. Provides several methods for
manipulating lists within the context of an ORM.

**Kind**: global class  

* [ListHandler](#ListHandler)
    * [new ListHandler(model, field)](#new_ListHandler_new)
    * *[.reduce(arr, listOps)](#ListHandler+reduce)*
    * *[.insert(entityId, childId, ops)](#ListHandler+insert) ⇒ <code>Promise</code>*
    * *[.remove(entityId, childId, ops)](#ListHandler+remove) ⇒ <code>Promise</code>*
    * *[.find(entityId, query)](#ListHandler+find) ⇒ <code>Promise</code>*
    * *[.collect()](#ListHandler+collect) ⇒ <code>Promise</code>*
    * *[.load()](#ListHandler+load) ⇒ <code>Promise</code>*

<a name="new_ListHandler_new"></a>

### new ListHandler(model, field)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |

<a name="ListHandler+reduce"></a>

### *listHandler.reduce(arr, listOps)*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | The array to reduce |
| listOps | <code>Array</code> | The list operations |

<a name="ListHandler+insert"></a>

### *listHandler.insert(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="ListHandler+remove"></a>

### *listHandler.remove(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="ListHandler+find"></a>

### *listHandler.find(entityId, query) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| query | <code>Object</code> | Query parameters |

<a name="ListHandler+collect"></a>

### *listHandler.collect() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 

<a name="ListHandler+load"></a>

### *listHandler.load() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ListHandler</code>](#ListHandler)  
**Throws**:

- <code>Error</code> 

<a name="ArrayList"></a>

## ArrayList ⇐ [<code>ListHandler</code>](#ListHandler)
ArrayList is a specialized ListHandler that works with arrays.
It implements methods for insertion, removal, and finding elements.

**Kind**: global class  
**Extends**: [<code>ListHandler</code>](#ListHandler)  

* [ArrayList](#ArrayList) ⇐ [<code>ListHandler</code>](#ListHandler)
    * [new ArrayList(model, field)](#new_ArrayList_new)
    * *[.reduce(arr, listOps)](#ArrayList+reduce)*
    * *[.insert(entityId, childId, ops)](#ArrayList+insert) ⇒ <code>Promise</code>*
    * *[.remove(entityId, childId, ops)](#ArrayList+remove) ⇒ <code>Promise</code>*
    * *[.find(entityId, query)](#ArrayList+find) ⇒ <code>Promise</code>*
    * *[.collect()](#ArrayList+collect) ⇒ <code>Promise</code>*
    * *[.load()](#ArrayList+load) ⇒ <code>Promise</code>*

<a name="new_ArrayList_new"></a>

### new ArrayList(model, field)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |

<a name="ArrayList+reduce"></a>

### *arrayList.reduce(arr, listOps)*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>reduce</code>](#ListHandler+reduce)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | The array to reduce |
| listOps | <code>Array</code> | The list operations |

<a name="ArrayList+insert"></a>

### *arrayList.insert(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>insert</code>](#ListHandler+insert)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="ArrayList+remove"></a>

### *arrayList.remove(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>remove</code>](#ListHandler+remove)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="ArrayList+find"></a>

### *arrayList.find(entityId, query) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>find</code>](#ListHandler+find)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| query | <code>Object</code> | Query parameters |

<a name="ArrayList+collect"></a>

### *arrayList.collect() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>collect</code>](#ListHandler+collect)  
**Throws**:

- <code>Error</code> 

<a name="ArrayList+load"></a>

### *arrayList.load() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ArrayList</code>](#ArrayList)  
**Overrides**: [<code>load</code>](#ListHandler+load)  
**Throws**:

- <code>Error</code> 

<a name="SpreadList"></a>

## SpreadList ⇐ [<code>ListHandler</code>](#ListHandler)
SpreadList is a specialized ListHandler that works by spreading elements.
It works with a different storage mechanism for maintaining the list.

**Kind**: global class  
**Extends**: [<code>ListHandler</code>](#ListHandler)  

* [SpreadList](#SpreadList) ⇐ [<code>ListHandler</code>](#ListHandler)
    * [new SpreadList(model, field)](#new_SpreadList_new)
    * *[.reduce(arr, listOps)](#SpreadList+reduce)*
    * *[.insert(entityId, childId, ops)](#SpreadList+insert) ⇒ <code>Promise</code>*
    * *[.remove(entityId, childId, ops)](#SpreadList+remove) ⇒ <code>Promise</code>*
    * *[.find(entityId, query)](#SpreadList+find) ⇒ <code>Promise</code>*
    * *[.collect()](#SpreadList+collect) ⇒ <code>Promise</code>*
    * *[.load()](#SpreadList+load) ⇒ <code>Promise</code>*

<a name="new_SpreadList_new"></a>

### new SpreadList(model, field)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |

<a name="SpreadList+reduce"></a>

### *spreadList.reduce(arr, listOps)*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>reduce</code>](#ListHandler+reduce)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array</code> | The array to reduce |
| listOps | <code>Array</code> | The list operations |

<a name="SpreadList+insert"></a>

### *spreadList.insert(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>insert</code>](#ListHandler+insert)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="SpreadList+remove"></a>

### *spreadList.remove(entityId, childId, ops) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>remove</code>](#ListHandler+remove)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| childId | <code>string</code> | Child identifier |
| ops | <code>Array</code> | Operations array |

<a name="SpreadList+find"></a>

### *spreadList.find(entityId, query) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>find</code>](#ListHandler+find)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entityId | <code>string</code> | Entity identifier |
| query | <code>Object</code> | Query parameters |

<a name="SpreadList+collect"></a>

### *spreadList.collect() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>collect</code>](#ListHandler+collect)  
**Throws**:

- <code>Error</code> 

<a name="SpreadList+load"></a>

### *spreadList.load() ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>SpreadList</code>](#SpreadList)  
**Overrides**: [<code>load</code>](#ListHandler+load)  
**Throws**:

- <code>Error</code> 

<a name="RelationHandler"></a>

## RelationHandler
Handles relations between models in an ORM context. 
Provides the base for implementing one-to-one, one-to-many, and many-to-one relations.

**Kind**: global class  

* [RelationHandler](#RelationHandler)
    * [new RelationHandler(model, field, otherField)](#new_RelationHandler_new)
    * *[.create(entity, field, value, visited)](#RelationHandler+create) ⇒ <code>Promise</code>*

<a name="new_RelationHandler_new"></a>

### new RelationHandler(model, field, otherField)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |
| otherField | <code>string</code> | The other field name |

<a name="RelationHandler+create"></a>

### *relationHandler.create(entity, field, value, visited) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>RelationHandler</code>](#RelationHandler)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entity | <code>Object</code> | The entity |
| field | <code>string</code> | The field name |
| value | <code>any</code> | The value to create |
| visited | <code>Set</code> | Visited set |

<a name="OneToOneRelation"></a>

## OneToOneRelation ⇐ [<code>RelationHandler</code>](#RelationHandler)
OneToOneRelation is a specialized RelationHandler for one-to-one relations.
It provides a method for creating a one-to-one relation between entities.

**Kind**: global class  
**Extends**: [<code>RelationHandler</code>](#RelationHandler)  

* [OneToOneRelation](#OneToOneRelation) ⇐ [<code>RelationHandler</code>](#RelationHandler)
    * [new OneToOneRelation(model, field, otherField)](#new_OneToOneRelation_new)
    * *[.create(entity, field, value, visited)](#OneToOneRelation+create) ⇒ <code>Promise</code>*

<a name="new_OneToOneRelation_new"></a>

### new OneToOneRelation(model, field, otherField)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |
| otherField | <code>string</code> | The other field name |

<a name="OneToOneRelation+create"></a>

### *oneToOneRelation.create(entity, field, value, visited) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>OneToOneRelation</code>](#OneToOneRelation)  
**Overrides**: [<code>create</code>](#RelationHandler+create)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entity | <code>Object</code> | The entity |
| field | <code>string</code> | The field name |
| value | <code>any</code> | The value to create |
| visited | <code>Set</code> | Visited set |

<a name="OneToManyRelation"></a>

## OneToManyRelation ⇐ [<code>RelationHandler</code>](#RelationHandler)
OneToManyRelation is a specialized RelationHandler for one-to-many relations.
It provides a method for creating a one-to-many relation between entities.

**Kind**: global class  
**Extends**: [<code>RelationHandler</code>](#RelationHandler)  

* [OneToManyRelation](#OneToManyRelation) ⇐ [<code>RelationHandler</code>](#RelationHandler)
    * [new OneToManyRelation(model, field, otherField)](#new_OneToManyRelation_new)
    * *[.create(entity, field, value, visited)](#OneToManyRelation+create) ⇒ <code>Promise</code>*

<a name="new_OneToManyRelation_new"></a>

### new OneToManyRelation(model, field, otherField)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |
| otherField | <code>string</code> | The other field name |

<a name="OneToManyRelation+create"></a>

### *oneToManyRelation.create(entity, field, value, visited) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>OneToManyRelation</code>](#OneToManyRelation)  
**Overrides**: [<code>create</code>](#RelationHandler+create)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entity | <code>Object</code> | The entity |
| field | <code>string</code> | The field name |
| value | <code>any</code> | The value to create |
| visited | <code>Set</code> | Visited set |

<a name="ManyToOneRelation"></a>

## ManyToOneRelation ⇐ [<code>RelationHandler</code>](#RelationHandler)
ManyToOneRelation is a specialized RelationHandler for many-to-one relations.
It provides a method for creating a many-to-one relation between entities.

**Kind**: global class  
**Extends**: [<code>RelationHandler</code>](#RelationHandler)  

* [ManyToOneRelation](#ManyToOneRelation) ⇐ [<code>RelationHandler</code>](#RelationHandler)
    * [new ManyToOneRelation(model, field, otherField)](#new_ManyToOneRelation_new)
    * *[.create(entity, field, value, visited)](#ManyToOneRelation+create) ⇒ <code>Promise</code>*

<a name="new_ManyToOneRelation_new"></a>

### new ManyToOneRelation(model, field, otherField)

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |
| otherField | <code>string</code> | The other field name |

<a name="ManyToOneRelation+create"></a>

### *manyToOneRelation.create(entity, field, value, visited) ⇒ <code>Promise</code>*
**Kind**: instance abstract method of [<code>ManyToOneRelation</code>](#ManyToOneRelation)  
**Overrides**: [<code>create</code>](#RelationHandler+create)  
**Throws**:

- <code>Error</code> 


| Param | Type | Description |
| --- | --- | --- |
| entity | <code>Object</code> | The entity |
| field | <code>string</code> | The field name |
| value | <code>any</code> | The value to create |
| visited | <code>Set</code> | Visited set |

<a name="RelationFactory"></a>

## RelationFactory
RelationFactory is a factory class for creating RelationHandler instances.
It supports one-to-one, one-to-many, and many-to-one relation types.

**Kind**: global class  

* [RelationFactory](#RelationFactory)
    * [.getHandler(relation, model, field, otherField)](#RelationFactory.getHandler) ⇒ [<code>RelationHandler</code>](#RelationHandler)
    * [.getType(field, otherField)](#RelationFactory.getType) ⇒ <code>string</code>

<a name="RelationFactory.getHandler"></a>

### RelationFactory.getHandler(relation, model, field, otherField) ⇒ [<code>RelationHandler</code>](#RelationHandler)
**Kind**: static method of [<code>RelationFactory</code>](#RelationFactory)  
**Returns**: [<code>RelationHandler</code>](#RelationHandler) - - Returns an instance of a relation handler  

| Param | Type | Description |
| --- | --- | --- |
| relation | <code>string</code> | Relation type |
| model | <code>Object</code> | The model |
| field | <code>string</code> | The field name |
| otherField | <code>string</code> | The other field name |

<a name="RelationFactory.getType"></a>

### RelationFactory.getType(field, otherField) ⇒ <code>string</code>
**Kind**: static method of [<code>RelationFactory</code>](#RelationFactory)  
**Returns**: <code>string</code> - - Returns the type of the relation  

| Param | Type | Description |
| --- | --- | --- |
| field | <code>Object</code> | The field |
| otherField | <code>Object</code> | The other field |

<a name="Aggregator"></a>

## Aggregator
Aggregator provides methods for populating properties for a given type of model.
It supports nested properties and handles both lists and single references.

**Kind**: global class  

* [Aggregator](#Aggregator)
    * [new Aggregator(orm)](#new_Aggregator_new)
    * [.splitProperty(type, prop)](#Aggregator+splitProperty) ⇒ <code>Array</code>
    * [.populateProperty(model, entity, prop)](#Aggregator+populateProperty) ⇒ <code>Promise</code>
    * [.populate(type, entity, ...props)](#Aggregator+populate) ⇒ <code>Promise</code>

<a name="new_Aggregator_new"></a>

### new Aggregator(orm)

| Param | Type | Description |
| --- | --- | --- |
| orm | <code>Object</code> | The ORM |

<a name="Aggregator+splitProperty"></a>

### aggregator.splitProperty(type, prop) ⇒ <code>Array</code>
**Kind**: instance method of [<code>Aggregator</code>](#Aggregator)  
**Returns**: <code>Array</code> - - Returns an array containing the split property  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type |
| prop | <code>string</code> | The property |

<a name="Aggregator+populateProperty"></a>

### aggregator.populateProperty(model, entity, prop) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Aggregator</code>](#Aggregator)  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>Object</code> | The model |
| entity | <code>Object</code> | The entity |
| prop | <code>string</code> | The property to populate |

<a name="Aggregator+populate"></a>

### aggregator.populate(type, entity, ...props) ⇒ <code>Promise</code>
**Kind**: instance method of [<code>Aggregator</code>](#Aggregator)  
**Returns**: <code>Promise</code> - - Returns the populated entity  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type |
| entity | <code>Object</code> | The entity |
| ...props | <code>string</code> | The properties to populate |

