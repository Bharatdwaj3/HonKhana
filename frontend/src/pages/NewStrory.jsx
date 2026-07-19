import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Type, Image, AlignLeft } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import api from "../util/api";
import { useSelector } from "react-redux";



export default function NewStory() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("history");
  const [saving, setSaving] = useState(false);
const { user } = useSelector((state) => state.avatar);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: true,
        orderedList: true,
      }),
    ],
    content: "<p>Start writing your story here...</p>",
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 text-foreground",
      },
    },
  });

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!title.trim() || !editor?.getText().trim()) {
      alert("Title and content are required");
      return;
    }

    setSaving(true);

    try {
      await api.post("/content", {
        title: title,
        description: editor.getHTML(),
        category: category,
        mediaType: "text",
      });

      alert("Story published!");
      navigate("/writer");
    } catch (err) {
      console.error(err);
      alert("Failed to publish story");
    } finally {
      setSaving(false);
    }
  };

  if (!editor) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 hover:bg-foreground/5 rounded-lg transition-colors border border-border"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-3xl font-black tracking-tight">New Story</h1>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={saving || !title.trim() || !editor.getText().trim()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                saving || !title.trim() || !editor.getText().trim()
                  ? "bg-foreground/10 text-foreground/40 cursor-not-allowed shadow-none"
                  : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
              }`}
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" />}
              {saving ? "Publishing..." : "Publish Story"}
              {!saving && <Save className="h-5 w-5" />}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                placeholder="Enter a captivating title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-border focus:border-primary outline-none pb-4 placeholder:text-foreground/30 text-foreground transition-colors"
              />
            </div>

            <div className="text-sm text-muted-foreground mt-2">
              Publishing as:{" "}
              <span className="font-medium text-foreground">
                {user?.fullName || user?.userName || "Loading..."}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-foreground/60">
                  Category:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:border-primary outline-none text-sm font-medium cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="history">History</option>
                  <option value="science">Science</option>
                  <option value="fiction">Fiction</option>
                  <option value="daily">Daily Life</option>
                  <option value="art">Art & Culture</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                </select>
              </div>

              <div className="hidden md:flex items-center gap-4 text-xs text-foreground/40">
                <div className="flex items-center gap-1.5">
                  <Type size={14} />
                  <span>Ctrl+B = Bold</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlignLeft size={14} />
                  <span>Ctrl+I = Italic</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
              <div className="md:hidden bg-foreground/[0.02] px-6 py-3 border-b border-border">
                <p className="text-xs text-foreground/50">
                  Use keyboard shortcuts for formatting: Ctrl+B (bold), Ctrl+I
                  (italic)
                </p>
              </div>

              <div className="bg-card">
                <EditorContent editor={editor} className="article-text" />
              </div>
            </div>

            <div className="md:hidden flex gap-3 pt-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-border rounded-xl font-semibold text-sm hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={saving || !title.trim() || !editor.getText().trim()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  saving || !title.trim() || !editor.getText().trim()
                    ? "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>

            <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-6 mt-8">
              <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                <Image size={18} className="text-secondary" />
                Writing Tips
              </h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>• Write a compelling title that captures attention</li>
                <li>
                  • Choose the most relevant category for better discoverability
                </li>
                <li>• Use headings to structure your content</li>
                <li>• Keep paragraphs short and readable</li>
                <li>• Proofread before publishing</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
