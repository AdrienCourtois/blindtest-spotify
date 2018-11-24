class Error{
    /**
     * Creates an object of the Error class
     * @param {string} name Name of the error
     * @param {string} description Description for the error
     * @param {number} type 0: normal error, 1: SQL error, 2: fatal error
     */
    constructor(name, description, type = 0){
        this.name = name;
        this.description = description;
        this.type = type;
    }

    isFatal(){
        return this.type == 2;
    }

    isSQL(){
        return this.type == 1;
    }

    isRegular(){
        return this.type == 0;
    }

    getMessage(){
        return this.description;
    }

    getName(){
        return this.name;
    }

    setMessage(message){
        this.message = message;
    }

    setName(name){
        this.name = name;
    }

    setType(type){
        this.type = type;
    }
}

module.exports = Error;