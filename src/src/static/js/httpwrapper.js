function createHttpWrapper(storage, host) {
    async function sendRequest(method, url, body) {
        var responseRaw = undefined;
        var bodyObj = {};
        if (body) {
            bodyObj = JSON.parse(body);
        }
        try {
            if (method === "GET") {
                if (url === "/api/account") {
                    responseRaw = await host.getAccount();
                } else if (url === "/api/recent") {
                    responseRaw = await storage.getRecent();
                } else if (url === "/api/theme") {
                    responseRaw = await host.getTheme();
                } else if (url.startsWith("/api/visit/")) {
                    responseRaw = await storage.getFolder(url);
                } else if (url.startsWith("/api/tag/")) {
                    responseRaw = await storage.getTag(url);
                } else if (url === "/api/search") {
                    responseRaw = await storage.getSearch();
                } else if (url.startsWith("/api/backup")) {
                    responseRaw = await storage.startBackup();
                }
            } else if (method === "POST") {
                if (url === "/api/theme") {
                    responseRaw = await host.saveTheme(bodyObj);
                } else if (url.startsWith("/api/folder/")) {
                    responseRaw = await storage.createFolder(bodyObj);
                } else if (url.startsWith("/api/edit/")) {
                    responseRaw = await storage.editDiagram(url, bodyObj);
                } else if (url === "/api/find_folders") {
                    responseRaw = await storage.findFolders(bodyObj);
                } else if (url === "/api/search") {
                    if (bodyObj.type === "folders") {
                        responseRaw = await storage.findFoldersByName(bodyObj);
                    } else if (bodyObj.type === "items") {
                        responseRaw = await storage.startItemSearch(bodyObj);
                    } else {
                        responseRaw = createError(400, "Unsupported type");
                    }
                } else if (url === "/api/many") {
                    if (bodyObj.operation === "copy") {
                        responseRaw = await storage.copyPaste(bodyObj);
                    } else if (bodyObj.operation === "move") {
                        responseRaw = await storage.cutPaste(bodyObj);
                    } else if (bodyObj.operation === "delete") {
                        responseRaw = await storage.deleteMany(bodyObj);
                    } else {
                        responseRaw = createError(400, "Unsupported operation");
                    }
                } else if (url === "/api/restore_many") {
                    responseRaw = await storage.restoreMany(bodyObj);
                } else if (url === "/api/feedback") {
                    console.error(bodyObj);
                    responseRaw = create200();
                }
            } else if (method === "PUT") {
                if (url.startsWith("/api/folder/")) {
                    responseRaw = await storage.updateFolder(url, bodyObj);
                }
            }
            console.log("sendRequest reply", method, url, bodyObj, responseRaw);
        } catch (ex) {
            console.error("sendRequest", method, url, body, ex);
            responseRaw = [500, { error: "Server error" }];
        }
        if (!responseRaw) {
            throw new Error(method + " " + url);
        }
        var response = {
            status: responseRaw[0],
            responseText: JSON.stringify(responseRaw[1]),
        };
        return response;
    }

    function createError(status, message) {
        return [status, { error: message }];
    }

    function create200(payload) {
        if (payload === undefined || payload === null) {
            payload = ""
        }
        return [200, payload];
    }

    async function main() {
        console.log("createHttpWrapper.main");
        await host.main()
    }

    return {
        type: "httpwrapper",
        sendRequest: sendRequest,
        main: main,
    };
}
