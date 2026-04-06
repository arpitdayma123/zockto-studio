import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: claimsData, error: claimsError } = await userClient.auth.getUser();
    if (claimsError || !claimsData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.user.id;
    const { resultId, imageUrl, style, voice, script, title } = await req.json();

    if (!resultId || !imageUrl || !style || !voice || !script) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update status to processing
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    await adminClient
      .from("video_results")
      .update({ status: "processing" })
      .eq("id", resultId)
      .eq("user_id", userId);

    // TODO: Replace with actual AI video generation webhook call
    // For now, simulate processing and mark as success after a delay
    // In production, you would:
    // 1. Send webhook to your AI service with image, style, voice, script
    // 2. The AI service processes the video
    // 3. The AI service calls back to update the video_results row with video_url

    // Simulate: mark as success with a placeholder
    setTimeout(async () => {
      await adminClient
        .from("video_results")
        .update({
          status: "success",
          video_url: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder
        })
        .eq("id", resultId);
    }, 10000); // 10 second simulated processing

    return new Response(
      JSON.stringify({ message: "Video generation started", resultId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
