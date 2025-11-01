import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOption } from "../../(Auth)/auth/[...nextauth]/options";
import apiError from "@/utils/apiError";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/course";


export async function PATCH(req: NextRequest) {
    //get video id and course title from the body
    // only admin can add video
    // this route is hit when the video is upload by add video route.
    //check the course is created or not
    const { videoId, courseTitle } = await req.json();

    const session = await getServerSession(authOption)
    if (!session) {
        return apiError("unauthancatid user", 400)
    }
    if (session?.user.role !== "admin") {
        return apiError("this route is not for the user", 400)
    }

    try {
        await dbConnect()
        const CourseExist = await Course.findOne({
            title:courseTitle
        })
        if (!CourseExist) {
            return apiError("course is not existed in the database")
        }
        const course = await Course.aggregate([
            {
                $match: {
                    title: courseTitle
                }
            },
            {
                $set: {
                    videos: {
                        $cond: {
                            if: {
                                $in: [videoId, "$videos"]
                            },
                            then: "$videos",
                            else: {
                                $concatArrays: ["$videos", [videoId]]
                            }
                        }
                    }
                }
            },
            {
                $merge: {
                    into: "courses",
                    whenMatched: "merge",
                    whenNotMatched: "discard"
                }
            }
        ])
        if (!course) {
            return apiError("video is not added in the course")
        }
        return NextResponse.json({message:"video add successfully in course",course,success:true},{status:200})
    } catch (error) {
        return apiError("internal server occure in the adding video",500)
    }

}