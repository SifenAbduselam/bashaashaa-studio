```jsx
import { useEffect, useRef, useState } from "react";
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

  // English / Amharic
  const [language, setLanguage] = useState("en");

  // Slots already booked for selected date
  const [bookedSlots, setBookedSlots] = useState([]);

  // Loading slots
  const [loadingSlots, setLoadingSlots] = useState(false);

  // File input reference
  const fileInputRef = useRef(null);

  // =========================================================
  // TRANSLATIONS
  // =========================================================

  const text = {
    en: {
      fullName: "Full Name",
      yourName: "Your name",

      phone: "Phone",
      phonePlaceholder: "09XX XXX XXX",

      email: "Email (optional)",
      emailPlaceholder: "you@email.com",

      telegram: "Telegram Username (optional)",
      telegramPlaceholder: "@username",

      date: "Preferred Date",
      time: "Preferred Time",

      service: "Service",

      payment: "Payment Screenshot",
      chooseFile: "Choose payment screenshot",
      noFile: "No file selected",

      send: "Send Booking Request",
      sending: "Sending...",

      success: "Booking request sent successfully!",
      successDetail: "We’ll contact you soon.",

      booked: "Booked",
      available: "Available",
      loading: "Checking availability...",

      required: "Please fill in all required fields.",

      invalidPhone:
        "Please enter a valid Ethiopian phone number (09XXXXXXXX or 07XXXXXXXX).",

      invalidEmail: "Please enter a valid email address.",

      invalidDate: "Please select a date.",

      invalidTime: "Please select a time.",

      invalidFile: "Please select a valid image file.",

      fileTooLarge: "Image must be smaller than 5MB.",

      slotTaken:
        "This time slot was just booked by someone else. Please choose another time.",

      serverError: "Something went wrong. Please try again.",
    },

    am: {
      fullName: "ሙሉ ስም",
      yourName: "ስምዎን ያስገቡ",

      phone: "ስልክ",
      phonePlaceholder: "09XX XXX XXX",

      email: "ኢሜይል (አማራጭ)",
      emailPlaceholder: "you@email.com",

      telegram: "Telegram ዩዘርኔም (አማራጭ)",
      telegramPlaceholder: "@username",

      date: "የሚፈልጉት ቀን",
      time: "የሚፈልጉት ሰዓት",

      service: "አገልግሎት",

      payment: "የክፍያ ማረጋገጫ",
      chooseFile: "የክፍያ ምስል ይምረጡ",
      noFile: "ምስል አልተመረጠም",

      send: "የቦታ ማስያዣ ጥያቄ ይላኩ",
      sending: "በመላክ ላይ...",

      success: "የቦታ ማስያዣ ጥያቄዎ ተልኳል!",
      successDetail: "በቅርቡ እናገኝዎታለን።",

      booked: "ተይዟል",
      available: "ክፍት",
      loading: "የሰዓት ክፍትነት በመፈተሽ ላይ...",

      required: "እባክዎ አስፈላጊ መስኮቶችን ይሙሉ።",

      invalidPhone:
        "እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ (09XXXXXXXX ወይም 07XXXXXXXX)።",

      invalidEmail: "እባክዎ ትክክለኛ ኢሜይል ያስገቡ።",

      invalidDate: "እባክዎ ቀን ይምረጡ።",

      invalidTime: "እባክዎ ሰዓት ይምረጡ።",

      invalidFile: "እባክዎ ትክክለኛ የምስል ፋይል ይምረጡ።",

      fileTooLarge: "የምስሉ መጠን ከ5MB መብለጥ የለበትም።",

      slotTaken:
        "ይህ ሰዓት አሁን በሌላ ሰው ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።",

      serverError: "ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
    },
  };

  const t = text[language];

  // =========================================================
  // UPDATE FORM
  // =========================================================

  const update = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  // =========================================================
  // DATE CHANGE
  // =========================================================

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    setForm((prev) => ({
      ...prev,
      date: selectedDate,
      time: "",
    }));
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setForm((prev) => ({
        ...prev,
        paymentScreenshot: null,
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      showError(t.invalidFile);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError(t.fileTooLarge);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setForm((prev) => ({
      ...prev,
      paymentScreenshot: file,
    }));
  };

  // =========================================================
  // ERROR POPUP
  // =========================================================

  const showError = (message) => {
    setStatus("error");
    setErrorMsg(message);

    setTimeout(() => {
      setStatus((current) =>
        current === "error" ? "idle" : current
      );
    }, 5000);
  };

  // =========================================================
  // SUCCESS POPUP
  // =========================================================

  const showSuccess = () => {
    setStatus("success");

    setTimeout(() => {
      setStatus((current) =>
        current === "success" ? "idle" : current
      );
    }, 5000);
  };

  // =========================================================
  // LOAD BOOKED SLOTS WHEN DATE CHANGES
  // =========================================================

  useEffect(() => {
    const loadBookedSlots = async () => {
      if (!form.date) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);

      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("booking_time")
          .eq("booking_date", form.date);

        if (error) {
          console.error("Availability error:", error);
          setBookedSlots([]);
          return;
        }

        const slots = (data || []).map(
          (booking) => booking.booking_time
        );

        setBookedSlots(slots);

        // If currently selected time became unavailable
        if (form.time && slots.includes(form.time)) {
          setForm((prev) => ({
            ...prev,
            time: "",
          }));

          showError(t.slotTaken);
        }
      } catch (error) {
        console.error(error);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadBookedSlots();
  }, [form.date]);

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!form.name || !form.phone || !form.date || !form.time) {
      showError(t.required);
      return false;
    }

    // Ethiopian mobile numbers:
    // 09XXXXXXXX
    // 07XXXXXXXX
    // +2519XXXXXXXX
    // +2517XXXXXXXX

    const phoneRegex =
      /^(09|07)\d{8}$|^\+251(9|7)\d{8}$/;

    if (!phoneRegex.test(form.phone.trim())) {
      showError(t.invalidPhone);
      return false;
    }

    if (form.email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email.trim())) {
        showError(t.invalidEmail);
        return false;
      }
    }

    if (!form.date) {
      showError(t.invalidDate);
      return false;
    }

    if (!form.time) {
      showError(t.invalidTime);
      return false;
    }

    // Frontend availability check
    if (bookedSlots.includes(form.time)) {
      showError(t.slotTaken);
      return false;
    }

    return true;
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "sending") return;

    if (!validateForm()) return;

    setStatus("sending");
    setErrorMsg("");

    try {
      let screenshotUrl = "";

      // =====================================================
      // 1. UPLOAD PAYMENT SCREENSHOT
      // =====================================================

      if (form.paymentScreenshot) {
        const file = form.paymentScreenshot;

        const fileName = `${Date.now()}-${file.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("payment-screenshots")
            .upload(fileName, file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const {
          data: signedUrlData,
          error: signedUrlError,
        } = await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(fileName, 60 * 60);

        if (signedUrlError) {
          throw new Error(signedUrlError.message);
        }

        screenshotUrl = signedUrlData.signedUrl;
      }

      // =====================================================
      // 2. SEND BOOKING TO API
      // =====================================================

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

      // =====================================================
      // 3. HANDLE API ERROR
      // =====================================================

      if (!res.ok) {
        if (res.status === 409) {
          // The database unique index caught a race condition.
          // This is VERY important for double-booking protection.

          // Refresh booked slots
          const { data: latestBookings } = await supabase
            .from("bookings")
            .select("booking_time")
            .eq("booking_date", form.date);

          setBookedSlots(
            (latestBookings || []).map(
              (booking) => booking.booking_time
            )
          );

          setForm((prev) => ({
            ...prev,
            time: "",
          }));

          throw new Error(t.slotTaken);
        }

        throw new Error(data.error || t.serverError);
      }

      // =====================================================
      // 4. SUCCESS
      // =====================================================

      setForm(initialState);

      // THIS clears the actual browser file input.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Remove booked slot from the current list immediately.
      setBookedSlots((prev) => [...prev, form.time]);

      showSuccess();
    } catch (error) {
      console.error("Booking error:", error);

      setStatus("error");

      setErrorMsg(
        error.message || t.serverError
      );

      setTimeout(() => {
        setStatus((current) =>
          current === "error" ? "idle" : current
        );
      }, 5000);
    }
  };

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          LANGUAGE SWITCH
      ===================================================== */}

      <div className="flex justify-end mb-6">
        <button
          type="button"
          onClick={() =>
            setLanguage((current) =>
              current === "en" ? "am" : "en"
            )
          }
          className="
            text-[10px]
            tracking-[0.2em]
            uppercase
            border
            border-hairline/60
            px-4
            py-2
            text-bone
            hover:bg-bone
            hover:text-ink
            transition-colors
          "
        >
          {language === "en"
            ? "አማርኛ"
            : "English"}
        </button>
      </div>

      {/* =====================================================
          BOOKING FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
      >
        {/* NAME + PHONE */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.fullName}
            </label>

            <input
              required
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder={t.yourName}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.phone}
            </label>

            <input
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
              placeholder={t.phonePlaceholder}
              className={FIELD_CLASS}
            />

            {form.phone &&
              !/^(09|07)\d{8}$|^\+251(9|7)\d{8}$/.test(
                form.phone.trim()
              ) && (
                <p className="mt-2 text-[10px] text-parchment">
                  {t.invalidPhone}
                </p>
              )}
          </div>
        </div>

        {/* EMAIL + TELEGRAM */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.email}
            </label>

            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder={t.emailPlaceholder}
              className={FIELD_CLASS}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.telegram}
            </label>

            <input
              type="text"
              value={form.telegram}
              onChange={update("telegram")}
              placeholder={t.telegramPlaceholder}
              className={FIELD_CLASS}
            />
          </div>
        </div>

        {/* DATE + TIME */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DATE */}

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.date}
            </label>

            <input
              required
              type="date"
              min={today}
              value={form.date}
              onChange={handleDateChange}
              className={`${FIELD_CLASS} [color-scheme:dark]`}
            />
          </div>

          {/* TIME */}

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.time}
            </label>

            <select
              required
              value={form.time}
              onChange={update("time")}
              disabled={!form.date || loadingSlots}
              className={`${FIELD_CLASS} [color-scheme:dark] disabled:opacity-40`}
            >
              <option value="" className="bg-ink">
                {loadingSlots
                  ? t.loading
                  : !form.date
                  ? t.date
                  : t.time}
              </option>

              {TIME_SLOTS.map((slot) => {
                const isBooked =
                  bookedSlots.includes(slot);

                return (
                  <option
                    key={slot}
                    value={slot}
                    disabled={isBooked}
                    className="bg-ink"
                  >
                    {slot}
                    {isBooked
                      ? ` — ${t.booked}`
                      : ""}
                  </option>
                );
              })}
            </select>

            {form.date && !loadingSlots && (
              <p className="mt-2 text-[10px] text-smoke">
                {bookedSlots.length > 0
                  ? `${bookedSlots.length} ${language === "en"
                      ? "slot(s) already booked"
                      : "ሰዓት(ቶች) ተይዘዋል"}`
                  : language === "en"
                  ? "All time slots are available"
                  : "ሁሉም ሰዓቶች ክፍት ናቸው"}
              </p>
            )}
          </div>
        </div>

        {/* SERVICE */}

        <div>
          <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
            {t.service}
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
          <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
            {t.payment}
          </label>

          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="paymentScreenshot"
            />

            <label
              htmlFor="paymentScreenshot"
              className="
                inline-flex
                cursor-pointer
                border
                border-hairline/60
                px-5
                py-3
                text-xs
                text-bone
                hover:bg-bone
                hover:text-ink
                transition-colors
              "
            >
              {t.chooseFile}
            </label>

            <p className="mt-3 text-xs text-smoke">
              {form.paymentScreenshot
                ? form.paymentScreenshot.name
                : t.noFile}
            </p>
          </div>
        </div>

        {/* SUBMIT */}

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
            disabled:cursor-not-allowed
          "
        >
          {status === "sending"
            ? t.sending
            : t.send}
        </button>
      </form>

      {/* =====================================================
          SUCCESS / ERROR TOAST
      ===================================================== */}

      <AnimatePresence>
        {status === "success" && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            className="
              fixed
              bottom-6
              right-6
              z-50
              max-w-sm
              border
              border-hairline/70
              bg-ink
              px-6
              py-5
              shadow-2xl
            "
          >
            <p className="text-sm text-bone">
              {t.success}
            </p>

            <p className="mt-1 text-xs text-smoke">
              {t.successDetail}
            </p>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            className="
              fixed
              bottom-6
              right-6
              z-50
              max-w-sm
              border
              border-parchment/60
              bg-ink
              px-6
              py-5
              shadow-2xl
            "
          >
            <p className="text-sm text-parchment">
              {errorMsg}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```
