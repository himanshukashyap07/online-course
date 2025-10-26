import mongoose,{Schema,Document} from "mongoose";

export interface IPayment extends Document{
    paymentId:string;
    orderId:string;
    signature:string;
    amount:number;
    currency:string;
    user:mongoose.Schema.Types.ObjectId;
    course:mongoose.Schema.Types.ObjectId;
    status:string
}

const paymentSchema:Schema<IPayment> = new Schema({
    paymentId:{
        type:String,
        required:[true,"Payment id is required"]
    },
    orderId:{
        type:String,
        required:[true,"order id is required"]
    },
    signature:{
        type:String,
        required:[true,"signature is required"]
    },
    amount:{
        type:Number,
        required:true,
        default:0
    },
    currency:{
        type:String,
        enum:["INR","USD"],
        default:"INR"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    status:{
        type:String,
        enum:["PENDING","COMPLETED","FAILED"],
        required:true,
        default:"PENDING"
    }

},{timestamps:true})


const Paytment = mongoose.models.Payment as mongoose.Model<IPayment> || mongoose.model("Payment",paymentSchema)

export default Paytment