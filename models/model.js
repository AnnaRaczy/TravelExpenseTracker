const mongoose = require('mongoose')

const {getTrips, addTrip, getExpenses, addExpense, findByUsername} = require('../controllers/repoFunctions');

const Schema = mongoose.Schema;


const ModelFunctions = ()  => {const User = {
        username: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true}
    }

const optionsUser = {
    methods: {getTrips, addTrip, getExpenses, addExpense},
    statics: {findByUsername}
}    



const Trips = {
    name: {
        type: String, 
        required: true,
        minLength: 3,
        maxLength: 20
    },
    budget: {
        type: Number, 
        required: false,
        min: 0

    },
    from: {type: Date, required: false},
    to: {type: Date, required: false},

}

const optionsTrips = {
    methods: {},
    statics: {}
}



const Expenses = {
    category : {
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
}

const optionsExpenses = {
    methods: {},
    statics: {}
}



const Mapping = {
    userId: mongoose.Schema.Types.ObjectId,
    tripId: mongoose.Schema.Types.ObjectId,
    expenseId: mongoose.Schema.Types.ObjectId
}

const optionsMapping = {
    methods: {},
    statics: {}
}





    const UserSchema = new Schema(User, optionsUser)
    const UserModel = mongoose.model("User", UserSchema);

    const TripsSchema = new Schema(Trips, optionsTrips)
    const TripsModel = mongoose.model("Trips", TripsSchema);

    const ExpensesSchema = new Schema(Expenses, optionsExpenses)
    const ExpensesModel = mongoose.model("Expense", ExpensesSchema);

    const MappingSchema = new Schema(Mapping, optionsMapping)
    const MappingModel = mongoose.model("Mapping", MappingSchema);

    return {UserModel, TripsModel, ExpensesModel, MappingModel}
}
    
    module.exports =  ModelFunctions();