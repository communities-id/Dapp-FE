const deltaFuncs: Record<string, (...args: any) => number> = {
  linear: (process: number) => process,
  quad: (process: number) => Math.pow(process, 2),
  cubic: (process: number) => Math.pow(process, 3),
  back: (process: number, x: number) => Math.pow(process, 2) * ((x + 1) * process - x),
}

interface AnimateOptions {
  delay: number,
  durations: number[],
  delta: string,
  iterationLimit: number
  iterationDelay: number
  step?: (delta: number, iteration: number) => void
  finish?: () => void
}

export class TypeWriter {
  private options: AnimateOptions
  private iterationStart = 0
  private currentIteration = 1
  private frameIns = 0
  private start = 0
  private prev = 0
  private isEnd = true
  public isDestory = false
  constructor(options: Partial<AnimateOptions>) {
    const { delay = 10, durations = [], delta = 'linear', iterationDelay = 350, iterationLimit = 1 } = options;
    this.options = {
      ...options,
      delay,
      durations,
      delta,
      iterationDelay,
      iterationLimit
    }
  }

  frameStep(timestramp: number) {
    // 迭代间隔
    if (this.iterationStart >= timestramp) {
      this.nextFrame(timestramp)
      return
    }
    // 初始化动画
    if (!this.start) {
      this.start = timestramp
    }
    // step delay
    const timePassed = timestramp - this.start
    // 保证步长
    if ((timestramp - this.prev) < this.options.delay) {
      this.nextFrame(timestramp)
      return
    }

    // 不同迭代期的 duration
    const duration = this.options.durations[this.currentIteration - 1] ?? 1000

    // 进度 [0, 1]
    let process = timePassed / duration
    process = process > 1 ? 1 : process

    // 动画轨迹计算
    const _delta = deltaFuncs[this.options.delta](process)

    // 成功执行回调
    this.options.step?.(_delta, this.currentIteration)

    // 动画执行完毕后
    if (process >= 1) {
      // 如果所有迭代都结束了，则正式结束
      if (this.currentIteration >= this.options.iterationLimit) {
        this.stop()
        this.options.finish?.()
        // 如果还有后续迭代，则开始执行后续迭代
      } else {
        this.nextIteration(timestramp)
      }
      return
    }
    this.nextFrame(timestramp)
  }

  nextFrame(timestramp: number) {
    // 中途中止，就结束
    if (this.isEnd) {
      this.stop()
      return
    }
    this.prev = timestramp
    this.frameIns = window.requestAnimationFrame(this.frameStep.bind(this))
  }

  // 后续迭代，还在同一个动画上，在此基础上增加 iterationDelay 因素影响
  nextIteration(timestramp: number) {
    this.currentIteration++
    this.start = 0
    // 迭代间隔
    this.iterationStart = timestramp + this.options.iterationDelay
    this.nextFrame(timestramp)
  }

  // 初始化动画参数
  reset() {
    this.iterationStart = 0
    this.currentIteration = 1
    this.frameIns = 0
    this.start = 0
    this.prev = 0
    this.isDestory = false
  }

  stop() {
    this.isEnd = true
    if (this.frameIns) {
      window.cancelAnimationFrame(this.frameIns)
    }
    this.frameIns = 0
    this.reset()
  }

  update(options: Partial<AnimateOptions>) {
    this.options = { ...this.options, ...options }
  }

  run() {
    if (this.isDestory) return
    this.isEnd = false
    this.nextFrame(0)
  }

  destory() {
    this.stop()
    this.isDestory = true
  }
}

interface BlinkFrameParams {
  delay: number
  times: number
  step?: (current: number) => void
  finish?: () => void
}
export const blinkFrame = ({ delay = 500, times = 7, step, finish }: BlinkFrameParams) => {
  let frameIns = 0
  let start = 0
  let count = 0
  const frameStep = (timestramp: number) => {
    if (!start) {
      start = timestramp
      frameIns = window.requestAnimationFrame(frameStep)
      return
    }
    // 计算时间间隔
    const timePassed = timestramp - start
    if (timePassed < delay) {
      frameIns = window.requestAnimationFrame(frameStep)
      return
    }
    start = timestramp

    // 计算次数是否上限
    if (count >= times) {
      window.cancelAnimationFrame(frameIns)
      finish?.()
      return
    }

    // 成功执行回调
    step?.(count)
    count++

    // 继续执行
    frameIns = window.requestAnimationFrame(frameStep)
  }
  frameIns = window.requestAnimationFrame(frameStep)
}