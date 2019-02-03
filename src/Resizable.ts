import { Constructor } from './Base'
import * as _ from 'lodash'

/**
 * An Interface for the Resizable mixin
 */
export interface IResizable {
	doResize()

	calcSizeOf(el: Element)
}

/**
 * A basic Vector2 object
 */
export interface Size {
	w: number
	h: number
}

/**
 * Return a Typescript Mixin for a resizable class which will automatically hook on to the Window Resize event
 * and fire the internal doResize() method with a SizeBundle object
 */
export function Resizable<T extends Constructor>(
	BaseClass: T
): Constructor<IResizable> & T {
	class Resizable extends BaseClass implements IResizable {
		/**
		 * Stub function for overriding
		 */
		doResize() {}

		/**
		 * Constructor to wire up the listener
		 */
		constructor(...args: Array<any>) {
			super(args)
			window.addEventListener('resize', this.resizeHandler.bind(this))
			setTimeout(() => {
				this.resizeHandler()
			}, 100)
		}

		/**
		 * Handle the window resize event, create the SizeBundle and trigger the doResize method
		 * throttled to avoid over firing
		 */
		resizeHandler = _.throttle(this.doResize.bind(this), 100, {
			leading: false,
			trailing: true
		})

		/**
		 * Calculate the size (in pixels) of an element
		 */
		calcSizeOf(el: Element, defaults: Size = { w: 100, h: 100 }): Size {
			try {
				const s = window.getComputedStyle(el, null)
				return {
					w: !isNaN(parseInt(s.width, 10)) ? parseInt(s.width, 10) : defaults.w,
					h: !isNaN(parseInt(s.height, 10))
						? parseInt(s.height, 10)
						: defaults.h
				}
			} catch (e) {
				return defaults
			}
		}
	}

	return Resizable
}
