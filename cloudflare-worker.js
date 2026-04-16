export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return jsonResponse({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }

    try {
      const payload = await request.json();

      const telegramToken = env.TELEGRAM_BOT_TOKEN;
      const chatIdsRaw = env.TELEGRAM_CHAT_IDS || "";
      const chatIds = chatIdsRaw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      if (!telegramToken || !chatIds.length) {
        return jsonResponse({ ok: false, error: "Telegram env vars are missing" }, 500, corsHeaders);
      }

      const text = buildTelegramMessage(payload);
      const results = [];

      for (const chatId of chatIds) {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramToken}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              parse_mode: "HTML"
            })
          }
        );

        const telegramData = await telegramResponse.json();
        results.push({
          chatId,
          ok: telegramResponse.ok && telegramData.ok === true
        });
      }

      const allSent = results.every((item) => item.ok);
      return jsonResponse({ ok: allSent, results }, allSent ? 200 : 502, corsHeaders);
    } catch (error) {
      return jsonResponse(
        {
          ok: false,
          error: "Webhook processing failed",
          details: String(error && error.message ? error.message : error)
        },
        500,
        corsHeaders
      );
    }
  }
};

function buildTelegramMessage(payload) {
  const safe = (value) => escapeHtml(String(value || "-"));

  return [
    "<b>New booking</b>",
    "",
    `<b>Traveler:</b> ${safe(payload.traveler || payload.userName)}`,
    `<b>Phone:</b> ${safe(payload.phone)}`,
    `<b>Destination:</b> ${safe(payload.destination || payload.destinationName)}`,
    `<b>People:</b> ${safe(payload.people)}`,
    `<b>Travel date:</b> ${safe(payload.travelDateLabel || payload.travelDate)}`,
    `<b>Total:</b> ${safe(payload.totalLabel || payload.totalUsd)}`,
    `<b>Language:</b> ${safe(payload.language)}`,
    `<b>Created:</b> ${safe(payload.createdLabel || payload.createdAt)}`,
    "",
    `<b>Booking ID:</b> ${safe(payload.bookingId || payload.id)}`
  ].join("\n");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function jsonResponse(data, status, headers) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers
    }
  });
}
