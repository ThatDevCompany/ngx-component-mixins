import { Observable, Subscription, of } from 'rxjs'
import { catchError, take } from 'rxjs/operators'
import { Constructor } from './Base'

/**
 * An Interface for the Subscriber mixin
 */
export interface ISubscriber {
	subscribeTo<T>(observable: Observable<T>, fnc: (...args) => void)
	when<T>(observable: Observable<T>): Promise<T>
}

/**
 * Return a Typescript Mixin for a subscribable component class
 * Basically this offers the component automated unsubscription
 */
export function SubscriberMixin<T extends Constructor>(
	BaseClass: T
): Constructor<ISubscriber> & T {
	class Subscriber extends BaseClass implements ISubscriber {
		/**
		 * An array of all subscriptions created
		 */
		private _subscriptions: Subscription[] = []

		/**
		 * A function which will perform subscription in a way
		 * that will be automatically unsubscribed on destruction
		 *
		 * e.g.
		 *
		 *      this.subscribeTo( anObservable, (value) => {
		 *          // do some stuff
		 *      })
		 */
		subscribeTo<T>(observable: Observable<T>, fnc: (...args) => void) {
			if (!observable || !fnc || !observable.subscribe) return
			let failed = false
			this._subscriptions.push(
				observable
					.pipe(
						catchError(() => {
							failed = true
							return of(null)
						})
					)
					.subscribe((...args) => {
						if (!failed) {
							fnc.apply(null, args)
						}
					})
			)
		}

		/**
		 * A quick way of taking ONE event and subscribing to it
		 */
		async when<T>(observable: Observable<T>): Promise<T> {
			if (!observable) return Promise.reject(null)
			return new Promise<T>((resolve, reject) => {
				let failed = false
				observable
					.pipe(
						take(1),
						catchError(e => {
							failed = true
							return of(null)
						})
					)
					.subscribe((args: T) => {
						if (failed) {
							reject()
						} else {
							resolve(args)
						}
					})
			})
		}

		/**
		 * A destructor method that unsubscribes to all subscriptions
		 */
		ngOnDestroy() {
			if (super['ngOnDestroy']) {
				super['ngOnDestroy']()
			}
			this._subscriptions.forEach(s => {
				s.unsubscribe()
			})
		}
	}

	return Subscriber
}
