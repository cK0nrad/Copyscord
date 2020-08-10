"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const AuthorizationStore = new Map();
class Store {
    constructor() {
        this.hasAuthorization = (authorization) => {
            return AuthorizationStore.has(authorization);
        };
        this.getAuthorization = (authorization) => {
            console.log(AuthorizationStore, this.hasAuthorization(authorization));
            if (this.hasAuthorization(authorization))
                return AuthorizationStore.get(authorization);
            return false;
        };
        this.addAuthorization = (authorization, User) => {
            AuthorizationStore.set(authorization, User);
            return true;
        };
    }
}
exports.Store = Store;
