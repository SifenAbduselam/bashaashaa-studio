```javascript
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
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

    // Basic validation
    if (!name || !phone || !date || !time || !service) {
      return res.status(400).json({
        error: "Please fill in all required fields.",
      });
    }

    // =========================================================
    // 1. SAVE BOOKING
    // =========================================================

    const { data: insertedBooking, error: databaseError } =
      await supabase
        .from("bookings")
        .insert([
          {
            name,
            phone,
            email,
            telegram,
            service,
            booking_date: date,
            booking_time: time,
            screenshot_url: screenshotUrl || "",
            booking_status: "confirmed",
          },
        ])
        .select();

    // Log the database result for debugging
    console.log("INSERT RESULT:", insertedBooking);
    console.log("INSERT ERROR:", databaseError);

    // =========================================================
    // 2. HANDLE DATABASE ERRORS
    // =========================================================

    if (databaseError) {
      // PostgreSQL error 23505 = duplicate value
      // This is triggered by the unique_booking_slot index.
      if (databaseError.code === "23505") {
        return res.status(409).json({
          error:
            "This time slot is already booked. Please choose another time.",
        });
      }

      console.error("DATABASE ERROR:", databaseError);

      return res.status(500).json({
        error: databaseError.message || "Could not save booking.",
      });
    }

    // =========================================================
    // 3. CREATE NOTIFICATION MESSAGE
    // =========================================================

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

    // =========================================================
    // 4. SEND TELEGRAM
    // =========================================================

    try {
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
        console.error(
          "Telegram notification failed:",
          await telegramResponse.text()
        );
      }
    } catch (telegramError) {
      // Do NOT cancel the booking if Telegram fails.
      console.error("Telegram error:", telegramError);
    }

    // =========================================================
    // 5. SEND EMAIL
    // =========================================================

    try {
      await resend.emails.send({
        from: "Bashaashaa Website <onboarding@resend.dev>",
        to: ["sifenabduselam7@gmail.com"],
        subject: "New Photography Booking Request",
        text: message,
      });
    } catch (emailError) {
      // Do NOT cancel the booking if email fails.
      console.error("Email error:", emailError);
    }

    // =========================================================
    // 6. SUCCESS
    // =========================================================

    return res.status(200).json({
      success: true,
      message: "Booking created successfully.",
    });
  } catch (error) {
    console.error("BOOKING API ERROR:", error);

    return res.status(500).json({
      error: error.message || "Something went wrong.",
    });
  }
}
```
