import mongoose,{Document,Schema} from "mongoose";

export interface ILike extends Document{
    course:mongoose.Schema.Types.ObjectId;
    video:mongoose.Schema.Types.ObjectId;
    likedBy:mongoose.Schema.Types.ObjectId;
}

const likeSchema:Schema<ILike> = new Schema({
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
},{timestamps:true})

const Like = mongoose.models.Like as mongoose.Model<ILike> || mongoose.model("Like",likeSchema);
export default Like