## vivid-wait

> Simulate a lively waiting operation.

You can use "vivid-wait" if you want to control a fast-executing function to complete at a specific time. It makes the operation more realistic by controlling the easing of the progress.

## Installation

```shell
npm install vivid-wait -S
```

## Usage

### If only to perform a wait operation

``` javascript
import { wait } from 'vivid-wait';

wait(5000).then(() => {
  // execute after five seconds
})
```
### If want to control the completion time of the operation

```javascript
import { wait } from 'vivid-wait';

wait(5000, {
  handler: () => new Promise((reslove) => {
    setTimeout(() => {
      reslove('vivid-wait');
    }, 100);
  })
}).then((result) => {
  // result will be obtained after a delay of five seconds
})
```

### If want to add easing animation to the waiting process

```html
<body>
  <h5>progress bars</h5>
  <div class="container">
    <strong class="progress" data-mode="linear"></strong>
    <strong class="progress" data-mode="ease"></strong>
    <strong class="progress" data-mode="ease-in"></strong>
    <strong class="progress" data-mode="ease-out"></strong>
    <strong class="progress" data-mode="ease-in-out"></strong>
    <strong class="progress" data-mode="random"></strong>
  </div>
</body>
```

```javascript
import { wait } from '../dist/index.esm.js';

function drawProgressBars () {
  const progressBars = document.querySelectorAll('.progress');

  progressBars.forEach(async bar => {
    wait(5000, {
      // the default easing mode is random
      mode: bar.getAttribute('data-mode'),
      // When the handler execution time exceeds the waiting time, the progress will be maintained at 99% until completed
      onUpdate: (percent) => {
      	bar.style.width = `${percent * 100}%`
      }
    }).then((result) => {
      // execute after five seconds
    });
  })
}

window.onload = drawProgressBars;
```

#### example
<p align="center">
  <img src="https://raw.githubusercontent.com/huanjinliu/vivid-wait/master/example/easing-modes.gif">
</p>

## LICENSE
[MIT](LICENSE)