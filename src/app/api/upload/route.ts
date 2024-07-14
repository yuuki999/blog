import {
  Bucket,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';


// 動画に関する
import * as fs from 'fs'
import { downloadFileFromSupabase } from '@/app/utils/supabaseClient';

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
//   },
// })

// const s3BucketName = process.env.S3_BUCKET_NAME;
// if (!s3BucketName) {
//   throw new Error('環境変数 S3_BUCKET_NAME が設定されていません。');
// }

export async function POST(req: any, res: any) {

  // // ファイルの処理
  // const { searchParams } = new URL(req.url);
  // const formData = await req.formData();
  // const file: any = formData.get("file");

  // // File オブジェクトから Buffer に変換
  // // const buffer = Buffer.from(await file?.arrayBuffer());

  // const startTimeFileName = Date.now(); // アップロード開始時のタイムスタンプ

  // // ファイル情報をsupabaseから取得する。
  // const filePath: string = formData.get("filePath"); 
  // console.log(filePath)

  // let buffer; 
  // let bucketParams;
  // try{
  //   console.log(filePath)
  //   buffer = await downloadFileFromSupabase(filePath);
  //   bucketParams = {
  //     Bucket: s3BucketName!,
  //     Key: `${startTimeFileName}_move`,
  //     Body: buffer!,
  //   };

  //   if(!bucketParams){
  //     throw new Error();
  //   }

  // } catch (error) {
  //   console.error(error);
  //   throw new Error('supaから動画の取得に失敗');
  // }

  // console.log("S3アップロード開始")
  // const startTime = Date.now(); // アップロード開始時のタイムスタンプ
  // const data = await s3Client.send(new PutObjectCommand(bucketParams!));
  // const endTime = Date.now(); // アップロード完了時のタイムスタンプ
  // const uploadDurationMs = endTime - startTime; // アップロードの継続時間（ミリ秒）
  // const uploadDurationSeconds = uploadDurationMs / 1000; // アップロードの継続時間（秒）
  // console.log("S3アップロード完了")

  // console.log(`アップロードの所要時間: ${uploadDurationSeconds}秒 (${uploadDurationMs}ミリ秒)`);
  // console.log(
  //   'Successfully uploaded object: ' +
  //     bucketParams!.Bucket +
  //     '/' +
  //     bucketParams!.Key,
  //   'Etag: ' + data.ETag
  // );
  
  // return NextResponse.json({ body: "success" });
  return new Response('OK');
}
