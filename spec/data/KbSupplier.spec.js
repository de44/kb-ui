import suppliers from '../../lib/data/KbSupplier';

describe('KbSupplier', function() {
  it('should initialize with default values', function(done) {
    const mem = suppliers.mem();
    mem.findAll().then(res => expect(res.items).toEqual([])).then(done);
  });

  /* FIND ONE */
  it('should find first by id', function(done) {
    const items = [ { id: 0 }, { id: 1 } ],
        mem = suppliers.mem(items);
    mem.findOne(0).then(res => expect(res).toEqual(items[0])).then(done);
  });
  it('should find by id', function(done) {
    const items = [ { id: 0 }, { id: 1 } ],
        mem = suppliers.mem(items);
    mem.findOne(1).then(res => expect(res).toEqual(items[1])).then(done);
  });
  it('should return undefined for missing id', function(done) {
    const items = [ { id: 0 }, { id: 1 } ],
        mem = suppliers.mem(items);
    mem.findOne(1000).then(res => expect(res).toBeUndefined()).then(done);
  });

  /* FIND ALL */
  it('should find all (default)', function(done) {
    const items = [ { id: 0 }, { id: 1 } ],
        mem = suppliers.mem(items);
    mem.findAll().then(res => expect(res.items).toEqual(items)).then(done);
  });
  it('should find all', function(done) {
    const items = [ { id: 0 }, { id: 1 } ],
        mem = suppliers.mem(items);
    mem.findAll({}).then(res => expect(res.items).toEqual(items)).then(done);
  });

  /* LIMIT / OFFSET */
  it('should return 1', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ limit: 1}).then(res => expect(res.items).toEqual([ items[0] ])).then(done);
  });
  it('should return 2', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ limit: 2}).then(res => expect(res.items).toEqual([ items[0], items[1] ])).then(done);
  });
  it('should return all for large limit', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ limit: 1000 }).then(res => expect(res.items).toEqual(items)).then(done);
  });
  it('should offset results', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ offset: 1 }).then(res => expect(res.items).toEqual([ items[1], items[2], items[3] ])).then(done);
  });
  it('should offset results by page', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ offset: 2 }).then(res => expect(res.items).toEqual([ items[2], items[3] ])).then(done);
  });
  it('should allow paging', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ limit: 2, offset: 1 }).then(res => expect(res.items).toEqual([ items[1], items[2] ])).then(done);
  });
  it('should return past last record', function(done) {
    const items = [ { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ offset: 1000 }).then(res => expect(res.items).toEqual([])).then(done);
  });

  /* FILTERS */
  it('should filter by =', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 'age', op: '=', value: 21 }]}).then(res => {
      expect(res.total).toEqual(1);
      expect(res.items).toEqual([ items[2] ]);
    }).then(done);
  });
  it('should filter by <', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 'age', op: '<', value: 18 }]}).then(res => {
      expect(res.total).toEqual(1);
      expect(res.items).toEqual([ items[0] ]);
    }).then(done);
  });
  it('should filter by <=', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 'age', op: '<=', value: 18 }]}).then(res => {
      expect(res.total).toEqual(2);
      expect(res.items).toEqual([ items[0], items[1] ]);
    }).then(done);
  });
  it('should filter by >', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 'age', op: '>', value: 30 }]}).then(res => {
      expect(res.total).toEqual(1);
      expect(res.items).toEqual([ items[4] ]);
    }).then(done);
  });
  it('should filter by >=', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 'age', op: '>=', value: 30 }]}).then(res => {
      expect(res.total).toEqual(2);
      expect(res.items).toEqual([ items[3], items[4] ]);
    }).then(done);
  });
  it('should filter by contains 1', function(done) {
    const items = [ { s: 'abc' }, { s: 'def' }, { s: 'abcdef' } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 's', op: 'contains', value: 'abc' }]}).then(res => {
      expect(res.total).toEqual(2);
      expect(res.items).toEqual([ items[0], items[2] ]);
    }).then(done);
  });
  it('should filter by contains 2', function(done) {
    const items = [ { s: 'abc' }, { s: 'def' }, { s: 'abcdef' } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [{ path: 's', op: 'contains', value: 'cd' }]}).then(res => {
      expect(res.total).toEqual(1);
      expect(res.items).toEqual([ items[2] ]);
    }).then(done);
  });
  it('should filter by predicate complex', function(done) {
    const items = [ { age: 10 }, { age: 18 }, { age: 21 }, { age: 30 }, { age: 65 } ],
        mem = suppliers.mem(items);
    mem.findAll({ filter: [
      { path: 'age', op: '>=', value: 21 },
      { path: 'age', op: '<', value: 60 }
    ] }).then(res => {
      expect(res.total).toEqual(2);
      expect(res.items).toEqual([ items[2], items[3] ]);
    }).then(done);
  });

  /* SORTS */
  it('should sort by field asc', function(done) {
    const items = [ { age: 100 }, { age: 21 }, { age: 18 }, { age: 65 }, { age: 30 } ],
        mem = suppliers.mem(items);
    mem.findAll({ sort: [ 'age' ] }).then(res => expect(res.items).toEqual([ items[2], items[1], items[4], items[3], items[0] ])).then(done);
  });
  it('should sort by field desc', function(done) {
    const items = [ { age: 100 }, { age: 21 }, { age: 18 }, { age: 65 }, { age: 30 } ],
        mem = suppliers.mem(items);
    mem.findAll({ sort: [ '-age' ] }).then(res => expect(res.items).toEqual([ items[0], items[3], items[4], items[1], items[2] ])).then(done);
  });
  it('should sort multi level sort', function(done) {
    const items = [ { s: 'a', n: 1 }, { s: 'a', n: 2 }, { s: 'b', n: 1 }, { s: 'b', n: 2 }, { s: 'c', n: 3 } ],
        mem = suppliers.mem(items);
    mem.findAll({ sort: [ 's', '-n' ] }).then(res => expect(res.items).toEqual([ items[1], items[0], items[3], items[2], items[4] ])).then(done);
  });

  /* SAVE */
  it('should save an initial value', function(done) {
    const mem = suppliers.mem(),
        user = { id: 1, name: 'david' };
    Promise.all([
      mem.save(user).then(res => expect(res).toEqual(user)),
      mem.findAll().then(res => expect(res.total).toEqual(1))
    ]).then(done);
  });
  it('should save a new value', function(done) {
    const mem = suppliers.mem([ { id: 0, name: 'david' }]),
        user = { id: 1, name: 'david' };
    Promise.all([
      mem.save(user).then(res => expect(res).toEqual(user)),
      mem.findAll().then(res => expect(res.total).toEqual(2))
    ]).then(done);
  });
  it('should update a value', function(done) {
    const mem = suppliers.mem([ { id: 0, name: 'david' }]),
        user = { id: 0, name: 'not david' };
    Promise.all([
      mem.save(user).then(res => expect(res).toEqual(user)),
      mem.findAll().then(res => expect(res.total).toEqual(1))
    ]).then(done);
  });
});
