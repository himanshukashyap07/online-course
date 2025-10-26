import { NextRequest, NextResponse } from 'next/server';
import ImageKit from 'imagekit';
import { writeFile } from 'fs/promises';
import path from 'path';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req:any) {
  const formData = await req.formData();
  const file = formData.get('file');

  const buffer = Buffer.from(await file.arrayBuffer());
  const tempPath = path.join('/tmp', file.name);
  await writeFile(tempPath, buffer);

  try {
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

    return NextResponse.json({ success: true, url: uploadResponse.url });
  } catch (error:any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}