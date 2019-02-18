import { ElementRef } from '@angular/core'
import { Constructor } from './Base'

/**
 * An Interface for the Processingable mixin
 */
export interface IProcessingable {
	processingEle: ElementRef
	mainEle: ElementRef
	isProcessing: boolean
	processingMessage: string
	processingFadeSpeed: number
	initProcessing: boolean
	setProcessing(onOff: boolean, message?: string)
	ngOnInit()
}

/**
 * Return a Typescript Mixin for a Processingable component
 */
export function Processingable<T extends Constructor>(
	BaseClass: T
): Constructor<IProcessingable> & T {
	class ProcessingableClass extends BaseClass implements IProcessingable {
		processingEle: ElementRef
		mainEle: ElementRef
		isProcessing: boolean
		initProcessing: boolean = true
		processingMessage: string
		processingFadeSpeed: number = 0.36

		private _initiated: boolean = false

		setProcessing(onOff: boolean = false, message: string = '') {
			this._initiated = true
			this.isProcessing = onOff
			this.processingMessage = message
			this.processingEle.nativeElement.style.opacity = onOff ? '1' : '0'
			this.mainEle.nativeElement.style.opacity = onOff ? '0' : '1'
			this.mainEle.nativeElement.style.pointerEvents = onOff ? 'none' : 'all'
		}

		ngOnInit() {
			if (super['ngOnInit']) {
				super['ngOnInit']()
			}
			let ps = this.processingEle.nativeElement.style,
				ms = this.mainEle.nativeElement.style
			ps.opacity = '0'
			ms.opacity = '0'

			setTimeout(() => {
				ps.transition = ms.transition = `opacity ${this.processingFadeSpeed}s`
				if (this.initProcessing) {
					setTimeout(() => {
						if (!this._initiated) {
							ps.opacity = '1'
						}
						this._initiated = true
					}, 100)
				} else {
					if (!this._initiated) {
						ms.opacity = '1'
					}
					this._initiated = true
				}
			}, 0)
		}
	}

	return ProcessingableClass
}
