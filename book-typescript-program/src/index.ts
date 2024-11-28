console.log("Hello Typescript!");

let a = 1 + 2;
let b = a + 3;
let c = {
  apple: a,
  banana: b
}
let d = c.apple * 4;

let symbol1 = Symbol('a');
let symbol2 = Symbol('a');
console.log(symbol1 === symbol2)
const symbol3 = Symbol('c');
const symbol4: unique symbol = Symbol('d');

let testObj1: object = {
  a: 1
};
// testObj1.a // Error: Property 'a' does not exist on type 'object'
let testObj2 = {
  a: 1
}
testObj2.a // number
let testObj3 = {
  a: 1
}
testObj3.a // number

let testObj4: {
  firstName: string;
  lastName: string;
} = {
  firstName: 'John',
  lastName: 'Doe'
}
class Person {
  constructor(
    public firstName: string,
    public lastName: string
  ) {}
}
testObj4 = new Person('John', 'Doe');

let testObj5: {b: number}
// testObj5 = {}; // Error
// testObj5 = {
//   a: 1,
//   b: 2,
// } // Error

let testObj6: object;
testObj6 = { a:1 }
testObj6 = [1, 2, 3]

type Age = number;
let driver: {
  name: string,
  age: Age
} = {
  name: 'John',
  age: 30
}

type Cat = {name: string, purrs: boolean}
type Dog = {name: string, barks: boolean, wags: boolean}
type CatOrDogOrBoth = Cat | Dog
type CatAndDog = Cat & Dog
let cat1: CatOrDogOrBoth = {
  name: 'Fluffy',
  purrs: true
}
cat1 = {
  name: 'Fluffy',
  purrs: true,
  barks: true,
  wags: true
}
cat1 = {
  name: 'Fluffy',
  purrs: true,
  barks: true,
  wags: true
}

// 并集
type Cat1 = {
  purrs: boolean
}
type Dog1 = {
  barks: boolean
}
let cat2: Cat1 | Dog1 = {
  purrs: true,
  barks: true
}

// 返回值类型 true | null
function trueOrNull(isTrue: boolean) {
  if (isTrue) {
    return true
  }
  return null
}
// 返回值类型 string | number
function funcStringOrNumber(a: string, b: number) {
  return a || b
}