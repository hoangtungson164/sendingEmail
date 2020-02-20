const oracleConnect = require('./oracle.connect');
const nodemailer = require('nodemailer');
const CronJob = require('cron').CronJob;
const oracledb = require('oracledb');
var params = {}
const optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };

const email = 'benhiminfoplus@gmail.com';
const password = 'Benhim123';


let getEmails = async function() { 
    console.log("================ get emails =====================");
    SELECT = 'SELECT*FROM ADMIN.EMAIL_SENDING';
    WHERE = ' WHERE STATUS = 1';
    LIMIT = ' FETCH NEXT 3 ROWS ONLY';
    sql = SELECT + WHERE + LIMIT;
    return await oracleConnect(sql, params, optionSelect)
}

let updateStatus = async function(email) {
    console.log("================ update emails =====================");
    UPDATE = 'UPDATE ADMIN.EMAIL_SENDING SET STATUS = 0 WHERE EMAIL_ID = ' + email.EMAIL_ID;
    return await oracleConnect(UPDATE, params, {autoCommit: true})
}


let job = new CronJob('0-30 * * * * *', async function() {
  job.stop();

  let emails = await getEmails();
  
  if (emails.length < 1) {
    console.log('send to no one');
  } else {

    const mailTransport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        pool: true, 
        auth: {
        user: email,
        pass: password,
        },
    });
    


    let i = 0;
    for(; i < emails.length; i++) {

        const mailOptions = {
        from: `benhiminfoplus@gmail.com`,
        to: emails[i].EMAIL,
        };
        // The user unsubscribed to the newsletter.
        mailOptions.subject = `Mail for test`;
        mailOptions.text = `Hey!, We confirm that we have deleted your account.`;
        console.log('=========== sending email =====================')
        console.log("Order number: " + i);
        await mailTransport.sendMail(mailOptions);
        console.log('Account deletion confirmation email sent to:', 'sonhoang');
        await updateStatus(emails[i]);

        if (i === (emails.length-1) ) {
        console.log('======== start again ==================')
        mailTransport.close();
        }
    }
}
  job.start();
  
}, null, true);


job.start();