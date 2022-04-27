import { calculateNextShowTime } from "./_utils"

export async function addNewMemo(db, memoText, startShowAt = new Date(), haveDelay,
    tags = ['default'], folder = 'default') {
    return await new Promise((resolve, reject) => {
        let transaction = db.transaction('memos', 'readwrite')
        let now = new Date().getTime()

        let memos = transaction.objectStore('memos')

        let lastid = +localStorage.getItem('last_id')

        let delay = startShowAt - new Date()
        if (delay < 10000) delay = 0

        const newMemo = {
            id: lastid + 1,
            text: memoText,
            tags,
            folder,
            startTime: now,
            countShows: delay === 0 ? 1 : 0,
            timeNextShow: delay === 0
                ? now + 1000 * 60 * 10
                : now + delay
        }

        let request = memos.add(newMemo)

        request.onsuccess = function () {
            localStorage.setItem('last_id', lastid + 1)
            resolve(lastid)
        }
        request.onerror = function (e) {
            reject('error creating new memo', e)
        }
    })
}


export async function searchUnresolvedMemos(db) {
    return await new Promise((resolve, reject) => {
        const from = 1587369876116 // apr 2020
        const to = new Date().getTime()

        let transaction = db.transaction('memos')
        let memos = transaction.objectStore('memos')
        let timeShowIndex = memos.index('time_index')

        let request = timeShowIndex.getAll(IDBKeyRange.bound(from, to))

        request.onsuccess = function () {
            resolve(request.result)
        }
        request.onerror = function (e) {
            reject('error searching book in db', e)
        }
    })
}

export async function handleMemoRepeated(db, memoId) {
    return await new Promise((resolve, reject) => {
        let transaction = db.transaction("memos", "readwrite");
        let memos = transaction.objectStore('memos')

        let request = memos.get(IDBKeyRange.only(memoId))

        request.onsuccess = function () {
            const memo = request.result
            memo.timeNextShow = calculateNextShowTime(memo.startTime, memo.countShows)
            memo.countShows = memo.countShows + 1
            memos.put(memo)
            resolve(true)
        }
        request.onerror = function (e) {
            reject('error searching book in db', e)
        }
    })
}