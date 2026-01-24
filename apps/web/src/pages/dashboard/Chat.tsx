import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Target,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Mic,
  Paperclip,
  ArrowDown,
  Check,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  feedback?: 'positive' | 'negative';
}

// Suggested prompts
const suggestedPrompts = [
  {
    icon: TrendingUp,
    text: 'How can I improve my ROAS?',
    category: 'optimization',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-500',
  },
  {
    icon: AlertCircle,
    text: 'Which campaigns are wasting spend?',
    category: 'analysis',
    gradient: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-500',
  },
  {
    icon: Target,
    text: 'What audiences should I target?',
    category: 'targeting',
    gradient: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
  },
  {
    icon: Lightbulb,
    text: 'Give me creative ideas for my ads',
    category: 'creative',
    gradient: 'from-amber-500/20 to-amber-500/5',
    iconColor: 'text-amber-500',
  },
];

// Mock AI responses based on keywords
const getMockResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  if (message.includes('roas') || message.includes('return')) {
    return `Based on my analysis of your campaigns, here are my top recommendations to improve ROAS:

**1. Reallocate Budget to Top Performers**
Your "Summer Sale" campaign has a 4.2x ROAS - 45% above average. Consider shifting 20% of budget from underperforming campaigns here.

**2. Optimize Bidding Strategy**
Switch to Target ROAS bidding on Google Ads campaigns. Based on historical data, a target of 3.5x would balance volume and efficiency.

**3. Refine Audience Targeting**
Users aged 25-34 on mobile show 28% higher conversion rates. Create dedicated ad sets for this segment.

**4. Dayparting Optimization**
Your conversions peak between 7-9 PM. Increase bids by 15-20% during these hours.

Would you like me to implement any of these changes automatically?`;
  }

  if (message.includes('wasting') || message.includes('underperforming') || message.includes('waste')) {
    return `I've identified several areas where you may be wasting ad spend:

**High-Priority Issues:**

1. **Brand Awareness Q1 - Meta Ads**
   - 3 ad sets with CPA 2x above target ($58 vs $29)
   - Estimated waste: $340/day
   - Recommendation: Pause these ad sets immediately

2. **Competitor Conquest - Google Ads**
   - ROAS of 2.9x, significantly below portfolio average of 4.0x
   - Low-quality score keywords driving up CPC
   - Recommendation: Review and pause low QS keywords

3. **Retargeting - Frequency Cap Issues**
   - Average frequency of 8.2 (too high)
   - Likely causing ad fatigue and negative brand perception
   - Recommendation: Set frequency cap to 3 per week

**Total Potential Savings: $1,240/day ($37,200/month)**

Shall I create automation rules to prevent these issues in the future?`;
  }

  if (message.includes('audience') || message.includes('target')) {
    return `Based on your conversion data and market analysis, here are audience recommendations:

**High-Value Segments to Target:**

1. **Mobile Users, 25-34, Interest: Technology**
   - Current CVR: 4.2% (28% above average)
   - Estimated reach: 450K users
   - Recommended budget allocation: +30%

2. **Cart Abandoners (7-30 days)**
   - Retargeting ROAS: 6.2x
   - Currently underutilized
   - Recommendation: Increase budget by 50%

3. **Lookalike Audiences (Top 1% Purchasers)**
   - Untapped opportunity on Meta
   - Estimated ROAS potential: 3.8x
   - Recommendation: Create new campaign

**Segments to Exclude:**

- Users who purchased in last 7 days (reduce wasted impressions)
- High bounce rate visitors (< 10s on site)
- Geographic areas with low LTV

Would you like me to set up these audience segments across your campaigns?`;
  }

  if (message.includes('creative') || message.includes('ideas') || message.includes('ad copy')) {
    return `Here are AI-generated creative concepts based on your top-performing ads:

**Video Ad Concepts:**

1. **"Problem-Solution" Format**
   - Hook: Start with a relatable pain point
   - Show product solving the problem
   - End with strong CTA + social proof
   - Predicted CTR: 3.8%

2. **"Day in the Life" UGC Style**
   - Authentic, unpolished feel
   - Show real usage scenarios
   - Perform well with 18-34 demographic
   - Predicted CTR: 4.2%

**Static Ad Concepts:**

1. **Minimal Design + Bold Typography**
   - Single product focus
   - Price anchor with crossed-out original
   - Urgency element (limited time)

2. **Carousel with Benefits**
   - Each slide = one key benefit
   - Final slide = CTA with offer

**Copy Variations to Test:**
- "Join 50,000+ happy customers"
- "Your search for [solution] ends here"
- "Stop [pain point]. Start [benefit]."

Want me to generate these creatives in the Creative Lab?`;
  }

  // Default response
  return `I'd be happy to help you with that! Based on your current campaign performance:

**Quick Overview:**
- Total Spend (Last 30 days): $48,250
- Overall ROAS: 4.05x
- Total Conversions: 1,847
- Active Campaigns: 6

**Key Insights:**
- Your "Summer Sale" campaign is your top performer with 4.2x ROAS
- Meta Ads has the highest volume but Google Ads has better efficiency
- Mobile conversions are up 28% this month

Is there a specific aspect of your campaigns you'd like me to dive deeper into? I can analyze:
- Campaign performance
- Audience insights
- Budget allocation
- Creative performance
- Competitor analysis`;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your AI advertising assistant. I have access to all your campaign data across Google Ads, Meta, LinkedIn, and more.

