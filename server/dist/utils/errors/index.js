"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
/**
 * Custom Error Class which extends from Error to send correct error
 */
class ErrorHandling extends Error {
    constructor(element, message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        if (typeof element === "object") {
            this.name = element["name"];
            this.message = element["message"];
        }
        else {
            this.name = element;
            this.message = message;
        }
        this.errorMessage(element, message);
    }
    errorMessage(element, message) {
        if (typeof element === "object") {
            if (message) {
                this.message = errors_1.errors[element["name"]] + " " + message;
            }
            else {
                this.message = errors_1.errors[element["name"]];
            }
        }
        else if (typeof element === "string") {
            if (message) {
                this.message = errors_1.errors[element] + " " + message;
            }
            else {
                this.message = errors_1.errors[element];
            }
        }
    }
}
exports.ErrorHandling = ErrorHandling;
