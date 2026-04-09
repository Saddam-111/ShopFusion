


//        this file is only for testing no other uses.


import crypto from 'crypto';



const resetToken = crypto.randomBytes(20).toString('hex');
//crypto.randomBytes(20) gives 20 Bytes but we have to change it into string and hexadecimal format. so we use .tostring('hex')


const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
