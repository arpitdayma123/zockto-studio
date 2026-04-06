import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Upload, Palette, Mic, FileText, Play,
  Camera, Wand2, Zap, MonitorPlay, GraduationCap, Award, Shield,
  CameraOff, Brain, Clock, MousePointerClick
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  }),
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-glow" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-glow" style={{ animationDelay: "1.5s" }} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass mb-6">
              <Sparkles className="h-3 w-3 text-primary" /> AI-Powered Video Generation
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Create AI Videos<br />
            <span className="gradient-text">Without Shooting</span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-8"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Turn your image into a professional video in minutes using AI.
            No cameras, no actors, no editing skills needed.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
          >
            <Link to="/create">
              <Button size="lg" className="gradient-bg text-white border-0 px-8 text-base">
                Try Zockto <Play className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="px-8 text-base">
                See How It Works
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* About College */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by <span className="gradient-text">SCSIT, DAVV</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              School of Computer Science & Information Technology (SCSIT), established in 1986,
              is a premier institute under Devi Ahilya Vishwavidyalaya, Indore offering programs
              like MCA, M.Tech, M.Sc, and Ph.D in Computer Science.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: GraduationCap, label: "UGC Recognized" },
              { icon: Award, label: "AICTE Approved" },
              { icon: Shield, label: "DRDO Collaboration" },
            ].map((badge, i) => (
              <motion.div
                key={badge.label}
                className="glass rounded-xl p-6 text-center"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <badge.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <span className="font-semibold text-sm">{badge.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Guide */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            Project <span className="gradient-text">Guidance</span>
          </motion.h2>
          <motion.div
            className="glass rounded-2xl p-8 max-w-md mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          >
            <div className="w-20 h-20 rounded-full gradient-bg mx-auto mb-4 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold">Dr. Ugrasen Suman</h3>
            <p className="text-muted-foreground text-sm mt-1">Faculty, SCSIT DAVV Indore</p>
          </motion.div>
        </div>
      </section>

      {/* What is Zockto */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What is <span className="gradient-text">Zockto</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Zockto lets you generate AI videos without cameras, actors, or editing.
              Simply upload an image, pick a style, choose a voice, write your script, and generate.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CameraOff, title: "No Filming Required", desc: "Skip the camera entirely" },
              { icon: Brain, title: "AI-Generated Visuals", desc: "Powered by advanced AI models" },
              { icon: Clock, title: "Fast Generation", desc: "Videos ready in under 10 minutes" },
              { icon: MousePointerClick, title: "Easy Workflow", desc: "Simple 5-step process" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className="glass rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            How It <span className="gradient-text">Works</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Upload, step: "01", title: "Upload Image", desc: "Drag & drop your image" },
              { icon: Palette, step: "02", title: "Select Style", desc: "Studio, Cafe, Outdoor..." },
              { icon: Mic, step: "03", title: "Choose Voice", desc: "Male or female AI voices" },
              { icon: FileText, step: "04", title: "Enter Script", desc: "Write up to 1000 chars" },
              { icon: Play, step: "05", title: "Generate!", desc: "AI creates your video" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                className="glass rounded-xl p-6 text-center relative"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <span className="text-xs font-bold text-primary">{s.step}</span>
                <s.icon className="h-8 w-8 mx-auto my-3 text-primary" />
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <span className="gradient-text">Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Wand2, title: "AI Image Styling" },
              { icon: Mic, title: "AI Voice Generation" },
              { icon: Zap, title: "Fast Video Creation" },
              { icon: MonitorPlay, title: "No Editing Skills" },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="glass rounded-xl p-6 text-center hover:border-primary/50 transition-colors"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <f.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-sm">{f.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="glass rounded-2xl p-12 max-w-2xl mx-auto relative overflow-hidden"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            <div className="absolute inset-0 gradient-bg opacity-10" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Start Creating Your<br />
                <span className="gradient-text">AI Video Now</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Join the future of video creation — no filming required.
              </p>
              <Link to="/create">
                <Button size="lg" className="gradient-bg text-white border-0 px-8 text-base">
                  Try Zockto <Sparkles className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
