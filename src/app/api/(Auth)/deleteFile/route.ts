import ImageKit from 'imagekit';
import apiResponse from '@/utils/apirespone';
import apiError from '@/utils/apiError';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '../auth/[...nextauth]/options';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOption);
    if (!session) {
        return apiError("user is not logged in", 400)
    }
   try {
     const res = imagekit.listFiles({
         path: session.user?.avatar
     },
         function (error, result) {
             if (error || !result || result.length === 0) {
                 return apiError("file not found", 400)
             }
             if ('fileId' in result[0]) {
                 const fileId = result[0].fileId;
                 if (!fileId) {
                     return apiError("file not found", 400)
                 }
                 imagekit.deleteFile(fileId, function (error, res) {
                     if (error) {
                         return apiError("delete error occurred", 500)
                     }
                     return apiResponse("file deleted successfully", 200)
                 })
             }
         })
   } catch (error) {
    return apiError("error in deleting file from imagekit")
   }

} 