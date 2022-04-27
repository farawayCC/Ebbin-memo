export function initdb() {
    let openRequest = indexedDB.open("memos", 1)

    openRequest.onupgradeneeded = function (event) {
        var request = event.target;
        var db = request.result;
        var txn = request.transaction;

        if (!db.objectStoreNames.contains("memos")) {
            let memos = db.createObjectStore("memos", { keyPath: "id" })
            memos.createIndex('time_index', 'timeNextShow')
            memos.createIndex('folder_index', 'folder')
        }
        else {
            let memos = txn.objectStore('memos')
            memos.createIndex('time_index', 'timeNextShow')
            memos.createIndex('folder_index', 'folder')
        }
    }

    openRequest.onsuccess = async function () {
        console.log('opened db');
    }
}