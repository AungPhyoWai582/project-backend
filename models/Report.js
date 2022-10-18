const mongoose = require("mongoose");

const Report = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  Lottery: {
    type: mongoose.Schema.ObjectId,
    ref: "Lottery",
  },
  Role:String,
  Type:String,
  Divider:String,
  Total:Number,
  Commission:Number,
  Win:Number,
  Date:Date,
  Time:String,
  NumberCount:Number,
  Calls:Array,
  OutCalls:Array,
  Lager:{
    type:mongoose.Schema.ObjectId,
    ref:"Lager"
  },

});

module.exports = mongoose.model("Report", Report);
