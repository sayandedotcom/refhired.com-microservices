"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplyStatus = void 0;
var ApplyStatus;
(function (ApplyStatus) {
    // Apply is not replied to yet, or the user has
    ApplyStatus["Pending"] = "Pending";
    // Apply is accepted
    ApplyStatus["Accepted"] = "Accepted";
    // Apply is rejected
    ApplyStatus["Rejected"] = "Rejected";
})(ApplyStatus = exports.ApplyStatus || (exports.ApplyStatus = {}));
