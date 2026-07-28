import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export default async function handler(req, res) {

  if(req.method !== "POST"){
    return res.status(405).json({
      message:"Method not allowed"
    });
  }


  try {

    const {
      name,
      phone,
      email,
      telegram,
      date,
      time,
      service
    } = req.body;


    const message = `
📸 New Booking Request

👤 Name:
${name}

📞 Phone:
${phone}

📧 Email:
${email || "Not provided"}

Telegram:
${telegram || "Not provided"}

📅 Date:
${date}

⏰ Time:
${time}

🎞 Service:
${service}
    `;


    // TELEGRAM

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          chat_id:process.env.TELEGRAM_CHAT_ID,
          text:message
        })
      }
    );



    // EMAIL

    await resend.emails.send({

      from:"Bashaashaa Website <onboarding@resend.dev>",

      to:[
        "sifenabduselam7@gmail.com"
      ],

      subject:"New Photography Booking",

      text:message

    });



    return res.status(200).json({
      success:true
    });



  } catch(error){

    console.log(error);

    return res.status(500).json({
      error:"Something went wrong"
    });

  }

}