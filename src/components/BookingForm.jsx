import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { services } from "../data/photos";
import { supabase } from "../lib/supabase";
const initialState = {
  name: "",
  phone: "",
  email: "",
  telegram: "",
  service: services[0].title,
  date: "",
  time: "",
   paymentScreenshot: null,
};
const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];


const FIELD_CLASS =
  "w-full bg-transparent border-b border-hairline/70 focus:border-bone outline-none py-3 font-body text-bone placeholder:text-ash transition-colors duration-300";


export default function BookingForm() {

  const [form, setForm] = useState(initialState);

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

const handleFileChange = (e) => {

  const file = e.target.files[0];
console.log(file);
  setForm((prev) => ({
    ...prev,
    paymentScreenshot: file,
  }));

};



  const update = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

const handleSubmit = async (e) => {

  e.preventDefault();

  setStatus("sending");
  setErrorMsg("");

  try {

    let screenshotUrl = "";


    // Upload payment screenshot first
    if (form.paymentScreenshot) {

      const file = form.paymentScreenshot;

      const fileName = `${Date.now()}-${file.name}`;


      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(fileName, file);


      if (uploadError) {
        throw new Error(uploadError.message);
      }


      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(fileName, 60 * 60);


      if (signedUrlError) {
        throw new Error(signedUrlError.message);
      }


      screenshotUrl = signedUrlData.signedUrl;

    }



    // Send booking data to API
    const res = await fetch("/api/booking", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        name: form.name,
        phone: form.phone,
        email: form.email,
        telegram: form.telegram,
        service: form.service,
        date: form.date,
        time: form.time,
        screenshotUrl,

      }),

    });



    const text = await res.text();

    let data = {};

    try {

      data = text ? JSON.parse(text) : {};

    } catch {

      data = {};

    }



    if (!res.ok) {

      throw new Error(data.error || "Server error");

    }



    setStatus("success");

    setForm(initialState);



  } catch (error) {

    console.error(error);

    setStatus("error");

    setErrorMsg(
      error.message || "Something went wrong"
    );

  }

};



  return (

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8"
    >


      {/* NAME + PHONE */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


        <div>

          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Full Name
          </label>


          <input
            required
            type="text"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            className={FIELD_CLASS}
          />

        </div>



        <div>

          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Phone
          </label>


          <input
            required
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            placeholder="09XX XXX XXX"
            className={FIELD_CLASS}
          />

        </div>


      </div>





      {/* EMAIL + TELEGRAM */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


        <div>

          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Email (optional)
          </label>


          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@email.com"
            className={FIELD_CLASS}
          />

        </div>



        <div>

          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Telegram Username (optional)
          </label>


          <input
            type="text"
            value={form.telegram}
            onChange={update("telegram")}
            placeholder="@username"
            className={FIELD_CLASS}
          />

        </div>


      </div>





      {/* DATE + TIME */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">


        <div>

          <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
            Preferred Date
          </label>


          <input
            required
            type="date"
            value={form.date}
            onChange={update("date")}
            className={`${FIELD_CLASS} [color-scheme:dark]`}
          />

        </div>



<select
  required
  value={form.time}
  onChange={update("time")}
  className={`${FIELD_CLASS} [color-scheme:dark]`}
>
  <option value="">
    Select a time
  </option>

  {TIME_SLOTS.map((slot) => (
    <option
      key={slot}
      value={slot}
      className="bg-ink"
    >
      {slot}
    </option>
  ))}

</select>


      </div>





      {/* SERVICE */}

      <div>


        <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
          Service
        </label>


        <select
          value={form.service}
          onChange={update("service")}
          className={`${FIELD_CLASS} [color-scheme:dark]`}
        >

          {services.map((service) => (

            <option
              key={service.id}
              value={service.title}
              className="bg-ink"
            >
              {service.title}
            </option>

          ))}

        </select>

 


      </div>


{/* PAYMENT SCREENSHOT */}

<div>

  <label className="font-mono text-[10px] tracking-widest2 uppercase text-smoke">
    Payment Screenshot
  </label>


  <input
    required
    type="file"
    accept="image/png,image/jpeg,image/webp"
    onChange={handleFileChange}
    className="mt-3 text-bone"
  />


</div>



      <button

        type="submit"

        disabled={status === "sending"}

        className="
        mt-2
        self-start
        border
        border-bone/70
        text-bone
        text-xs
        tracking-[0.25em]
        uppercase
        px-9
        py-4
        hover:bg-bone
        hover:text-ink
        transition-colors
        duration-500
        disabled:opacity-50
        "

      >

        {status === "sending"
          ? "Sending..."
          : "Send Booking Request"}

      </button>





      <AnimatePresence mode="wait">


        {status === "success" && (

          <motion.p

            initial={{opacity:0,y:6}}

            animate={{opacity:1,y:0}}

            exit={{opacity:0}}

            className="
            font-body
            text-sm
            text-bone
            border
            border-hairline/60
            px-5
            py-4
            "

          >

            Your booking request has been sent successfully. We’ll contact you soon.

          </motion.p>

        )}





        {status === "error" && (

          <motion.p

            initial={{opacity:0,y:6}}

            animate={{opacity:1,y:0}}

            exit={{opacity:0}}

            className="
            font-body
            text-sm
            text-parchment
            border
            border-hairline/60
            px-5
            py-4
            "

          >

            {errorMsg}

          </motion.p>

        )}


      </AnimatePresence>


    </form>

  );
}