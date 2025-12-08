import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, X, Activity } from 'lucide-react';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  
  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<any>(null); // To store session object
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const cleanup = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (inputAudioContextRef.current) {
        inputAudioContextRef.current.close();
        inputAudioContextRef.current = null;
    }
    if (sessionRef.current) {
        // Try closing session if method exists
        try {
           // sessionRef.current.close(); 
        } catch(e) {}
        sessionRef.current = null;
    }
    // Stop all playing sources
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    
    setIsActive(false);
    nextStartTimeRef.current = 0;
  }, []);

  const startSession = async () => {
    setError(null);
    setTranscription('Verbinde mit KI-Assistent...');
    
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key fehlt. Bitte Umgebungsvariable prüfen.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;
      
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination); // Connect to speakers

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Session opened");
            setIsActive(true);
            setTranscription("Ich höre zu. Fragen Sie mich nach Jobs im Großhandel!");

            // Setup Input Processing
            const source = inputCtx.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                  session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcription
            if (message.serverContent?.modelTurn?.parts[0]?.text) {
                 setTranscription(prev => message.serverContent?.modelTurn?.parts[0]?.text || prev);
            }
            
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                const ctx = audioContextRef.current;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                
                try {
                    const audioBuffer = await decodeAudioData(
                        decode(base64Audio),
                        ctx,
                        24000,
                        1
                    );
                    
                    const source = ctx.createBufferSource();
                    source.buffer = audioBuffer;
                    source.connect(outputNode);
                    
                    source.addEventListener('ended', () => {
                        sourcesRef.current.delete(source);
                    });
                    
                    source.start(nextStartTimeRef.current);
                    nextStartTimeRef.current += audioBuffer.duration;
                    sourcesRef.current.add(source);
                } catch (err) {
                    console.error("Audio decode error", err);
                }
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(s => s.stop());
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            console.log("Session closed");
            setIsActive(false);
          },
          onerror: (err) => {
            console.error("Session error", err);
            setError("Verbindung unterbrochen.");
            setIsActive(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          },
          systemInstruction: "Du bist ein professioneller, freundlicher Karriereberater für die Website 'großhandel-stellenangebote.de'. Du hilfst Arbeitnehmern, passende Jobs im Großhandel (Logistik, Einkauf, Verkauf) zu finden und berätst Arbeitgeber bei der Personalsuche. Antworte prägnant, auf Deutsch und hilfreich. Erwähne bei geografischen Fragen Städte wie Hamburg, München oder Berlin.",
        }
      });
      
      // Store session logic if needed, but primarily relying on callbacks
      sessionPromise.then(session => {
          sessionRef.current = session;
      });

    } catch (err: any) {
      console.error(err);
      setError("Zugriff auf Mikrofon verweigert oder API Fehler.");
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      cleanup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-brand-100 overflow-hidden flex flex-col animate-fade-in-up">
        <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Activity className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
            <h3 className="font-semibold">KI Karriere-Assistent</h3>
          </div>
          <button onClick={onClose} className="hover:bg-brand-700 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 bg-slate-50 min-h-[150px] flex flex-col items-center justify-center text-center">
          {error ? (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          ) : (
            <div className="mb-4">
               <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${isActive ? 'bg-brand-100 text-brand-600' : 'bg-slate-200 text-slate-400'}`}>
                 {isActive ? <Mic className="w-8 h-8 animate-bounce" /> : <MicOff className="w-8 h-8" />}
               </div>
               <p className="text-slate-600 text-sm font-medium">
                 {transcription || "Initialisiere..."}
               </p>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-slate-100 text-xs text-slate-500 text-center border-t border-slate-200">
           Powered by Gemini Live API
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;