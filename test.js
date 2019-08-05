let speed = 1000
let counter = 0
let interval = null


function startInterval() {
    console.log("Start: " + counter)
    console.log("Speed: " + speed)
    const newInterval = setInterval(function () {
        console.log(++counter)

        if (counter > 10) {
            clearInterval(interval)
            interval = null
            counter = 0
            speed -= 100
            console.log("End")
            startInterval()
        }

    }, speed);
    interval = newInterval
}

startInterval()
