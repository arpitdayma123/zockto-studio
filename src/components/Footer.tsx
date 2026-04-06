import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/50 py-12 mt-20">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="gradient-text">Zockto</span>
          </div>
          <p className="text-sm text-muted-foreground">
            AI-powered video generation platform.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Links</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/create" className="hover:text-primary transition-colors">Create</Link>
            <Link to="/results" className="hover:text-primary transition-colors">Results</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Academic</h4>
          <p className="text-sm text-muted-foreground">SCSIT, DAVV Indore</p>
          <p className="text-sm text-muted-foreground">Guide: Dr. Ugrasen Suman</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Zockto — A College Project by SCSIT, DAVV
      </div>
    </div>
  </footer>
);

export default Footer;
