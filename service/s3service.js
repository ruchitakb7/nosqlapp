const AWS = require('aws-sdk');

exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expenseru';
    const IAM_USER_KEY = process.env.Access_key_ID;
    const IAM_USER_SECRET = process.env.Secret_access_key;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,                                     
        secretAccessKey: IAM_USER_SECRET
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err)
                reject(err)
            }
            else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })
}

