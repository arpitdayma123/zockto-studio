import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Palette, Mic, FileText, Play, ChevronLeft, ChevronRight,
  Check, Loader2, Image as ImageIcon, LogIn, Volume2, Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";

interface PublicVoice {
  id: string;
  name: string;
  age: number | null;
  citizen: string | null;
  gender: string | null;
  voicelink: string | null;
  voiceid: string | null;
  language: string | null;
  lang_code: string | null;
  description: string | null;
}

const STYLES = [
  { id: "studio", label: "Studio", emoji: "🎬" },
  { id: "cafe", label: "Cafe", emoji: "☕" },
  { id: "outdoor", label: "Outdoor", emoji: "🌿" },
  { id: "office", label: "Office", emoji: "🏢" },
  { id: "neon", label: "Neon", emoji: "💜" },
  { id: "minimal", label: "Minimal", emoji: "⚪" },
];

const STEPS = [
  { icon: Upload, label: "Upload" },
  { icon: Palette, label: "Style" },
  { icon: Mic, label: "Voice" },
  { icon: FileText, label: "Script" },
  { icon: Play, label: "Generate" },
];

const Create = () => {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [style, setStyle] = useState("");
  const [voice, setVoice] = useState("");
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState<PublicVoice[]>([]);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoices = async () => {
      const { data } = await supabase
        .from("public_voices")
        .select("*")
        .order("name");
      if (data) setVoices(data as PublicVoice[]);
    };
    fetchVoices();
  }, []);

  const handlePlayVoice = (voicelink: string, voiceId: string) => {
    if (playingVoice === voiceId) {
      audioRef.current?.pause();
      audioRef.current = null;
      setPlayingVoice(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(voicelink);
    audio.onended = () => setPlayingVoice(null);
    audio.play();
    audioRef.current = audio;
    setPlayingVoice(voiceId);
  };

  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const canNext = () => {
    if (step === 0) return !!image;
    if (step === 1) return !!style;
    if (step === 2) return !!voice;
    if (step === 3) return script.length > 0 && script.length <= 1000;
    return true;
  };

  const handleGenerate = async () => {
    if (!user || !image) return;
    setGenerating(true);
    setProgress(0);

    try {
      // 1. Upload image to storage
      const fileExt = image.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, image);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(filePath);

      setProgress(20);

      // 2. Create video_results entry
      const resultId = crypto.randomUUID();
      const { error: insertError } = await supabase.from("video_results").insert({
        id: resultId,
        user_id: user.id,
        title: image.name.replace(/\.[^/.]+$/, ""),
        status: "pending",
        image_url: urlData.publicUrl,
        style,
        voice,
        script,
      });

      if (insertError) throw insertError;
      setProgress(40);

      // 3. Call edge function
      const { error: fnError } = await supabase.functions.invoke("generate-video", {
        body: {
          resultId,
          imageUrl: urlData.publicUrl,
          style,
          voice,
          script,
          title: image.name,
        },
      });

      if (fnError) throw fnError;

      // 4. Poll for completion
      const pollInterval = setInterval(async () => {
        const { data } = await supabase
          .from("video_results")
          .select("status")
          .eq("id", resultId)
          .single();

        if (data?.status === "success") {
          clearInterval(pollInterval);
          setProgress(100);
          setTimeout(() => {
            setGenerating(false);
            toast({
              title: "Video Generated!",
              description: "Your AI video is ready. Redirecting to results...",
            });
            navigate("/results");
          }, 500);
        } else if (data?.status === "failed") {
          clearInterval(pollInterval);
          setGenerating(false);
          toast({
            title: "Generation Failed",
            description: "Something went wrong. Please try again.",
            variant: "destructive",
          });
        } else {
          setProgress((p) => Math.min(p + 5, 95));
        }
      }, 2000);
    } catch (error: any) {
      setGenerating(false);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

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
          <p className="text-sm text-muted-foreground mb-6">
            You need to sign in to create AI videos.
          </p>
          <Link to="/auth">
            <Button className="gradient-bg text-white border-0">
              Sign In <LogIn className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        >
          Create Your <span className="gradient-text">AI Video</span>
        </motion.h1>
        <p className="text-center text-muted-foreground mb-8">Follow the steps to generate your video</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i < step ? "gradient-bg text-white" :
                  i === step ? "border-2 border-primary text-primary" :
                  "border border-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${i < step ? "gradient-bg" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl p-8"
          >
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upload Your Image</h2>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleImageDrop}
                  className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  ) : (
                    <div className="text-muted-foreground">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                      <p className="font-medium">Drag & drop or click to upload</p>
                      <p className="text-sm mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-1">Select Image Style</h2>
                <p className="text-sm text-muted-foreground mb-4">Powered by Nano Banana AI transformation</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`glass rounded-xl p-6 text-center transition-all hover:border-primary/50 ${
                        style === s.id ? "border-primary ring-2 ring-primary/30" : ""
                      }`}
                    >
                      <span className="text-3xl block mb-2">{s.emoji}</span>
                      <span className="font-medium text-sm">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-1">Choose a Voice</h2>
                <p className="text-sm text-muted-foreground mb-4">Preview and select a voice</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.voiceid || v.id)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:border-primary/50 flex items-center gap-3 ${
                        voice === (v.voiceid || v.id) ? "border-primary ring-2 ring-primary/30" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        v.gender === "Male" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"
                      }`}>
                        {v.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{v.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {v.gender} · {v.language === "hi" ? "Hindi" : "English"}
                          {v.age ? ` · ${v.age}y` : ""}
                        </div>
                        {v.description && (
                          <div className="text-xs text-muted-foreground/70 truncate mt-0.5">{v.description}</div>
                        )}
                      </div>
                      {v.voicelink && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayVoice(v.voicelink!, v.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            playingVoice === v.id ? "bg-primary/20 text-primary" : "bg-muted hover:bg-muted/80 text-muted-foreground"
                          }`}
                        >
                          {playingVoice === v.id ? <Square className="h-3 w-3" /> : <Volume2 className="h-3.5 w-3.5" />}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Enter Your Script</h2>
                <Textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value.slice(0, 1000))}
                  placeholder="Write what the AI voice should say in your video..."
                  rows={6}
                  className="resize-none"
                />
                <div className="text-right mt-2 text-xs text-muted-foreground">
                  <span className={script.length > 900 ? "text-destructive" : ""}>{script.length}</span>/1000
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                {generating ? (
                  <div>
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Generating Your Video...</h2>
                    <p className="text-sm text-muted-foreground mb-4">This usually takes a few minutes</p>
                    <Progress value={progress} className="max-w-xs mx-auto" />
                    <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Review & Generate</h2>
                    <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto mb-6">
                      <div className="text-sm text-muted-foreground">Image:</div>
                      <div className="text-sm font-medium truncate">{image?.name}</div>
                      <div className="text-sm text-muted-foreground">Style:</div>
                      <div className="text-sm font-medium capitalize">{style}</div>
                      <div className="text-sm text-muted-foreground">Voice:</div>
                      <div className="text-sm font-medium">{voices.find(v => (v.voiceid || v.id) === voice)?.name}</div>
                      <div className="text-sm text-muted-foreground">Script:</div>
                      <div className="text-sm font-medium truncate">{script.slice(0, 50)}...</div>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      size="lg"
                      className="gradient-bg text-white border-0 px-8"
                    >
                      Generate Video <Play className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {!generating && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 4 && (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="gradient-bg text-white border-0"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Create;
