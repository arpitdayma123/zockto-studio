import { motion } from "framer-motion";
import { VideoOff, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data — replace with real backend data
const MOCK_RESULTS: Array<{
  id: string;
  status: "pending" | "processing" | "success";
  video_url: string | null;
  title: string;
}> = [];

const Results = () => {
  const successVideos = MOCK_RESULTS.filter((r) => r.status === "success");

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          Your <span className="gradient-text">Results</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-10">All your generated AI videos</p>

        {successVideos.length === 0 ? (
          <motion.div
            className="glass rounded-2xl p-16 text-center max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          >
            <VideoOff className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">No Videos Yet</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Create your first AI video to see it here.
            </p>
            <a href="/create">
              <Button className="gradient-bg text-white border-0">
                Create a Video <Play className="h-4 w-4 ml-1" />
              </Button>
            </a>
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
                <div className="aspect-video bg-secondary flex items-center justify-center">
                  {video.video_url ? (
                    <video src={video.video_url} controls className="w-full h-full object-cover" />
                  ) : (
                    <Play className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">{video.title}</span>
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
