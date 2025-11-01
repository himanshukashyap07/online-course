import mongoose,{Schema ,Document} from "mongoose";

export interface IVideo extends Document{
    title:string;
    url:string;
    description:string;
    courseId:mongoose.Schema.Types.ObjectId;
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
    url:{
        type:String,
        required:true,
        trim:true
    },
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }

},{timestamps:true})


const Video = mongoose.models.Video as mongoose.Model<IVideo> || mongoose.model("Video",videoSchema);

export default Video