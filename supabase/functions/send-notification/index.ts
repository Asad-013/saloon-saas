import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.44.0';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  try {
    const { name, record } = await req.json();

    if (name === "on_new_booking_send_notification") {
      const bookingId = record.id;
      const userId = record.user_id;

      // Fetch the user's email and phone number
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, phone_number')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user data or user not found:", userError?.message);
        return new Response(JSON.stringify({ error: userError?.message || "User data not found" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      const userEmail = userData.email;
      const userPhoneNumber = userData.phone_number; // Assuming you add phone_number to auth.users metadata

      // Fetch the queued notification
      const { data: notificationData, error: notificationError } = await supabase
        .from('notifications')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('user_id', userId)
        .eq('type', 'email') // Targeting email confirmation for now
        .eq('status', 'queued')
        .single();

      if (notificationError || !notificationData) {
        console.error("Error fetching queued notification or not found:", notificationError?.message);
        return new Response(JSON.stringify({ error: notificationError?.message || "Notification not found" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      const notificationId = notificationData.id;

      // --- Send Email Confirmation (Placeholder) ---
      if (userEmail) {
        console.log(`Sending email to ${userEmail} for booking ${bookingId}`);
        // Replace with actual email sending logic (e.g., SendGrid, Mailgun API call)
        const emailSent = true; // Simulate success

        if (emailSent) {
          await supabase.from('notifications').update({ status: 'sent' }).eq('id', notificationId);
          console.log(`Email notification ${notificationId} marked as sent.`);
        } else {
          await supabase.from('notifications').update({ status: 'failed' }).eq('id', notificationId);
          console.error(`Email notification ${notificationId} failed to send.`);
        }
      }

      // --- Send SMS Confirmation (Placeholder) ---
      if (userPhoneNumber) {
        console.log(`Sending SMS to ${userPhoneNumber} for booking ${bookingId}`);
        // Replace with actual SMS sending logic (e.g., Twilio API call)
        const smsSent = true; // Simulate success

        if (smsSent) {
          // Optionally, create a new SMS notification record or update the existing one
          // For simplicity, we'll assume a single notification record per booking for now
          console.log(`SMS notification for ${bookingId} marked as sent.`);
        } else {
          console.error(`SMS notification for ${bookingId} failed to send.`);
        }
      }

      return new Response(JSON.stringify({ message: "Notification process initiated." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });

    } else {
      return new Response(JSON.stringify({ message: "Webhook received, but not for booking notification trigger." }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    }

  } catch (error) {
    console.error("Edge Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});
