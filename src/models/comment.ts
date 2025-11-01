import mongoose,{Document,Schema} from "mongoose";


export interface IComment extends Document{
    content:string,
    course:mongoose.Schema.Types.ObjectId,
    video:mongoose.Schema.Types.ObjectId,
    owner:mongoose.Schema.Types.ObjectId,
}


const commentSchema:Schema<IComment> = new Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

const Comment = mongoose.models.Comment as mongoose.Model<IComment> || mongoose.model("Comment",commentSchema)
export default Comment