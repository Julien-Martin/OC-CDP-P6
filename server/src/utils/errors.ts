export class ErrorHandling extends Error {

    constructor(el: string|object, message?: string){
        super(`${el}: ${message}`)
        Object.setPrototypeOf(this, new.target.prototype)
        if(typeof el === "object"){
            this.name = el["name"]
        } else {
            this.name = el
        }
        this.errorMessage(el, message)
        console.log(this.name)
    }

    public errorMessage(el: string|object, message?: string): void{
        if(typeof el === "object"){
            console.log('test')

            this.name = el["name"]
            if(this.name === "TokenExpiredError") this.message = "Le token est expiré."
            else if(this.name === "JsonWebTokenError") this.message = "Le token est invalide."
            else if(this.name === "NotBeforeError") this.message = "Le token n'est pas actif."
            else this.message = el["message"]
        }
        else if(typeof el === "string"){
            console.log('test2')

            this.name = el
            let errorName = el.split('-')[0]
            let errorCode = el.split('-')[1]
            if(errorName === "AUTH"){
                if(errorCode === "001") this.message = "L'authentification a échoué."
                if(errorCode === "002") this.message = "Token manquant."
                if(errorCode === "003") this.message = "Vous n'êtes pas administrateur."
            } else {
                if(message) {
                    this.message = message
                } else {
                    this.message = "Une erreur est apparue."
                }
            }
        }
    }
}

//
// export class AuthError extends Error {
//     constructor(prop) {
//         super(prop);
//     }
// }
//eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjNWFmNWY1YTdiMTFiMDAwNzFmZDU5ZSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNTQ5NDY2ODg0LCJleHAiOjE1NDk1NTMyODR9.nK0we6xq9ItOkLOoWz_psVpD4rxuxTv48a4XbEbvAFXsSTZd1N-ZLnZa8D105G4bqeamG7SrZUXPk3lKYsykZsj7zUXaKhhgSznkZ026r9emQwWAc79tpMoFC3LlL_VpmEb6S31jUSVAMxySuCN9YwSfwVqApcvABbvW3RTblTYOQKj8jqs1XB-mCQ1i5ORer86XHttmxUT-blr6vSGOQet4ELKRXJPpM8T2ENihp-6JL2w2k6HTTM7XX4JVkrSiO_97RrQIziijfvecSV8dsICepbC3AL9UcJH92fm8F51Z2J1fEXbF7hSNY6wJg8PC-LcggAa4uuosV2I5h5askg