//フィールドを初期化するヘルパー関数
export const initFields = (fieldSize, initialPosition) => {
  const fields = []
  for (let i = 0; i < fieldSize; i++) { //フィールドの縦の長さ分ループ
    const cols = new Array(fieldSize).fill('') 
    // fieldSize 分の配列を作成して、フィールドの列ごとに作成した配列をつめていく
    fields.push(cols)
  }
  fields[initialPosition.y][initialPosition.x] = 'snake' //スネークの初期位置
  return fields
}