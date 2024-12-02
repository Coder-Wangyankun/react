// function great(name: string) {
//   return 'hello' + name
// }

// let great2 = function (name: string) {
//   return 'hello' + name
// }

// let great3 = (name: string) => {
//   return 'hello' + name
// }

// let great4 = (name: string) => 'hello' + name

// let great5 = new Function('name', 'return "hello" + name')

// type Context = {
//   appId?: string,
//   userId?: string
// }
// function log(message: string, content: Context = {}) {
//   console.log(message, content.appId)
// }
// let fnLogRes = log('message')

// let x = {
//   a() {
//     return this
//   }
// }
// let aaa = x.a
// console.log(aaa())

// function fancyDate(this: Date) {
//   return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`
// }
// let time = fancyDate.call(new Date)
// console.log(time)

function* createNumbers(): IterableIterator<number> {
  let n = 0
  while (true) {
      yield n++
  }
}
let numbers = createNumbers()
console.log(numbers.next()) // { value: 0, done: false }
console.log(numbers.next()) // { value: 1, done: false }