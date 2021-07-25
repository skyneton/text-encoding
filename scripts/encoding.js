function Encoding() {
    "use strict";
    
    const idx = [];
    let worker;
    let WORKER_URL;
    let IMPORT_SCRIPT;

    const init = () => {
        if(Worker && location.protocol.startsWith("http")) {
            WORKER_URL = URL.createObjectURL(new Blob([`(${threadWorker.toString()})()`], {type: "text/javascript"}));
            worker = new Worker(WORKER_URL);
            worker.addEventListener("message", getThreadMessage);

            IMPORT_SCRIPT = URL.createObjectURL(new Blob([`const getEncodingResult = ${getEncodingResult.toString()}`], {type: "text/javascript"}));
            worker.postMessage({
                "type": "import",
                "url": IMPORT_SCRIPT
            });
        }
    };

    const getEncodingResult = (file, types, type = "auto") => {
        const fileReaderLoad = (file, fileReader, type = "UTF-8") => {
            return new Promise(resolve => {
                fileReader.onloadend = () => {
                    resolve(fileReader.result);
                }
    
                fileReader.readAsText(file, type);
            });
        };

        return new Promise(async resolve => {
            if(type !== "auto") {
                fileReaderLoad(file, new FileReader(), type).then(result => {
                    resolve({
                        "result": URL.createObjectURL(new Blob([result], { type: "text/plain" })),
                        "before": type,
                    });
                });
                return;
            }
            const data = {};
            for(let i = 0; i < types.length; i++) {
                const result = await fileReaderLoad(file, new FileReader(), types[i]);
                // const size = (getArr(result.match(/�/g)).concat(getArr(result.match(/đ/g))).concat(getArr(result.match(/ў/g))).concat(getArr(result.match(/Ą/g))).concat(getArr(result.match(/Ẅ/g)))).length;
                const size = (result.match(/�/g) || result.match(/đ/g) || result.match(/ў/g) || result.match(/Ą/g) || result.match(/в/g) || result.match(/Ṁ/g) || result.match(/À/g) || result.match(/¾/g) || result.match(/ˇ/g) || result.match(/Α/g) || result.match(//g) || []).length;
                if(size == 0) {
                    if(data.url != undefined) URL.revokeObjectURL(data.url);
                    data.min = size;
                    data.before = types[i];
                    data.url = URL.createObjectURL(new Blob([result], { type: "text/plain" }));
                    break;
                }
                if(data.min == undefined || data.min > size) {
                    data.min = size;
                    data.before = types[i];
                    if(data.url != undefined) URL.revokeObjectURL(data.url);
                    data.url = URL.createObjectURL(new Blob([result], { type: "text/plain" }));
                    continue;
                }
            }

            resolve({
                "result" : data.url,
                "before": data.before,
            });
        });
    };

    const threadWorker = () => {
        self.addEventListener("message", e => {
            const packet = e.data;
            if(packet.type === "import") {
                importScripts(packet.url);
                return;
            }
            getEncodingResult(packet.file, packet.types, packet["encoding-type"]).then(data => {
                self.postMessage({
                    "result": data.result,
                    "before": data.before,
                    "return": packet.return,
                });
            });
        });
    };

    var getThreadMessage = e => {
        const packet = e.data,
            options = idx[packet.return];
        if(!options) return;
        if(options.success) {
            options.success(packet.result, packet.before);
        }
        delete idx[packet.return];
    };

    init();

    return new class {
        start(file, options) {
            if(typeof file === "undefined" || !(file instanceof File || file instanceof Blob)) throw new Error("파일 혹은 Blob를 입력해주세요.");
            if(typeof options === "undefined") throw new Error("옵션값을 입력해주세요.");

            if(worker) {
                const id = idx.length;
                idx[id] = options;
                worker.postMessage({
                    "file": file,
                    "type": "encoding",
                    "encoding-type": options.type || "auto",
                    "types": this.types(),
                    "return": id
                });
            }else {
                getEncodingResult(file, this.types(), options.type).then(data => {
                    if(options.success) {
                        options.success(data.result, data.before);
                    }
                });
            }
        }

        close() {
            if(worker) {
                URL.revokeObjectURL(WORKER_URL)
                worker.terminate();
            }

            if(IMPORT_SCRIPT) {
                URL.revokeObjectURL(IMPORT_SCRIPT);
            }
        }

        types() {
            return ["UTF-8", "IBM866", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5", "ISO-8859-6", "ISO-8857-7", "ISO-8859-8", "ISO-8859-8-I", "ISO-8859-10", "ISO-8859-13", "ISO-8859-14", "ISO-8859-15", "ISO-8859-16", "KOI8-R", "KOI8-U", "macintosh", "windows-874", "windows-1250", "windows-1251", "windows-1252", "windows-1253", "windows-1254", "windows-1255", "windows-1256", "windows-1257", "windows-1258", "x-mac-cyrillic", "GBK", "gb18030", "Big5", "EUC-JP", "ISO-2022-JP", "Shift_JIS", "EUC-KR", "UTF-16BE", "UTF-16LE"];
        }
    }
}