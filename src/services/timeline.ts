// Constants
const DefaultTimelineFramerate: number = 10;
const DefaultTimelineCycleTime: number = 0;

// Interfaces
interface TimelineConfig {
  debug?: boolean;
  framerate?: number;
  cycleTime?: number;
  offset?: number;
}

interface Event {
  trigger(time: number): void;
}

// Abstract class for timeline events
abstract class TimelineEvent implements Event {
  protected _callback: (time: number) => void;
  protected _time: number;
  protected _tag: string;

  constructor(
    callback: (time: number) => void,
    time: number,
    tag: string = ""
  ) {
    this._callback = callback;
    this._time = time;
    this._tag = tag;
  }

  get time(): number {
    return this._time;
  }
  get tag(): string {
    return this._tag;
  }

  abstract trigger(time: number): void;
}

// FixedTimelineEvent class
class FixedTimelineEvent extends TimelineEvent {
  constructor(callback: (time: number) => void, time: number, tag: string) {
    super(callback, time, tag);
  }

  trigger(time: number): void {
    this._callback(time);
  }
}

// IntervalTimelineEvent class
class IntervalTimelineEvent extends TimelineEvent {
  private _interval: number;

  constructor(
    callback: (time: number) => void,
    time: number,
    interval: number,
    tag: string
  ) {
    super(callback, time, tag);
    this._interval = interval;
  }

  get interval(): number {
    return this._interval;
  }

  trigger(time: number): void {
    this._callback(time);
  }
}

// Timeline class
class Timeline {
  private _framerate: number;
  private _cycleTime: number;
  private _offset: number;
  private _timelineEvents: { [key: number]: TimelineEvent[] } = {};
  private _fixedEvents: FixedTimelineEvent[] = [];
  private _intervalEvents: IntervalTimelineEvent[] = [];
  private _previous: number = 0;
  private _currentExecuting: number | null = null;
  private _frameLength: number;

  constructor(config: TimelineConfig = {}) {
    this._framerate = config.framerate || DefaultTimelineFramerate;
    this._cycleTime = config.cycleTime || DefaultTimelineCycleTime;
    this._offset = config.offset || 0;
    this._frameLength = Math.floor(1000 / this._framerate);
    window.requestAnimationFrame(() => {
      this._update();
    });
  }

  addEvent(
    callback: (time: number) => void,
    time: number,
    interval: number | null = null,
    tag: string = ""
  ): Event {
    if (interval === null) {
      return this._addFixedEvent(callback, time, tag);
    } else {
      return this._addIntervalEvent(callback, time, interval, tag);
    }
  }

  clear(): void {
    this._timelineEvents = {};
  }

  reset(): void {
    this._offset = -Date.now();
  }

  set cycleTime(val: number) {
    this._cycleTime = val;
    this._generate();
  }

  private _update(): void {
    const cyclePosition = this._cyclePosition;

    if (this._cycleTime === 0) {
      return;
    }

    if (cyclePosition !== this._currentExecuting) {
      this._currentExecuting = cyclePosition;

      const previous = this._previous;
      for (let i = previous; i <= cyclePosition; i += this._frameLength) {
        if (this._timelineEvents[i]) {
          this._timelineEvents[i].forEach((e) => e.trigger(cyclePosition));
        }
      }
      this._previous = cyclePosition;
    }

    window.requestAnimationFrame(() => {
      this._update();
    });
  }

  private _addFixedEvent(
    callback: (time: number) => void,
    time: number,
    tag: string
  ): FixedTimelineEvent {
    const ev = new FixedTimelineEvent(callback, this._toFrameTime(time), tag);
    this._fixedEvents.push(ev);
    this._generate();
    return ev;
  }

  private _addIntervalEvent(
    callback: (time: number) => void,
    time: number,
    interval: number,
    tag: string
  ): IntervalTimelineEvent {
    const ev = new IntervalTimelineEvent(
      callback,
      this._toFrameTime(time),
      this._toFrameTime(interval),
      tag
    );
    this._intervalEvents.push(ev);
    this._generate();
    return ev;
  }

  private _generate(): void {
    if (this._cycleTime === 0) {
      return;
    }

    this.clear();

    // Fixed events
    this._fixedEvents.forEach((e) => {
      this._insertEvent(e.time, e);
    });

    // Interval events
    this._intervalEvents.forEach((e) => {
      let counter = e.time;
      while (counter < this._cycleTime) {
        this._insertEvent(counter, e);
        counter += e.interval;
      }
    });
  }

  private _insertEvent(time: number, e: TimelineEvent): void {
    if (!this._timelineEvents[time]) {
      this._timelineEvents[time] = [];
    }
    this._timelineEvents[time].push(e);
  }

  private get _cyclePosition(): number {
    const milliseconds = Date.now() + this._offset;
    return this._toFrameTime(milliseconds % this._cycleTime);
  }

  private _toFrameTime(time: number): number {
    return Math.floor(time / this._frameLength) * this._frameLength;
  }
}

export default Timeline;
