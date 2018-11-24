class Response{
    constructor(err, data){
        this.err = err;
        this.data = data;
    }

    getData(){
        return this.data;
    }

    setData(data){
        this.data = data;
    }

    getError(){
        return this.err;
    }

    setError(err){
        this.err = err;
    }

    getStatus(){
        return (this.err === null) ? 'success' : 'error';
    }

    stringify(){
        if (this.err === null){
            return {
                status: 'success',
                data: this.data
            };
        } else {
            return {
                status: 'error',
                error: this.err
            };
        }
    }
}

module.exports = Response;