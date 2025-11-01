import mongoose,{Document,Schema} from "mongoose";

export interface ICourse extends Document{
    title:string;
    description:string;
    videos:mongoose.Schema.Types.ObjectId;
    price:number;
    thumbnail:string;
}

const courseSchema:Schema<ICourse> = new Schema({
    title:{
        type:String,
        tirm:true,
        unique:true,
        index:true,
        required:true,
        lowercase:true
    },
    description:{
        type:String,
        tirm:true,
        required:true
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    price:{
        type:Number,
        required:true,
        default:0,
        trim:true
    },
    thumbnail:{
        type:String,
        trim:true,
        required:true
    }

},{timestamps:true})

const Course = mongoose.models.Course as mongoose.Model<ICourse> || mongoose.model("Course",courseSchema)
export default Course;