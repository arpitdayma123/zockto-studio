import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, Palette, Mic, FileText, Play, ChevronLeft, ChevronRight,
  Check, Loader2, Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const STYLES = [
  { id: "studio", label: "Studio", emoji: "🎬" },
  { id: "cafe", label: "Cafe", emoji: "☕" },
  { id: "outdoor", label: "Outdoor", emoji: "🌿" },
  { id: "office", label: "Office", emoji: "🏢" },
  { id: "neon", label: "Neon", emoji: "💜" },
  { id: "minimal", label: "Minimal", emoji: "⚪" },
];

const VOICES = [
  { id: "alloy-m", name: "Alloy", gender: "Male", lang: "English" },
  { id: "nova-f", name: "Nova", gender: "Female", lang: "English" },
  { id: "echo-m", name: "Echo", gender: "Male", lang: "English" },
  { id: "shimmer-f", name: "Shimmer", gender: "Female", lang: "English" },
  { id: "onyx-m", name: "Onyx", gender: "Male", lang: "English" },
  { id: "fable-f", name: "Fable", gender: "Female", lang: "English" },
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
  const { toast } = useToast();

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
    setGenerating(true);
    setProgress(0);
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 15;
      });
    }, 500);

    // Simulate webhook call
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setGenerating(false);
        toast({
          title: "Video Generated!",
          description: "Your AI video has been created. Check the Results page.",
        });
      }, 500);
    }, 5000);
  };

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
            {/* Step 0: Upload */}
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

            {/* Step 1: Style */}
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

            {/* Step 2: Voice */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-1">Choose a Voice</h2>
                <p className="text-sm text-muted-foreground mb-4">Cartesia API voices</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOICES.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVoice(v.id)}
                      className={`glass rounded-xl p-4 text-left transition-all hover:border-primary/50 flex items-center gap-3 ${
                        voice === v.id ? "border-primary ring-2 ring-primary/30" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        v.gender === "Male" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"
                      }`}>
                        {v.name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.gender} · {v.lang}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Script */}
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

            {/* Step 4: Review & Generate */}
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
                      <div className="text-sm font-medium">{VOICES.find(v => v.id === voice)?.name}</div>
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

        {/* Navigation */}
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
