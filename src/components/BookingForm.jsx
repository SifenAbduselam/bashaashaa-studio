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
  const [language, setLanguage] = useState("en");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fileInputRef = useRef(null);
  const notificationTimerRef = useRef(null);

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

      selectDate: "Select a date first",
      selectTime: "Select a time",

      send: "Send Booking Request",
      sending: "Sending...",

      success: "Booking request sent successfully!",
      successDetail: "We’ll contact you soon.",

      booked: "Booked",
      available: "Available",
      loading: "Checking availability...",

      slotsBooked: "slot(s) already booked",
      allAvailable: "All time slots are available",

      required: "Please fill in all required fields.",

      invalidName: "Please enter your full name.",

      invalidPhone:
        "Please enter a valid Ethiopian phone number (09XXXXXXXX, 07XXXXXXXX, +2519XXXXXXXX or +2517XXXXXXXX).",

      invalidEmail: "Please enter a valid email address.",

      invalidDate: "Please select a valid date.",

      pastDate: "Please select today or a future date.",

      invalidTime: "Please select a time.",

      invalidFile: "Please select a valid image file.",

      fileTooLarge: "Image must be smaller than 5MB.",

      slotTaken:
        "This time slot was just booked by someone else. Please choose another time.",

      uploadError: "Payment screenshot could not be uploaded.",

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

      selectDate: "መጀመሪያ ቀን ይምረጡ",
      selectTime: "ሰዓት ይምረጡ",

      send: "የቦታ ማስያዣ ጥያቄ ይላኩ",
      sending: "በመላክ ላይ...",

      success: "የቦታ ማስያዣ ጥያቄዎ ተልኳል!",
      successDetail: "በቅርቡ እናገኝዎታለን።",

      booked: "ተይዟል",
      available: "ክፍት",
      loading: "የሰዓት ክፍትነት በመፈተሽ ላይ...",

      slotsBooked: "ሰዓት(ቶች) ተይዘዋል",
      allAvailable: "ሁሉም ሰዓቶች ክፍት ናቸው",

      required: "እባክዎ አስፈላጊ መስኮቶችን ይሙሉ።",

      invalidName: "እባክዎ ሙሉ ስምዎን ያስገቡ።",

      invalidPhone:
        "እባክዎ ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ።",

      invalidEmail: "እባክዎ ትክክለኛ ኢሜይል ያስገቡ።",

      invalidDate: "እባክዎ ትክክለኛ ቀን ይምረጡ።",

      pastDate: "እባክዎ ዛሬን ወይም የወደፊት ቀን ይምረጡ።",

      invalidTime: "እባክዎ ሰዓት ይምረጡ።",

      invalidFile: "እባክዎ ትክክለኛ የምስል ፋይል ይምረጡ።",

      fileTooLarge: "የምስሉ መጠን ከ5MB መብለጥ የለበትም።",

      slotTaken:
        "ይህ ሰዓት አሁን በሌላ ሰው ተይዟል። እባክዎ ሌላ ሰዓት ይምረጡ።",

      uploadError: "የክፍያ ማረጋገጫው መላክ አልተቻለም።",

      serverError: "ስህተት ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።",
    },
  };

  const t = text[language];

  // =========================================================
  // TODAY
  // =========================================================

  const today = new Date().toISOString().split("T")[0];

  // =========================================================
  // CLEANUP NOTIFICATION TIMER
  // =========================================================

  useEffect(() => {
    return () => {
      if (notificationTimerRef.current) {
        clearTimeout(notificationTimerRef.current);
      }
    };
  }, []);

  // =========================================================
  // SHOW ERROR
  // =========================================================

  const showError = (message) => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setStatus("error");
    setErrorMsg(message);

    notificationTimerRef.current = setTimeout(() => {
      setStatus("idle");
      setErrorMsg("");
    }, 5000);
  };

  // =========================================================
  // SHOW SUCCESS
  // =========================================================

  const showSuccess = () => {
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }

    setStatus("success");

    notificationTimerRef.current = setTimeout(() => {
      setStatus("idle");
    }, 5000);
  };

  // =========================================================
  // UPDATE FORM
  // =========================================================

  const update = (key) => (e) => {
    setForm((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));

    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
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

    setBookedSlots([]);
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

    if (status === "error") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  // =========================================================
  // LOAD BOOKED SLOTS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

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

        if (cancelled) return;

        if (error) {
          console.error("Availability error:", error);
          setBookedSlots([]);
          return;
        }

        const slots = (data || []).map(
          (booking) => booking.booking_time
        );

        setBookedSlots(slots);

        // If the selected slot became booked,
        // clear it and notify the user.
        if (form.time && slots.includes(form.time)) {
          setForm((prev) => ({
            ...prev,
            time: "",
          }));

          showError(t.slotTaken);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Availability error:", error);
          setBookedSlots([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    };

    loadBookedSlots();

    return () => {
      cancelled = true;
    };
  }, [form.date]);

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    const cleanName = form.name.trim();
    const cleanPhone = form.phone.trim();
    const cleanEmail = form.email.trim();

    if (!cleanName || !cleanPhone || !form.date || !form.time) {
      showError(t.required);
      return false;
    }

    if (cleanName.length < 2) {
      showError(t.invalidName);
      return false;
    }

    // Ethiopian mobile numbers:
    // 09XXXXXXXX
    // 07XXXXXXXX
    // +2519XXXXXXXX
    // +2517XXXXXXXX
    const phoneRegex =
      /^(09|07)\d{8}$|^\+251(9|7)\d{8}$/;

    if (!phoneRegex.test(cleanPhone)) {
      showError(t.invalidPhone);
      return false;
    }

    if (cleanEmail) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        showError(t.invalidEmail);
        return false;
      }
    }

    if (form.date < today) {
      showError(t.pastDate);
      return false;
    }

    if (!form.time) {
      showError(t.invalidTime);
      return false;
    }

    // Frontend availability check.
    // The database UNIQUE constraint remains
    // the final protection against double booking.
    if (bookedSlots.includes(form.time)) {
      showError(t.slotTaken);
      return false;
    }

    return true;
  };

  // =========================================================
  // REFRESH BOOKED SLOTS
  // =========================================================

  const refreshBookedSlots = async (date) => {
    const { data, error } = await supabase
      .from("bookings")
      .select("booking_time")
      .eq("booking_date", date);

    if (error) {
      console.error("Could not refresh slots:", error);
      return;
    }

    const slots = (data || []).map(
      (booking) => booking.booking_time
    );

    setBookedSlots(slots);
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === "sending") {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    try {
      let screenshotUrl = "";

      // =====================================================
      // 1. UPLOAD PAYMENT SCREENSHOT
      // =====================================================

      if (form.paymentScreenshot) {
        const file = form.paymentScreenshot;

        // Deliberately NOT using a template literal here.
        // This avoids the parser problem from the previous file.
        const fileName =
          Date.now() + "-" + file.name;

        const { error: uploadError } =
          await supabase.storage
            .from("payment-screenshots")
            .upload(fileName, file);

        if (uploadError) {
          throw new Error(t.uploadError);
        }

        const {
          data: signedUrlData,
          error: signedUrlError,
        } = await supabase.storage
          .from("payment-screenshots")
          .createSignedUrl(fileName, 60 * 60);

        if (signedUrlError) {
          throw new Error(t.uploadError);
        }

        screenshotUrl =
          signedUrlData?.signedUrl || "";
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
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          telegram: form.telegram.trim(),
          service: form.service,
          date: form.date,
          time: form.time,
          screenshotUrl,
        }),
      });

      const responseText = await res.text();

      let data = {};

      try {
        data = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        data = {};
      }

      // =====================================================
      // 3. HANDLE API ERROR
      // =====================================================

      if (!res.ok) {
        // HTTP 409 = unique booking slot violation.
        if (res.status === 409) {
          await refreshBookedSlots(form.date);

          setForm((prev) => ({
            ...prev,
            time: "",
          }));

          throw new Error(t.slotTaken);
        }

        throw new Error(
          data.error || t.serverError
        );
      }

      // =====================================================
      // 4. SUCCESS
      // =====================================================

      const bookedDate = form.date;
      const bookedTime = form.time;

      // Reset ALL form fields.
      setForm({
        ...initialState,
        service: services[0].title,
      });

      // Clear the actual browser file input.
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Immediately mark the booked slot as unavailable.
      setBookedSlots((prev) => {
        if (prev.includes(bookedTime)) {
          return prev;
        }

        return [...prev, bookedTime];
      });

      // Keep the date's booking state refreshed in case
      // another booking happened at the same time.
      await refreshBookedSlots(bookedDate);

      showSuccess();
    } catch (error) {
      console.error("Booking error:", error);

      if (error instanceof Error) {
        setStatus("error");
        setErrorMsg(error.message || t.serverError);

        if (notificationTimerRef.current) {
          clearTimeout(notificationTimerRef.current);
        }

        notificationTimerRef.current = setTimeout(() => {
          setStatus("idle");
          setErrorMsg("");
        }, 5000);
      } else {
        showError(t.serverError);
      }
    }
  };

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
          onClick={() => {
            setLanguage((current) =>
              current === "en" ? "am" : "en"
            );
          }}
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
          {language === "en" ? "አማርኛ" : "English"}
        </button>
      </div>

      {/* =====================================================
          BOOKING FORM
      ===================================================== */}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8"
        noValidate
      >
        {/* ===================================================
            NAME + PHONE
        =================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NAME */}

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

          {/* PHONE */}

          <div>
            <label className="font-mono text-[10px] tracking-widest uppercase text-smoke">
              {t.phone}
            </label>

            <input
              required
              type="tel"
              inputMode="tel"
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

        {/* ===================================================
            EMAIL + TELEGRAM
        =================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* EMAIL */}

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

            {form.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                form.email.trim()
              ) && (
                <p className="mt-2 text-[10px] text-parchment">
                  {t.invalidEmail}
                </p>
              )}
          </div>

          {/* TELEGRAM */}

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

        {/* ===================================================
            DATE + TIME
        =================================================== */}

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
                  ? t.selectDate
                  : t.selectTime}
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
                      ? " — " + t.booked
                      : ""}
                  </option>
                );
              })}
            </select>

            {/* AVAILABILITY STATUS */}

            {form.date && !loadingSlots && (
              <p className="mt-2 text-[10px] text-smoke">
                {bookedSlots.length > 0
                  ? bookedSlots.length +
                    " " +
                    t.slotsBooked
                  : t.allAvailable}
              </p>
            )}
          </div>
        </div>

        {/* ===================================================
            SERVICE
        =================================================== */}

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

        {/* ===================================================
            PAYMENT SCREENSHOT
        =================================================== */}

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

            <p className="mt-3 text-xs text-smoke break-all">
              {form.paymentScreenshot
                ? form.paymentScreenshot.name
                : t.noFile}
            </p>
          </div>
        </div>

        {/* ===================================================
            SUBMIT BUTTON
        =================================================== */}

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
          SUCCESS / ERROR POPUPS
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
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-bone shrink-0" />

              <div>
                <p className="text-sm text-bone">
                  {t.success}
                </p>

                <p className="mt-1 text-xs text-smoke">
                  {t.successDetail}
                </p>
              </div>
            </div>
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
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-parchment shrink-0" />

              <div>
                <p className="text-sm text-parchment">
                  {errorMsg}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```
