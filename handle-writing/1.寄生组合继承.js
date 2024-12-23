function Parent(name) {
  this.name = name
  this.say = () => {
    console.log(`${this.name} say`)
  }
}
Parent.prototype.play = () => {
  console.log('play')
}

function Child(name) {
  Parent.call(this, name)
}
Child.prototype = Object.create(Parent.prototype)
// Child.prototype.constructor = Child

const child = new Child('child')
console.log(child.name) // child
child.say() // child say
child.play() // play

// 使用 Parent.call(this) 只能继承 Parent 的实例属性和方法，但不能继承 Parent 的原型属性和方法
// 当使用 Object.create() 时，创建的新对象会继承其原型对象的所有属性和方法。然而，它并不会复制这些属性，而是通过原型链访问它们。这意味着如果原型对象发生变化，继承的对象也会受到影响
// 修复构造函数原型上构造函数的指向