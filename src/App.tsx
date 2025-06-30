import React, { useState } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  User, 
  Send, 
  Menu,
  X,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronRight,
  Upload,
  Image,
  Globe,
  Code,
  Search,
  Lightbulb,
  Shuffle,
  Eye,
  EyeOff,
  Brain,
  Clock,
  Zap
} from 'lucide-react';

interface Chat {
  id: string;
  title: string;
  timestamp: string;
  assistantId?: string;
}

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  assistantId?: string;
}

interface KnowledgeBaseItem {
  id: string;
  content: string;
}

interface CustomInstruction {
  id: string;
  content: string;
}

interface AIAssistant {
  id: string;
  name: string;
  isActive: boolean;
  isEditing?: boolean;
  knowledgeBase: KnowledgeBaseItem[];
  customInstructions: CustomInstruction[];
}

interface LLMProvider {
  id: string;
  name: string;
  apiKey: string;
  showKey: boolean;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [assistantsExpanded, setAssistantsExpanded] = useState(true);
  const [currentAssistantChat, setCurrentAssistantChat] = useState<string | null>(null);
  const [deepResearchMode, setDeepResearchMode] = useState(false);
  const [thinkLongerMode, setThinkLongerMode] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m ChrisGPT, your AI assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [chats] = useState<Chat[]>([
    { id: '1', title: 'New conversation', timestamp: 'Just now' },
    { id: '2', title: 'React development help', timestamp: '2 hours ago', assistantId: '1' },
    { id: '3', title: 'JavaScript best practices', timestamp: 'Yesterday', assistantId: '2' },
    { id: '4', title: 'CSS Grid layout', timestamp: '2 days ago' },
  ]);

  const [aiAssistants, setAiAssistants] = useState<AIAssistant[]>([
    { 
      id: '1', 
      name: 'AI Assistant 1', 
      isActive: true,
      knowledgeBase: [
        { id: 'kb1', content: '' },
        { id: 'kb2', content: '' }
      ],
      customInstructions: [
        { id: 'ci1', content: '' },
        { id: 'ci2', content: '' }
      ]
    },
    { 
      id: '2', 
      name: 'AI Assistant 2', 
      isActive: false,
      knowledgeBase: [
        { id: 'kb3', content: '' },
        { id: 'kb4', content: '' }
      ],
      customInstructions: [
        { id: 'ci3', content: '' },
        { id: 'ci4', content: '' }
      ]
    },
    { 
      id: '3', 
      name: 'AI Assistant 3', 
      isActive: false,
      knowledgeBase: [
        { id: 'kb5', content: '' },
        { id: 'kb6', content: '' }
      ],
      customInstructions: [
        { id: 'ci5', content: '' },
        { id: 'ci6', content: '' }
      ]
    },
  ]);

  const [llmProviders, setLlmProviders] = useState<LLMProvider[]>([
    { id: 'openai', name: 'OpenAI', apiKey: '', showKey: false },
    { id: 'deepseek', name: 'DeepSeek', apiKey: '', showKey: false },
    { id: 'huggingface', name: 'HuggingFace', apiKey: '', showKey: false },
    { id: 'anthropic', name: 'Anthropic', apiKey: '', showKey: false },
    { id: 'gemini', name: 'Google Gemini', apiKey: '', showKey: false },
  ]);

  const [knowledgeBaseExpanded, setKnowledgeBaseExpanded] = useState<{[key: string]: boolean}>({});
  const [customInstructionsExpanded, setCustomInstructionsExpanded] = useState<{[key: string]: boolean}>({});
  const [llmSettingsExpanded, setLlmSettingsExpanded] = useState(false);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;
    