I can help you with:
- **Analyzing performance** - Understanding what's working and what isn't
- **Optimizing campaigns** - Finding opportunities to improve ROAS
- **Budget allocation** - Where to invest for maximum returns
- **Audience insights** - Discovering high-value segments
- **Creative recommendations** - Ideas for better ad performance

What would you like to explore today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getMockResponse(content),
      timestamp: new Date(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiResponse]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
  };

  const handleCopy = async (messageId: string, content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Ryze AI Assistant</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              Your intelligent advertising copilot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-6"
      >
        <div className="mx-auto max-w-3xl space-y-6 px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-4 animate-fade-up',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-lg',
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-primary to-primary/80 shadow-primary/20'
                    : 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-slate-900/20'
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5 text-primary-foreground" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'group relative max-w-[85%] space-y-2',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3',
                    message.role === 'assistant'
                      ? 'bg-muted/50 text-foreground border border-border/50'
                      : 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20'
                  )}
                >
                  <div
                    className={cn(
                      'prose prose-sm max-w-none',
                      message.role === 'user' && 'prose-invert',
                      message.role === 'assistant' && 'prose-slate dark:prose-invert'
                    )}
                  >
                    {message.content.split('\n').map((line, i) => {
                      // Handle bold text
                      const processedLine = line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong class="font-semibold text-foreground">$1</strong>'
                      );
                      return (
                        <p
                          key={i}
                          className={cn(
                            'mb-1.5 last:mb-0 leading-relaxed',
                            line.startsWith('-') && 'ml-4',
                            line.startsWith('**') && 'mt-3 first:mt-0'
                          )}
                          dangerouslySetInnerHTML={{ __html: processedLine }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Message Footer */}
                <div
                  className={cn(
                    'flex items-center gap-2 px-1 text-xs text-muted-foreground',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <span className="opacity-70">{formatTime(message.timestamp)}</span>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg hover:bg-muted"
                        onClick={() => handleCopy(message.id, message.content)}
                      >
                        {copiedId === message.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-7 w-7 rounded-lg hover:bg-muted',
                          message.feedback === 'positive' && 'text-emerald-500 bg-emerald-500/10'
                        )}
                        onClick={() => handleFeedback(message.id, 'positive')}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-7 w-7 rounded-lg hover:bg-muted',
                          message.feedback === 'negative' && 'text-red-500 bg-red-500/10'
                        )}
                        onClick={() => handleFeedback(message.id, 'negative')}
                      >
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 animate-fade-up">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="rounded-2xl bg-muted/50 border border-border/50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-36 left-1/2 z-10 -translate-x-1/2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg border border-border/50 bg-card/90 backdrop-blur-sm hover:bg-card"
            onClick={scrollToBottom}
          >
            <ArrowDown className="mr-1.5 h-3.5 w-3.5" />
            New messages
          </Button>
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="border-t border-border/50 py-5">
          <div className="mx-auto max-w-3xl px-4">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Get started with a question
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handlePromptClick(prompt.text)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-left transition-all duration-200',
                    'hover:border-primary/30 hover:bg-muted/50 hover:shadow-lg'
                  )}
                >
                  <div className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110',
                    prompt.gradient
                  )}>
                    <prompt.icon className={cn('h-5 w-5', prompt.iconColor)} />
                  </div>
                  <span className="text-sm font-medium leading-tight">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm p-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your campaigns..."
                rows={1}
                className={cn(
                  'w-full resize-none rounded-xl border-2 border-border/50 bg-background px-4 py-3 pr-24 text-sm',
                  'placeholder:text-muted-foreground/60',
                  'focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'transition-all duration-200'
                )}
                disabled={isTyping}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className={cn(
                'h-12 w-12 rounded-xl transition-all duration-200',
                inputValue.trim() && !isTyping
                  ? 'btn-premium shadow-lg'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground/70">
            Ryze AI analyzes your real campaign data to provide personalized insights and recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
