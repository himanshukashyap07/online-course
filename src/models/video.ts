import mongoose,{Schema ,Document} from "mongoose";

export interface IVideo extends Document{
    title:string;
    description:string;
    course:mongoose.Schema.Types.ObjectId;
}

const videoSchema:Schema<IVideo> = new Schema({
    
    title:{
        type:String,
        trim:true,
        required:[true,"title is required"]
    },
    description:{
        type:String,
        trim:true,
        required:[true,"title is required"]
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }

},{timestamps:true})


const Video = mongoose.models.Video as mongoose.Model<IVideo> || mongoose.model("Video",videoSchema);

export default Video