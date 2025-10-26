import mongoose,{Schema,Document} from "mongoose";

export interface IPayment extends Document{
    paymentId:string;
    orderId:string;
    signature:string;
    amount:number;
    currency:string;
    userId:mongoose.Schema.Types.ObjectId;
    courseId:mongoose.Schema.Types.ObjectId;
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
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    courseId:{
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


const Payment = mongoose.models.Payment as mongoose.Model<IPayment> || mongoose.model("Payment",paymentSchema)

export default Payment