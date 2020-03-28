import DummyClass from '../src/tslib'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new DummyClass(null)).toBeInstanceOf(DummyClass)
  })
  new DummyClass(null).print()
})
