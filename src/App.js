import React, { useCallback, useEffect, useState } from 'react';
import Navigation from './components/Navigation'
 import Field from './components/Field'
 import Button from './components/Button'
 import ManipulationPanel from './components/ManipulationPanel'
 import { initFields } from './utils'
 const initialPosition = { x: 17, y: 17 } //スネークがいる初期位置
 const initialValues = initFields(35, initialPosition)//フィールドを生成
 const defaultInterval = 100  //タイマーの時間


 const GameStatus = Object.freeze({ //ゲームの状態を表す定数
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
})

export const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
})


const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
})


const OppositeDirection = Object.freeze({ //進行方向と逆の位置をマッピングしている　(スネークは反対方向に進めないため)
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
})

const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x:  1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
})



 let timer = undefined

  const unsubscribe = () => {
     if (!timer) {
       return
    }
     clearInterval(timer) //タイマーが不要になった時にclearIntervalでタイマーを削除する
  }

  const isCollision = (fieldSize, position) => { //壁にぶつかったか判定する
    if (position.y < 0 || position.x < 0) {//x,y 座標のどちらかが 0 より小さくなっていることをチェック、
      return true; //0 より小さい => フィールドからはみ出していると判断してtrueを返す
    }

    if (position.y > fieldSize - 1 || position.x > fieldSize - 1) { //x,y 座標がフィールドより大きくなってしまった場合をチェック
      return true;
    }

    return false;
  };


function App() {
  const [fields, setFields] = useState(initialValues) //フィールドの情報をfieldsにセット
  const [position, setPosition] = useState(initialPosition) //スネークの位置情報
  const [tick, setTick] = useState(0) //時間
  const [status, setStatus] = useState(GameStatus.init) //ゲームの状態
  const [direction, setDirection] = useState(Direction.up) //進行方向

  useEffect(() => {
    // ゲームの中の時間を管理する
    timer = setInterval(() => { //setInterval(一定間隔ごとに実行する関数（コールバック）, インターバルの長さ(ms))
      setTick(tick => tick + 1) //tickは一定時間ごとにインクリメントされる
      //インクリメントされる値自体はあまり問題でなく、一定間隔でレンダリングがトリガーされるということが重要
    }, defaultInterval) //defaultIntervalは100ms 100ms毎にsetTickが実行される
    return unsubscribe //コンポーネントが削除されるタイミングで関数を実行するにはuseEffectのreturn句で関数を返す。
  }, [])


  useEffect(() => {
    if (!position || status !== GameStatus.playing) { //プレイ中ならスネークを動かす
      return
    }
    const canContinue = handleMoving()
    if (!canContinue) {
      setStatus(GameStatus.gameover)
    }  }, [tick]) //ゲームの中の時間が進むたびにgoUp関数が呼ばれるように

  const onStart=()=>{
    setStatus(GameStatus.playing)
  }

  const onRestart = () => { //初期化
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval)
    setStatus(GameStatus.init)
    setPosition(initialPosition)
    setDirection(Direction.up)
    setFields(initFields(35, initialPosition))
  }

  const onChangeDirection = useCallback((newDirection) => {
    if (status !== GameStatus.playing) {
      return direction
    }
    if (OppositeDirection[direction] === newDirection) {
      return
    }
    setDirection(newDirection)
  }, [direction ,status])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      }

      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onChangeDirection])


  const handleMoving = () => {
    const { x, y } = position
    const delta = Delta[direction]
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y
    }
    if (isCollision(fields.length, newPosition)) { //壁にぶつかったかどうかを判定
    unsubscribe()
    return false
  }
  fields[y][x] = ''

  fields[newPosition.y][newPosition.x] = 'snake'
  setPosition(newPosition)
  setFields(fields)
  return true

}

  console.log('direction', direction)


  return (
    <div className="App">
         <header className="header">
         <div className="title-container">
           <h1 className="title">Snake Game</h1>
         </div>
         <Navigation />
       </header>
       <main className="main">
       <Field fields={fields} />
       </main>

       <footer className="footer">
         <Button status={status} onStart={onStart} onRestart={onRestart}/>
         <ManipulationPanel onChange={onChangeDirection} />
       </footer>
    </div>
  );
}

export default App;
