import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VideoOff, Download, Play, Loader2, LogIn, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface VideoResult {
  id: string;
  status: string;
  video_url: string | null;
  title: string;
  created_at: string;
  style: string | null;
}

const Results = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("video_results")
      .select("id, status, video_url, title, created_at, style")
      .order("created_at", { ascending: false });
    setResults(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchResults();

    // Realtime subscription for status updates
    if (!user) return;
    const channel = supabase
      .channel("video-results")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "video_results" },
        (payload) => {
          setResults((prev) =>
            prev.map((r) => (r.id === payload.new.id ? { ...r, ...payload.new } : r))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <motion.div
          className="glass rounded-2xl p-12 text-center max-w-md mx-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <LogIn className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to view your generated videos.</p>
          <Link to="/auth">
            <Button className="gradient-bg text-white border-0">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const successVideos = results.filter((r) => r.status === "success");
  const processingVideos = results.filter((r) => r.status === "processing" || r.status === "pending");

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.div className="flex items-center justify-between mb-2" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold">
            Your <span className="gradient-text">Results</span>
          </h1>
          <Button variant="outline" size="sm" onClick={fetchResults}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        </motion.div>
        <p className="text-muted-foreground mb-10">All your generated AI videos</p>

        {/* Processing videos */}
        {processingVideos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Processing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {processingVideos.map((video) => (
                <div key={video.id} className="glass rounded-xl p-4 flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground capitalize">{video.status}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        ) : successVideos.length === 0 && processingVideos.length === 0 ? (
          <motion.div
            className="glass rounded-2xl p-16 text-center max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          >
            <VideoOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">No Videos Yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Create your first AI video to see it here.</p>
            <Link to="/create">
              <Button className="gradient-bg text-white border-0">
                Create a Video <Play className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {successVideos.map((video, i) => (
              <motion.div
                key={video.id}
                className="glass rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-[9/16] bg-secondary flex items-center justify-center max-h-[400px] mx-auto">
                  {video.video_url ? (
                    <video src={video.video_url} controls className="w-full h-full object-contain" />
                  ) : (
                    <Play className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-sm font-medium block truncate">{video.title}</span>
                    <span className="text-xs text-muted-foreground capitalize">{video.style}</span>
                  </div>
                  {video.video_url && (
                    <a href={video.video_url} download>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
