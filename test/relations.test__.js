describe('Relations', () => {
  let orm

  describe('One-To-None', () => {
    before.each(() => {
      orm = getOrm({
        user: { name: 'string', age: 'number', pet: 'pet' },
        pet: { name: 'string', age: 'number' },
      })
    })

    it('should add pet to user (create)', async () => {
      const pet = await orm.create('pet', spot)
      const user = await orm.create('user', { ...alice, pet })

      expect(user.pet).to.equal(pet.id)
    })
  })

  describe('Many-To-None', () => {
    describe('List', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pets: { list: 'pet' }},
          pet: { name: 'string', age: 'number' },
        })
      })

      it('Many-To-None (w/ insert/remove @todo - bring out)', async () => {
        const pet = await orm.create('pet', spot)
        const chi = await orm.create('pet', { name: 'Chi', age: 20 })

        const user = await orm.create('user', { ...alice, pets: [pet] })
        await orm.insert('user', 'pets', user.id, chi.id)
        const readUser = await orm.read('user', user.id)

        expect(readUser.pets).to.have.members([pet.id, chi.id])

        await orm.remove('user', 'pets', user.id, chi.id)
        const readUser2 = await orm.read('user', user.id)

        expect(readUser2.pets).to.include(pet.id)
        expect(readUser2.pets).to.not.include(chi.id)
      })
    })
    describe('Spread', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pets: { list: '...pet' }},
          pet: { name: 'string', age: 'number' },
        })
      })

      it('Many-To-None + Spread', async () => {
        const orm = getOrm({
          user: { name: 'string', age: 'number', pets: { list: '...pet' }},
          pet: { name: 'string', age: 'number' },
        })

        const pet = await orm.create('pet', spot)
        const chi = await orm.create('pet', { name: 'Chi', age: 20 })

        const user = await orm.create('user', { ...alice, pets: [pet] })

        await orm.insert('user', 'pets', user.id, chi.id)

        // const readUser = await orm.read('user', user.id).collect('pets')
        // const readUser = await orm.read('user', user.id)
        // const readUser = await orm.read('user', user.id).load('pets').collect('pets')
        // const readUser = await orm.read('user', user.id).collect().load()
        const readUser = await orm.read('user', user.id).collect()

        expect(readUser.pets).to.have.members([pet.id, chi.id])
        // _.print({ readUser })

        // expect(readUser.pets).to.have.members([pet.id, chi.id])

        // await orm.remove('user', 'pets', user.id, chi.id)
        // const readUser2 = await orm.read('user', user.id)
        // const query = { age: 20 }
        // let res = await orm.findIn('user', 'pets', user.id, query)
        // log({ res })
        // expect(readUser2.pets).to.include(pet.id)
        // expect(readUser2.pets).to.not.include(chi.id)

        // _.print(orm.storage.store)
      })
    })
  })

  describe('One-To-One', () => {
    let orm
    before.each(() => {
      orm = getOrm({
        user: { name: 'string', age: 'number', pet: 'pet' },
        pet: { name: 'string', age: 'number', owner: 'user' },
      })
    })

    it('should add pet to user (create)', async () => {
      const pet = await orm.create('pet', spot)
      const user = await orm.create('user', { ...alice, pet })
      const readPet = await orm.read('pet', pet.id)

      expect(user.pet).to.equal(pet.id)
      expect(readPet.owner).to.equal(user.id)
    })

    it('should add pet to user (update)', async () => {
      const pet = await orm.create('pet', spot)
      const user = await orm.create('user', alice)
      await orm.update('user', user.id, { pet: pet.id })
      const readPet = await orm.read('pet', pet.id)
      const readUser = await orm.read('user', user.id)

      expect(readUser.pet).to.equal(pet.id)
      expect(readPet.owner).to.equal(readUser.id)
    })
  })

  describe('One-To-Many', () => {
    describe('List', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pet: 'pet' },
          pet: { name: 'string', age: 'number', owners: { list: 'user' }},
        })
      })
      it('update a user and pet updates', async () => {
        const user1 = await orm.create('user', alice)
        const user2 = await orm.create('user', bob)
        const pet = await orm.create('pet', spot)
        await orm.update('user', user1.id, { pet })
        await orm.update('user', user2.id, { pet })
        const readPet = await orm.read('pet', pet.id).collect()
        const readUser1 = await orm.read('user', user1.id)
        const readUser2 = await orm.read('user', user2.id)

        expect(readPet.owners).to.have.members([readUser1.id, readUser2.id])
        expect(readUser1.pet).to.equal(pet.id)
        expect(readUser2.pet).to.equal(pet.id)
      })
      it('create a pet with owners and users should update', async () => {
        const user1 = await orm.create('user', alice)
        const user2 = await orm.create('user', bob)
        const pet = await orm.create('pet', { ...spot, owners: [user1.id, user2.id] })
        const readPet = await orm.read('pet', pet.id).collect()
        const readUser1 = await orm.read('user', user1.id)
        const readUser2 = await orm.read('user', user2.id)

        expect(readPet.owners).to.have.members([readUser1.id, readUser2.id])
        expect(readUser1.pet).to.equal(pet.id)
        expect(readUser2.pet).to.equal(pet.id)
      })
    })

    describe('Spread', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pet: 'pet' },
          pet: { name: 'string', age: 'number', owners: { list: '...user' }},
        })
      })
      it('update a user and pet updates', async () => {
        const user1 = await orm.create('user', alice)
        const user2 = await orm.create('user', bob)
        const pet = await orm.create('pet', spot)
        await orm.update('user', user1.id, { pet })
        await orm.update('user', user2.id, { pet })
        const readPet = await orm.read('pet', pet.id).collect()
        const readUser1 = await orm.read('user', user1.id)
        const readUser2 = await orm.read('user', user2.id)

        expect(readPet.owners).to.have.members([readUser1.id, readUser2.id])
        expect(readUser1.pet).to.equal(pet.id)
        expect(readUser2.pet).to.equal(pet.id)
      })
      it('create a pet with owners and users should update', async () => {
        const user1 = await orm.create('user', alice)
        const user2 = await orm.create('user', bob)
        const pet = await orm.create('pet', { ...spot, owners: [user1.id, user2.id] })
        const readPet = await orm.read('pet', pet.id).collect()
        const readUser1 = await orm.read('user', user1.id)
        const readUser2 = await orm.read('user', user2.id)

        expect(readPet.owners).to.have.members([readUser1.id, readUser2.id])
        expect(readUser1.pet).to.equal(pet.id)
        expect(readUser2.pet).to.equal(pet.id)
      })
    })
  })

  describe('Many-To-One', () => {
    describe('List', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pets: { list: 'pet' }},
          pet: { name: 'string', age: 'number', owner: 'user' },
        })
      })

      it('update a user and pet updates', async () => {
        const user = await orm.create('user', alice)
        const pet1 = await orm.create('pet', spot)
        const pet2 = await orm.create('pet', { name: 'Chi', age: 1 })
        await orm.update('user', user.id, { pets: [pet1.id, pet2.id] })
        const readPet1 = await orm.read('pet', pet1.id).collect()
        const readPet2 = await orm.read('pet', pet2.id).collect()
        const readUser = await orm.read('user', user.id)

        expect(readUser.pets).to.have.members([readPet1.id, readPet2.id])
        expect(readPet1.owner).to.equal(readUser.id)
        expect(readPet2.owner).to.equal(readUser.id)
      })
    })
  })

  describe('Many-To-Many', () => {
    describe('List - List', () => {
      before.each(() => {
        orm = getOrm({
          user: { name: 'string', age: 'number', pets: { list: 'pet' }},
          pet: { name: 'string', age: 'number', owners: { list: 'user' }},
        })
      })

      it('update a user and pet updates', async () => {
        const user1 = await orm.create('user', alice)
        const user2 = await orm.create('user', bob)
        const pet1 = await orm.create('pet', spot)
        const pet2 = await orm.create('pet', chi)

        await orm.update('user', user1.id, { pets: [pet1.id, pet2.id] })
        await orm.update('user', user2.id, { pets: [pet1.id, pet2.id] })

        const readPet1 = await orm.read('pet', pet1.id)
        const readPet2 = await orm.read('pet', pet2.id)
        const readUser1 = await orm.read('user', user1.id)
        const readUser2 = await orm.read('user', user2.id)

        expect(readUser1.pets).to.have.members([readPet1.id, readPet2.id])
        expect(readUser2.pets).to.have.members([readPet1.id, readPet2.id])
        expect(readPet1.owners).to.have.members([readUser1.id, readUser2.id])
        expect(readPet2.owners).to.have.members([readUser1.id, readUser2.id])
      })
    })
  })
})
