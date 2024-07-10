// TODO:
// + Events: onPrint, onWrongKommand etc
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { DefaultKommands } from "./kommand.js";
export { Kommand } from "./kommand.js";
var Helpers = /** @class */ (function () {
    function Helpers() {
    }
    Helpers.konsoleLineMarkup = function (prefix) {
        return "<pre class=\"KonsoleLine\"><span class=\"KonsolePrefix\">".concat(prefix, " </span><span class=\"KonsoleLineText\"></span></pre>");
    };
    Helpers.konsoleParaMarkup = function () {
        return "<pre class=\"KonsolePara\"><span class=\"KonsoleParaText\"></span></pre>";
    };
    Helpers.konsoleChoiceMarkup = function (lis) {
        return "<pre><ul class=\"KonsoleChoice\">".concat(lis, "</ul></pre>");
    };
    return Helpers;
}());
var KonsoleSettings = /** @class */ (function () {
    function KonsoleSettings() {
        this.prefix = "$";
        this.animatePrint = true;
        this.printLetterInterval = 25;
        this.registerDefaultKommands = true;
        this.caseSensitiveKommands = true;
        this.invalidKommandMessage = "invalid command.";
    }
    return KonsoleSettings;
}());
export { KonsoleSettings };
var Konsole = /** @class */ (function () {
    function Konsole(selector, settings) {
        if (settings === void 0) { settings = new KonsoleSettings(); }
        var _this = this;
        this.settings = new KonsoleSettings();
        this.elem = undefined;
        this.inputElem = undefined;
        this.kommands = [];
        this.controller = new AbortController;
        Object.assign(this.settings, settings);
        this.elem = document.querySelector(selector);
        if (this.elem == null) {
            throw "element '" + selector + "' wasn't found.";
        }
        this.elem.classList.add("Konsole");
        this.elem.setAttribute("tabindex", "0");
        // Prevent browser from scrolling when pressing arrow keys or space bar
        window.addEventListener("keydown", function (e) {
            if (document.activeElement != _this.inputElem && ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
                e.preventDefault();
            }
        }, false);
        // Prevent enter key from opening a link after it is focused once by clicking on it
        // this.elem.addEventListener('keydown', function(e) {
        //     if (e.which === 13 && (e.target as HTMLElement).tagName === 'A') 
        //     {
        //         (e.target as HTMLElement).blur();
        //         e.preventDefault();
        //     }
        // });
        this.elem.addEventListener('click', function (e) {
            if (e.target.tagName === 'A') {
                e.target.blur();
                _this.inputElem.focus();
                // e.preventDefault();
            }
        });
        // Add input element
        // this.elem.insertAdjacentHTML("beforeend", `<input type="text" id="konsoleInput" disabled>`);
        this.elem.insertAdjacentHTML("afterend", "<textarea id=\"konsoleInput\" disabled></textarea>");
        this.inputElem = document.body.querySelector("#konsoleInput");
        this.elem.addEventListener('focus', function (e) {
            _this.elem.classList.add("focussed");
            if (!_this.inputElem.disabled)
                _this.inputElem.focus();
        });
        this.inputElem.addEventListener('focus', function (e) {
            _this.elem.classList.add("focussed");
        });
        document.body.addEventListener('focusout', function (e) {
            // console.log(e);
            // relatedTarget is the element that will receive focus next
            if (_this.inputElem.disabled) {
                if (e.relatedTarget == _this.elem) {
                    // this.elem.classList.add("focussed");
                }
                else if (e.relatedTarget != null) {
                    _this.elem.classList.remove("focussed");
                }
            }
            else {
                if (e.relatedTarget == _this.inputElem) {
                    // this.elem.classList.add("focussed");
                }
                else {
                    _this.elem.classList.remove("focussed");
                }
            }
        });
        // Automatically Scroll to the bottom when new child is added
        var observer = new MutationObserver(function (mutationsList, observer) {
            for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
                var mutation = mutationsList_1[_i];
                if (mutation.type === 'childList') {
                    // console.log('A child node has been added or removed.', mutation.addedNodes.);
                    _this.scrollToBottom();
                }
            }
        });
        observer.observe(this.elem, { attributes: false, childList: true, subtree: false });
        if (this.settings.registerDefaultKommands) {
            for (var _i = 0, DefaultKommands_1 = DefaultKommands; _i < DefaultKommands_1.length; _i++) {
                var kommand = DefaultKommands_1[_i];
                this.registerKommand(kommand);
            }
        }
    }
    Konsole.prototype.registerKommand = function (kommand) {
        if (this.kommands.find(function (k) { return k.name == kommand.name; }))
            throw "Kommand with name '".concat(kommand.name, "' already exists.");
        if (kommand && kommand.name && kommand.description && kommand.action)
            this.kommands.push(kommand);
    };
    Konsole.prototype.removeKommand = function (name) {
        this.kommands = this.kommands.filter(function (k) { return k.name !== name; });
    };
    Konsole.prototype.getInput = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleLineMarkup(_this.settings.prefix));
            var lastLine = Array.from(document.querySelectorAll(".KonsoleLine")).pop().querySelector("span.KonsoleLineText");
            _this.initController();
            _this.inputElem.disabled = false;
            _this.inputElem.value = "";
            _this.inputElem.focus();
            _this.inputElem.addEventListener("input", function (e) { return __awaiter(_this, void 0, void 0, function () {
                var cl;
                return __generator(this, function (_a) {
                    if (e.inputType === "insertLineBreak") // Enter key
                     {
                        this.inputElem.disabled = true;
                        this.controller.abort();
                        cl = this.inputElem.value.trim().replace(/  +/g, "");
                        resolve(cl);
                    }
                    else {
                        lastLine.textContent = this.inputElem.value;
                    }
                    return [2 /*return*/];
                });
            }); }, { signal: _this.controller.signal });
        });
    };
    Konsole.prototype.awaitKommand = function () {
        return __awaiter(this, void 0, void 0, function () {
            var cl, command, arg, kommand;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getInput()];
                    case 1:
                        cl = _a.sent();
                        command = "";
                        arg = "";
                        if (cl.indexOf(" ") == -1)
                            command = cl;
                        else {
                            command = cl.substr(0, cl.indexOf(" "));
                            arg = cl.substr(cl.indexOf(" ") + 1);
                        }
                        kommand = this.kommands.find(function (k) { return _this.settings.caseSensitiveKommands ? k.name == command : k.name.toLowerCase() == command.toLowerCase(); });
                        if (!kommand) return [3 /*break*/, 3];
                        return [4 /*yield*/, kommand.action(arg, this)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.print(this.settings.invalidKommandMessage)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this.awaitKommand();
                        return [2 /*return*/];
                }
            });
        });
    };
    Konsole.prototype.print = function () {
        var _this = this;
        var texts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            texts[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            if (!texts.join("").trim()) {
                reject("Empty Text.");
                return;
            }
            // Append new Konsole Para Markup
            _this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleParaMarkup());
            var LastKonsolePara = Array.from(document.querySelectorAll(".KonsolePara")).pop().querySelector(".KonsoleParaText");
            // input in HTML
            var htmlToPrint = texts.join("\n");
            // Temporary elem to convert HTML to simple Text
            var tempHtmlElem = document.createElement("div");
            tempHtmlElem.innerHTML = htmlToPrint;
            // input in simple text
            var textToPrint = tempHtmlElem.textContent;
            if (_this.settings.animatePrint) {
                var i_1 = 0;
                var lineInter_1 = setInterval(function () {
                    LastKonsolePara.textContent = LastKonsolePara.textContent + textToPrint[i_1];
                    i_1++;
                    if (i_1 >= textToPrint.length) {
                        LastKonsolePara.innerHTML = htmlToPrint;
                        clearInterval(lineInter_1);
                        _this.controller.abort();
                        resolve("Printed animately");
                    }
                }, _this.settings.printLetterInterval);
                // Skip the animation if user presses space
                _this.initController();
                document.body.addEventListener("keydown", function (e) {
                    if (e.code === "Space") {
                        LastKonsolePara.innerHTML = htmlToPrint;
                        clearInterval(lineInter_1);
                        _this.controller.abort();
                        resolve("Printed animately (interrupted)");
                    }
                }, { signal: _this.controller.signal });
            }
            else {
                LastKonsolePara.innerHTML = htmlToPrint;
                resolve("Printed non-animately");
            }
        });
    };
    Konsole.prototype.input = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.print(question + "\n")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getInput()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Konsole.prototype.choice = function (question, choices) {
        return __awaiter(this, void 0, void 0, function () {
            var lis, i, choice;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.print(question)];
                    case 1:
                        _a.sent();
                        this.initController();
                        lis = "";
                        for (i = 0; i < choices.length; i++) {
                            choice = choices[i];
                            lis += "<li ".concat(i == 0 ? "class='active'" : "", ">").concat(choice, "</li>");
                        }
                        this.elem.insertAdjacentHTML("beforeend", Helpers.konsoleChoiceMarkup(lis));
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var lastChoices = Array.from(document.querySelectorAll("ul.KonsoleChoice")).pop();
                                _this.inputElem.disabled = false;
                                _this.inputElem.value = "";
                                _this.inputElem.addEventListener("keyup", function (e) {
                                    if (e.code === "ArrowDown") {
                                        var nextLiIndex_1 = Array.from(lastChoices.children).findIndex(function (child) { return child.classList.contains("active"); }) + 1;
                                        if (nextLiIndex_1 >= lastChoices.children.length)
                                            nextLiIndex_1 = 0;
                                        Array.from(lastChoices.children).forEach(function (child, index) {
                                            child.classList.remove("active");
                                            if (index == nextLiIndex_1)
                                                child.classList.add("active");
                                        });
                                        lastChoices.children[nextLiIndex_1].classList.add("active");
                                    }
                                    else if (e.code === "ArrowUp") {
                                        var nextLiIndex_2 = Array.from(lastChoices.children).findIndex(function (child) { return child.classList.contains("active"); }) - 1;
                                        if (nextLiIndex_2 < 0) {
                                            nextLiIndex_2 = lastChoices.children.length - 1;
                                        }
                                        Array.from(lastChoices.children).forEach(function (child, index) {
                                            child.classList.remove("active");
                                            if (index === nextLiIndex_2) {
                                                child.classList.add("active");
                                            }
                                        });
                                    }
                                    else if (e.code === "Enter") {
                                        _this.inputElem.disabled = true;
                                        _this.controller.abort();
                                        Array.from(lastChoices.children).forEach(function (child, index) {
                                            if (child.classList.contains("active")) {
                                                resolve(child.textContent);
                                            }
                                        });
                                    }
                                }, { signal: _this.controller.signal });
                                _this.inputElem.focus();
                            })];
                }
            });
        });
    };
    Konsole.prototype.scrollToBottom = function () {
        this.elem.scrollTop = this.elem.scrollHeight;
    };
    Konsole.prototype.initController = function () {
        this.controller.abort();
        this.controller = new AbortController;
    };
    return Konsole;
}());
export { Konsole };
;
