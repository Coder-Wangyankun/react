// infer用于声明一个类型变量
// 把需要提取的部分放到 infer 声明的局部变量里

// 模式匹配示例
type p = Promise<'guang'>
type GetValue<P> = P extends Promise<infer Value> ? Value : never
type GetValueResult = GetValue<p>

// any 和 unknown 的区别： any 和 unknown 都代表任意类型，但是 unknown 只能接收任意类型的值，
// 而 any 除了可以接收任意类型的值，也可以赋值给任意类型（除了 never）。类型体操中经常用 unknown 
// 接受和匹配任何类型，而很少把任何类型赋值给某个类型变量

// 一、数组类型
// 获取数组的第一个元素类型
type GetFirst<Arr extends unknown[]> = Arr extends [infer First, ...unknown[]] ? First : never
type GetFirstResult1 = GetFirst<[1, 2, 3]>
type GetFirstResult2 = GetFirst<[]>
// 获取数组的最后一个元素类型
type GetLast<Arr extends unknown[]> = Arr extends[...unknown[], infer Last] ? Last : never
type GetLastResult1 = GetLast<[1, 2, 3]>
type GetLastResult2 = GetLast<[]>

// 提取去掉了最后一个元素的数组
type popArr<Arr extends unknown[]> = Arr extends [...infer Rest, unknown] ? Rest : never
type PopArrResult = popArr<[1, 2, 3]>

// 提取去掉了第一个元素的数组
type shiftArr<Arr extends unknown[]> = Arr extends [unknown, ...infer Rest] ? Rest : never
type ShiftArrResult = shiftArr<[1, 2, 3]>

// 二、字符串类型
// 判断字符串是否以某个前缀开头 StartsWith
type StartsWith<Str extends string, Prefix extends string> = Str extends `${Prefix}${string}` ? true : false
type StartsWithResult1 = StartsWith<'guang', 'g'>
type StartsWithResult2 = StartsWith<'guang', 'a'>

// 替换字符串 Replace
type ReplaceStr<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}` ? `${Prefix}${To}${Suffix}` : Str
type ReplaceStrResult1 = ReplaceStr<"Guangguang's best friend is ?", '?', 'Dongdong'>
type ReplaceStrResult2 = ReplaceStr<"abc", '?', 'Dongdong'>

// 去掉右侧空白字符Trim
type TrimStrRight<Str extends string> = 
  Str extends `${infer Rest}${' ' | '\n' | '\t'}` 
    ? TrimStrRight<Rest> : Str
type TrimRightResult = TrimStrRight<"Guangguang   ">
// 去掉左侧空白字符TrimLeft
type TrimStrLeft<Str extends string> = 
  Str extends `${' ' | '\n' | '\t'}${infer Rest}`
    ? TrimStrLeft<Rest> : Str
type TrimLeftResult = TrimStrLeft<"   Guangguang">
// 去掉两侧空白字符Trim 
type TrimStr<Str extends string> = TrimStrLeft<TrimStrRight<Str>>
type TrimStrResult = TrimStr<"   Guangguang   ">

// 三、函数
// 提取参数的类型
type GetParameters<Func extends Function> = 
  Func extends (...args: infer Args) => unknown ? Args : never
type GetParametersResult = GetParameters<(a: number, b: string) => void>


// 提取返回值的类型
type GetReturnType<Func extends Function> = 
  Func extends (...args: any[]) => infer ReturuType ? ReturuType : never
type GetReturnTypeResult = GetReturnType<(a: number, b: string) => 'dong'>

class Dong {
  name: string

  constructor() {
    this.name = 'dong'
  }
  hello(this: Dong) {
    return "hello, I'm " + this.name
  }
}
const dong = new Dong()
dong.hello()
dong.hello.call(dong)