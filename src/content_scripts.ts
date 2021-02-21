import { browser } from 'webextension-polyfill-ts'

function refresh() {
    let element = document.querySelector('a[href="/home"]') as HTMLElement
    element.click()
}

function refreshIfOnHomeTop() {
    if (window.pageYOffset == 0) {
        if (location.pathname == "/home") {
            refresh()
        }
    }
}

const setTime = function () {
    let _time: number
    let interval: NodeJS.Timeout
    return (time: number) => {
        _time = time
        clearInterval(interval)
        interval = setInterval(refreshIfOnHomeTop, _time)
    }
}();

(() => {
    const defaultTime = 3000
    const execute = async () => {
        let value = await browser.storage.sync.get("time")
        let time = isNaN(value.time) ? defaultTime : value.time
        setTime(time)
    }
    execute()
    browser.storage.onChanged.addListener((changes, namespace) => {
        var storageChange = changes["time"]
        setTime(storageChange.newValue)
    })
})();




