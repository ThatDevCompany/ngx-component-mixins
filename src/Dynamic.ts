import { BehaviorSubject } from 'rxjs'
import { Constructor } from './Base'

/**
 * An interface for the resulting Dynamic Mixin Class
 */
export interface IDynamic {
	startOnInit: boolean
	isRunning: boolean
	clockSpeed: number
	clock: BehaviorSubject<DynamicTick>

	doStart(): void
	doStop(): void
	doTick(): void
	ngOnInit(): void
	ngOnDestroy(): void
}

/**
 * A tick of time
 */
export interface DynamicTick {
	diff: number
	stamp: number
}

/**
 * A clock which ticks
 */
export class DynamicClock extends BehaviorSubject<DynamicTick> {}

/**
 * The mixin function which will create a Dynamic component
 *
 * - A dynamic component has the capacity to change over time
 * - It can be Started, Stopped and can run a process during each moment (tick of time)
 */
export function DynamicMixin<T extends Constructor>(
	Base: T
): Constructor<IDynamic> & T {
	class Dynamic extends Base implements IDynamic {
		/* PROPERTIES */
		/**
		 * Should the component run immediately when it is initiated
		 */
		startOnInit: boolean = false

		/**
		 * Is the component currently playing
		 */
		isRunning: boolean = false

		/**
		 * The interval (in milliseconds) for the time clock
		 */
		clockSpeed: number = 0

		/**
		 * The ticking clock
		 */
		clock: DynamicClock = new DynamicClock({
			diff: 0,
			stamp: null
		})

		/**
		 * Is the clock currently processing a tick
		 */
		private _isProcessing = false

		/**
		 * The handle for the clock interval
		 */
		private _intervalHandle: any

		/* LIFECYCLE METHODS */
		ngOnInit() {
			if (super['ngOnInit']) {
				super['ngOnInit']()
			}

			// Start Play
			if (this.startOnInit) {
				this.doStart()
			}
		}

		ngOnDestroy() {
			if (super['ngOnDestroy']) {
				super['ngOnDestroy']()
			}
			this.doStop()
		}

		/* METHODS */
		/**
		 * Start the dynamic process
		 */
		doStart() {
			if (this.isRunning) {
				return
			}
			this.clock.next({ diff: 0, stamp: new Date().getTime() })
			this._intervalHandle = setInterval(
				() => this.doProcessInterval(),
				this.clockSpeed
			)
			this.isRunning = true
		}

		/**
		 * Pause the dynamic process
		 */
		doStop() {
			this.isRunning = false
		}

		/**
		 * Process a single step of the dynamic process
		 */
		doTick() {}

		/**
		 * PRIVATE - the internal method for handling the dynamic processing clock
		 */
		private doProcessInterval() {
			// Make sure we only tick once at a time
			if (this._isProcessing) {
				return
			}
			this._isProcessing = true

			// Have we stopped playing? Then stop future ticking
			if (!this.isRunning) {
				clearInterval(this._intervalHandle)
			}

			// Tick
			this.doTick()
			this.clock.next({
				diff: new Date().getTime() - this.clock.getValue().stamp,
				stamp: new Date().getTime()
			})

			// We're done
			this._isProcessing = false
		}
	}

	return Dynamic
}
