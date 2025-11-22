import React, { useState, useEffect } from 'react';
import { Upload, Wand2, Loader2, Type, Palette, Download, Key, Bot } from 'lucide-react';
import { generateProGraphics, generateMarketingContent } from '../services/geminiService';

const Labs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'slogans'>('graphics');
  const [hasKey, setHasKey] = useState(false);
  
  // Check for API Key availability
  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const has = await window.aistudio.hasSelectedApiKey();
      setHasKey(has);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      checkKey();
    }
  };

  // Graphics State
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [graphicsPrompt, setGraphicsPrompt] = useState('');
  const [assetType, setAssetType] = useState('Business Card');
  const [graphicsLoading, setGraphicsLoading] = useState(false);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  // Slogan State
  const [sloganTopic, setSloganTopic] = useState('');
  const [sloganType, setSloganType] = useState<'slogan' | 'mission'>('slogan');
  const [selectedModel, setSelectedModel] = useState<'Gemini' | 'GPT' | 'Grok'>('Gemini');
  const [sloganLoading, setSloganLoading] = useState(false);
  const [sloganResult, setSloganResult] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerateGraphics = async () => {
    if (!graphicsPrompt) return;
    setGraphicsLoading(true);

    try {
      let base64 = undefined;
      if (imagePreview) {
         base64 = imagePreview.split(',')[1];
      }
      const result = await generateProGraphics(graphicsPrompt, assetType, base64);
      setEditedImage(result);
    } catch (error) {
      console.error(error);
      alert("Graphic generation failed. Ensure you have a valid paid API key connected for Pro features.");
    } finally {
      setGraphicsLoading(false);
    }
  };

  const handleGenerateText = async () => {
    if (!sloganTopic) return;
    setSloganLoading(true);
    setSloganResult(null);
    try {
        const result = await generateMarketingContent(sloganTopic, sloganType, selectedModel);
        setSloganResult(result);
    } catch (error) {
        console.error(error);
        alert("Generation failed.");
    } finally {
        setSloganLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-6 animate-float">
      <div className="glass-panel rounded-2xl shadow-2xl border border-teal-500/30 overflow-hidden min-h-[700px]">
        {/* Header / Tabs */}
        <div className="bg-slate-900/40 border-b border-teal-500/20 p-6 text-center">
             <h2 className="text-3xl font-light mb-4 text-teal-200 tracking-wide">ESTIMATE RELIANCE LABS</h2>
             <div className="flex justify-center space-x-4">
                 <button 
                    onClick={() => setActiveTab('graphics')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeTab === 'graphics' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
                 >
                    <Palette className="w-4 h-4 mr-2" /> Graphic Studio
                 </button>
                 <button 
                    onClick={() => setActiveTab('slogans')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${activeTab === 'slogans' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
                 >
                    <Type className="w-4 h-4 mr-2" /> Copy & Strategy
                 </button>
             </div>
        </div>

        <div className="p-8">
            {activeTab === 'graphics' && (
                <div className="animate-fadeIn">
                    {!hasKey ? (
                         <div className="text-center py-20">
                            <Key className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-teal-100 mb-2">Pro Features Locked</h3>
                            <p className="text-teal-200/60 mb-6 max-w-md mx-auto">
                                To generate professional graphics (Logos, Banners, etc.) using Nano Banana Pro, you must connect a paid API Key.
                            </p>
                            <button
                                onClick={handleSelectKey}
                                className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
                            >
                                Connect API Key
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <div className="text-teal-100/60 text-sm mb-2">
                                    Generate professional assets using our advanced "Nano Banana Pro" engine.
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-teal-200 text-xs mb-2">Asset Type</label>
                                        <select 
                                            value={assetType}
                                            onChange={(e) => setAssetType(e.target.value)}
                                            className="w-full bg-slate-900/50 border border-teal-500/30 rounded-lg p-3 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                        >
                                            <option value="Business Card">Business Card</option>
                                            <option value="Logo">Company Logo</option>
                                            <option value="Yard Sign">Yard Sign</option>
                                            <option value="Banner">Marketing Banner</option>
                                            <option value="Flyer">Promotional Flyer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-teal-200 text-xs mb-2">Ref Image (Optional)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="ref-upload"
                                            />
                                            <label
                                                htmlFor="ref-upload"
                                                className="flex items-center justify-center w-full p-3 border border-dashed border-teal-500/30 rounded-lg cursor-pointer hover:bg-teal-500/10 transition-colors text-teal-300 text-sm truncate"
                                            >
                                                {file ? file.name : "Upload"}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-teal-200 text-xs mb-2">Design Instructions</label>
                                    <textarea
                                        value={graphicsPrompt}
                                        onChange={(e) => setGraphicsPrompt(e.target.value)}
                                        placeholder="Describe the style, colors, and content. E.g. 'Modern minimalist logo for a roofing company using blue and grey colors'"
                                        className="w-full bg-slate-900/50 border border-teal-500/30 rounded-xl p-4 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 resize-none h-32 placeholder-teal-700/50"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerateGraphics}
                                    disabled={!graphicsPrompt || graphicsLoading}
                                    className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-4 rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center disabled:opacity-50"
                                >
                                    {graphicsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-5 h-5 mr-2" /> Generate {assetType}</>}
                                </button>
                            </div>

                            <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-slate-950/30 rounded-xl border border-teal-500/10">
                                {editedImage ? (
                                <div className="space-y-4 w-full p-4 animate-twinkle">
                                    <div className="aspect-square rounded-xl overflow-hidden border border-teal-400/30 shadow-2xl shadow-teal-900/50">
                                    <img src={editedImage} alt="Generated Asset" className="w-full h-full object-cover" />
                                    </div>
                                    <a 
                                    href={editedImage} 
                                    download={`${assetType.toLowerCase().replace(' ', '-')}.png`}
                                    className="flex items-center justify-center w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-teal-200 transition-colors"
                                    >
                                    <Download className="w-4 h-4 mr-2" /> Download Asset
                                    </a>
                                </div>
                                ) : (
                                <div className="text-center text-slate-500/50 flex flex-col items-center">
                                    {graphicsLoading ? (
                                        <div className="relative">
                                            <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <Palette className="w-12 h-12 mb-4 opacity-20" />
                                            <p>Your {assetType} will appear here</p>
                                            {imagePreview && (
                                                <img src={imagePreview} className="w-20 h-20 object-cover mt-4 opacity-50 rounded-lg border border-teal-500/30" alt="ref" />
                                            )}
                                        </>
                                    )}
                                </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'slogans' && (
                <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
                     <div className="text-teal-100/60 text-center text-sm">
                        Create compelling marketing copy using our multi-model AI interface.
                    </div>
                    
                    <div className="bg-slate-900/30 p-4 rounded-xl border border-teal-500/10 grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-teal-200 text-xs mb-2">AI Model Persona</label>
                             <div className="flex space-x-2 bg-slate-950/50 p-1 rounded-lg">
                                 {['Gemini', 'GPT', 'Grok'].map((m) => (
                                     <button
                                        key={m}
                                        onClick={() => setSelectedModel(m as any)}
                                        className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${selectedModel === m ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                     >
                                         {m}
                                     </button>
                                 ))}
                             </div>
                        </div>
                         <div>
                             <label className="block text-teal-200 text-xs mb-2">Content Type</label>
                             <div className="flex space-x-2 bg-slate-950/50 p-1 rounded-lg">
                                 <button
                                    onClick={() => setSloganType('slogan')}
                                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${sloganType === 'slogan' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                     Slogans
                                 </button>
                                 <button
                                    onClick={() => setSloganType('mission')}
                                    className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${sloganType === 'mission' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'}`}
                                 >
                                     Mission Stmt
                                 </button>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <textarea
                            value={sloganTopic}
                            onChange={(e) => setSloganTopic(e.target.value)}
                            placeholder="Describe your company, product, or core values..."
                            className="w-full bg-slate-900/50 border border-teal-500/30 rounded-xl p-4 text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 placeholder-teal-700/50 h-32 resize-none"
                        />
                        <button
                            onClick={handleGenerateText}
                            disabled={!sloganTopic || sloganLoading}
                            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-4 rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center disabled:opacity-50"
                        >
                            {sloganLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Bot className="w-5 h-5 mr-2" /> Generate with {selectedModel}</>}
                        </button>
                    </div>

                    {sloganResult && (
                        <div className="bg-slate-950/60 rounded-xl border border-teal-500/30 p-6 animate-float">
                            <div className="flex items-center mb-4">
                                <div className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse" />
                                <span className="text-xs uppercase tracking-widest text-teal-400">{selectedModel} Output</span>
                            </div>
                            <div className="text-teal-100 whitespace-pre-line leading-relaxed">
                                {sloganResult}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Labs;