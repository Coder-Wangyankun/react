// keyof T
function getValue<T extends object, Key extends keyof T>(obj: T, key: Key): T[Key] {
  return obj[key]
}

// `#${string}`
function funcTestA(str: `#${string}`) {}
funcTestA('#123')

// never
function funcTestNever (): never {
  throw new Error()
}

// void
function funcTestVoid(): void {}

// unknown 任意类型
function funcTestUnknown(): unknown {
  return 1
}

// 高级类型：传入参数，返回新的类型
type isTwo<T> = T extends 2 ? true : false
type T1 = isTwo<2>
type T2 = isTwo<3>

// 交叉类型（同一类型合并，不同类型舍弃）
type ObjType = {a: number} & {b: boolean}
type objTypeTest = {a: number, b: boolean} extends ObjType ? true : false

// 映射类型
type MapType<T> = {
  [Key in keyof T]?: T[Key]
}
type MapTypeChangeValue<T> = {
  [Key in keyof T]?: [T[Key], T[Key], T[Key]]
}
type MapTypeChangeValueRes = MapTypeChangeValue<{a: 1, b: 2}>
type MapTypeChangeKey<T> = {
  [
    Key in keyof T
      as `${Key & string}${Key & string}${Key & string}`
  ]: [T[Key], T[Key], T[Key]]
}
type MapTypeChangeKeyRes = MapTypeChangeKey<{a: 1, b: 2}>