import {errors} from "./errors";

export class ErrorHandling extends Error {

    constructor(element: string|object, message?: string){
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        if(typeof element === "object"){
            this.name = element["name"]
        } else {
            this.name = element
        }
        this.errorMessage(element, message)
    }

    public errorMessage(element: string|object, message?: string): void {
        if(!message){
            if(typeof element === "object"){
                this.message = errors[element["name"]]
            }
            else {
                this.message = errors[element]
            }
        } else this.message = message
    }
}