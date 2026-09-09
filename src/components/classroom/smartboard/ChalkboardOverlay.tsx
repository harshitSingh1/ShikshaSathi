import { useEffect, useRef, useState } from "react";
import {
  Download,
  Eraser,
  Highlighter,
  Paintbrush,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ToolType = "pen" | "highlighter" | "eraser";

const CHALK_COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Yellow", value: "#fde047" },
  { name: "Cyan", value: "#38bdf8" },
  { name: "Pink", value: "#f472b6" },
  { name: "Lime", value: "#4ade80" },
];

export function ChalkboardOverlay({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#fde047"); // Default yellow chalk
  const [lineWidth, setLineWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      // Save content before resize
      const prevData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      if (prevData.width > 0) {
        ctx.putImageData(prevData, 0, 0);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (historyRef.current.length > 20) {
      historyRef.current.shift();
    }
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prevState = historyRef.current.pop();
    if (prevState) {
      ctx.putImageData(prevState, 0, 0);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSaveNotes = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `ShikshaSathi-Chalkboard-Notes-${Date.now()}.png`;
    a.click();
  };

  // Touch & mouse coordinates
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    saveState();
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);

    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = lineWidth * 5;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = lineWidth * 4;
      ctx.lineCap = "square";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.globalAlpha = 1.0;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.closePath();
  };

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      {/* Drawing Canvas */}
      <canvas
        ref={canvasRef}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onPointerCancel={stopDrawing}
        className="h-full w-full pointer-events-auto touch-none cursor-crosshair"
      />

      {/* Floating Smart Board Chalk Toolbar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-2 rounded-full border border-border/80 bg-card/95 px-4 py-2 shadow-2xl backdrop-blur-xl animate-slide-up">
        {/* Tool: Chalk/Pen */}
        <button
          onClick={() => setTool("pen")}
          title="Chalk Pen"
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            tool === "pen" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Paintbrush className="h-4 w-4" />
        </button>

        {/* Tool: Highlighter */}
        <button
          onClick={() => setTool("highlighter")}
          title="Highlighter"
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            tool === "highlighter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Highlighter className="h-4 w-4" />
        </button>

        {/* Tool: Eraser */}
        <button
          onClick={() => setTool("eraser")}
          title="Eraser"
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full transition-colors",
            tool === "eraser" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <Eraser className="h-4 w-4" />
        </button>

        <div className="h-5 w-[1px] bg-border" />

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          {CHALK_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => {
                setColor(c.value);
                if (tool === "eraser") setTool("pen");
              }}
              title={c.name}
              style={{ backgroundColor: c.value }}
              className={cn(
                "h-5 w-5 rounded-full border border-black/20 transition-transform",
                color === c.value && tool !== "eraser" ? "scale-125 ring-2 ring-primary ring-offset-2" : "hover:scale-110",
              )}
            />
          ))}
        </div>

        <div className="h-5 w-[1px] bg-border" />

        {/* Actions */}
        <button
          onClick={handleUndo}
          title="Undo"
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleClear}
          title="Clear Chalkboard"
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={handleSaveNotes}
          title="Save Board Notes as Image"
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-primary"
        >
          <Download className="h-3.5 w-3.5" />
        </button>

        <div className="h-5 w-[1px] bg-border" />

        <button
          onClick={onClose}
          title="Exit Chalkboard Mode"
          className="grid h-8 w-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-destructive hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
