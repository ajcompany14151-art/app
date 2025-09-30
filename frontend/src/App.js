import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Plus, 
  Upload, 
  Trash2, 
  Settings, 
  Brain, 
  Code, 
  FileText,
  Sparkles,
  Bot,
  User,
  Zap,
  Globe,
  Terminal,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { ScrollArea } from './components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Landing Page Component
const LandingPage = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        </div>
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 lg:p-8">
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              AJ STUDIOZ
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Button 
              onClick={onGetStarted}
              data-testid="get-started-nav-btn"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Get Started
            </Button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                    Advanced
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                    Agentic AI
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-slate-300 mt-6 leading-relaxed">
                  Experience the future of AI assistance with AJ STUDIOZ - your intelligent partner for development, analysis, and creative problem-solving.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button 
                  onClick={onGetStarted}
                  data-testid="get-started-hero-btn"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Chatting
                </Button>
                <Button 
                  variant="outline" 
                  className="border-indigo-400/50 text-indigo-300 hover:bg-indigo-500/10 px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:border-indigo-300"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTc1OTI0NDYxNHww&ixlib=rb-4.1.0&q=85" 
                  alt="AI Technology" 
                  className="rounded-2xl shadow-2xl w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.section 
        className="relative py-24 bg-slate-900/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Advanced AI capabilities designed for developers, analysts, and creative professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Multi-Modal AI",
                description: "Advanced reasoning with text, code, and document analysis capabilities",
                image: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTc1OTI0NDYxNHww&ixlib=rb-4.1.0&q=85"
              },
              {
                icon: Code,
                title: "Code Generation",
                description: "Generate, debug, and optimize code across multiple programming languages",
                image: "https://images.unsplash.com/photo-1694903110330-cc64b7e1d21d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlfGVufDB8fHx8MTc1OTI0NDYxNHww&ixlib=rb-4.1.0&q=85"
              },
              {
                icon: FileText,
                title: "Document Analysis",
                description: "Upload and analyze documents with comprehensive AI insights",
                image: "https://images.unsplash.com/photo-1757310998648-f8aaa5572e8e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHx0ZWNoJTIwaW50ZXJmYWNlfGVufDB8fHx8MTc1OTI0NDYyMHww&ixlib=rb-4.1.0&q=85"
              },
              {
                icon: Terminal,
                title: "Agentic Workflows",
                description: "AI agents that can execute complex multi-step tasks autonomously"
              },
              {
                icon: Globe,
                title: "Web Development",
                description: "Specialized expertise in modern web technologies and frameworks"
              },
              {
                icon: Database,
                title: "Data Analysis",
                description: "Advanced data processing and analytical capabilities"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {feature.image && (
                  <div className="mb-4 overflow-hidden rounded-lg">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="relative py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
              Ready to Experience AJ STUDIOZ?
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join thousands of developers and professionals using our advanced AI platform
          </p>
          <Button 
            onClick={onGetStarted}
            data-testid="get-started-cta-btn"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            Get Started Now
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

// Chat Interface Component
const ChatInterface = ({ onBackToLanding }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelProvider, setModelProvider] = useState('anthropic');
  const [modelName, setModelName] = useState('claude-sonnet-4-20250514');
  const [availableModels, setAvailableModels] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Available models by provider
  const modelOptions = {
    anthropic: [
      { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
      { value: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
      { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' }
    ],
    openai: [
      { value: 'gpt-5', label: 'GPT-5' },
      { value: 'o3', label: 'GPT-O3' },
      { value: 'gpt-4o', label: 'GPT-4O' }
    ],
    gemini: [
      { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' }
    ]
  };

  useEffect(() => {
    fetchSessions();
    fetchAvailableModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/chat/sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to load chat sessions');
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const response = await axios.get(`${API}/models`);
      setAvailableModels(response.data);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/chat/sessions/${sessionId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: messageText,
        session_id: currentSession?.id,
        model_provider: modelProvider,
        model_name: modelName
      });

      const { session_id } = response.data;
      
      if (!currentSession || currentSession.id !== session_id) {
        // New session created or switched
        await fetchSessions();
        const newSession = sessions.find(s => s.id === session_id) || 
          { id: session_id, title: messageText.substring(0, 50) };
        setCurrentSession(newSession);
      }
      
      // Refresh messages
      await fetchMessages(session_id);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const selectSession = async (session) => {
    setCurrentSession(session);
    await fetchMessages(session.id);
  };

  const createNewSession = () => {
    setCurrentSession(null);
    setMessages([]);
    toast.success('New chat session started');
  };

  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API}/chat/sessions/${sessionId}`);
      await fetchSessions();
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      toast.success('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('session_id', currentSession?.id || 'temp');

    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/upload/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success(`File "${file.name}" analyzed successfully`);
      
      // If we have a current session, refresh messages
      if (currentSession) {
        await fetchMessages(currentSession.id);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to analyze file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white" data-testid="chat-interface">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
                  AJ STUDIOZ
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLanding}
                className="text-slate-400 hover:text-white"
                data-testid="back-to-landing-btn"
              >
                ←
              </Button>
            </div>
            
            <Button 
              onClick={createNewSession}
              data-testid="new-chat-btn"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Sessions List */}
          <ScrollArea className="flex-1 p-4" data-testid="sessions-list">
            <div className="space-y-2">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentSession?.id === session.id
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30'
                      : 'hover:bg-slate-700/30'
                  }`}
                  onClick={() => selectSession(session)}
                  data-testid={`session-${session.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300 truncate">
                      {session.title || 'New Chat'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all duration-200 p-1 h-auto"
                    data-testid={`delete-session-${session.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Model Selection */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-2 block">AI Provider</label>
                <Select value={modelProvider} onValueChange={setModelProvider}>
                  <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white" data-testid="model-provider-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-slate-400 mb-2 block">Model</label>
                <Select value={modelName} onValueChange={setModelName}>
                  <SelectTrigger className="w-full bg-slate-700/50 border-slate-600 text-white" data-testid="model-name-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {modelOptions[modelProvider]?.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">
                  {currentSession?.title || 'AJ STUDIOZ AI Assistant'}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Powered by {modelOptions[modelProvider]?.find(m => m.value === modelName)?.label || modelName}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.pdf,.doc,.docx,.md"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700/30"
                  data-testid="upload-file-btn"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                <Badge variant="secondary" className="bg-indigo-600/20 text-indigo-300">
                  <Cpu className="w-3 h-3 mr-1" />
                  AI Ready
                </Badge>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6" data-testid="messages-area">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-300 mb-2">Welcome to AJ STUDIOZ AI</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Start a conversation with our advanced AI assistant. Ask questions, upload documents, or request code generation.
                  </p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message.id || index}
                    className={`flex items-start space-x-4 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    data-testid={`message-${message.role}-${index}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                    }`}>
                      {message.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                    </div>
                    <div className={`flex-1 max-w-3xl ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      <div className={`inline-block p-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30'
                          : 'bg-slate-800/50 border border-slate-700/50'
                      }`}>
                        {message.role === 'assistant' ? (
                          <div className="prose prose-invert prose-slate max-w-none">
                            <ReactMarkdown
                              components={{
                                code({node, inline, className, children, ...props}) {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      style={tomorrow}
                                      language={match[1]}
                                      PreTag="div"
                                      className="rounded-lg"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  ) : (
                                    <code className="bg-slate-700/50 px-2 py-1 rounded text-sm" {...props}>
                                      {children}
                                    </code>
                                  )
                                }
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-white whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-2 px-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              
              {isLoading && (
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-indigo-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                      <span className="text-slate-400 text-sm">AJ STUDIOZ is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask AJ STUDIOZ anything..."
                    className="bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 resize-none min-h-[60px] focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    data-testid="message-input"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50"
                  data-testid="send-message-btn"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-3 text-center">
                Powered by advanced AI models • Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <BrowserRouter>
      <div className="App">
        <AnimatePresence mode="wait">
          {showChat ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ChatInterface onBackToLanding={() => setShowChat(false)} />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onGetStarted={() => setShowChat(true)} />
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgb(30 41 59)',
              color: 'white',
              border: '1px solid rgb(71 85 105)'
            }
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
