var Module = typeof Module !== "undefined" ? Module : {};
(function(window) {
    var arguments = [];
    var cp5 = {
        contexts: [],
        images: [],
        sockets: [],
        patterns: []
    };
    var cp5_destroyed = false;
    var FontDetect = function() {
        function e() {
            if (!n) {
                n = !0;
                var e = document.body,
                    t = document.body.firstChild,
                    i = document.getElementById("fontdetectHelper") || document.createElement("div");
                i.id = "fontdetectHelper";
                r = document.createElement("span");
                r.innerText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                i.appendChild(r);
                e.insertBefore(i, t);
                i.style.position = "absolute";
                i.style.visibility = "hidden";
                i.style.top = "-200px";
                i.style.left = "-100000px";
                i.style.width = "100000px";
                i.style.height = "200px";
                i.style.fontSize = "100px"
            }
        }

        function t(e, t) {
            return e instanceof Element ? window.getComputedStyle(e).getPropertyValue(t) : window.jQuery ? $(e).css(t) : ""
        }
        var n = !1,
            i = ["serif", "sans-serif", "monospace", "cursive", "fantasy"],
            r = null;
        return {
            onFontLoaded: function(t, i, r, o) {
                if (t) {
                    var s = o && o.msInterval ? o.msInterval : 100,
                        a = o && o.msTimeout ? o.msTimeout : 2e3;
                    if (i || r) {
                        if (n || e(), this.isFontLoaded(t)) return void(i && i(t));
                        var l = this,
                            f = (new Date).getTime(),
                            d = setInterval(function() {
                                if (l.isFontLoaded(t)) return clearInterval(d), void i(t);
                                var e = (new Date).getTime();
                                e - f > a && (clearInterval(d), r && r(t))
                            }, s)
                    }
                }
            },
            isFontLoaded: function(t) {
                var o = 0,
                    s = 0;
                n || e();
                for (var a = 0; a < i.length; ++a) {
                    if (r.style.fontFamily = '"' + t + '",' + i[a], o = r.offsetWidth, a > 0 && o != s) return !1;
                    s = o
                }
                return !0
            },
            whichFont: function(e) {
                for (var n = t(e, "font-family"), r = n.split(","), o = r.shift(); o;) {
                    o = o.replace(/^\s*['"]?\s*([^'"]*)\s*['"]?\s*$/, "$1");
                    for (var s = 0; s < i.length; s++)
                        if (o == i[s]) return o;
                    if (this.isFontLoaded(o)) return o;
                    o = r.shift()
                }
                return null
            }
        }
    }();
    var haveFontsLoaded = false;
    var idleDeadline = null;

    function idleCallback(deadline) {
        if (cp5_destroyed) return;
        if (deadline["timeRemaining"]() < 0) return;
        idleDeadline = deadline;
        _cp5_idle();
        window["requestIdleCallback"](idleCallback)
    }
    if (typeof Module == "undefined") Module = {};
    Module["postRun"] = Module["preRun"] || [];
    Module["postRun"].push(function() {
        if ("requestIdleCallback" in window) {
            window["requestIdleCallback"](idleCallback)
        }
    });
    var curScript = window.document.currentScript;
    var textInput = document.getElementById("textInput");
    var textInputContainer = document.getElementById("textInputContainer");

    function reload(version) {
        if (window["setLoadingStatus"]) window["setLoadingStatus"]("Updating...");
        setTimeout(function() {
            window.location.reload(true)
        }, 2e3)
    }

    function allocateUTF8(str) {
        if (str == null) return 0;
        var l = str.length * 4 + 1;
        var ptr = _malloc(l);
        stringToUTF8(str, ptr, l);
        return ptr
    }
    var Module = Module || {};
    Module["postRun"] = Module["postRun"] || [];
    Module["postRun"].push(function() {
        window["input"] = {
            "mouse": _set_mouse_pos,
            "keyDown": _set_key_down,
            "keyUp": _set_key_up,
            "blur": _reset_keys,
            "wheel": _mouse_wheel,
            "prevent_right_click": _prevent_right_click,
            "flushInputHooks": _flush_input_hooks,
            "set_convar": function(key, value) {
                var k = allocateUTF8(key.toString());
                var v = allocateUTF8(value.toString());
                var r = !!_set_convar(k, v);
                _free(k);
                _free(v);
                return r
            },
            "get_convar": function(key) {
                var k = allocateUTF8(key.toString());
                var r = _get_convar(k);
                _free(k);
                return r ? UTF8ToString(r) : null
            },
            "execute": function(v) {
                var k = allocateUTF8(v.toString());
                _execute(k);
                _free(k)
            },
            "print_convar_help": _print_convar_help,
            "should_prevent_unload": _has_tank
        }
    });
    Module["noExitRuntime"] = true;
    Module["print"] = function(text, color) {
        console.log(text)
    };
    Module["printErr"] = function(text) {
        console.error(text)
    };
    Module["setStatus"] = function(text) {
        console.log(text)
    };
    Module["totalDependencies"] = 0;
    Module["monitorRunDependencies"] = function(left) {
        console.log(left + " dependencies left")
    };
    Module["setStatus"]("Downloading d.js...");
    window["connect"] = function(ip) {
        var p = allocateUTF8(ip);
        _d_connect(p);
        _free(p)
    };

    function copyToKeyboard(text) {
        var textArea = document.createElement("textarea");
        textArea.style.position = "fixed";
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.margin = 0;
        textArea.style.padding = 0;
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var res = false;
        try {
            res = document.execCommand("copy");
            if (!res) console.log("execCommand copy failed")
        } catch (e) {}
        document.body.removeChild(textArea);
        if (!res) {
            window["prompt"]("Copy the following link to your clipboard:", text)
        }
    }
    if (typeof Worker == "undefined") {
        window["alert"]("Your browser doesn't support Web Workers. Please ensure you're using the latest available version. Try Chrome if you haven't yet.")
    }
    if (!window.m28) {
        var url = "pow.js";
        var e = document.createElement("script");
        e.type = "text/javascript";
        e.src = url;
        e.onerror = function() {
            window.location.reload(true)
        };
        var node = document.getElementsByTagName("script")[0];
        node.parentNode.insertBefore(e, node)
    }
    if (/Chrome\/84\./.test(window.navigator.userAgent)) {
        window["alert"]("Your browser version contains a bug that makes the game run very poorly.\nIt is recommended that you update to Chrome 85 or newer, or use Chrome Canary for best performance.")
    }
    var originalFunctionToString = Function.prototype.toString;
    var moduleOverrides = {};
    var key;
    for (key in Module) {
        if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key]
        }
    }
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = function(status, toThrow) {
        throw toThrow
    };
    var ENVIRONMENT_IS_WEB = true;
    var ENVIRONMENT_IS_WORKER = false;
    var ENVIRONMENT_IS_NODE = false;
    var ENVIRONMENT_IS_SHELL = false;
    ENVIRONMENT_IS_WEB = typeof window === "object";
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    ENVIRONMENT_IS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
    ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    var scriptDirectory = "";

    function locateFile(path) {
        if (Module["locateFile"]) {
            return Module["locateFile"](path, scriptDirectory)
        }
        return scriptDirectory + path
    }
    var read_, readAsync, readBinary, setWindowTitle;
    var nodeFS;
    var nodePath;
    if (ENVIRONMENT_IS_NODE) {
        if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = require("path").dirname(scriptDirectory) + "/"
        } else {
            scriptDirectory = __dirname + "/"
        }
        read_ = function shell_read(filename, binary) {
            if (!nodeFS) nodeFS = require("fs");
            if (!nodePath) nodePath = require("path");
            filename = nodePath["normalize"](filename);
            return nodeFS["readFileSync"](filename, binary ? null : "utf8")
        };
        readBinary = function readBinary(filename) {
            var ret = read_(filename, true);
            if (!ret.buffer) {
                ret = new Uint8Array(ret)
            }
            assert(ret.buffer);
            return ret
        };
        if (process["argv"].length > 1) {
            thisProgram = process["argv"][1].replace(/\\/g, "/")
        }
        arguments_ = process["argv"].slice(2);
        if (typeof module !== "undefined") {
            module["exports"] = Module
        }
        process["on"]("uncaughtException", function(ex) {
            if (!(ex instanceof ExitStatus)) {
                throw ex
            }
        });
        process["on"]("unhandledRejection", abort);
        quit_ = function(status) {
            process["exit"](status)
        };
        Module["inspect"] = function() {
            return "[Emscripten Module object]"
        }
    } else if (ENVIRONMENT_IS_SHELL) {
        if (typeof read != "undefined") {
            read_ = function shell_read(f) {
                return read(f)
            }
        }
        readBinary = function readBinary(f) {
            var data;
            if (typeof readbuffer === "function") {
                return new Uint8Array(readbuffer(f))
            }
            data = read(f, "binary");
            assert(typeof data === "object");
            return data
        };
        if (typeof scriptArgs != "undefined") {
            arguments_ = scriptArgs
        } else if (typeof arguments != "undefined") {
            arguments_ = arguments
        }
        if (typeof quit === "function") {
            quit_ = function(status) {
                quit(status)
            }
        }
        if (typeof print !== "undefined") {
            if (typeof console === "undefined") console = {};
            console.log = print;
            console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
        }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
        if (ENVIRONMENT_IS_WORKER) {
            scriptDirectory = self.location.href
        } else if (document.currentScript) {
            scriptDirectory = document.currentScript.src
        }
        if (scriptDirectory.indexOf("blob:") !== 0) {
            scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
        } else {
            scriptDirectory = ""
        } {
            read_ = function shell_read(url) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.send(null);
                return xhr.responseText
            };
            if (ENVIRONMENT_IS_WORKER) {
                readBinary = function readBinary(url) {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, false);
                    xhr.responseType = "arraybuffer";
                    xhr.send(null);
                    return new Uint8Array(xhr.response)
                }
            }
            readAsync = function readAsync(url, onload, onerror) {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, true);
                xhr.responseType = "arraybuffer";
                xhr.onload = function xhr_onload() {
                    if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                        onload(xhr.response);
                        return
                    }
                    onerror()
                };
                xhr.onerror = onerror;
                xhr.send(null)
            }
        }
        setWindowTitle = function(title) {
            document.title = title
        }
    } else {}
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    for (key in moduleOverrides) {
        if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key]
        }
    }
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];

    function warnOnce(text) {
        if (!warnOnce.shown) warnOnce.shown = {};
        if (!warnOnce.shown[text]) {
            warnOnce.shown[text] = 1;
            err(text)
        }
    }
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime;
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
    if (typeof WebAssembly !== "object") {
        abort("no native wasm support detected")
    }
    var wasmMemory;
    var wasmTable = new WebAssembly.Table({
        "initial": 687,
        "maximum": 687 + 0,
        "element": "anyfunc"
    });
    var ABORT = false;
    var EXITSTATUS = 0;

    function assert(condition, text) {
        if (!condition) {
            abort("Assertion failed: " + text)
        }
    }
    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
        var endIdx = idx + maxBytesToRead;
        var endPtr = idx;
        while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
        if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
            return UTF8Decoder.decode(heap.subarray(idx, endPtr))
        } else {
            var str = "";
            while (idx < endPtr) {
                var u0 = heap[idx++];
                if (!(u0 & 128)) {
                    str += String.fromCharCode(u0);
                    continue
                }
                var u1 = heap[idx++] & 63;
                if ((u0 & 224) == 192) {
                    str += String.fromCharCode((u0 & 31) << 6 | u1);
                    continue
                }
                var u2 = heap[idx++] & 63;
                if ((u0 & 240) == 224) {
                    u0 = (u0 & 15) << 12 | u1 << 6 | u2
                } else {
                    u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63
                }
                if (u0 < 65536) {
                    str += String.fromCharCode(u0)
                } else {
                    var ch = u0 - 65536;
                    str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
                }
            }
        }
        return str
    }

    function UTF8ToString(ptr, maxBytesToRead) {
        return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
    }

    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
        if (!(maxBytesToWrite > 0)) return 0;
        var startIdx = outIdx;
        var endIdx = outIdx + maxBytesToWrite - 1;
        for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
                var u1 = str.charCodeAt(++i);
                u = 65536 + ((u & 1023) << 10) | u1 & 1023
            }
            if (u <= 127) {
                if (outIdx >= endIdx) break;
                heap[outIdx++] = u
            } else if (u <= 2047) {
                if (outIdx + 1 >= endIdx) break;
                heap[outIdx++] = 192 | u >> 6;
                heap[outIdx++] = 128 | u & 63
            } else if (u <= 65535) {
                if (outIdx + 2 >= endIdx) break;
                heap[outIdx++] = 224 | u >> 12;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63
            } else {
                if (outIdx + 3 >= endIdx) break;
                heap[outIdx++] = 240 | u >> 18;
                heap[outIdx++] = 128 | u >> 12 & 63;
                heap[outIdx++] = 128 | u >> 6 & 63;
                heap[outIdx++] = 128 | u & 63
            }
        }
        heap[outIdx] = 0;
        return outIdx - startIdx
    }

    function stringToUTF8(str, outPtr, maxBytesToWrite) {
        return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
    }

    function lengthBytesUTF8(str) {
        var len = 0;
        for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
            if (u <= 127) ++len;
            else if (u <= 2047) len += 2;
            else if (u <= 65535) len += 3;
            else len += 4
        }
        return len
    }

    function allocateUTF8(str) {
        var size = lengthBytesUTF8(str) + 1;
        var ret = _malloc(size);
        if (ret) stringToUTF8Array(str, HEAP8, ret, size);
        return ret
    }

    function writeArrayToMemory(array, buffer) {
        HEAP8.set(array, buffer)
    }

    function writeAsciiToMemory(str, buffer, dontAddNull) {
        for (var i = 0; i < str.length; ++i) {
            HEAP8[buffer++ >> 0] = str.charCodeAt(i)
        }
        if (!dontAddNull) HEAP8[buffer >> 0] = 0
    }
    var WASM_PAGE_SIZE = 65536;
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

    function updateGlobalBufferAndViews(buf) {
        buffer = buf;
        Module["HEAP8"] = HEAP8 = new Int8Array(buf);
        Module["HEAP16"] = HEAP16 = new Int16Array(buf);
        Module["HEAP32"] = HEAP32 = new Int32Array(buf);
        Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
        Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
        Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
        Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
        Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
    }
    var DYNAMIC_BASE = 5426464,
        DYNAMICTOP_PTR = 183424;
    var INITIAL_INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 67108864;
    if (Module["wasmMemory"]) {
        wasmMemory = Module["wasmMemory"]
    } else {
        wasmMemory = new WebAssembly.Memory({
            "initial": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE,
            "maximum": INITIAL_INITIAL_MEMORY / WASM_PAGE_SIZE
        })
    }
    if (wasmMemory) {
        buffer = wasmMemory.buffer
    }
    INITIAL_INITIAL_MEMORY = buffer.byteLength;
    updateGlobalBufferAndViews(buffer);
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

    function callRuntimeCallbacks(callbacks) {
        while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
                callback(Module);
                continue
            }
            var func = callback.func;
            if (typeof func === "number") {
                if (callback.arg === undefined) {
                    Module["dynCall_v"](func)
                } else {
                    Module["dynCall_vi"](func, callback.arg)
                }
            } else {
                func(callback.arg === undefined ? null : callback.arg)
            }
        }
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    var runtimeInitialized = false;
    var runtimeExited = false;

    function preRun() {
        if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
                addOnPreRun(Module["preRun"].shift())
            }
        }
        callRuntimeCallbacks(__ATPRERUN__)
    }

    function initRuntime() {
        runtimeInitialized = true;
        callRuntimeCallbacks(__ATINIT__)
    }

    function preMain() {
        callRuntimeCallbacks(__ATMAIN__)
    }

    function exitRuntime() {
        runtimeExited = true
    }

    function postRun() {
        if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
                addOnPostRun(Module["postRun"].shift())
            }
        }
        callRuntimeCallbacks(__ATPOSTRUN__)
    }

    function addOnPreRun(cb) {
        __ATPRERUN__.unshift(cb)
    }

    function addOnPostRun(cb) {
        __ATPOSTRUN__.unshift(cb)
    }
    var Math_ceil = Math.ceil;
    var Math_floor = Math.floor;
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;

    function getUniqueRunDependency(id) {
        return id
    }

    function addRunDependency(id) {
        runDependencies++;
        if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies)
        }
    }

    function removeRunDependency(id) {
        runDependencies--;
        if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies)
        }
        if (runDependencies == 0) {
            if (runDependencyWatcher !== null) {
                clearInterval(runDependencyWatcher);
                runDependencyWatcher = null
            }
            if (dependenciesFulfilled) {
                var callback = dependenciesFulfilled;
                dependenciesFulfilled = null;
                callback()
            }
        }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};

    function abort(what) {
        if (Module["onAbort"]) {
            Module["onAbort"](what)
        }
        what += "";
        err(what);
        ABORT = true;
        EXITSTATUS = 1;
        what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
        var e = new WebAssembly.RuntimeError(what);
        throw e
    }

    function hasPrefix(str, prefix) {
        return String.prototype.startsWith ? str.startsWith(prefix) : str.indexOf(prefix) === 0
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";

    function isDataURI(filename) {
        return hasPrefix(filename, dataURIPrefix)
    }
    var fileURIPrefix = "file://";

    function isFileURI(filename) {
        return hasPrefix(filename, fileURIPrefix)
    }
    var wasmBinaryFile = "build_6f874414d08a988a0525d9053773d7f0d407a670.wasm.wasm";
    if (!isDataURI(wasmBinaryFile)) {
        wasmBinaryFile = locateFile(wasmBinaryFile)
    }

    function getBinary() {
        try {
            if (wasmBinary) {
                return new Uint8Array(wasmBinary)
            }
            if (readBinary) {
                return readBinary(wasmBinaryFile)
            } else {
                throw "both async and sync fetching of the wasm failed"
            }
        } catch (err) {
            abort(err)
        }
    }

    function getBinaryPromise() {
        if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function" && !isFileURI(wasmBinaryFile)) {
            return fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function(response) {
                if (!response["ok"]) {
                    throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                }
                return response["arrayBuffer"]()
            }).catch(function() {
                return getBinary()
            })
        }
        return new Promise(function(resolve, reject) {
            resolve(getBinary())
        })
    }

    function createWasm() {
        var info = {
            "a": asmLibraryArg
        };

        function receiveInstance(instance, module) {
            var exports = instance.exports;
            Module["asm"] = exports;
            removeRunDependency("wasm-instantiate")
        }
        addRunDependency("wasm-instantiate");

        function receiveInstantiatedSource(output) {
            receiveInstance(output["instance"])
        }

        function instantiateArrayBuffer(receiver) {
            return getBinaryPromise().then(function(binary) {
                return WebAssembly.instantiate(binary, info)
            }).then(receiver, function(reason) {
                err("failed to asynchronously prepare wasm: " + reason);
                abort(reason)
            })
        }

        function instantiateAsync() {
            if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && !isFileURI(wasmBinaryFile) && typeof fetch === "function") {
                fetch(wasmBinaryFile, {
                    credentials: "same-origin"
                }).then(function(response) {
                    var result = WebAssembly.instantiateStreaming(response, info);
                    return result.then(receiveInstantiatedSource, function(reason) {
                        err("wasm streaming compile failed: " + reason);
                        err("falling back to ArrayBuffer instantiation");
                        return instantiateArrayBuffer(receiveInstantiatedSource)
                    })
                })
            } else {
                return instantiateArrayBuffer(receiveInstantiatedSource)
            }
        }
        if (Module["instantiateWasm"]) {
            try {
                var exports = Module["instantiateWasm"](info, receiveInstance);
                return exports
            } catch (e) {
                err("Module.instantiateWasm callback failed with error: " + e);
                return false
            }
        }
        instantiateAsync();
        return {}
    }
    var ASM_CONSTS = {
        1221: function($0, $1) {
            var elem = document.getElementById(UTF8ToString($0));
            if (elem == null) {
                debugger;
                return -1
            }
            var ctx = elem.getContext("2d", {
                "alpha": !!$1
            });
            for (var i = 0; i < cp5.contexts.length; ++i) {
                if (cp5.contexts[i] != null) continue;
                cp5.contexts[i] = ctx;
                return i
            }
            cp5.contexts.push(ctx);
            return cp5.contexts.length - 1
        },
        3473: function($0) {
            var img = new Image;
            img.isLoaded = false;
            img.onload = function() {
                img.isLoaded = true
            };
            img.src = UTF8ToString($0);
            for (var i = 0; i < cp5.images.length; ++i) {
                if (cp5.images[i] != null) continue;
                cp5.images[i] = img;
                return i
            }
            cp5.images.push(img);
            return cp5.images.length - 1
        },
        4211: function() {
            setTimeout(function() {
                window.location.reload(true)
            }, 100)
        },
        4279: function($0) {
            return !!window[UTF8ToString($0)]
        },
        4322: function() {
            return document.getElementsByName("google_osd_static_frame").length > 0
        },
        4404: function($0) {
            delete window["acu" + $0]
        },
        4435: function($0, $1, $2) {
            var hasLoaded = false;
            var f = new Image;
            f.onload = function() {
                if (!window["acu" + $2]) return;
                hasLoaded = true;
                window["acu" + $2][$1] = false
            };
            f.onerror = function() {
                if (!window["acu" + $2]) return;
                if (!hasLoaded) window["acu" + $2][$1] = true
            };
            f.src = window.location.protocol + UTF8ToString($0)
        },
        4754: function($0, $1) {
            return !window["acu" + $1] || !!window["acu" + $1][$0]
        },
        4817: function($0, $1) {
            return typeof window["acu" + $1][$0] == "undefined"
        },
        4874: function() {
            var v = window.location.href.split("?")[0];
            return allocateUTF8(v.slice(0, v.lastIndexOf("/")))
        },
        5595: function($0, $1) {
            var s0 = UTF8ToString($0);
            var s1 = UTF8ToString($1);
            var iframe = document.createElement("iframe");
            iframe.id = s0;
            iframe.name = "1.0.4;" + s1.length + ";" + s1;
            iframe.src = window.location.protocol + "//tpc.googlesyndication.com/safeframe/1-0-4/html/container.html#xpc=sf-gdn-exp-1&p=http%3A//diep.io";
            iframe.style.display = "none";
            document.body.appendChild(iframe)
        },
        5975: function() {
            setTimeout(function() {
                for (var i in window.localStorage) {
                    if (i.indexOf("acu$") == 0) {
                        delete window.localStorage[i]
                    }
                }
            }, 15e3)
        },
        6116: function($0, $1) {
            var str = window.localStorage[UTF8ToString($0)];
            if (!str) str = "";
            var arr = _malloc(str.length);
            HEAPU32[$1 >> 2] = str.length;
            for (var i = 0; i < str.length; ++i) {
                HEAPU8[arr + i] = str.charCodeAt(i)
            }
            return arr
        },
        6341: function($0) {
            delete window.localStorage[UTF8ToString($0)]
        },
        6391: function($0) {
            var f = document.getElementById(UTF8ToString($0));
            if (f && f.parentNode) f.parentNode.removeChild(f)
        },
        6497: function($0, $1, $2, $3) {
            var a = document.getElementById(UTF8ToString($0));
            if (!a) return true;
            var key = UTF8ToString($1);
            if (!a[key]) return true;
            return a[key][UTF8ToString($2)] == UTF8ToString($3)
        },
        6723: function($0) {
            var fs = document.querySelectorAll(UTF8ToString($0));
            if (fs.length == 0) return true;
            for (var i = 0; i < fs.length; ++i) {
                if (fs[i].src == "about:blank") return true
            }
            return false
        },
        6934: function($0) {
            if (!window["ga"]) return;
            window["ga"]("send", "event", "HasAdblock", $0 ? "Yes" : "No", {
                nonInteraction: true
            })
        },
        7056: function($0, $1, $2) {
            window.localStorage[UTF8ToString($0)] = String.fromCharCode.apply(null, HEAPU8.subarray($1, $1 + $2))
        },
        7304: function($0) {
            window["acu" + $0] = []
        },
        7574: function($0) {
            textInput.value = UTF8ToString($0)
        },
        7614: function($0) {
            cp5.contexts[$0] = null
        },
        7653: function($0) {
            cp5.images[$0] = null
        },
        7680: function($0) {
            return cp5.sockets[$0].readyState == 1
        },
        7724: function($0, $1, $2) {
            var w = cp5.sockets[$0];
            if (w.readyState != 1) return 0;
            try {
                w.send(HEAP8.subarray($1, $1 + $2))
            } catch (e) {
                return 0
            }
            return 1
        },
        8060: function($0, $1) {
            return $0 % $1
        },
        8083: function($0) {
            var w = cp5.sockets[$0];
            w.onopen = w.onclose = w.onmessage = w.onerror = function() {};
            for (var i = 0; i < w.events.length; ++i) _free(w.events[i][1]);
            w.events = null;
            try {
                w.close()
            } catch (e) {}
            cp5.sockets[$0] = null
        },
        8309: function() {
            if (!window.localStorage["playwireAB"]) window.localStorage["playwireAB"] = Math.random();
            var player = document.getElementById("player");
            if (player && player.parentNode) player.parentNode.style.display = "none";
            var f = function(playerName) {
                console.log("Bolt loaded " + playerName);
                if (playerName != "player") return;
                var Bolt = window["Bolt"];
                if (!Bolt) return;
                Bolt["on"](playerName, Bolt["BOLT_AD_STARTED"], function() {
                    console.log("Ad started")
                });
                Bolt["on"](playerName, Bolt["BOLT_AD_ERROR"], function() {
                    console.log("Ad error");
                    _videoads_done()
                });
                Bolt["on"](playerName, Bolt["BOLT_AD_COMPLETE"], function() {
                    console.log("Ad complete");
                    _videoads_done()
                })
            };
            window["onBoltLoaded"] = f
        },
        9015: function() {
            var player = document.getElementById("player");
            if (player) {
                player.innerHTML = "";
                player.style.display = "none";
                if (player.parentNode) player.parentNode.style.display = "none"
            }
        },
        9199: function() {
            return window.navigator.getGamepads && window.navigator.getGamepads()[0] != null && window.navigator.getGamepads()[0]["mapping"] == "standard"
        },
        9395: function() {
            if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullscreenElement) {
                var e = document.body;
                if (!e) return;
                if (e.requestFullscreen) e.requestFullscreen();
                else if (e.webkitRequestFullscreen) e.webkitRequestFullscreen();
                else if (e.mozRequestFullScreen) e.mozRequestFullScreen()
            } else if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            }
        },
        9980: function() {
            if (!haveFontsLoaded) haveFontsLoaded = FontDetect.isFontLoaded("Ubuntu");
            return haveFontsLoaded
        },
        10082: function($0, $1, $2, $3, $4, $5, $6) {
            cp5.contexts[$0].setTransform($1, $2, $3, $4, $5, $6)
        },
        10149: function($0, $1) {
            cp5.contexts[$0].font = ($1 * 2048 | 0) / 2048 + "px Ubuntu"
        },
        10218: function($0, $1) {
            return cp5.contexts[$0].measureText(UTF8ToString($1)).width
        },
        10286: function($0, $1, $2) {
            var canvas = cp5.contexts[$0].canvas;
            HEAP32[$1 >> 2] = canvas.width;
            HEAP32[$2 >> 2] = canvas.height
        },
        10397: function($0, $1, $2) {
            var canvas = cp5.contexts[$0].canvas;
            canvas.width = $1;
            canvas.height = $2
        },
        10482: function($0, $1) {
            cp5.contexts[$0].globalAlpha = $1
        },
        10521: function($0, $1) {
            cp5.contexts[$0].lineWidth = $1
        },
        10558: function($0, $1, $2, $3) {
            cp5.contexts[$0].strokeStyle = "rgb(" + $1 + "," + $2 + "," + $3 + ")"
        },
        10639: function($0, $1, $2, $3) {
            cp5.contexts[$0].fillStyle = "rgb(" + $1 + "," + $2 + "," + $3 + ")"
        },
        10713: function($0) {
            cp5.contexts[$0].save()
        },
        10742: function($0, $1) {
            cp5.contexts[$0].fillText(UTF8ToString($1), 0, 0)
        },
        10797: function($0) {
            cp5.contexts[$0].restore()
        },
        10829: function($0, $1) {
            cp5.contexts[$0].strokeText(UTF8ToString($1), 0, 0)
        },
        10886: function($0) {
            cp5.contexts[$0].textBaseline = "top"
        },
        10929: function($0) {
            cp5.contexts[$0].textBaseline = "hanging"
        },
        10976: function($0) {
            cp5.contexts[$0].textBaseline = "middle"
        },
        11022: function($0) {
            cp5.contexts[$0].textBaseline = "alphabetic"
        },
        11072: function($0) {
            cp5.contexts[$0].textBaseline = "ideographic"
        },
        11123: function($0) {
            cp5.contexts[$0].textBaseline = "bottom"
        },
        11169: function($0) {
            cp5.contexts[$0].setTransform(1, 0, 0, 1, 0, 0)
        },
        11222: function($0) {
            var ctx = cp5.contexts[$0];
            var canvas = ctx.canvas;
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        },
        11329: function() {
            var ctx = document.createElement("canvas").getContext("2d");
            for (var i = 0; i < cp5.contexts.length; ++i) {
                if (cp5.contexts[i] != null) continue;
                cp5.contexts[i] = ctx;
                return i
            }
            cp5.contexts.push(ctx);
            return cp5.contexts.length - 1
        },
        11569: function($0) {
            cp5.contexts[$0].lineCap = "butt"
        },
        11608: function($0) {
            cp5.contexts[$0].lineCap = "round"
        },
        11648: function($0) {
            cp5.contexts[$0].lineCap = "square"
        },
        11689: function($0) {
            cp5.contexts[$0].lineJoin = "round"
        },
        11730: function($0) {
            cp5.contexts[$0].lineJoin = "bevel"
        },
        11771: function($0) {
            cp5.contexts[$0].lineJoin = "miter"
        },
        11812: function($0, $1) {
            cp5.contexts[$0].miterLimit = $1
        },
        11850: function($0, $1) {
            cp5.contexts[$0].drawImage(cp5.contexts[$1].canvas, 0, 0)
        },
        11975: function($0) {
            if (window["setLoadingStatus"]) window["setLoadingStatus"](UTF8ToString($0))
        },
        12056: function($0) {
            var ws = new WebSocket(UTF8ToString($0));
            ws.binaryType = "arraybuffer";
            ws.events = [];
            ws.onopen = function() {
                ws.events.push([2, 0, 0]);
                _cp5_check_ws()
            };
            ws.onerror = function() {
                ws.events.push([3, 0, 0]);
                _cp5_check_ws()
            };
            ws.onclose = function() {
                ws.events.push([4, 0, 0]);
                _cp5_check_ws()
            };
            ws.onmessage = function(e) {
                var view = new Uint8Array(e.data);
                var ptr = _malloc(view.length);
                writeArrayToMemory(view, ptr);
                ws.events.push([1, ptr, view.length]);
                _cp5_check_ws()
            };
            for (var i = 0; i < cp5.sockets.length; ++i) {
                if (cp5.sockets[i] != null) continue;
                cp5.sockets[i] = ws;
                return i
            }
            cp5.sockets.push(ws);
            return cp5.sockets.length - 1
        },
        12717: function() {
            return window.location.protocol == "https:"
        },
        19984: function($0) {
            return typeof process != UTF8ToString($0)
        },
        20041: function($0) {
            return allocateUTF8(UTF8ToString($0))
        },
        20092: function($0) {
            window.alert(UTF8ToString($0))
        },
        20412: function($0, $1) {
            cp5.contexts[$0].globalAlpha *= $1
        },
        20452: function() {
            var a = document.getElementById("a");
            var aa = document.querySelectorAll(".aa");
            if (a) a.style.display = "none";
            for (var i = 0; i < aa.length; ++i) aa[i].style.display = "none";
            if (!window["googletag"]) return;
            if (!window["googletag"]["cmd"]) return;
            window["googletag"]["cmd"].push(function() {
                if (!window["googletag"]["pubads"]) return;
                if (!window["googletag"]["pubads"]().clear) return;
                window["googletag"]["pubads"]().clear()
            })
        },
        20890: function($0, $1) {
            var a = document.getElementById("a");
            var aa = document.getElementById(UTF8ToString($0));
            if (a) a.style.display = "block";
            if (aa) aa.style.display = "block";
            if (!window["googletag"]) return;
            if (!window["googletag"]["cmd"]) return;
            window["googletag"]["cmd"].push(function() {
                if (!window["googletag"]["pubads"]) return;
                if (!window["googletag"]["pubads"]()["refresh"]) return;
                window["googletag"]["pubads"]()["refresh"](window[UTF8ToString($1)])
            })
        },
        21365: function() {
            var Bolt = window["Bolt"];
            if (!Bolt) return false;
            var player = document.getElementById("player");
            if (!player) return false;
            player.style.display = "block";
            if (player.parentNode) player.parentNode.style.display = "block";
            Bolt["renderPlayer"]("player");
            return true
        },
        21636: function() {
            var a = document.getElementById("a");
            if (!a) return;
            a.style.display = "block"
        },
        21720: function() {
            var a = document.getElementById("a");
            if (!a) return;
            a.style.display = "none"
        },
        21803: function($0) {
            cp5.contexts[$0].fillRect(0, 0, 1, 1)
        },
        21854: function($0) {
            cp5.contexts[$0].beginPath()
        },
        21888: function($0) {
            cp5.contexts[$0].clip()
        },
        21917: function($0) {
            cp5.contexts[$0].fill()
        },
        21946: function($0, $1, $2, $3, $4) {
            cp5.contexts[$0].setTransform($1, $2, $3, $4, 0, 0)
        },
        22009: function($0) {
            cp5.contexts[$0].stroke()
        },
        22040: function($0) {
            cp5.contexts[$0].rect(0, 0, 1, 1)
        },
        22079: function() {
            return allocateUTF8(textInput.value)
        },
        22460: function($0, $1, $2) {
            cp5.contexts[$0].moveTo($1, $2)
        },
        22501: function($0, $1, $2) {
            cp5.contexts[$0].lineTo($1, $2)
        },
        22538: function($0) {
            cp5.contexts[$0].closePath()
        },
        22608: function($0, $1, $2, $3) {
            cp5.contexts[$0].arc(0, 0, 1, $1, $2, $3)
        },
        23530: function($0) {
            copyToKeyboard(UTF8ToString($0))
        },
        23753: function($0) {
            window.location = UTF8ToString($0)
        },
        24207: function($0, $1) {
            var img = cp5.images[$1];
            if (!img.isLoaded) return;
            if (img.width == 0 || img.height == 0) return;
            cp5.contexts[$0].drawImage(img, 0, 0, img.width, img.height, 0, 0, 1, 1)
        },
        24676: function($0, $1, $2, $3) {
            var i = cp5.images[$0];
            HEAPU8[$1 >> 0] = i.isLoaded | 0;
            HEAP32[$2 >> 2] = i.width;
            HEAP32[$3 >> 2] = i.height
        },
        25044: function($0) {
            cp5.contexts[$0].strokeRect(0, 0, 1, 1)
        },
        25089: function($0, $1) {
            var canvas = cp5.contexts[$1].canvas;
            cp5.contexts[$0].drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 1, 1)
        },
        25431: function() {
            return !!CanvasRenderingContext2D.prototype.createPattern
        },
        25494: function($0, $1) {
            var pattern = cp5.contexts[$0].createPattern(cp5.contexts[$1].canvas, null);
            for (var i = 0; i < cp5.patterns.length; ++i) {
                if (cp5.patterns[i] == null) {
                    cp5.patterns[i] = pattern;
                    return i
                }
            }
            cp5.patterns.push(pattern);
            return cp5.patterns.length - 1
        },
        25780: function($0, $1, $2) {
            var d = cp5.contexts[$0].getImageData($1, $2, 1, 1);
            return d.data[0] << 16 | d.data[1] << 8 | d.data[2]
        },
        25894: function($0, $1, $2, $3, $4, $5) {
            cp5.contexts[$0].drawImage(cp5.contexts[$1].canvas, $2, $3, $4, $5, 0, 0, 1, 1)
        },
        25986: function($0, $1, $2, $3) {
            cp5.contexts[$0].fillStyle = cp5.patterns[$1];
            cp5.contexts[$0].fillRect(0, 0, $2, $3)
        },
        26083: function($0) {
            cp5.patterns[$0] = null
        },
        26205: function() {
            return curScript != null ? allocateUTF8(curScript.src) : 0
        },
        26269: function() {
            return curScript != null ? allocateUTF8(curScript.innerHTML) : 0
        },
        26354: function($0) {
            return document.querySelector(UTF8ToString($0)) != null
        },
        26814: function() {
            return Function.prototype.toString != originalFunctionToString
        },
        26882: function($0) {
            var r = UTF8ToString($0);
            return document.getElementById("canvas")[r] !== document.body[r]
        },
        26989: function($0) {
            return document.body[UTF8ToString($0)] !== void 0
        },
        27044: function($0) {
            return !!document.body[UTF8ToString($0)]
        },
        27090: function($0, $1) {
            var f = UTF8ToString($0);
            var d = document.createElement("div");
            if (!d[f]) return false;
            return d[f]() == document.body[UTF8ToString($1)]
        },
        27250: function($0, $1) {
            var s0 = UTF8ToString($0);
            var s1 = UTF8ToString($1);
            var t = window[s0][s1];
            window[s0][s1] = function() {
                return "abcdef"
            };
            var res = window[s0][s1].toString().indexOf("abcdef") == -1;
            window[s0][s1] = t;
            return res
        },
        27499: function($0) {
            return document.getElementById(UTF8ToString($0)) != null
        },
        27580: function($0) {
            return document.getElementsByClassName(UTF8ToString($0)).length > 0
        },
        27715: function($0) {
            return typeof window[UTF8ToString($0)] != "undefined"
        },
        27830: function() {
            return !!window.WebSocket.prototype["_send"]
        },
        27880: function() {
            return allocateUTF8(document.body.innerHTML)
        },
        27939: function() {
            return function() {}.prototype.constructor.toString.apply(document.querySelector).indexOf("return") != -1
        },
        28051: function() {
            return document.body.parentElement != document.documentElement
        },
        28119: function() {
            return allocateUTF8(window.navigator.userAgent)
        },
        28180: function($0, $1, $2) {
            var s0 = UTF8ToString($0);
            return window[UTF8ToString($2)].prototype[s0][UTF8ToString($1)] != s0
        },
        28427: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(document.querySelector))
        },
        28529: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(window.alert))
        },
        28621: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.fillText))
        },
        28744: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.strokeRect))
        },
        28869: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.strokeText))
        },
        28994: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.scale))
        },
        29114: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.translate))
        },
        29238: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.fillRect))
        },
        29361: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.rotate))
        },
        29482: function() {
            return allocateUTF8(function() {}.prototype.constructor.toString.apply(CanvasRenderingContext2D.prototype.getImageData))
        },
        29630: function() {
            return "google_ad_client" in window && typeof window.google_ad_client == "undefined"
        },
        29852: function($0) {
            var str = UTF8ToString($0);
            setTimeout(reload(str), 1)
        },
        29912: function() {
            alert("Invalid party ID")
        },
        29943: function() {
            window.location.hash = ""
        },
        29974: function($0, $1) {
            if (window.m28 && window.m28.pow) {
                window.m28.pow.solve(UTF8ToString($1), $0, function(result) {
                    var ptr = allocateUTF8(result);
                    _game_pow_solve_result(ptr);
                    _free(ptr)
                })
            }
        },
        30281: function($0) {
            var axes = window.navigator.getGamepads()[0]["axes"];
            if ($0 >= axes.length) return 0;
            return axes[$0]
        },
        30390: function($0) {
            var buttons = window.navigator.getGamepads()[0]["buttons"];
            if ($0 >= buttons.length) return false;
            return buttons[$0]["pressed"]
        },
        30524: function($0, $1, $2) {
            var w = cp5.sockets[$0];
            if (w.events.length == 0) return 0;
            var e = w.events.shift();
            HEAPU32[$1 >> 2] = e[1];
            HEAP32[$2 >> 2] = e[2];
            return e[0]
        },
        30725: function() {
            document.getElementById("canvas").style.cursor = "default"
        },
        30789: function() {
            document.getElementById("canvas").style.cursor = "pointer"
        },
        30853: function() {
            document.getElementById("canvas").style.cursor = "text"
        },
        30914: function($0, $1, $2, $3, $4) {
            window["setTyping"](true);
            var padding = 5;
            textInputContainer.style.display = "block";
            textInputContainer.style.position = "absolute";
            textInputContainer.style.left = window["unscale"]($0) + "px";
            textInputContainer.style.top = window["unscale"]($1) + "px";
            textInput.style.width = window["unscale"]($2 * .96) + "px";
            textInput.style.height = window["unscale"]($3) + "px";
            textInput.style.lineHeight = window["unscale"]($3 * .9) + "px";
            textInput.style.fontSize = window["unscale"]($3 * .9) + "px";
            textInput.style.paddingLeft = padding + "px";
            textInput.style.paddingRight = padding + "px";
            textInput.disabled = !$4;
            textInput.focus()
        },
        31565: function() {
            window["setTyping"](false);
            textInput.blur();
            textInput.value = "";
            textInputContainer.style.display = "none"
        },
        31680: function() {
            var c = document.getElementById("canvas");
            if (document.activeElement && document.activeElement != c) document.activeElement.blur();
            c.focus()
        },
        31828: function() {
            return allocateUTF8(window.location.hash)
        },
        31920: function($0, $1) {
            var requestID = $0;
            window["m28n"]["findServerPreference"](UTF8ToString($1), function(err, servers) {
                if (err || servers.length == 0) {
                    _cp6_m28n_reply(requestID, 0, 0, 0)
                } else {
                    var server = servers[0];
                    var id = allocateUTF8(server["id"]);
                    var ipv4 = allocateUTF8(server["ipv4"]);
                    var ipv6 = allocateUTF8(server["ipv6"]);
                    _cp6_m28n_reply(requestID, id, ipv4, ipv6);
                    _free(id);
                    _free(ipv4);
                    _free(ipv6)
                }
            })
        },
        32392: function($0, $1) {
            var requestID = $0;
            window["m28n"]["findServerByID"](UTF8ToString($1), function(err, server) {
                if (err || server == null) {
                    _cp6_m28n_reply(requestID, 0, 0, 0)
                } else {
                    var id = allocateUTF8(server["id"]);
                    var ipv4 = allocateUTF8(server["ipv4"]);
                    var ipv6 = allocateUTF8(server["ipv6"]);
                    _cp6_m28n_reply(requestID, id, ipv4, ipv6);
                    _free(id);
                    _free(ipv4);
                    _free(ipv6)
                }
            })
        },
        32767: function() {
            setTimeout(reload, 1)
        },
        32794: function() {
            return allocateUTF8(window.location.search)
        },
        32843: function() {
            return allocateUTF8(window.document.referrer)
        },
        33039: function() {
            return window.top.location != window.location
        },
        33123: function() {
            window.top.location = "http://diep.io/"
        },
        33176: function() {
            window.top.location = "https://play.google.com/store/apps/details?id=com.miniclip.diep.io"
        },
        33284: function() {
            window.top.location = "https://itunes.apple.com/app/diep.io/id1114751883?mt=8&at=1l3vajp"
        },
        33379: function() {
            return typeof window.navigator.orientation != "undefined"
        },
        33442: function() {
            return window.navigator.standalone
        },
        33482: function() {
            return "onorientationchange" in window
        }
    };

    function _emscripten_asm_const_dii(code, sigPtr, argbuf) {
        var args = readAsmConstArgs(sigPtr, argbuf);
        return ASM_CONSTS[code].apply(null, args)
    }

    function _emscripten_asm_const_iii(code, sigPtr, argbuf) {
        var args = readAsmConstArgs(sigPtr, argbuf);
        return ASM_CONSTS[code].apply(null, args)
    }
    __ATINIT__.push({
        func: function() {
            ___wasm_call_ctors()
        }
    });

    function ___assert_fail(condition, filename, line, func) {
        abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
    }

    function setErrNo(value) {
        HEAP32[___errno_location() >> 2] = value;
        return value
    }

    function ___map_file(pathname, size) {
        setErrNo(63);
        return -1
    }
    var PATH = {
        splitPath: function(filename) {
            var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            return splitPathRe.exec(filename).slice(1)
        },
        normalizeArray: function(parts, allowAboveRoot) {
            var up = 0;
            for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                    parts.splice(i, 1)
                } else if (last === "..") {
                    parts.splice(i, 1);
                    up++
                } else if (up) {
                    parts.splice(i, 1);
                    up--
                }
            }
            if (allowAboveRoot) {
                for (; up; up--) {
                    parts.unshift("..")
                }
            }
            return parts
        },
        normalize: function(path) {
            var isAbsolute = path.charAt(0) === "/",
                trailingSlash = path.substr(-1) === "/";
            path = PATH.normalizeArray(path.split("/").filter(function(p) {
                return !!p
            }), !isAbsolute).join("/");
            if (!path && !isAbsolute) {
                path = "."
            }
            if (path && trailingSlash) {
                path += "/"
            }
            return (isAbsolute ? "/" : "") + path
        },
        dirname: function(path) {
            var result = PATH.splitPath(path),
                root = result[0],
                dir = result[1];
            if (!root && !dir) {
                return "."
            }
            if (dir) {
                dir = dir.substr(0, dir.length - 1)
            }
            return root + dir
        },
        basename: function(path) {
            if (path === "/") return "/";
            var lastSlash = path.lastIndexOf("/");
            if (lastSlash === -1) return path;
            return path.substr(lastSlash + 1)
        },
        extname: function(path) {
            return PATH.splitPath(path)[3]
        },
        join: function() {
            var paths = Array.prototype.slice.call(arguments, 0);
            return PATH.normalize(paths.join("/"))
        },
        join2: function(l, r) {
            return PATH.normalize(l + "/" + r)
        }
    };
    var SYSCALLS = {
        mappings: {},
        buffers: [null, [],
            []
        ],
        printChar: function(stream, curr) {
            var buffer = SYSCALLS.buffers[stream];
            if (curr === 0 || curr === 10) {
                (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
                buffer.length = 0
            } else {
                buffer.push(curr)
            }
        },
        varargs: undefined,
        get: function() {
            SYSCALLS.varargs += 4;
            var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
            return ret
        },
        getStr: function(ptr) {
            var ret = UTF8ToString(ptr);
            return ret
        },
        get64: function(low, high) {
            return low
        }
    };

    function syscallMunmap(addr, len) {
        if ((addr | 0) === -1 || len === 0) {
            return -28
        }
        var info = SYSCALLS.mappings[addr];
        if (!info) return 0;
        if (len === info.len) {
            SYSCALLS.mappings[addr] = null;
            if (info.allocated) {
                _free(info.malloc)
            }
        }
        return 0
    }

    function ___sys_munmap(addr, len) {
        return syscallMunmap(addr, len)
    }

    function _abort() {
        abort()
    }

    function _emscripten_set_main_loop_timing(mode, value) {
        Browser.mainLoop.timingMode = mode;
        Browser.mainLoop.timingValue = value;
        if (!Browser.mainLoop.func) {
            return 1
        }
        if (mode == 0) {
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
                var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
                setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
            };
            Browser.mainLoop.method = "timeout"
        } else if (mode == 1) {
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
                Browser.requestAnimationFrame(Browser.mainLoop.runner)
            };
            Browser.mainLoop.method = "rAF"
        } else if (mode == 2) {
            if (typeof setImmediate === "undefined") {
                var setImmediates = [];
                var emscriptenMainLoopMessageId = "setimmediate";
                var Browser_setImmediate_messageHandler = function(event) {
                    if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                        event.stopPropagation();
                        setImmediates.shift()()
                    }
                };
                addEventListener("message", Browser_setImmediate_messageHandler, true);
                setImmediate = function Browser_emulated_setImmediate(func) {
                    setImmediates.push(func);
                    if (ENVIRONMENT_IS_WORKER) {
                        if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                        Module["setImmediates"].push(func);
                        postMessage({
                            target: emscriptenMainLoopMessageId
                        })
                    } else postMessage(emscriptenMainLoopMessageId, "*")
                }
            }
            Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
                setImmediate(Browser.mainLoop.runner)
            };
            Browser.mainLoop.method = "immediate"
        }
        return 0
    }
    var _emscripten_get_now;
    if (ENVIRONMENT_IS_NODE) {
        _emscripten_get_now = function() {
            var t = process["hrtime"]();
            return t[0] * 1e3 + t[1] / 1e6
        }
    } else if (typeof dateNow !== "undefined") {
        _emscripten_get_now = dateNow
    } else _emscripten_get_now = function() {
        return performance.now()
    };

    function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
        noExitRuntime = true;
        assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
        Browser.mainLoop.func = func;
        Browser.mainLoop.arg = arg;
        var browserIterationFunc;
        if (typeof arg !== "undefined") {
            browserIterationFunc = function() {
                Module["dynCall_vi"](func, arg)
            }
        } else {
            browserIterationFunc = function() {
                Module["dynCall_v"](func)
            }
        }
        var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
        Browser.mainLoop.runner = function Browser_mainLoop_runner() {
            if (ABORT) return;
            if (Browser.mainLoop.queue.length > 0) {
                var start = Date.now();
                var blocker = Browser.mainLoop.queue.shift();
                blocker.func(blocker.arg);
                if (Browser.mainLoop.remainingBlockers) {
                    var remaining = Browser.mainLoop.remainingBlockers;
                    var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                    if (blocker.counted) {
                        Browser.mainLoop.remainingBlockers = next
                    } else {
                        next = next + .5;
                        Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                    }
                }
                console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
                Browser.mainLoop.updateStatus();
                if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
                setTimeout(Browser.mainLoop.runner, 0);
                return
            }
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
            if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
                Browser.mainLoop.scheduler();
                return
            } else if (Browser.mainLoop.timingMode == 0) {
                Browser.mainLoop.tickStartTime = _emscripten_get_now()
            }
            Browser.mainLoop.runIter(browserIterationFunc);
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
            Browser.mainLoop.scheduler()
        };
        if (!noSetTiming) {
            if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
            else _emscripten_set_main_loop_timing(1, 1);
            Browser.mainLoop.scheduler()
        }
        if (simulateInfiniteLoop) {
            throw "unwind"
        }
    }
    var Browser = {
        mainLoop: {
            scheduler: null,
            method: "",
            currentlyRunningMainloop: 0,
            func: null,
            arg: 0,
            timingMode: 0,
            timingValue: 0,
            currentFrameNumber: 0,
            queue: [],
            pause: function() {
                Browser.mainLoop.scheduler = null;
                Browser.mainLoop.currentlyRunningMainloop++
            },
            resume: function() {
                Browser.mainLoop.currentlyRunningMainloop++;
                var timingMode = Browser.mainLoop.timingMode;
                var timingValue = Browser.mainLoop.timingValue;
                var func = Browser.mainLoop.func;
                Browser.mainLoop.func = null;
                _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
                _emscripten_set_main_loop_timing(timingMode, timingValue);
                Browser.mainLoop.scheduler()
            },
            updateStatus: function() {
                if (Module["setStatus"]) {
                    var message = Module["statusMessage"] || "Please wait...";
                    var remaining = Browser.mainLoop.remainingBlockers;
                    var expected = Browser.mainLoop.expectedBlockers;
                    if (remaining) {
                        if (remaining < expected) {
                            Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                        } else {
                            Module["setStatus"](message)
                        }
                    } else {
                        Module["setStatus"]("")
                    }
                }
            },
            runIter: function(func) {
                if (ABORT) return;
                if (Module["preMainLoop"]) {
                    var preRet = Module["preMainLoop"]();
                    if (preRet === false) {
                        return
                    }
                }
                try {
                    func()
                } catch (e) {
                    if (e instanceof ExitStatus) {
                        return
                    } else {
                        if (e && typeof e === "object" && e.stack) err("exception thrown: " + [e, e.stack]);
                        throw e
                    }
                }
                if (Module["postMainLoop"]) Module["postMainLoop"]()
            }
        },
        isFullscreen: false,
        pointerLock: false,
        moduleContextCreatedCallbacks: [],
        workers: [],
        init: function() {
            if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
            if (Browser.initted) return;
            Browser.initted = true;
            try {
                new Blob;
                Browser.hasBlobConstructor = true
            } catch (e) {
                Browser.hasBlobConstructor = false;
                console.log("warning: no blob constructor, cannot create blobs with mimetypes")
            }
            Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
            Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
            if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
                console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
                Module.noImageDecoding = true
            }
            var imagePlugin = {};
            imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
                return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
            };
            imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
                var b = null;
                if (Browser.hasBlobConstructor) {
                    try {
                        b = new Blob([byteArray], {
                            type: Browser.getMimetype(name)
                        });
                        if (b.size !== byteArray.length) {
                            b = new Blob([new Uint8Array(byteArray).buffer], {
                                type: Browser.getMimetype(name)
                            })
                        }
                    } catch (e) {
                        warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                    }
                }
                if (!b) {
                    var bb = new Browser.BlobBuilder;
                    bb.append(new Uint8Array(byteArray).buffer);
                    b = bb.getBlob()
                }
                var url = Browser.URLObject.createObjectURL(b);
                var img = new Image;
                img.onload = function img_onload() {
                    assert(img.complete, "Image " + name + " could not be decoded");
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    Module["preloadedImages"][name] = canvas;
                    Browser.URLObject.revokeObjectURL(url);
                    if (onload) onload(byteArray)
                };
                img.onerror = function img_onerror(event) {
                    console.log("Image " + url + " could not be decoded");
                    if (onerror) onerror()
                };
                img.src = url
            };
            Module["preloadPlugins"].push(imagePlugin);
            var audioPlugin = {};
            audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
                return !Module.noAudioDecoding && name.substr(-4) in {
                    ".ogg": 1,
                    ".wav": 1,
                    ".mp3": 1
                }
            };
            audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
                var done = false;

                function finish(audio) {
                    if (done) return;
                    done = true;
                    Module["preloadedAudios"][name] = audio;
                    if (onload) onload(byteArray)
                }

                function fail() {
                    if (done) return;
                    done = true;
                    Module["preloadedAudios"][name] = new Audio;
                    if (onerror) onerror()
                }
                if (Browser.hasBlobConstructor) {
                    try {
                        var b = new Blob([byteArray], {
                            type: Browser.getMimetype(name)
                        })
                    } catch (e) {
                        return fail()
                    }
                    var url = Browser.URLObject.createObjectURL(b);
                    var audio = new Audio;
                    audio.addEventListener("canplaythrough", function() {
                        finish(audio)
                    }, false);
                    audio.onerror = function audio_onerror(event) {
                        if (done) return;
                        console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

                        function encode64(data) {
                            var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                            var PAD = "=";
                            var ret = "";
                            var leftchar = 0;
                            var leftbits = 0;
                            for (var i = 0; i < data.length; i++) {
                                leftchar = leftchar << 8 | data[i];
                                leftbits += 8;
                                while (leftbits >= 6) {
                                    var curr = leftchar >> leftbits - 6 & 63;
                                    leftbits -= 6;
                                    ret += BASE[curr]
                                }
                            }
                            if (leftbits == 2) {
                                ret += BASE[(leftchar & 3) << 4];
                                ret += PAD + PAD
                            } else if (leftbits == 4) {
                                ret += BASE[(leftchar & 15) << 2];
                                ret += PAD
                            }
                            return ret
                        }
                        audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                        finish(audio)
                    };
                    audio.src = url;
                    Browser.safeSetTimeout(function() {
                        finish(audio)
                    }, 1e4)
                } else {
                    return fail()
                }
            };
            Module["preloadPlugins"].push(audioPlugin);

            function pointerLockChange() {
                Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
            }
            var canvas = Module["canvas"];
            if (canvas) {
                canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || function() {};
                canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function() {};
                canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
                document.addEventListener("pointerlockchange", pointerLockChange, false);
                document.addEventListener("mozpointerlockchange", pointerLockChange, false);
                document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
                document.addEventListener("mspointerlockchange", pointerLockChange, false);
                if (Module["elementPointerLock"]) {
                    canvas.addEventListener("click", function(ev) {
                        if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                            Module["canvas"].requestPointerLock();
                            ev.preventDefault()
                        }
                    }, false)
                }
            }
        },
        createContext: function(canvas, useWebGL, setInModule, webGLContextAttributes) {
            if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
            var ctx;
            var contextHandle;
            if (useWebGL) {
                var contextAttributes = {
                    antialias: false,
                    alpha: false,
                    majorVersion: 1
                };
                if (webGLContextAttributes) {
                    for (var attribute in webGLContextAttributes) {
                        contextAttributes[attribute] = webGLContextAttributes[attribute]
                    }
                }
                if (typeof GL !== "undefined") {
                    contextHandle = GL.createContext(canvas, contextAttributes);
                    if (contextHandle) {
                        ctx = GL.getContext(contextHandle).GLctx
                    }
                }
            } else {
                ctx = canvas.getContext("2d")
            }
            if (!ctx) return null;
            if (setInModule) {
                if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
                Module.ctx = ctx;
                if (useWebGL) GL.makeContextCurrent(contextHandle);
                Module.useWebGL = useWebGL;
                Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
                    callback()
                });
                Browser.init()
            }
            return ctx
        },
        destroyContext: function(canvas, useWebGL, setInModule) {},
        fullscreenHandlersInstalled: false,
        lockPointer: undefined,
        resizeCanvas: undefined,
        requestFullscreen: function(lockPointer, resizeCanvas) {
            Browser.lockPointer = lockPointer;
            Browser.resizeCanvas = resizeCanvas;
            if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
            if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
            var canvas = Module["canvas"];

            function fullscreenChange() {
                Browser.isFullscreen = false;
                var canvasContainer = canvas.parentNode;
                if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                    canvas.exitFullscreen = Browser.exitFullscreen;
                    if (Browser.lockPointer) canvas.requestPointerLock();
                    Browser.isFullscreen = true;
                    if (Browser.resizeCanvas) {
                        Browser.setFullscreenCanvasSize()
                    } else {
                        Browser.updateCanvasDimensions(canvas)
                    }
                } else {
                    canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                    canvasContainer.parentNode.removeChild(canvasContainer);
                    if (Browser.resizeCanvas) {
                        Browser.setWindowedCanvasSize()
                    } else {
                        Browser.updateCanvasDimensions(canvas)
                    }
                }
                if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
                if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
            }
            if (!Browser.fullscreenHandlersInstalled) {
                Browser.fullscreenHandlersInstalled = true;
                document.addEventListener("fullscreenchange", fullscreenChange, false);
                document.addEventListener("mozfullscreenchange", fullscreenChange, false);
                document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
                document.addEventListener("MSFullscreenChange", fullscreenChange, false)
            }
            var canvasContainer = document.createElement("div");
            canvas.parentNode.insertBefore(canvasContainer, canvas);
            canvasContainer.appendChild(canvas);
            canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? function() {
                canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
            } : null) || (canvasContainer["webkitRequestFullScreen"] ? function() {
                canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
            } : null);
            canvasContainer.requestFullscreen()
        },
        exitFullscreen: function() {
            if (!Browser.isFullscreen) {
                return false
            }
            var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function() {};
            CFS.apply(document, []);
            return true
        },
        nextRAF: 0,
        fakeRequestAnimationFrame: function(func) {
            var now = Date.now();
            if (Browser.nextRAF === 0) {
                Browser.nextRAF = now + 1e3 / 60
            } else {
                while (now + 2 >= Browser.nextRAF) {
                    Browser.nextRAF += 1e3 / 60
                }
            }
            var delay = Math.max(Browser.nextRAF - now, 0);
            setTimeout(func, delay)
        },
        requestAnimationFrame: function(func) {
            if (typeof requestAnimationFrame === "function") {
                requestAnimationFrame(func);
                return
            }
            var RAF = Browser.fakeRequestAnimationFrame;
            RAF(func)
        },
        safeCallback: function(func) {
            return function() {
                if (!ABORT) return func.apply(null, arguments)
            }
        },
        allowAsyncCallbacks: true,
        queuedAsyncCallbacks: [],
        pauseAsyncCallbacks: function() {
            Browser.allowAsyncCallbacks = false
        },
        resumeAsyncCallbacks: function() {
            Browser.allowAsyncCallbacks = true;
            if (Browser.queuedAsyncCallbacks.length > 0) {
                var callbacks = Browser.queuedAsyncCallbacks;
                Browser.queuedAsyncCallbacks = [];
                callbacks.forEach(function(func) {
                    func()
                })
            }
        },
        safeRequestAnimationFrame: function(func) {
            return Browser.requestAnimationFrame(function() {
                if (ABORT) return;
                if (Browser.allowAsyncCallbacks) {
                    func()
                } else {
                    Browser.queuedAsyncCallbacks.push(func)
                }
            })
        },
        safeSetTimeout: function(func, timeout) {
            noExitRuntime = true;
            return setTimeout(function() {
                if (ABORT) return;
                if (Browser.allowAsyncCallbacks) {
                    func()
                } else {
                    Browser.queuedAsyncCallbacks.push(func)
                }
            }, timeout)
        },
        safeSetInterval: function(func, timeout) {
            noExitRuntime = true;
            return setInterval(function() {
                if (ABORT) return;
                if (Browser.allowAsyncCallbacks) {
                    func()
                }
            }, timeout)
        },
        getMimetype: function(name) {
            return {
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "png": "image/png",
                "bmp": "image/bmp",
                "ogg": "audio/ogg",
                "wav": "audio/wav",
                "mp3": "audio/mpeg"
            } [name.substr(name.lastIndexOf(".") + 1)]
        },
        getUserMedia: function(func) {
            if (!window.getUserMedia) {
                window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
            }
            window.getUserMedia(func)
        },
        getMovementX: function(event) {
            return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
        },
        getMovementY: function(event) {
            return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
        },
        getMouseWheelDelta: function(event) {
            var delta = 0;
            switch (event.type) {
                case "DOMMouseScroll":
                    delta = event.detail / 3;
                    break;
                case "mousewheel":
                    delta = event.wheelDelta / 120;
                    break;
                case "wheel":
                    delta = event.deltaY;
                    switch (event.deltaMode) {
                        case 0:
                            delta /= 100;
                            break;
                        case 1:
                            delta /= 3;
                            break;
                        case 2:
                            delta *= 80;
                            break;
                        default:
                            throw "unrecognized mouse wheel delta mode: " + event.deltaMode
                    }
                    break;
                default:
                    throw "unrecognized mouse wheel event: " + event.type
            }
            return delta
        },
        mouseX: 0,
        mouseY: 0,
        mouseMovementX: 0,
        mouseMovementY: 0,
        touches: {},
        lastTouches: {},
        calculateMouseEvent: function(event) {
            if (Browser.pointerLock) {
                if (event.type != "mousemove" && "mozMovementX" in event) {
                    Browser.mouseMovementX = Browser.mouseMovementY = 0
                } else {
                    Browser.mouseMovementX = Browser.getMovementX(event);
                    Browser.mouseMovementY = Browser.getMovementY(event)
                }
                if (typeof SDL != "undefined") {
                    Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                    Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
                } else {
                    Browser.mouseX += Browser.mouseMovementX;
                    Browser.mouseY += Browser.mouseMovementY
                }
            } else {
                var rect = Module["canvas"].getBoundingClientRect();
                var cw = Module["canvas"].width;
                var ch = Module["canvas"].height;
                var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
                var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
                if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                    var touch = event.touch;
                    if (touch === undefined) {
                        return
                    }
                    var adjustedX = touch.pageX - (scrollX + rect.left);
                    var adjustedY = touch.pageY - (scrollY + rect.top);
                    adjustedX = adjustedX * (cw / rect.width);
                    adjustedY = adjustedY * (ch / rect.height);
                    var coords = {
                        x: adjustedX,
                        y: adjustedY
                    };
                    if (event.type === "touchstart") {
                        Browser.lastTouches[touch.identifier] = coords;
                        Browser.touches[touch.identifier] = coords
                    } else if (event.type === "touchend" || event.type === "touchmove") {
                        var last = Browser.touches[touch.identifier];
                        if (!last) last = coords;
                        Browser.lastTouches[touch.identifier] = last;
                        Browser.touches[touch.identifier] = coords
                    }
                    return
                }
                var x = event.pageX - (scrollX + rect.left);
                var y = event.pageY - (scrollY + rect.top);
                x = x * (cw / rect.width);
                y = y * (ch / rect.height);
                Browser.mouseMovementX = x - Browser.mouseX;
                Browser.mouseMovementY = y - Browser.mouseY;
                Browser.mouseX = x;
                Browser.mouseY = y
            }
        },
        asyncLoad: function(url, onload, onerror, noRunDep) {
            var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
            readAsync(url, function(arrayBuffer) {
                assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
                onload(new Uint8Array(arrayBuffer));
                if (dep) removeRunDependency(dep)
            }, function(event) {
                if (onerror) {
                    onerror()
                } else {
                    throw 'Loading data file "' + url + '" failed.'
                }
            });
            if (dep) addRunDependency(dep)
        },
        resizeListeners: [],
        updateResizeListeners: function() {
            var canvas = Module["canvas"];
            Browser.resizeListeners.forEach(function(listener) {
                listener(canvas.width, canvas.height)
            })
        },
        setCanvasSize: function(width, height, noUpdates) {
            var canvas = Module["canvas"];
            Browser.updateCanvasDimensions(canvas, width, height);
            if (!noUpdates) Browser.updateResizeListeners()
        },
        windowedWidth: 0,
        windowedHeight: 0,
        setFullscreenCanvasSize: function() {
            if (typeof SDL != "undefined") {
                var flags = HEAPU32[SDL.screen >> 2];
                flags = flags | 8388608;
                HEAP32[SDL.screen >> 2] = flags
            }
            Browser.updateCanvasDimensions(Module["canvas"]);
            Browser.updateResizeListeners()
        },
        setWindowedCanvasSize: function() {
            if (typeof SDL != "undefined") {
                var flags = HEAPU32[SDL.screen >> 2];
                flags = flags & ~8388608;
                HEAP32[SDL.screen >> 2] = flags
            }
            Browser.updateCanvasDimensions(Module["canvas"]);
            Browser.updateResizeListeners()
        },
        updateCanvasDimensions: function(canvas, wNative, hNative) {
            if (wNative && hNative) {
                canvas.widthNative = wNative;
                canvas.heightNative = hNative
            } else {
                wNative = canvas.widthNative;
                hNative = canvas.heightNative
            }
            var w = wNative;
            var h = hNative;
            if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
                if (w / h < Module["forcedAspectRatio"]) {
                    w = Math.round(h * Module["forcedAspectRatio"])
                } else {
                    h = Math.round(w / Module["forcedAspectRatio"])
                }
            }
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
                var factor = Math.min(screen.width / w, screen.height / h);
                w = Math.round(w * factor);
                h = Math.round(h * factor)
            }
            if (Browser.resizeCanvas) {
                if (canvas.width != w) canvas.width = w;
                if (canvas.height != h) canvas.height = h;
                if (typeof canvas.style != "undefined") {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            } else {
                if (canvas.width != wNative) canvas.width = wNative;
                if (canvas.height != hNative) canvas.height = hNative;
                if (typeof canvas.style != "undefined") {
                    if (w != wNative || h != hNative) {
                        canvas.style.setProperty("width", w + "px", "important");
                        canvas.style.setProperty("height", h + "px", "important")
                    } else {
                        canvas.style.removeProperty("width");
                        canvas.style.removeProperty("height")
                    }
                }
            }
        },
        wgetRequests: {},
        nextWgetRequestHandle: 0,
        getNextWgetRequestHandle: function() {
            var handle = Browser.nextWgetRequestHandle;
            Browser.nextWgetRequestHandle++;
            return handle
        }
    };

    function _emscripten_exit_with_live_runtime() {
        noExitRuntime = true;
        throw "unwind"
    }

    function _emscripten_force_exit(status) {
        noExitRuntime = false;
        exit(status)
    }

    function _emscripten_memcpy_big(dest, src, num) {
        HEAPU8.copyWithin(dest, src, src + num)
    }

    function _emscripten_random() {
        return Math.random()
    }

    function abortOnCannotGrowMemory(requestedSize) {
        abort("OOM")
    }

    function _emscripten_resize_heap(requestedSize) {
        requestedSize = requestedSize >>> 0;
        abortOnCannotGrowMemory(requestedSize)
    }
    var ENV = {};

    function __getExecutableName() {
        return thisProgram || "./this.program"
    }

    function getEnvStrings() {
        if (!getEnvStrings.strings) {
            var lang = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
            var env = {
                "USER": "web_user",
                "LOGNAME": "web_user",
                "PATH": "/",
                "PWD": "/",
                "HOME": "/home/web_user",
                "LANG": lang,
                "_": __getExecutableName()
            };
            for (var x in ENV) {
                env[x] = ENV[x]
            }
            var strings = [];
            for (var x in env) {
                strings.push(x + "=" + env[x])
            }
            getEnvStrings.strings = strings
        }
        return getEnvStrings.strings
    }

    function _environ_get(__environ, environ_buf) {
        var bufSize = 0;
        getEnvStrings().forEach(function(string, i) {
            var ptr = environ_buf + bufSize;
            HEAP32[__environ + i * 4 >> 2] = ptr;
            writeAsciiToMemory(string, ptr);
            bufSize += string.length + 1
        });
        return 0
    }

    function _environ_sizes_get(penviron_count, penviron_buf_size) {
        var strings = getEnvStrings();
        HEAP32[penviron_count >> 2] = strings.length;
        var bufSize = 0;
        strings.forEach(function(string) {
            bufSize += string.length + 1
        });
        HEAP32[penviron_buf_size >> 2] = bufSize;
        return 0
    }

    function _fd_write(fd, iov, iovcnt, pnum) {
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            for (var j = 0; j < len; j++) {
                SYSCALLS.printChar(fd, HEAPU8[ptr + j])
            }
            num += len
        }
        HEAP32[pnum >> 2] = num;
        return 0
    }

    function _roundf(d) {
        d = +d;
        return d >= +0 ? +Math_floor(d + +.5) : +Math_ceil(d - +.5)
    }

    function __isLeapYear(year) {
        return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
    }

    function __arraySum(array, index) {
        var sum = 0;
        for (var i = 0; i <= index; sum += array[i++]) {}
        return sum
    }
    var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    function __addDays(date, days) {
        var newDate = new Date(date.getTime());
        while (days > 0) {
            var leap = __isLeapYear(newDate.getFullYear());
            var currentMonth = newDate.getMonth();
            var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
            if (days > daysInCurrentMonth - newDate.getDate()) {
                days -= daysInCurrentMonth - newDate.getDate() + 1;
                newDate.setDate(1);
                if (currentMonth < 11) {
                    newDate.setMonth(currentMonth + 1)
                } else {
                    newDate.setMonth(0);
                    newDate.setFullYear(newDate.getFullYear() + 1)
                }
            } else {
                newDate.setDate(newDate.getDate() + days);
                return newDate
            }
        }
        return newDate
    }

    function _strftime(s, maxsize, format, tm) {
        var tm_zone = HEAP32[tm + 40 >> 2];
        var date = {
            tm_sec: HEAP32[tm >> 2],
            tm_min: HEAP32[tm + 4 >> 2],
            tm_hour: HEAP32[tm + 8 >> 2],
            tm_mday: HEAP32[tm + 12 >> 2],
            tm_mon: HEAP32[tm + 16 >> 2],
            tm_year: HEAP32[tm + 20 >> 2],
            tm_wday: HEAP32[tm + 24 >> 2],
            tm_yday: HEAP32[tm + 28 >> 2],
            tm_isdst: HEAP32[tm + 32 >> 2],
            tm_gmtoff: HEAP32[tm + 36 >> 2],
            tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
        };
        var pattern = UTF8ToString(format);
        var EXPANSION_RULES_1 = {
            "%c": "%a %b %d %H:%M:%S %Y",
            "%D": "%m/%d/%y",
            "%F": "%Y-%m-%d",
            "%h": "%b",
            "%r": "%I:%M:%S %p",
            "%R": "%H:%M",
            "%T": "%H:%M:%S",
            "%x": "%m/%d/%y",
            "%X": "%H:%M:%S",
            "%Ec": "%c",
            "%EC": "%C",
            "%Ex": "%m/%d/%y",
            "%EX": "%H:%M:%S",
            "%Ey": "%y",
            "%EY": "%Y",
            "%Od": "%d",
            "%Oe": "%e",
            "%OH": "%H",
            "%OI": "%I",
            "%Om": "%m",
            "%OM": "%M",
            "%OS": "%S",
            "%Ou": "%u",
            "%OU": "%U",
            "%OV": "%V",
            "%Ow": "%w",
            "%OW": "%W",
            "%Oy": "%y"
        };
        for (var rule in EXPANSION_RULES_1) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
        }
        var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        function leadingSomething(value, digits, character) {
            var str = typeof value === "number" ? value.toString() : value || "";
            while (str.length < digits) {
                str = character[0] + str
            }
            return str
        }

        function leadingNulls(value, digits) {
            return leadingSomething(value, digits, "0")
        }

        function compareByDay(date1, date2) {
            function sgn(value) {
                return value < 0 ? -1 : value > 0 ? 1 : 0
            }
            var compare;
            if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
                if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                    compare = sgn(date1.getDate() - date2.getDate())
                }
            }
            return compare
        }

        function getFirstWeekStartDate(janFourth) {
            switch (janFourth.getDay()) {
                case 0:
                    return new Date(janFourth.getFullYear() - 1, 11, 29);
                case 1:
                    return janFourth;
                case 2:
                    return new Date(janFourth.getFullYear(), 0, 3);
                case 3:
                    return new Date(janFourth.getFullYear(), 0, 2);
                case 4:
                    return new Date(janFourth.getFullYear(), 0, 1);
                case 5:
                    return new Date(janFourth.getFullYear() - 1, 11, 31);
                case 6:
                    return new Date(janFourth.getFullYear() - 1, 11, 30)
            }
        }

        function getWeekBasedYear(date) {
            var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
            var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
            var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
                if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                    return thisDate.getFullYear() + 1
                } else {
                    return thisDate.getFullYear()
                }
            } else {
                return thisDate.getFullYear() - 1
            }
        }
        var EXPANSION_RULES_2 = {
            "%a": function(date) {
                return WEEKDAYS[date.tm_wday].substring(0, 3)
            },
            "%A": function(date) {
                return WEEKDAYS[date.tm_wday]
            },
            "%b": function(date) {
                return MONTHS[date.tm_mon].substring(0, 3)
            },
            "%B": function(date) {
                return MONTHS[date.tm_mon]
            },
            "%C": function(date) {
                var year = date.tm_year + 1900;
                return leadingNulls(year / 100 | 0, 2)
            },
            "%d": function(date) {
                return leadingNulls(date.tm_mday, 2)
            },
            "%e": function(date) {
                return leadingSomething(date.tm_mday, 2, " ")
            },
            "%g": function(date) {
                return getWeekBasedYear(date).toString().substring(2)
            },
            "%G": function(date) {
                return getWeekBasedYear(date)
            },
            "%H": function(date) {
                return leadingNulls(date.tm_hour, 2)
            },
            "%I": function(date) {
                var twelveHour = date.tm_hour;
                if (twelveHour == 0) twelveHour = 12;
                else if (twelveHour > 12) twelveHour -= 12;
                return leadingNulls(twelveHour, 2)
            },
            "%j": function(date) {
                return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
            },
            "%m": function(date) {
                return leadingNulls(date.tm_mon + 1, 2)
            },
            "%M": function(date) {
                return leadingNulls(date.tm_min, 2)
            },
            "%n": function() {
                return "\n"
            },
            "%p": function(date) {
                if (date.tm_hour >= 0 && date.tm_hour < 12) {
                    return "AM"
                } else {
                    return "PM"
                }
            },
            "%S": function(date) {
                return leadingNulls(date.tm_sec, 2)
            },
            "%t": function() {
                return "\t"
            },
            "%u": function(date) {
                return date.tm_wday || 7
            },
            "%U": function(date) {
                var janFirst = new Date(date.tm_year + 1900, 0, 1);
                var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
                var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
                if (compareByDay(firstSunday, endDate) < 0) {
                    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                    var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                    var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                    return leadingNulls(Math.ceil(days / 7), 2)
                }
                return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
            },
            "%V": function(date) {
                var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
                var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
                var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
                var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
                var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
                if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                    return "53"
                }
                if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                    return "01"
                }
                var daysDifference;
                if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                    daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
                } else {
                    daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
                }
                return leadingNulls(Math.ceil(daysDifference / 7), 2)
            },
            "%w": function(date) {
                return date.tm_wday
            },
            "%W": function(date) {
                var janFirst = new Date(date.tm_year, 0, 1);
                var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
                var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
                if (compareByDay(firstMonday, endDate) < 0) {
                    var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                    var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                    var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                    return leadingNulls(Math.ceil(days / 7), 2)
                }
                return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
            },
            "%y": function(date) {
                return (date.tm_year + 1900).toString().substring(2)
            },
            "%Y": function(date) {
                return date.tm_year + 1900
            },
            "%z": function(date) {
                var off = date.tm_gmtoff;
                var ahead = off >= 0;
                off = Math.abs(off) / 60;
                off = off / 60 * 100 + off % 60;
                return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
            },
            "%Z": function(date) {
                return date.tm_zone
            },
            "%%": function() {
                return "%"
            }
        };
        for (var rule in EXPANSION_RULES_2) {
            if (pattern.indexOf(rule) >= 0) {
                pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
            }
        }
        var bytes = intArrayFromString(pattern, false);
        if (bytes.length > maxsize) {
            return 0
        }
        writeArrayToMemory(bytes, s);
        return bytes.length - 1
    }

    function _strftime_l(s, maxsize, format, tm) {
        return _strftime(s, maxsize, format, tm)
    }
    var __readAsmConstArgsArray = [];

    function readAsmConstArgs(sigPtr, buf) {
        __readAsmConstArgsArray.length = 0;
        var ch;
        buf >>= 2;
        while (ch = HEAPU8[sigPtr++]) {
            var double = ch < 105;
            if (double && buf & 1) buf++;
            __readAsmConstArgsArray.push(double ? HEAPF64[buf++ >> 1] : HEAP32[buf]);
            ++buf
        }
        return __readAsmConstArgsArray
    }
    Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas) {
        Browser.requestFullscreen(lockPointer, resizeCanvas)
    };
    Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
        Browser.requestAnimationFrame(func)
    };
    Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
        Browser.setCanvasSize(width, height, noUpdates)
    };
    Module["pauseMainLoop"] = function Module_pauseMainLoop() {
        Browser.mainLoop.pause()
    };
    Module["resumeMainLoop"] = function Module_resumeMainLoop() {
        Browser.mainLoop.resume()
    };
    Module["getUserMedia"] = function Module_getUserMedia() {
        Browser.getUserMedia()
    };
    Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
        return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
    };

    function intArrayFromString(stringy, dontAddNull, length) {
        var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
        var u8array = new Array(len);
        var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
        if (dontAddNull) u8array.length = numBytesWritten;
        return u8array
    }
    var asmLibraryArg = {
        "i": ___assert_fail,
        "q": ___map_file,
        "p": ___sys_munmap,
        "b": _abort,
        "d": _emscripten_asm_const_dii,
        "a": _emscripten_asm_const_iii,
        "j": _emscripten_exit_with_live_runtime,
        "m": _emscripten_force_exit,
        "g": _emscripten_get_now,
        "n": _emscripten_memcpy_big,
        "e": _emscripten_random,
        "f": _emscripten_resize_heap,
        "r": _emscripten_set_main_loop,
        "k": _environ_get,
        "l": _environ_sizes_get,
        "h": _fd_write,
        "memory": wasmMemory,
        "c": _roundf,
        "o": _strftime_l,
        "table": wasmTable
    };
    var asm = createWasm();
    var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
        return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["s"]).apply(null, arguments)
    };
    var _game_pow_solve_result = Module["_game_pow_solve_result"] = function() {
        return (_game_pow_solve_result = Module["_game_pow_solve_result"] = Module["asm"]["t"]).apply(null, arguments)
    };
    var _set_mouse_pos = Module["_set_mouse_pos"] = function() {
        return (_set_mouse_pos = Module["_set_mouse_pos"] = Module["asm"]["u"]).apply(null, arguments)
    };
    var _set_key_down = Module["_set_key_down"] = function() {
        return (_set_key_down = Module["_set_key_down"] = Module["asm"]["v"]).apply(null, arguments)
    };
    var _set_key_up = Module["_set_key_up"] = function() {
        return (_set_key_up = Module["_set_key_up"] = Module["asm"]["w"]).apply(null, arguments)
    };
    var _reset_keys = Module["_reset_keys"] = function() {
        return (_reset_keys = Module["_reset_keys"] = Module["asm"]["x"]).apply(null, arguments)
    };
    var _prevent_right_click = Module["_prevent_right_click"] = function() {
        return (_prevent_right_click = Module["_prevent_right_click"] = Module["asm"]["y"]).apply(null, arguments)
    };
    var _flush_input_hooks = Module["_flush_input_hooks"] = function() {
        return (_flush_input_hooks = Module["_flush_input_hooks"] = Module["asm"]["z"]).apply(null, arguments)
    };
    var _mouse_wheel = Module["_mouse_wheel"] = function() {
        return (_mouse_wheel = Module["_mouse_wheel"] = Module["asm"]["A"]).apply(null, arguments)
    };
    var _cp5_check_ws = Module["_cp5_check_ws"] = function() {
        return (_cp5_check_ws = Module["_cp5_check_ws"] = Module["asm"]["B"]).apply(null, arguments)
    };
    var _d_connect = Module["_d_connect"] = function() {
        return (_d_connect = Module["_d_connect"] = Module["asm"]["C"]).apply(null, arguments)
    };
    var _has_tank = Module["_has_tank"] = function() {
        return (_has_tank = Module["_has_tank"] = Module["asm"]["D"]).apply(null, arguments)
    };
    var _set_convar = Module["_set_convar"] = function() {
        return (_set_convar = Module["_set_convar"] = Module["asm"]["E"]).apply(null, arguments)
    };
    var _get_convar = Module["_get_convar"] = function() {
        return (_get_convar = Module["_get_convar"] = Module["asm"]["F"]).apply(null, arguments)
    };
    var _execute = Module["_execute"] = function() {
        return (_execute = Module["_execute"] = Module["asm"]["G"]).apply(null, arguments)
    };
    var _print_convar_help = Module["_print_convar_help"] = function() {
        return (_print_convar_help = Module["_print_convar_help"] = Module["asm"]["H"]).apply(null, arguments)
    };
    var _main = Module["_main"] = function() {
        return (_main = Module["_main"] = Module["asm"]["I"]).apply(null, arguments)
    };
    var _free = Module["_free"] = function() {
        return (_free = Module["_free"] = Module["asm"]["J"]).apply(null, arguments)
    };
    var _cp5_idle = Module["_cp5_idle"] = function() {
        return (_cp5_idle = Module["_cp5_idle"] = Module["asm"]["K"]).apply(null, arguments)
    };
    var _cp5_destroy = Module["_cp5_destroy"] = function() {
        return (_cp5_destroy = Module["_cp5_destroy"] = Module["asm"]["L"]).apply(null, arguments)
    };
    var _videoads_loaded = Module["_videoads_loaded"] = function() {
        return (_videoads_loaded = Module["_videoads_loaded"] = Module["asm"]["M"]).apply(null, arguments)
    };
    var _videoads_done = Module["_videoads_done"] = function() {
        return (_videoads_done = Module["_videoads_done"] = Module["asm"]["N"]).apply(null, arguments)
    };
    var _cp6_m28n_reply = Module["_cp6_m28n_reply"] = function() {
        return (_cp6_m28n_reply = Module["_cp6_m28n_reply"] = Module["asm"]["O"]).apply(null, arguments)
    };
    var ___errno_location = Module["___errno_location"] = function() {
        return (___errno_location = Module["___errno_location"] = Module["asm"]["P"]).apply(null, arguments)
    };
    var _malloc = Module["_malloc"] = function() {
        return (_malloc = Module["_malloc"] = Module["asm"]["Q"]).apply(null, arguments)
    };
    var dynCall_vi = Module["dynCall_vi"] = function() {
        return (dynCall_vi = Module["dynCall_vi"] = Module["asm"]["R"]).apply(null, arguments)
    };
    var dynCall_v = Module["dynCall_v"] = function() {
        return (dynCall_v = Module["dynCall_v"] = Module["asm"]["S"]).apply(null, arguments)
    };
    var calledRun;

    function ExitStatus(status) {
        this.name = "ExitStatus";
        this.message = "Program terminated with exit(" + status + ")";
        this.status = status
    }
    var calledMain = false;
    dependenciesFulfilled = function runCaller() {
        if (!calledRun) run();
        if (!calledRun) dependenciesFulfilled = runCaller
    };

    function callMain(args) {
        var entryFunction = Module["_main"];
        var argc = 0;
        var argv = 0;
        try {
            var ret = entryFunction(argc, argv);
            exit(ret, true)
        } catch (e) {
            if (e instanceof ExitStatus) {
                return
            } else if (e == "unwind") {
                noExitRuntime = true;
                return
            } else {
                var toLog = e;
                if (e && typeof e === "object" && e.stack) {
                    toLog = [e, e.stack]
                }
                err("exception thrown: " + toLog);
                quit_(1, e)
            }
        } finally {
            calledMain = true
        }
    }

    function run(args) {
        args = args || arguments_;
        if (runDependencies > 0) {
            return
        }
        preRun();
        if (runDependencies > 0) return;

        function doRun() {
            if (calledRun) return;
            calledRun = true;
            Module["calledRun"] = true;
            if (ABORT) return;
            initRuntime();
            preMain();
            if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
            if (shouldRunNow) callMain(args);
            postRun()
        }
        if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
                setTimeout(function() {
                    Module["setStatus"]("")
                }, 1);
                doRun()
            }, 1)
        } else {
            doRun()
        }
    }
    Module["run"] = run;

    function exit(status, implicit) {
        if (implicit && noExitRuntime && status === 0) {
            return
        }
        if (noExitRuntime) {} else {
            ABORT = true;
            EXITSTATUS = status;
            exitRuntime();
            if (Module["onExit"]) Module["onExit"](status)
        }
        quit_(status, new ExitStatus(status))
    }
    if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
            Module["preInit"].pop()()
        }
    }
    var shouldRunNow = true;
    if (Module["noInitialRun"]) shouldRunNow = false;
    noExitRuntime = true;
    run()
})(window);