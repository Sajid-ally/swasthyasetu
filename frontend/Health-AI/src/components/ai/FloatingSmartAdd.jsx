import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  X,
  Send,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  ImagePlus,
  CheckCircle2,
  FileText,
  Keyboard,
  Pill,
  UploadCloud,
  Languages,
  Activity,
  ShieldCheck,
  ScanLine,
  ClipboardPlus,
} from "lucide-react";

import {
  assistantCommand,
  uploadVoiceCommand,
  previewMedicineImage,
  confirmMedicineImage,
  previewMedicalReport,
  confirmMedicalReport,
} from "../../services/dashboardApi";
import { useUser } from "../../context/UserContext";

const quickCommands = [
  "sleep 7 hours",
  "water 3 litre",
  "steps 5000",
  "bp 120/80",
  "open family",
];

const tabs = [
  { id: "command", label: "Command", icon: Keyboard },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "medicine", label: "Medicine", icon: Pill },
  { id: "report", label: "Report", icon: FileText },
];

const flattenFloat32Arrays = (chunks) => {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Float32Array(totalLength);

  let offset = 0;

  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });

  return result;
};

const encodeWAV = (samples, sampleRate) => {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset, string) => {
    for (let i = 0; i < string.length; i += 1) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const floatTo16BitPCM = (offset, input) => {
    for (let i = 0; i < input.length; i += 1, offset += 2) {
      const sample = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(44, samples);

  return new Blob([view], { type: "audio/wav" });
};

const StatusMessage = ({ result, voiceError }) => {
  if (voiceError) {
    return (
      <div className="flex gap-2 rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs text-yellow-100">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <span className="leading-5">{voiceError}</span>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div
      className={`rounded-3xl border p-3 text-xs ${
        result.success
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
          : "border-red-500/20 bg-red-500/10 text-red-100"
      }`}
    >
      <div className="flex items-start gap-2">
        {result.success ? (
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
        ) : (
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
        )}

        <div>
          <p className="font-semibold">
            {result.message || "Command processed."}
          </p>

          {result.intent && result.module ? (
            <p className="mt-1 opacity-80">
              Intent: {result.intent} • Module: {result.module}
              {result.source ? ` • Source: ${result.source}` : ""}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const FloatingSmartAdd = () => {
  const navigate = useNavigate();
  const { userId } = useUser();

  const medicineFileInputRef = useRef(null);
  const reportFileInputRef = useRef(null);

  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const processorRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);

  const audioChunksRef = useRef([]);
  const sampleRateRef = useRef(44100);

  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("command");

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [savingImageMedicine, setSavingImageMedicine] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [result, setResult] = useState(null);

  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [voiceLang, setVoiceLang] = useState("en-IN");
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState("");

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [medicineDraft, setMedicineDraft] = useState({
    medicine_name: "",
    dosage: "",
    time: "Not specified",
    symptom: "",
  });

  const [reportPreview, setReportPreview] = useState(null);
  const [reportText, setReportText] = useState("");
  const [reportDraft, setReportDraft] = useState(null);

  const isBusy =
    loading ||
    imageLoading ||
    savingImageMedicine ||
    reportLoading ||
    savingReport;

  const busyLabel = useMemo(() => {
    if (loading) return "Processing command...";
    if (imageLoading) return "Reading medicine image...";
    if (savingImageMedicine) return "Saving medicine...";
    if (reportLoading) return "Reading report...";
    if (savingReport) return "Saving report...";
    if (isRecording) return "Recording voice...";
    return "Ready";
  }, [
    loading,
    imageLoading,
    savingImageMedicine,
    reportLoading,
    savingReport,
    isRecording,
  ]);

  const loadMicrophones = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) {
        setVoiceError("Your browser cannot list microphones.");
        return;
      }

      const tempStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      tempStream.getTracks().forEach((track) => track.stop());

      const allDevices = await navigator.mediaDevices.enumerateDevices();

      const audioInputs = allDevices.filter(
        (device) => device.kind === "audioinput"
      );

      setDevices(audioInputs);

      if (!selectedDeviceId && audioInputs.length > 0) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.error("Load microphones error:", err);
      setVoiceError(
        "Could not access microphone list. Allow mic permission from browser."
      );
    }
  };

  useEffect(() => {
    if (open) {
      loadMicrophones();
    }
  }, [open]);

  const refreshDashboard = () => {
    window.dispatchEvent(new Event("smart-add-updated"));
    window.dispatchEvent(new Event("assistant-command-updated"));
    window.dispatchEvent(new Event("timeline-updated"));
  };

  const runCommand = async (commandText) => {
    const finalText = commandText?.trim();

    if (!finalText) {
      setVoiceError("Type or record a command first.");
      return;
    }

    setLoading(true);
    setResult(null);
    setVoiceError("");

    try {
      const res = await assistantCommand(userId, finalText);

      setResult(res);
      setText("");

      if (res?.navigate_to) {
        navigate(res.navigate_to);
      }

      refreshDashboard();
    } catch (err) {
      console.error("Assistant command error:", err);

      setResult({
        success: false,
        message: "Command failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startAudioLevelMeter = () => {
    const analyser = analyserRef.current;

    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.fftSize);

    const updateLevel = () => {
      analyser.getByteTimeDomainData(dataArray);

      let sum = 0;

      for (let i = 0; i < dataArray.length; i += 1) {
        const value = (dataArray[i] - 128) / 128;
        sum += value * value;
      }

      const rms = Math.sqrt(sum / dataArray.length);
      const level = Math.min(100, Math.round(rms * 350));

      setAudioLevel(level);

      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  };

  const cleanupRecording = async () => {
    try {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (processorRef.current) {
        processorRef.current.disconnect();
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }

      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    } catch (err) {
      console.warn("Recording cleanup warning:", err);
    }

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    streamRef.current = null;
    analyserRef.current = null;
    animationFrameRef.current = null;

    setAudioLevel(0);
  };

  const startRecording = async () => {
    if (isRecording || isBusy) return;

    setVoiceError("");
    setResult(null);
    setTranscript("");
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setVoiceError("Audio recording is not supported in this browser.");
        return;
      }

      const audioConstraints = selectedDeviceId
        ? {
            deviceId: { exact: selectedDeviceId },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          }
        : {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: true,
          };

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audioConstraints,
      });

      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        setVoiceError("AudioContext is not supported in this browser.");
        return;
      }

      const audioContext = new AudioContextClass();
      await audioContext.resume();

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      analyser.fftSize = 2048;
      sampleRateRef.current = audioContext.sampleRate;

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const copied = new Float32Array(input);

        audioChunksRef.current.push(copied);
      };

      source.connect(analyser);
      source.connect(processor);
      processor.connect(audioContext.destination);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      sourceRef.current = source;
      processorRef.current = processor;
      analyserRef.current = analyser;

      setIsRecording(true);
      startAudioLevelMeter();
    } catch (err) {
      console.error("Recording start error:", err);

      if (err?.name === "NotAllowedError") {
        setVoiceError("Microphone permission denied. Allow mic access.");
      } else if (err?.name === "NotFoundError") {
        setVoiceError("No microphone found. Check your input device.");
      } else if (err?.name === "OverconstrainedError") {
        setVoiceError("Selected microphone is unavailable. Choose another mic.");
      } else {
        setVoiceError("Could not start recording. Check mic settings.");
      }
    }
  };

  const stopRecordingAndSend = async () => {
    if (!isRecording) return;

    setIsRecording(false);
    setLoading(true);
    setVoiceError("");

    try {
      const chunks = audioChunksRef.current;

      await cleanupRecording();

      if (!chunks.length) {
        setVoiceError("No audio captured. Try again.");
        setLoading(false);
        return;
      }

      const samples = flattenFloat32Arrays(chunks);

      let maxAmplitude = 0;
      for (let i = 0; i < samples.length; i += 1) {
        maxAmplitude = Math.max(maxAmplitude, Math.abs(samples[i]));
      }

      if (maxAmplitude < 0.005) {
        setVoiceError(
          "Your mic is recording silence. Select another microphone or fix Windows input device."
        );
        setLoading(false);
        return;
      }

      const wavBlob = encodeWAV(samples, sampleRateRef.current);
      const res = await uploadVoiceCommand(userId, wavBlob, voiceLang);

      if (!res.success) {
        setVoiceError(res.message || "Voice command failed.");
        setLoading(false);
        return;
      }

      const detectedText = res.transcript || "";
      const commandResult = res.command_result || {};

      setTranscript(detectedText);
      setText(detectedText);
      setResult(commandResult);
      setActiveTab("command");

      if (res?.navigate_to || commandResult?.navigate_to) {
        navigate(res.navigate_to || commandResult.navigate_to);
      }

      refreshDashboard();
    } catch (err) {
      console.error("Voice upload error:", err);
      setVoiceError("Voice upload/transcription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecordingAndSend();
    } else {
      startRecording();
    }
  };

  const handleSubmit = () => {
    runCommand(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleMedicineImageButtonClick = () => {
    if (isBusy) return;
    medicineFileInputRef.current?.click();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setVoiceError("Please select a valid image file.");
      return;
    }

    setImageLoading(true);
    setVoiceError("");
    setResult(null);
    setOcrText("");
    setImagePreview(null);

    try {
      const res = await previewMedicineImage(userId, file);

      if (!res.success) {
        setVoiceError(res.message || "Image OCR failed.");
        return;
      }

      const parsed = res.parsed || {};

      setOcrText(res.ocr_text || "");
      setImagePreview(res);
      setMedicineDraft({
        medicine_name: parsed.medicine_name || "",
        dosage: parsed.dosage || "",
        time: parsed.time || "Not specified",
        symptom: parsed.symptom || "",
      });

      setResult({
        success: true,
        message: res.message || "Image parsed. Please confirm before saving.",
        intent: "preview",
        module: "image_ocr",
      });
    } catch (err) {
      console.error("Image OCR error:", err);
      setVoiceError("Image upload/OCR failed. Try again.");
    } finally {
      setImageLoading(false);
      e.target.value = "";
    }
  };

  const updateMedicineDraft = (key, value) => {
    setMedicineDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const confirmImageMedicine = async () => {
    if (!medicineDraft.medicine_name.trim()) {
      setVoiceError("Medicine name is required before saving.");
      return;
    }

    setSavingImageMedicine(true);
    setVoiceError("");

    try {
      const res = await confirmMedicineImage(userId, medicineDraft);

      setResult(res);

      if (res.success) {
        setImagePreview(null);
        setOcrText("");
        setMedicineDraft({
          medicine_name: "",
          dosage: "",
          time: "Not specified",
          symptom: "",
        });

        refreshDashboard();
      }
    } catch (err) {
      console.error("Confirm OCR medicine error:", err);
      setVoiceError("Could not save medicine from image.");
    } finally {
      setSavingImageMedicine(false);
    }
  };

  const cancelImagePreview = () => {
    setImagePreview(null);
    setOcrText("");
    setMedicineDraft({
      medicine_name: "",
      dosage: "",
      time: "Not specified",
      symptom: "",
    });
  };

  const handleReportButtonClick = () => {
    if (isBusy) return;
    reportFileInputRef.current?.click();
  };

  const handleReportSelect = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isImage && !isPdf) {
      setVoiceError("Please select a valid report image or PDF.");
      return;
    }

    setReportLoading(true);
    setVoiceError("");
    setResult(null);
    setReportPreview(null);
    setReportText("");
    setReportDraft(null);

    try {
      const res = await previewMedicalReport(userId, file);

      if (!res.success) {
        setVoiceError(res.message || "Report reading failed.");
        return;
      }

      setReportPreview(res);
      setReportText(res.report_text || "");
      setReportDraft(res.parsed || null);

      setResult({
        success: true,
        message: res.message || "Report parsed. Please review before saving.",
        intent: "preview",
        module: "medical_report",
      });
    } catch (err) {
      console.error("Report preview error:", err);
      setVoiceError("Report upload/reading failed. Try again.");
    } finally {
      setReportLoading(false);
      e.target.value = "";
    }
  };

  const confirmReportSave = async () => {
    if (!reportDraft) {
      setVoiceError("Report preview is required before saving.");
      return;
    }

    setSavingReport(true);
    setVoiceError("");

    try {
      const res = await confirmMedicalReport(userId, {
        parsed: reportDraft,
      });

      setResult(res);

      if (res.success) {
        setReportPreview(null);
        setReportText("");
        setReportDraft(null);
        refreshDashboard();
      }
    } catch (err) {
      console.error("Confirm report error:", err);
      setVoiceError("Could not save report summary.");
    } finally {
      setSavingReport(false);
    }
  };

  const cancelReportPreview = () => {
    setReportPreview(null);
    setReportText("");
    setReportDraft(null);
  };

  const closePanel = async () => {
    if (isRecording) {
      setIsRecording(false);
      await cleanupRecording();
    }

    setOpen(false);
  };

  const togglePanel = async () => {
    if (open) {
      await closePanel();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={togglePanel}
        className="group fixed bottom-6 right-6 z-[70] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-violet-500 to-cyan-400 text-white shadow-2xl shadow-primary/30 transition hover:scale-105"
        title={open ? "Close AI All-Rounder" : "Open AI All-Rounder"}
      >
        <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 blur-xl transition group-hover:opacity-100" />
        <span className="absolute -inset-1 rounded-full border border-primary/30" />

        {open ? (
          <X size={25} className="relative z-10" />
        ) : (
          <Bot size={25} className="relative z-10" />
        )}

        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-emerald-500 text-[10px] font-bold">
            AI
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={closePanel}
          />

          <div
            className="fixed bottom-24 right-4 z-50 max-h-[78vh] w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f172a]/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:right-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0f172a]/95 p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/15 text-primary">
                    <Sparkles size={20} />

                    {isRecording ? (
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,0.9)]" />
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      AI Health Command Center
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Text, voice, medicine OCR, and report reader in one place.
                    </p>

                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200">
                      <Activity size={12} />
                      {busyLabel}
                    </div>
                  </div>
                </div>

                <button
                  onClick={closePanel}
                  className="rounded-2xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 rounded-3xl border border-white/10 bg-black/20 p-1.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition sm:flex-row ${
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-slate-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={15} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="max-h-[calc(78vh-150px)] space-y-4 overflow-y-auto p-4">
              {activeTab === "command" && (
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                        <Keyboard size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Typed Health Command
                        </p>
                        <p className="text-xs text-slate-400">
                          Add routine, vitals, medicines, or open pages.
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={4}
                      placeholder="Try: kal raat headache tha aur maine dolo 650 li after dinner"
                      className="w-full resize-none rounded-3xl border border-white/10 bg-[#020617] p-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-primary"
                    />

                    <p className="mt-2 text-[11px] text-slate-500">
                      Tip: press Ctrl + Enter to run command.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {quickCommands.map((command) => (
                        <button
                          key={command}
                          onClick={() => runCommand(command)}
                          disabled={isBusy}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:bg-primary/15 hover:text-primary disabled:opacity-50"
                        >
                          {command}
                        </button>
                      ))}
                    </div>

                    {transcript ? (
                      <div className="mt-4 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs text-cyan-100">
                        <p className="font-semibold">Voice transcript</p>
                        <p className="mt-1 leading-5">{transcript}</p>
                      </div>
                    ) : null}

                    <button
                      onClick={handleSubmit}
                      disabled={isBusy || !text.trim()}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-primary to-cyan-500 px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Run Command
                        </>
                      )}
                    </button>
                  </div>

                  <StatusMessage result={result} voiceError={voiceError} />
                </div>
              )}

              {activeTab === "voice" && (
                <div className="space-y-4">
                  <div
                    className={`rounded-[1.5rem] border p-4 transition ${
                      isRecording
                        ? "border-red-500/20 bg-red-500/10"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 ${
                            isRecording
                              ? "bg-red-500/15 text-red-300"
                              : "bg-primary/15 text-primary"
                          }`}
                        >
                          {isRecording ? (
                            <Volume2 size={20} />
                          ) : (
                            <Mic size={20} />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">
                            {isRecording
                              ? "Recording your command..."
                              : "Voice Command"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {isRecording
                              ? "Speak clearly, then tap stop."
                              : "Record in English or Hindi."}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleMicClick}
                        disabled={isBusy}
                        className={`rounded-2xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${
                          isRecording
                            ? "bg-red-500 text-white hover:bg-red-400"
                            : "bg-primary text-white hover:bg-primaryLight"
                        }`}
                      >
                        {isRecording ? (
                          <span className="flex items-center gap-1.5">
                            <MicOff size={14} />
                            Stop
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Mic size={14} />
                            Record
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="mt-4">
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Microphone device
                      </label>

                      <select
                        value={selectedDeviceId}
                        onChange={(e) => setSelectedDeviceId(e.target.value)}
                        disabled={isRecording}
                        className="w-full rounded-2xl border border-white/10 bg-[#020617] px-3 py-2.5 text-xs text-white outline-none focus:border-primary"
                      >
                        {devices.length === 0 ? (
                          <option value="">No microphone detected</option>
                        ) : (
                          devices.map((device, index) => (
                            <option
                              key={device.deviceId || index}
                              value={device.deviceId}
                              className="bg-slate-900 text-white"
                            >
                              {device.label || `Microphone ${index + 1}`}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Audio level</span>
                        <span>{audioLevel}%</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isRecording
                              ? "bg-gradient-to-r from-red-500 to-orange-300"
                              : "bg-gradient-to-r from-primary to-cyan-400"
                          }`}
                          style={{ width: `${audioLevel}%` }}
                        />
                      </div>

                      <p className="mt-1.5 text-[10px] text-slate-500">
                        Bar should move while speaking.
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <Languages size={13} />
                        Language
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setVoiceLang("en-IN")}
                          disabled={isRecording}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                            voiceLang === "en-IN"
                              ? "bg-primary text-white"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          English
                        </button>

                        <button
                          type="button"
                          onClick={() => setVoiceLang("hi-IN")}
                          disabled={isRecording}
                          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                            voiceLang === "hi-IN"
                              ? "bg-primary text-white"
                              : "bg-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          Hindi
                        </button>
                      </div>
                    </div>
                  </div>

                  {transcript ? (
                    <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-xs text-cyan-100">
                      <p className="font-bold">Detected transcript</p>
                      <p className="mt-1 leading-5">{transcript}</p>
                    </div>
                  ) : null}

                  <StatusMessage result={result} voiceError={voiceError} />
                </div>
              )}

              {activeTab === "medicine" && (
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-cyan-500/20 bg-cyan-500/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-500/15 text-cyan-200">
                          <ScanLine size={20} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">
                            Medicine Image OCR
                          </p>
                          <p className="text-xs text-cyan-100/70">
                            Upload strip/box image, edit result, then save.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleMedicineImageButtonClick}
                        disabled={isBusy}
                        className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-cyan-400 disabled:opacity-50"
                      >
                        {imageLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Reading
                          </>
                        ) : (
                          <>
                            <ImagePlus size={14} />
                            Upload
                          </>
                        )}
                      </button>

                      <input
                        ref={medicineFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>

                    {!imagePreview ? (
                      <div className="mt-4 rounded-3xl border border-dashed border-cyan-400/30 bg-black/20 p-6 text-center">
                        <UploadCloud
                          size={28}
                          className="mx-auto text-cyan-200"
                        />
                        <p className="mt-3 text-sm font-semibold text-white">
                          No medicine image selected
                        </p>
                        <p className="mt-1 text-xs text-cyan-100/70">
                          OCR result will appear here before saving.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="mb-2 text-xs font-bold text-cyan-100">
                            OCR Text
                          </p>
                          <p className="max-h-24 overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-3 text-[11px] leading-5 text-cyan-50">
                            {ocrText || "No OCR text found."}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            value={medicineDraft.medicine_name}
                            onChange={(e) =>
                              updateMedicineDraft(
                                "medicine_name",
                                e.target.value
                              )
                            }
                            className="w-full rounded-2xl border border-white/10 bg-[#020617] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                            placeholder="Medicine name"
                          />

                          <input
                            value={medicineDraft.dosage}
                            onChange={(e) =>
                              updateMedicineDraft("dosage", e.target.value)
                            }
                            className="w-full rounded-2xl border border-white/10 bg-[#020617] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                            placeholder="Dosage"
                          />

                          <input
                            value={medicineDraft.time}
                            onChange={(e) =>
                              updateMedicineDraft("time", e.target.value)
                            }
                            className="w-full rounded-2xl border border-white/10 bg-[#020617] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                            placeholder="Time"
                          />

                          <input
                            value={medicineDraft.symptom}
                            onChange={(e) =>
                              updateMedicineDraft("symptom", e.target.value)
                            }
                            className="w-full rounded-2xl border border-white/10 bg-[#020617] px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
                            placeholder="Symptom optional"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={confirmImageMedicine}
                            disabled={savingImageMedicine}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-3 text-xs font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {savingImageMedicine ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={14} />
                                Confirm Save
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={cancelImagePreview}
                            disabled={savingImageMedicine}
                            className="rounded-2xl border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <StatusMessage result={result} voiceError={voiceError} />
                </div>
              )}

              {activeTab === "report" && (
                <div className="space-y-4">
                  <div className="rounded-[1.5rem] border border-purple-500/20 bg-purple-500/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/15 text-purple-200">
                          <ClipboardPlus size={20} />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">
                            Medical Report Reader
                          </p>
                          <p className="text-xs text-purple-100/70">
                            Upload image/PDF, review findings, then save.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleReportButtonClick}
                        disabled={isBusy}
                        className="flex items-center gap-2 rounded-2xl bg-purple-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-400 disabled:opacity-50"
                      >
                        {reportLoading ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Reading
                          </>
                        ) : (
                          <>
                            <FileText size={14} />
                            Upload
                          </>
                        )}
                      </button>

                      <input
                        ref={reportFileInputRef}
                        type="file"
                        accept="image/*,.pdf,application/pdf"
                        onChange={handleReportSelect}
                        className="hidden"
                      />
                    </div>

                    {!reportPreview || !reportDraft ? (
                      <div className="mt-4 rounded-3xl border border-dashed border-purple-400/30 bg-black/20 p-6 text-center">
                        <UploadCloud
                          size={28}
                          className="mx-auto text-purple-200"
                        />
                        <p className="mt-3 text-sm font-semibold text-white">
                          No medical report selected
                        </p>
                        <p className="mt-1 text-xs text-purple-100/70">
                          Report summary and findings will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="mb-2 text-xs font-bold text-purple-100">
                            Report Summary
                          </p>
                          <p className="rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-5 text-purple-50">
                            {reportDraft.summary || "Summary not available."}
                          </p>
                        </div>

                        {reportDraft.key_findings?.length ? (
                          <div>
                            <p className="mb-2 text-xs font-bold text-purple-100">
                              Key Findings
                            </p>

                            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                              {reportDraft.key_findings.map((item, index) => (
                                <div
                                  key={`${item.name}-${index}`}
                                  className="rounded-2xl border border-white/10 bg-black/25 p-3 text-xs text-slate-200"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="font-bold text-white">
                                      {item.name}
                                    </span>
                                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] capitalize text-slate-200">
                                      {item.status || "unknown"}
                                    </span>
                                  </div>

                                  <p className="mt-1 text-slate-300">
                                    {item.value} {item.unit}
                                  </p>

                                  {item.note ? (
                                    <p className="mt-1 leading-5 text-slate-400">
                                      {item.note}
                                    </p>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <div>
                          <p className="mb-2 text-xs font-bold text-purple-100">
                            Extracted Text
                          </p>
                          <p className="max-h-24 overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-3 text-[10px] leading-5 text-purple-50">
                            {reportText || "No report text found."}
                          </p>
                        </div>

                        <p className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-[11px] leading-5 text-yellow-100">
                          This is not a diagnosis. Please consult a qualified
                          doctor.
                        </p>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={confirmReportSave}
                            disabled={savingReport}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-3 py-3 text-xs font-bold text-white transition hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {savingReport ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                Saving
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={14} />
                                Save Report
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={cancelReportPreview}
                            disabled={savingReport}
                            className="rounded-2xl border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <StatusMessage result={result} voiceError={voiceError} />
                </div>
              )}

              <p className="text-center text-[10px] text-slate-500">
                Click outside or tap the AI button again to close.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FloatingSmartAdd;