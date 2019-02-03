# NGX Component Mixins
[![CircleCI](https://circleci.com/gh/ThatDevCompany/ngx-component-mixins.svg?style=svg)](https://circleci.com/gh/ThatDevCompany/ngx-component-mixins)
##  Overview
A collection of useful mixins for use in creating Angular Components

##  Resizable Mixin
This mixin will automatically trigger a resize method whenever the user's browser changes size

```
    class MyComponent extends ResizableMixin(BaseMixin) {
        doRezize({ w, h }) {
            console.log('My component's is now W wide and H high
        }
    }

```

##  Subscriber Mixin
This mixin provides automated unsubscription to Observables when a component is destroyed

```
    class MyComponent extends SubscriberMixin(BaseMixin) {
        doThing() {
            this.subscribeTo(someObservable, () => {
                // Do what you want
            })
        }
    }
```

It also provides a nice shorthand for taking just ONE event from an Observable and converting
it into a Promise

```
    class MyComponent extends SubscriberMixin(BaseMixin) {
        doThing() {
            this.when(someObservable)
                .then(() => {
                    // Do what you want
                })
                .catch(() => {
                    // Handle the error
                })
        }
    }
```



##  Dynamic Mixin
This mixin adds the concept of TIME to the component

The component can be STARTED and STOPPED and whilst RUNNING it will TICK for each moment in time


```
    class MyComponent extends DynamicMixin(BaseMixin) {
        onClickPlay() {
            this.doStart()
        }
        
        onClickStop() {
            this.doStop()
        }
        
        doTick() {
            // Do whatever you want each tick of the clock
        }
    }
```
