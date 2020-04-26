const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.sendgridAPIKey);


const welcomeEmail = (email, name) => {
    
const msg = {
    to: email,
    from: 'moatasemsalama954@outlook.com',
    subject: 'Welcome Email',
    text:`Welcome here Mr. ${name} ,How things going on !` 
}
    sgMail.send(msg)
}
  


const cancelEmail = (email, name) => {
    
    const msg = {
        to: email,
        from: 'moatasemsalama954@outlook.com',
        subject: 'GoodBYE Email',
        text:`Sorry for this Mr. ${name}, We Will Miss You alot !` 
    }
        sgMail.send(msg)
    }

  module.exports = {
      welcomeEmail,
      cancelEmail
  }