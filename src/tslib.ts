// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export default class DummyClass {
  three: any
  constructor(three: any) {
    this.three = three
  }
  print(): void {
    console.log('hello world')
  }
}
