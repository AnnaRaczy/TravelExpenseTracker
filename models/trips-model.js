const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Trips = new Schema(
    {
        user_id : {type: String, required: true },
        trips : {type: Object, required: true} [{ 
            trip_id: {type: String, required: true},
            data : {type: Object, required: true} [{
                trip_name : {type: String, required: true},
                budget : {type: Number, required: false},
                start_date : {type: Date, required: false},
                end_date: {type: Date, required: false},
                expense_categories: {type: Object, required: true} [{
                    category_name : {type: String, required: true},
                    amount: {type: Number, required: true}
                }]

            }]
        }]
                
    },
    { timestamps: true}
    
    
    )

    
    export {Trips}