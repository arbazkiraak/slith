"use strict";
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
        while (_) try {
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
exports.__esModule = true;
var core = require("@actions/core");
var exec = require("@actions/exec");
var slitherVersion = core.getInput("slither-slitherVersion") || "0.6.14";
var runNpmInstall = core.getInput("run-npm-install") === "true";
var failOnHighResults = parseInt(core.getInput("high-threshold")) || 1;
var failOnMediumResults = parseInt(core.getInput("medium-threshold")) || 1;
var failOnLowResults = parseInt(core.getInput("low-threshold")) || 1;
var failOnInformativeResults = parseInt(core.getInput("informative-threshold")) || 10;
var failOnOptimizationResults = parseInt(core.getInput("optimization-threshold")) || 1;
var slitherParams = core.getInput("slither-params") || "";
var projectPath = core.getInput("projectPath") || ".";
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var counts, ex_1, output, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                counts = { "High": 0, "Medium": 0, "Low": 0, "Informational": 0, "Optimization": 0 };
                printDebugInfo();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prepare()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                ex_1 = _a.sent();
                core.setFailed("Something went wrong. Check above for more information");
                return [2 /*return*/];
            case 4:
                console.log("Running static scan");
                return [4 /*yield*/, runSlither()];
            case 5:
                output = _a.sent();
                try {
                    data = JSON.parse(output);
                    if (!data.success) {
                        core.setFailed("Something went wrong...");
                        return [2 /*return*/];
                    }
                    if (data.results.length === 0) {
                        core.info("All good");
                        return [2 /*return*/];
                    }
                    console.log("");
                    console.log("----------------------------------------");
                    console.log("                Findings");
                    console.log("----------------------------------------");
                    (data.results.detectors || []).forEach(function (d) {
                        var severity = d.impact;
                        counts[severity]++;
                        core.error("[" + d.impact + "] " + d.check + ": " + d.description + "\n");
                        console.log("[" + d.impact + "] " + d.check + ":");
                        console.log(d.description);
                        console.log("");
                    });
                    showStats(counts);
                }
                catch (ex) {
                    core.setFailed("Error parsing results");
                    console.debug(ex);
                    return [2 /*return*/];
                }
                return [2 /*return*/];
        }
    });
}); };
var prepare = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                core.info("Install dependencies");
                return [4 /*yield*/, exec.exec("sudo apt-get install -y git python3 python3-setuptools wget software-properties-common")];
            case 1:
                _a.sent();
                core.info("Install solc");
                return [4 /*yield*/, exec.exec("sudo add-apt-repository ppa:ethereum/ethereum -y")];
            case 2:
                _a.sent();
                return [4 /*yield*/, exec.exec("sudo apt-get update -y")];
            case 3:
                _a.sent();
                return [4 /*yield*/, exec.exec("sudo apt-get install solc -y")];
            case 4:
                _a.sent();
                core.info("Downloading slither");
                return [4 /*yield*/, exec.exec("wget https://github.com/crytic/slither/archive/" + slitherVersion + ".zip -O /tmp/slither.zip")];
            case 5:
                _a.sent();
                core.info("Unzipping slither");
                return [4 /*yield*/, exec.exec(" unzip /tmp/slither.zip -d .")];
            case 6:
                _a.sent();
                core.info("Installing slither");
                return [4 /*yield*/, exec.exec("sudo python3 setup.py install", undefined, { cwd: "slither-" + slitherVersion })];
            case 7:
                _a.sent();
                if (!runNpmInstall) return [3 /*break*/, 9];
                core.info("Installing dependencies");
                return [4 /*yield*/, exec.exec("npm install", undefined, { cwd: projectPath })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
var printDebugInfo = function () {
    core.debug("Configs:");
    core.debug("slitherVersion: " + slitherVersion);
    core.debug("failOnHighResults: " + failOnHighResults);
    core.debug("failOnMediumResults: " + failOnMediumResults);
    core.debug("failOnLowResults: " + failOnLowResults);
    core.debug("failOnInformativeResults: " + failOnInformativeResults);
    core.debug("failOnOptimizationResults: " + failOnOptimizationResults);
    core.debug("projectPath: " + projectPath);
    core.debug("runNpmInstall: " + runNpmInstall);
};
var runSlither = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //slither return code is the number of findings... 
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var output = "";
                var options = {};
                options.listeners = {
                    stdout: function (data) { return output += data.toString(); }
                };
                options.cwd = projectPath;
                exec.exec("slither --json - . " + slitherParams, undefined, options).then(function () { return resolve(output); })["catch"](function () { return resolve(output); });
            })];
    });
}); };
//TODO: replace any
var showStats = function (counts) {
    core.warning("Stats: High: " + counts["High"] + ", Medium: " + counts["Medium"] + ", Low: " + counts["Low"] + ", Informative: " + counts["Informational"] + ", Optimizations: " + counts["Optimization"]);
    if (failOnHighResults !== 0 && failOnHighResults <= counts["High"])
        core.setFailed("Number of High results is equal or bigger then the defined threshold of " + failOnHighResults);
    else if (failOnMediumResults !== 0 && failOnMediumResults <= counts["Medium"])
        core.setFailed("Number of Medium results is equal or bigger then the defined threshold of " + failOnMediumResults);
    else if (failOnLowResults !== 0 && failOnLowResults <= counts["Low"])
        core.setFailed("Number of Low results is equal or bigger then the defined threshold of " + failOnLowResults);
    else if (failOnInformativeResults !== 0 && failOnInformativeResults <= counts["Informational"])
        core.setFailed("Number of Informative results is equal or bigger then the defined threshold of " + failOnInformativeResults);
    else if (failOnOptimizationResults !== 0 && failOnOptimizationResults <= counts["Optimization"])
        core.setFailed("Number of Optimization results is equal or bigger then the defined threshold of " + failOnOptimizationResults);
};
run();
