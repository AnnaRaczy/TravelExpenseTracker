const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TripSchema = new Schema(
    {
        user_id : {type: Schema.Types.ObjectId, required: true },
        trips : {type: Object, required: true} [{ 
            trip_id: {type: Schema.Types.ObjectId, required: true},
            data : {type: Object, required: true} [{
                trip_name : {
                    type: String, 
                    required: true,
                    minLength: 3,
                    maxLength: 20
                },
                budget : {
                    type: Number, 
                    required: false,
                    min: 0

                },
                start_date : {type: Date, required: false},
                end_date: {type: Date, required: false},
                expense_categories: {type: Object, required: true} [{
                    category_name : {
                        type: String, 
                        required: true,
                        minLength: 3,
                        maxLength: 20
                    },
                    amount: {
                        type: Number, 
                        required: true,
                        min: 0
                    }
                }]

            }]
        }]
                
    },
    { timestamps: true}
    
    
    )

    const TripsModel = mongoose.model("Trips", TripSchema);

    
    module.exports =  (TripsModel);