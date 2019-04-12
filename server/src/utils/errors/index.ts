import {errors} from "./errors";

/**
 * Custom Error Class which extends from Error to send correct error
 */
export class ErrorHandling extends Error {

    constructor(element: string | object, message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        if (typeof element === "object") {
            this.name = element["name"];
            this.message = element["message"]
        } else {
            this.name = element;
            this.message = message
        }
        this.errorMessage(element, message)
    }

    public errorMessage(element: string | object, message?: string): void {
        if(typeof element === "object"){
            if(message){
                this.message = errors[element["name"]] + " " + message
            } else {
                this.message = errors[element["name"]]
            }
        } else if (typeof element === "string") {
            if (message) {
                this.message = errors[element] + " " + message
            } else {
                this.message = errors[element]
            }
        }
    }
}