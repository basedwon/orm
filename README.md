# Orm

[![npm](https://img.shields.io/npm/v/@plaindb/orm?style=flat&logo=npm)](https://www.npmjs.com/package/@plaindb/orm)
[![pipeline](https://gitlab.com/frenware/framework/plaindb/orm/badges/master/pipeline.svg)](https://gitlab.com/frenware/framework/plaindb/orm/-/pipelines)
[![license](https://img.shields.io/npm/l/@plaindb/orm)](https://gitlab.com/frenware/framework/plaindb/orm/-/blob/master/LICENSE)
[![downloads](https://img.shields.io/npm/dw/@plaindb/orm)](https://www.npmjs.com/package/@plaindb/orm) 

[![Gitlab](https://img.shields.io/badge/Gitlab%20-%20?logo=gitlab&color=%23383a40)](https://gitlab.com/frenware/framework/plaindb/orm)
[![Github](https://img.shields.io/badge/Github%20-%20?logo=github&color=%23383a40)](https://github.com/basedwon/orm)
[![Twitter](https://img.shields.io/badge/@basdwon%20-%20?logo=twitter&color=%23383a40)](https://twitter.com/basdwon)
[![Discord](https://img.shields.io/badge/Basedwon%20-%20?logo=discord&color=%23383a40)](https://discordapp.com/users/basedwon)

A simple, yet extensible Object-Relational Mapping (ORM) library that allows you to interact with any key-value databse like LevelDB or Redis. It provides a clean and well-structured JavaScript API for performing database operations like Create, Read, Update, Delete (CRUD), indexing, and query searches. The package extends on the `@basd/encoder` package and follows Object-Oriented Programming (OOP) and SOLID principles, making it easy to extend and adapt to various use cases.

## Features

- Lightweight and efficient.
- Extensible architecture based on @basd/encoder.
- Dynamic index management.
- Query engine for advanced searching.
- Aggregator for optimized database interactions.

## Installation

Install the package with:

```bash
npm install @plaindb/orm
```

## Usage

First, import the `Orm` library.

```js
import Orm from '@plaindb/orm'
```
or
```js
const Orm = require('@plaindb/orm')
```

### Basic Example

Here is a simple example to demonstrate CRUD operations using the ORM:

```js
const orm = new Orm(storage, {
  User: {
    name: 'string',
    age: 'number'
  }
})

// Create
const user = await orm.create('User', {
  name: 'John Doe',
  age: 30
})

// Update
await orm.update('User', user.id, {
  age: 31
})

// Read
const fetchedUser = await orm.read('User', user.id)

// Delete
await orm.delete('User', user.id)
```

### Advanced Example

This package allows more advanced use-cases, like list handling and relationships:

```js
const orm = new Orm(storage, {
  User: {
    name: 'string',
    posts: '...Post'
  },
  Post: {
    content: 'string'
  }
})

const user = await orm.create('User', {
  name: 'John',
  posts: [
    { content: 'First Post' },
    { content: 'Second Post' }
  ]
})
```

## Extending

Since the library follows OOP principles, you can easily extend it. For example, to add a new query operation:

```js
class CustomOrmModel extends OrmModel {
  constructor(type, fields, config, codex) {
    super(type, fields, config, codex)
    // Custom logic
  }
  customFind(query) {
    // Custom find logic
  }
}
```

### Configuration Options

The `Orm` constructor accepts a configuration object that includes the following options:

- `classes`: Define custom classes for models, fields, lists, etc.
- `parseField`: A function to parse field definitions.
- `props`: Define id, created, and updated property names.

## Documentation

- [API Reference](/docs/api.md)

### OrmModel

The `OrmModel` class encapsulates an entity type in the database. It allows you to perform CRUD operations, as well as indexing and searching.

#### Methods

- `create(data)`: Creates a new entity.
- `update(id, update)`: Updates an existing entity by its ID.
- `delete(id)`: Deletes an entity by its ID.
- `read(id)`: Fetches an entity by its ID.

### Orm

The `Orm` class serves as a manager for different types of models and contains utility methods for global operations.

#### Methods

- `create(type, data)`: Creates a new entity of a given type.
- `update(type, id, update)`: Updates an existing entity of a given type.
- `delete(type, id)`: Deletes an entity of a given type.
- `read(type, id)`: Reads an entity of a given type.

## Tests

In order to run the test suite, simply clone the repository and install its dependencies:

```bash
git clone https://gitlab.com/frenware/framework/plaindb/orm.git
cd orm
npm install
```

To run the tests:

```bash
npm test
```

## Contributing

Thank you! Please see our [contributing guidelines](/docs/contributing.md) for details.

## Donations

If you find this project useful and want to help support further development, please send us some coin. We greatly appreciate any and all contributions. Thank you!

**Bitcoin (BTC):**
```
1JUb1yNFH6wjGekRUW6Dfgyg4J4h6wKKdF
```

**Monero (XMR):**
```
46uV2fMZT3EWkBrGUgszJCcbqFqEvqrB4bZBJwsbx7yA8e2WBakXzJSUK8aqT4GoqERzbg4oKT2SiPeCgjzVH6VpSQ5y7KQ
```

## License

@plaindb/orm is [MIT licensed](https://gitlab.com/frenware/framework/plaindb/orm/-/blob/master/LICENSE).
