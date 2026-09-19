(function () {
    const IDB_DB_NAME = "drakonhubdb";
    const IDB_DB_VERSION = 1;
    const IDB_STORE = "kv";

    let folderPrefix = ""
    let _dbPromise;

    function openDb() {
        if (_dbPromise) return _dbPromise;

        _dbPromise = new Promise(function (resolve, reject) {
            const req = indexedDB.open(IDB_DB_NAME, IDB_DB_VERSION);

            req.onupgradeneeded = function () {
                const db = req.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE); // key -> value
                }
            };

            req.onsuccess = function () {
                resolve(req.result);
            };

            req.onerror = function () {
                reject(req.error || new Error("Failed to open IndexedDB"));
            };
        });

        return _dbPromise;
    }

    function makeCompositeKey(tableName, key) {
        if (!tableName) {
            throw new Error("tableName is required");
        }
        if (!key) {
            throw new Error("key is required");
        }

        if (folderPrefix) {
            return String(folderPrefix) + "-" + String(tableName) + "-" + String(key);
        } else {
            return String(tableName) + "-" + String(key);
        }
    }

    async function read(tableName, key) {
        const db = await openDb();
        const compositeKey = makeCompositeKey(tableName, key);

        return await new Promise(function (resolve, reject) {
            const tx = db.transaction(IDB_STORE, "readonly");
            const store = tx.objectStore(IDB_STORE);
            const req = store.get(compositeKey);

            req.onsuccess = function () {
                // If missing, req.result is undefined
                resolve(req.result);
            };
            req.onerror = function () {
                reject(req.error || new Error("IndexedDB read failed"));
            };
        });
    }

    async function write(tableName, key, obj) {
        const db = await openDb();
        const compositeKey = makeCompositeKey(tableName, key);

        await new Promise(function (resolve, reject) {
            const tx = db.transaction(IDB_STORE, "readwrite");
            const store = tx.objectStore(IDB_STORE);

            const req = store.put(obj, compositeKey);

            req.onerror = function () {
                reject(req.error);
            };

            tx.oncomplete = function () {
                resolve();
            };

            tx.onerror = function () {
                reject(tx.error || new Error("IndexedDB write failed"));
            };

            tx.onabort = function () {
                reject(tx.error || new Error("IndexedDB write aborted"));
            };
        });
    }

    async function remove(tableName, key) {
        const db = await openDb();
        const compositeKey = makeCompositeKey(tableName, key);

        await new Promise(function (resolve, reject) {
            const tx = db.transaction(IDB_STORE, "readwrite");
            const store = tx.objectStore(IDB_STORE);

            // delete() is already a no-op if key doesn't exist
            store.delete(compositeKey);

            tx.oncomplete = function () {
                resolve();
            };
            tx.onerror = function () {
                reject(tx.error || new Error("IndexedDB remove failed"));
            };
            tx.onabort = function () {
                reject(tx.error || new Error("IndexedDB remove aborted"));
            };
        });
    }

    if (!window.padBridge) {
        window.padBridge = {};
    }
    window.padBridge.addListener = function () {};
    window.padBridge.getLaunchUrl = async function () {
        return undefined;
        //return "file:///Users/user1/Library/Developer/CoreSimulator/Devices/la-la-la/data/Containers/Shared/AppGroup/foo/File Provider Storage/Første%20på%20ipad.drakon/";
    };
    window.padBridge.readUtf8FileFromDisk = async function () {
        return JSON.stringify({
            items: {
                1: {
                    type: "end",
                },
                2: {
                    type: "branch",
                    branchId: 0,
                    one: "3",
                },
                3: {
                    type: "question",
                    one: "5",
                    two: "4",
                    flag1: 0,
                    content: "<p>aaaaa</p>",
                },
                4: {
                    type: "question",
                    one: "5",
                    two: "6",
                    flag1: 0,
                    content: "<p>bbbbb</p>",
                },
                5: {
                    type: "action",
                    one: "1",
                    content: "<p>cccc</p>",
                },
                6: {
                    type: "action",
                    one: "1",
                    content: "<p>ddddd</p>",
                },
            },
        });
    };
    window.padBridge.disconnectFolder = async function (folderPath) {
        folderPrefix = ""
    }
    window.padBridge.initFolder = async function (folderPath) {
        folderPrefix = folderPath;
    }

    window.padBridge.openFolder = async function () {
        var value = prompt("Enter a fake folder path to open:");
        return value || undefined
    };
    window.padBridge.getRecentFolders = async function () {
        var recentStr = localStorage.getItem("desktop-recentFolders");
        if (!recentStr) {
            return [];
        }

        return JSON.parse(recentStr);
    };   
    window.padBridge.saveRecentFolders = async function (recentFolders) {
        localStorage.setItem("desktop-recentFolders", JSON.stringify(recentFolders));
    };

    window.drakonStorage = {
        read: read,
        write: write,
        remove: remove,
    };
})();
