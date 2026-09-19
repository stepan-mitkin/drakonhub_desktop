const {
    contextBridge,
    ipcRenderer
} = require("electron");


contextBridge.exposeInMainWorld(
    "electronBackend",
    {
        invoke: function (command, args) {
            return ipcRenderer.invoke(
                command,
                args
            );
        },

        listen: function (eventName, callback) {
            function handler(_event, payload) {
                callback({
                    payload: payload
                });
            }

            ipcRenderer.on(
                eventName,
                handler
            );

            return function () {
                ipcRenderer.removeListener(
                    eventName,
                    handler
                );
            };
        }
    }
);