    let messagePrefix = '';
    if (deepResearchMode) messagePrefix += '[Deep Research] ';
    if (thinkLongerMode) messagePrefix += '[Think Longer] ';
    if (searchMode) messagePrefix += '[Search] ';
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messagePrefix + currentInput,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
      assistantId: currentAssistantChat || undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setCurrentInput('');
    setShowToolsDropdown(false);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand your message. This is a response from ${currentAssistantChat ? aiAssistants.find(a => a.id === currentAssistantChat)?.name || 'ChrisGPT' : 'ChrisGPT'}.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
        assistantId: currentAssistantChat || undefined
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleAssistantChat = (assistantId: string) => {
    setCurrentAssistantChat(assistantId);
    const assistantMessages = messages.filter(m => m.assistantId === assistantId || !m.assistantId);
    setMessages(assistantMessages);
  };

  const handleEditAssistant = (assistantId: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { ...assistant, isEditing: !assistant.isEditing }
        : { ...assistant, isEditing: false }
    ));
  };

  const handleRenameAssistant = (assistantId: string, newName: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { ...assistant, name: newName, isEditing: false }
        : assistant
    ));
  };

  const handleAddNewAssistant = () => {
    const newId = (Date.now()).toString();
    const newAssistant: AIAssistant = {
      id: newId,
      name: `AI Assistant ${aiAssistants.length + 1}`,
      isActive: false,
      knowledgeBase: [
        { id: `kb${newId}1`, content: '' },
        { id: `kb${newId}2`, content: '' }
      ],
      customInstructions: [
        { id: `ci${newId}1`, content: '' },
        { id: `ci${newId}2`, content: '' }
      ]
    };
    setAiAssistants(prev => [...prev, newAssistant]);
  };

  const handleDeleteAssistant = (assistantId: string) => {
    setAiAssistants(prev => prev.filter(assistant => assistant.id !== assistantId));
    if (currentAssistantChat === assistantId) {
      setCurrentAssistantChat(null);
    }
  };

  const handleAddKnowledgeBaseItem = (assistantId: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            knowledgeBase: [...assistant.knowledgeBase, { id: Date.now().toString(), content: '' }]
          }
        : assistant
    ));
  };

  const handleRemoveKnowledgeBaseItem = (assistantId: string, itemId: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            knowledgeBase: assistant.knowledgeBase.filter(item => item.id !== itemId)
          }
        : assistant
    ));
  };

  const handleUpdateKnowledgeBaseItem = (assistantId: string, itemId: string, content: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            knowledgeBase: assistant.knowledgeBase.map(item => 
              item.id === itemId ? { ...item, content } : item
            )
          }
        : assistant
    ));
  };

  const handleAddCustomInstruction = (assistantId: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            customInstructions: [...assistant.customInstructions, { id: Date.now().toString(), content: '' }]
          }
        : assistant
    ));
  };

  const handleRemoveCustomInstruction = (assistantId: string, instructionId: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            customInstructions: assistant.customInstructions.filter(instruction => instruction.id !== instructionId)
          }
        : assistant
    ));
  };

  const handleUpdateCustomInstruction = (assistantId: string, instructionId: string, content: string) => {
    setAiAssistants(prev => prev.map(assistant => 
      assistant.id === assistantId 
        ? { 
            ...assistant, 
            customInstructions: assistant.customInstructions.map(instruction => 
              instruction.id === instructionId ? { ...instruction, content } : instruction
            )
          }
        : assistant
    ));
  };

  const handleSaveKnowledgeBase = (assistantId: string) => {
    // Implementation for saving knowledge base
    console.log('Saving knowledge base for assistant:', assistantId);
  };

  const handleSaveCustomInstructions = (assistantId: string) => {
    // Implementation for saving custom instructions
    console.log('Saving custom instructions for assistant:', assistantId);
  };

  const handleUpdateLLMProvider = (providerId: string, apiKey: string) => {
    setLlmProviders(prev => prev.map(provider => 
      provider.id === providerId ? { ...provider, apiKey } : provider
    ));
  };

  const handleToggleShowKey = (providerId: string) => {
    setLlmProviders(prev => prev.map(provider => 
      provider.id === providerId ? { ...provider, showKey: !provider.showKey } : provider
    ));
  };

  const handleSaveLLMProvider = (providerId: string) => {
    console.log('Saving API key for provider:', providerId);
  };

  const handleRemoveLLMProvider = (providerId: string) => {
    setLlmProviders(prev => prev.map(provider => 
      provider.id === providerId ? { ...provider, apiKey: '' } : provider
    ));
  };

  const toolsOptions = [
    { id: 'image', icon: Image, label: 'Create an image' },
    { id: 'web', icon: Globe, label: 'Search the web' },
    { id: 'code', icon: Code, label: 'Write or code' },
    { id: 'research', icon: Search, label: 'Run deep research' },
    { id: 'think', icon: Lightbulb, label: 'Think for longer' },
  ];

  return (
    <div id="app-container" className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <div id="sidebar" className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-slate-800 text-white flex flex-col overflow-hidden border-r border-slate-700`}>
        {/* Sidebar Header */}
        <div id="sidebar-header" className="p-4 border-b border-slate-700 flex-shrink-0">
          <div id="logo-container" className="flex items-center gap-3 mb-4">
            <img id="logo-image" src="/chrisGPR.png" alt="ChrisGPT" className="w-8 h-8 rounded" />
            <h1 id="brand-title" className="text-xl font-bold text-orange-400">ChrisGPT</h1>
          </div>
          <button id="new-chat-btn" className="w-full flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors border border-slate-600">
            <Plus id="new-chat-icon" size={16} className="text-orange-400" />
            <span id="new-chat-text">New chat</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div id="sidebar-scrollable-content" className="flex-1 overflow-y-auto">
          {/* LLM Settings Section */}
          <div id="llm-settings-section" className="p-4 border-b border-slate-700">
            <button 
              id="llm-settings-toggle"
              onClick={() => setLlmSettingsExpanded(!llmSettingsExpanded)}
              className="w-full flex items-center gap-2 p-2 hover:bg-slate-700 rounded text-left mb-3"
            >
              <Settings id="llm-settings-icon" size={16} className="text-orange-400" />
              <span id="llm-settings-title" className="text-sm font-semibold text-orange-400 flex-1">LLM Settings</span>
              {llmSettingsExpanded ? 
                <ChevronDown id="llm-settings-chevron-down" size={14} className="text-slate-400" /> : 
                <ChevronRight id="llm-settings-chevron-right" size={14} className="text-slate-400" />
              }
            </button>
            
            {llmSettingsExpanded && (
              <div id="llm-providers-list" className="space-y-3 mb-4">
                {llmProviders.map((provider) => (
                  <div key={provider.id} id={`llm-provider-${provider.id}`} className="bg-slate-700 p-3 rounded border border-slate-600">
                    <h4 id={`llm-provider-name-${provider.id}`} className="text-sm font-medium text-orange-300 mb-2">{provider.name}</h4>
                    <div id={`llm-provider-input-container-${provider.id}`} className="flex gap-2 mb-2">
                      <div className="flex-1 relative">
                        <input
                          id={`llm-provider-input-${provider.id}`}
                          type={provider.showKey ? "text" : "password"}
                          value={provider.apiKey}
                          onChange={(e) => handleUpdateLLMProvider(provider.id, e.target.value)}
                          placeholder="Enter API Key"
                          className="w-full bg-slate-600 text-white text-xs p-2 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button
                          id={`llm-provider-toggle-visibility-${provider.id}`}
                          onClick={() => handleToggleShowKey(provider.id)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-orange-400"
                        >
                          {provider.showKey ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                    <div id={`llm-provider-buttons-${provider.id}`} className="flex gap-2">
                      <button 
                        id={`llm-provider-save-${provider.id}`}
                        onClick={() => handleSaveLLMProvider(provider.id)}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs py-1 px-2 rounded font-medium"
                      >
                        Save
                      </button>
                      <button 
                        id={`llm-provider-remove-${provider.id}`}
                        onClick={() => handleRemoveLLMProvider(provider.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* AI Assistants Toggle */}
            <div id="ai-assistants-container">
              <button 
                id="ai-assistants-toggle"
                onClick={() => setAssistantsExpanded(!assistantsExpanded)}
                className="w-full flex items-center gap-2 p-2 hover:bg-slate-700 rounded text-left"
              >
                <Menu id="ai-assistants-menu-icon" size={12} className="text-orange-400" />
                <span id="ai-assistants-title" className="text-xs font-medium text-slate-300 flex-1">AI ASSISTANTS</span>
                {assistantsExpanded ? 
                  <ChevronDown id="assistants-chevron-down" size={14} className="text-slate-400" /> : 
                  <ChevronRight id="assistants-chevron-right" size={14} className="text-slate-400" />
                }
              </button>
              
              {assistantsExpanded && (
                <div id="ai-assistants-list" className="mt-2">
                  {aiAssistants.map((assistant, index) => (
                    <div key={assistant.id} id={`ai-assistant-${assistant.id}`} className="mb-2">
                      <div id={`ai-assistant-header-${assistant.id}`} className="flex items-center gap-2 p-2 hover:bg-slate-700 rounded">
                        <input 
                          id={`ai-assistant-checkbox-${assistant.id}`}
                          type="checkbox" 
                          checked={assistant.isActive}
                          onChange={() => {
                            setAiAssistants(prev => prev.map(a => 
                              a.id === assistant.id ? {...a, isActive: !a.isActive} : a
                            ));
                          }}
                          className="w-3 h-3 accent-orange-500"
                        />
                        {assistant.isEditing ? (
                          <input
                            id={`ai-assistant-name-input-${assistant.id}`}
                            type="text"
                            defaultValue={assistant.name}
                            className="text-sm bg-slate-600 text-white px-2 py-1 rounded flex-1"
                            onBlur={(e) => handleRenameAssistant(assistant.id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRenameAssistant(assistant.id, e.currentTarget.value);
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span id={`ai-assistant-name-${assistant.id}`} className="text-sm underline text-blue-300 flex-1">{assistant.name}</span>
                        )}
                        <button 
                          id={`ai-assistant-edit-${assistant.id}`} 
                          onClick={() => handleEditAssistant(assistant.id)}
                          className="ml-auto"
                        >
                          <Edit3 size={12} className="text-slate-400 hover:text-orange-400" />
                        </button>
                        <span id={`ai-assistant-number-${assistant.id}`} className="bg-orange-600 text-white text-xs px-1 rounded">{index + 1}</span>
                      </div>
                      
                      {assistant.isActive && (
                        <div id={`ai-assistant-details-${assistant.id}`} className="ml-6 mt-2 space-y-2">
                          {/* Knowledge Base */}
                          <div id={`knowledge-base-${assistant.id}`} className="bg-slate-700 p-3 rounded border border-slate-600">
                            <button 
                              id={`knowledge-base-toggle-${assistant.id}`}
                              onClick={() => setKnowledgeBaseExpanded(prev => ({
                                ...prev,
                                [assistant.id]: !prev[assistant.id]
                              }))}
                              className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300"
                            >
                              {knowledgeBaseExpanded[assistant.id] ? 
                                <ChevronDown id={`knowledge-base-chevron-down-${assistant.id}`} size={14} /> : 
                                <ChevronRight id={`knowledge-base-chevron-right-${assistant.id}`} size={14} />
                              }
                              <span id={`knowledge-base-title-${assistant.id}`}>Knowledge Base</span>
                            </button>
                            
                            {knowledgeBaseExpanded[assistant.id] && (
                              <div id={`knowledge-base-content-${assistant.id}`}>
                                <p id={`knowledge-base-description-${assistant.id}`} className="text-xs text-slate-400 mb-2">
                                  (Paste the file path from your device, Enter a URL, Google Drive link, etc.)
                                </p>
                                
                                <div id={`knowledge-base-files-${assistant.id}`} className="space-y-2 mb-2">
                                  {assistant.knowledgeBase.map((item) => (
                                    <div key={item.id} id={`knowledge-file-${item.id}`} className="flex items-center gap-2 bg-slate-600 p-2 rounded border border-slate-500">
                                      <input
                                        id={`knowledge-file-input-${item.id}`}
                                        type="text"
                                        value={item.content}
                                        onChange={(e) => handleUpdateKnowledgeBaseItem(assistant.id, item.id, e.target.value)}
                                        placeholder="Add file, URL, Images, Videos, etc."
                                        className="text-xs flex-1 bg-transparent text-white placeholder-slate-400 focus:outline-none"
                                      />
                                      <Upload id={`knowledge-file-icon-${item.id}`} size={12} className="text-orange-400" />
                                      <button 
                                        id={`knowledge-file-remove-${item.id}`} 
                                        onClick={() => handleRemoveKnowledgeBaseItem(assistant.id, item.id)}
                                        className="text-xs bg-slate-500 hover:bg-slate-400 px-2 py-1 rounded"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                
                                <button 
                                  id={`add-file-btn-${assistant.id}`} 
                                  onClick={() => handleAddKnowledgeBaseItem(assistant.id)}
                                  className="flex items-center gap-1 text-xs mb-2 text-orange-300 hover:text-orange-200"
                                >
                                  <Plus id={`add-file-icon-${assistant.id}`} size={12} />
                                  <span id={`add-file-text-${assistant.id}`}>(Add file)</span>
                                </button>
                                
                                <button 
                                  id={`knowledge-save-btn-${assistant.id}`} 
                                  onClick={() => handleSaveKnowledgeBase(assistant.id)}
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-2 rounded font-medium"
                                >
                                  SAVE
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {/* Custom Instructions */}
                          <div id={`custom-instructions-${assistant.id}`} className="bg-slate-700 p-3 rounded border border-slate-600">
                            <button 
                              id={`custom-instructions-toggle-${assistant.id}`}
                              onClick={() => setCustomInstructionsExpanded(prev => ({
                                ...prev,
                                [assistant.id]: !prev[assistant.id]
                              }))}
                              className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-300"
                            >
                              {customInstructionsExpanded[assistant.id] ? 
                                <ChevronDown id={`custom-instructions-chevron-down-${assistant.id}`} size={14} /> : 
                                <ChevronRight id={`custom-instructions-chevron-right-${assistant.id}`} size={14} />
                              }
                              <span id={`custom-instructions-title-${assistant.id}`}>Custom Instructions</span>
                            </button>
                            
                            {customInstructionsExpanded[assistant.id] && (
                              <div id={`custom-instructions-content-${assistant.id}`}>
                                <p id={`custom-instructions-description-${assistant.id}`} className="text-xs text-slate-400 mb-2">
                                  (AI prompt, instructions for the AI, etc...)
                                </p>
                                
                                <div id={`custom-instructions-list-${assistant.id}`} className="space-y-2 mb-2">
                                  {assistant.customInstructions.map((instruction) => (
                                    <div key={instruction.id} id={`instruction-${instruction.id}`} className="flex items-center gap-2">
                                      <textarea 
                                        id={`instruction-text-${instruction.id}`}
                                        value={instruction.content}
                                        onChange={(e) => handleUpdateCustomInstruction(assistant.id, instruction.id, e.target.value)}
                                        className="flex-1 bg-slate-600 text-xs p-2 rounded resize-none border border-slate-500 text-white placeholder-slate-400"
                                        rows={2}
                                        placeholder="Eg: You are an email reply agent for Company XX..."
                                      />
                                      <button 
                                        id={`instruction-remove-${instruction.id}`} 
                                        onClick={() => handleRemoveCustomInstruction(assistant.id, instruction.id)}
                                        className="text-xs bg-slate-500 hover:bg-slate-400 px-2 py-1 rounded"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                
                                <button 
                                  id={`add-instruction-btn-${assistant.id}`} 
                                  onClick={() => handleAddCustomInstruction(assistant.id)}
                                  className="flex items-center gap-1 text-xs mb-2 text-orange-300 hover:text-orange-200"
                                >
                                  <Plus id={`add-instruction-icon-${assistant.id}`} size={12} />
                                  <span id={`add-instruction-text-${assistant.id}`}>(Add instruction)</span>
                                </button>
                                
                                <button 
                                  id={`instructions-save-btn-${assistant.id}`} 
                                  onClick={() => handleSaveCustomInstructions(assistant.id)}
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs py-2 rounded mb-2 font-medium"
                                >
                                  SAVE
                                </button>
                                
                                <button 
                                  id={`chat-btn-${assistant.id}`} 
                                  onClick={() => handleAssistantChat(assistant.id)}
                                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded w-full justify-center mb-2"
                                >
                                  <Send id={`chat-icon-${assistant.id}`} size={12} />
                                  <div className="flex flex-col items-start">
                                    <span id={`chat-text-${assistant.id}`} className="font-medium">Chat</span>
                                    <span id={`chat-subtext-${assistant.id}`} className="text-xs opacity-75">Talk to your assistant</span>
                                  </div>
                                </button>
                                
                                <button 
                                  id={`delete-assistant-btn-${assistant.id}`} 
                                  onClick={() => handleDeleteAssistant(assistant.id)}
                                  className="w-full flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 mt-2 p-1 hover:bg-slate-600 rounded"
                                >
                                  <span id={`delete-assistant-arrow-${assistant.id}`}>↦</span>
                                  <span id={`delete-assistant-text-${assistant.id}`}>Delete AI Assistant</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    id="add-new-assistant-btn" 
                    onClick={handleAddNewAssistant}
                    className="flex items-center gap-2 text-sm p-2 border border-slate-600 rounded hover:bg-slate-700 mt-2 w-full"
                  >
                    <span id="add-new-assistant-arrow" className="text-orange-400">↦</span>
                    <span id="add-new-assistant-text" className="underline text-blue-300">Add New AI Assistant</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Chat History */}
          <div id="chat-history-section" className="p-4">
            <h3 id="chat-history-title" className="text-sm font-semibold mb-3 text-orange-400">Chats</h3>
            <div id="chat-list" className="space-y-1">
              {chats.map((chat) => (
                <div key={chat.id} id={`chat-item-${chat.id}`} className="group flex items-center gap-2 p-2 hover:bg-slate-700 rounded-lg cursor-pointer">
                  <MessageSquare id={`chat-icon-${chat.id}`} size={16} className="text-slate-400" />
                  <div id={`chat-content-${chat.id}`} className="flex-1 min-w-0">
                    <p id={`chat-title-${chat.id}`} className="text-sm truncate">{chat.title}</p>
                    <p id={`chat-timestamp-${chat.id}`} className="text-xs text-slate-400">{chat.timestamp}</p>
                  </div>
                  <button id={`chat-edit-${chat.id}`} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded">
                    <Edit3 size={12} className="text-slate-400 hover:text-orange-400" />
                  </button>
                  <button id={`chat-delete-${chat.id}`} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-600 rounded">
                    <Trash2 size={12} className="text-slate-400 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div id="sidebar-footer" className="p-4 border-t border-slate-700 flex-shrink-0">
          <button id="settings-btn" className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-lg">
            <Settings id="settings-icon" size={16} className="text-slate-400" />
            <span id="settings-text">Settings</span>
          </button>
          <button id="profile-btn" className="flex items-center gap-2 w-full p-2 hover:bg-slate-700 rounded-lg">
            <User id="profile-icon" size={16} className="text-slate-400" />
            <span id="profile-text">Profile</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="flex-1 flex flex-col bg-slate-900">
        {/* Header */}
        <header id="main-header" className="bg-slate-800 border-b border-slate-700 p-4 flex items-center gap-4">
          <button 
            id="sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-300"
          >
            {sidebarOpen ? <X id="sidebar-close-icon" size={20} /> : <Menu id="sidebar-open-icon" size={20} />}
          </button>
          <h2 id="main-title" className="text-lg font-semibold text-orange-400">
            {currentAssistantChat ? `Chat with ${aiAssistants.find(a => a.id === currentAssistantChat)?.name}` : 'ChrisGPT'}
          </h2>
        </header>

        {/* Messages Area */}
        <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} id={`message-${message.id}`} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              {!message.isUser && (
                <div id={`ai-avatar-${message.id}`} className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
              )}
              <div id={`message-content-${message.id}`} className={`max-w-3xl p-4 rounded-lg ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 border border-slate-700 text-white'
              }`}>
                <p id={`message-text-${message.id}`} className="text-sm leading-relaxed">{message.content}</p>
                <p id={`message-timestamp-${message.id}`} className={`text-xs mt-2 ${
                  message.isUser ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {message.timestamp}
                </p>
              </div>
              {message.isUser && (
                <div id={`user-avatar-${message.id}`} className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  U
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div id="input-area" className="p-4 bg-slate-800 border-t border-slate-700">
          <div id="input-container" className="max-w-4xl mx-auto">
            <div id="input-wrapper" className="flex gap-2 items-end">
              {/* Tools Dropdown */}
              <div id="tools-container" className="relative">
                <button
                  id="tools-btn"
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg border border-slate-600 text-slate-300"
                >
                  <Plus id="tools-icon" size={16} />
                </button>
                
                {showToolsDropdown && (
                  <div id="tools-dropdown" className="absolute bottom-full left-0 mb-2 bg-slate-700 border border-slate-600 rounded-lg shadow-lg p-2 min-w-48">
                    <div id="tools-header" className="flex items-center gap-2 px-2 py-1 mb-2">
                      <Shuffle id="tools-shuffle-icon" size={14} className="text-orange-400" />
                      <span id="tools-title" className="text-sm font-medium text-white">Tools</span>
                    </div>
                    {toolsOptions.map((tool) => (
                      <button
                        key={tool.id}
                        id={`tool-${tool.id}`}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-600 rounded text-left text-white"
                        onClick={() => setShowToolsDropdown(false)}
                      >
                        <tool.icon id={`tool-icon-${tool.id}`} size={16} className="text-slate-400" />
                        <span id={`tool-label-${tool.id}`} className="text-sm">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div id="text-input-container" className="flex-1 relative">
                <textarea
                  id="message-input"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message ChrisGPT..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder-slate-400"
                  rows={1}
                />
              </div>
              <button
                id="send-btn"
                onClick={handleSendMessage}
                disabled={!currentInput.trim()}
                className="p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send id="send-icon" size={16} />
              </button>
            </div>
            
            {/* Enhanced Input Controls */}
            <div id="input-controls" className="flex items-center gap-4 mt-3 justify-center">
              <button
                id="deep-research-btn"
                onClick={() => setDeepResearchMode(!deepResearchMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition-colors ${
                  deepResearchMode 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Brain id="deep-research-icon" size={14} />
                <span id="deep-research-text">Deep Research</span>
              </button>
              
              <button
                id="think-longer-btn"
                onClick={() => setThinkLongerMode(!thinkLongerMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition-colors ${
                  thinkLongerMode 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Clock id="think-longer-icon" size={14} />
                <span id="think-longer-text">Think Longer</span>
              </button>
              
              <button
                id="search-btn"
                onClick={() => setSearchMode(!searchMode)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition-colors ${
                  searchMode 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Search id="search-icon" size={14} />
                <span id="search-text">Search</span>
              </button>
            </div>
            
            <p id="input-disclaimer" className="text-xs text-slate-400 text-center mt-2">
              ChrisGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;