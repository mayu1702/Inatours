class APIFeatures{

    constructor(query, queryString){//query- mongoose query , queryString- query coming from the express
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        //BUILD A QUERY
        // 1 A) Filtering
        const queryObj = { ...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1 B) Advanced Filtering 
        let queStr = JSON.stringify(queryObj);
        queStr = queStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        //console.log(JSON.parse(queStr));

        this.query.find(JSON.parse(queStr));
        return this;
        //let query =  Tour.find(JSON.parse(queStr));
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('');
            this.query = this.query.sort(sortBy);
        }
        else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        else{
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate(){
        const page = this.queryString.page * 1 || 1;// * 1 to convert string to number
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);//GETTING ONLY 10 TOURS PER PAGE

        return this;
    }
}

module.exports = APIFeatures;