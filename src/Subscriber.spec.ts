import { fakeAsync, tick } from '@angular/core/testing'
import { Subscriber } from './Subscriber'
import { of, Subject, throwError } from 'rxjs'

/**
 * Tests for Subscriber
 */
describe('Subscriber', () => {
	class X extends Subscriber {}

	it('should be an extendable class', () => {
		const x = new X()
		expect(x).toBeDefined()
	})

	it('should add subscribeTo to instance', () => {
		const x = new X()
		expect(x.subscribeTo).toBeDefined()
	})
})

/**
 * Tests for Subscriber
 */
describe('Subscriber.when', () => {
	class X extends Subscriber {}

	it('should error if not provided with an observable', done => {
		const x = new X()
		x.when(null)
			.then(() => {
				expect(false).toBeTruthy()
				done()
			})
			.catch(() => {
				expect(true).toBeTruthy()
				done()
			})
	})

	it('should take 1 of the observable', done => {
		const x = new X()
		const b = new Subject()
		x.when(b).then(() => {
			expect(true).toBeTruthy()
			done()
		})
		b.next('a')
		b.next('b')
	})

	it('should error if observable errors', done => {
		const x = new X()
		const b = new Subject()
		x.when(b)
			.then(() => {
				expect(false).toBeTruthy()
				done()
			})
			.catch(() => {
				expect(true).toBeTruthy()
				done()
			})
		b.error(new Error(''))
	})
})

/**
 * Tests for Subscriber
 */
describe('Subscriber.subscribeTo', () => {
	class X extends Subscriber {}

	it('should subscribe to an observable', done => {
		const x = new X()
		x.subscribeTo(of(1, 2), v => {
			if (v === 2) {
				done()
			}
		})
	})

	it('should catch errors and NOT call the subscriber', fakeAsync(() => {
		const x = new X()
		let fired = false
		x.subscribeTo(throwError(''), v => {
			fired = true
		})
		tick(500)
		expect(fired).toBeFalsy()
	}))
})
