import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";


const resend = new Resend(process.env.RESEND_API_KEY);


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);



export default async function handler(req, res) {


  if (req.method !== "POST") {

    return res.status(405).json({
      message: "Method not allowed",
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
      service,
      screenshotUrl,
    } = req.body;




    // 1. SAVE BOOKING TO DATABASE

    const { error: databaseError } = await supabase
      .from("bashaashaa")
      .insert([

        {

          name,
          phone,
          email,
          telegram,
          service,
          booking_date: date,
          booking_time: time,
          screenshot_url: screenshotUrl,
          booking_status: "confirmed",

        }

      ]);



    if (databaseError) {

      throw new Error(databaseError.message);

    }




    const message = `
📸 NEW BOOKING REQUEST

👤 Name:
${name}

📞 Phone:
${phone}

📧 Email:
${email || "Not provided"}

💬 Telegram:
${telegram || "Not provided"}

📅 Date:
${date}

⏰ Time:
${time}

🎞 Service:
${service}

💳 Payment Screenshot:
${screenshotUrl || "Not provided"}
`;





    // 2. SEND TELEGRAM

    const telegramResponse = await fetch(

      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,

      {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },


        body: JSON.stringify({

          chat_id: process.env.TELEGRAM_CHAT_ID,

          text: message,

        }),

      }

    );



    if (!telegramResponse.ok) {

      throw new Error("Telegram notification failed");

    }





    // 3. SEND EMAIL

    await resend.emails.send({

      from: "Bashaashaa Website <onboarding@resend.dev>",

      to: [
        "sifenabduselam7@gmail.com"
      ],

      subject: "New Photography Booking Request",

      text: message,

    });





    return res.status(200).json({

      success: true,

    });



  } catch(error) {


    console.error(error);


    return res.status(500).json({

      error: error.message || "Something went wrong",

    });


  }


}