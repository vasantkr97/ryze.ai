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
    <div className="flex h-[calc(100vh-6rem)] flex-col bg-background/50 relative">
      {/* Premium Header */}
      <div className="relative z-10 flex flex-shrink-0 items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5 transition-transform hover:scale-105">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-background">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Ryze AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs font-medium text-muted-foreground">Always active & ready to help</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground border border-transparent hover:border-border/50">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 flex flex-col bg-gradient-to-b from-transparent to-primary/5">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth"
        >
          <div className="mx-auto max-w-3xl space-y-8 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm border',
                    message.role === 'assistant'
                      ? 'bg-card border-border/50 text-foreground shadow-sm'
                      : 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>

                {/* Message Content */}
                <div className={cn('relative max-w-[80%]', message.role === 'user' ? 'items-end' : 'items-start')}>
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-2xl px-6 py-4 shadow-sm transition-all',
                      message.role === 'assistant'
                        ? 'bg-card border border-border/50 text-foreground'
                        : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
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
                        const processedLine = line.replace(
                          /\*\*(.*?)\*\*/g,
                          message.role === 'assistant' 
                            ? '<strong class="font-bold text-foreground">$1</strong>' 
                            : '<strong class="font-bold text-white">$1</strong>'
                        );
                        return (
                          <p
                            key={i}
                            className={cn(
                              'mb-2 last:mb-0 leading-relaxed tracking-wide',
                              line.startsWith('-') && 'ml-4',
                              line.startsWith('**') && 'mt-4 first:mt-0'
                            )}
                            dangerouslySetInnerHTML={{ __html: processedLine }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Message Actions */}
                  <div
                    className={cn(
                      'mt-2 flex items-center gap-2 px-1',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <span className="text-[10px] font-medium text-muted-foreground/60">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-md hover:bg-muted hover:text-foreground text-muted-foreground"
                          onClick={() => handleCopy(message.id, message.content)}
                        >
                          {copiedId === message.id ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <div className="h-3 w-[1px] bg-border/50" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-6 w-6 rounded-md hover:bg-muted hover:text-foreground text-muted-foreground',
                            message.feedback === 'positive' && 'text-emerald-500 bg-emerald-500/10'
                          )}
                          onClick={() => handleFeedback(message.id, 'positive')}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-6 w-6 rounded-md hover:bg-muted hover:text-foreground text-muted-foreground',
                            message.feedback === 'negative' && 'text-red-500 bg-red-500/10'
                          )}
                          onClick={() => handleFeedback(message.id, 'negative')}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-card border border-border/50 shadow-sm">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="rounded-2xl bg-card border border-border/50 px-5 py-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            )}
            
            {/* Suggested Prompts (Inline) */}
            {messages.length === 1 && (
              <div className="py-2">
                <p className="mb-4 text-sm font-medium text-muted-foreground px-1">
                  Suggested topics to get started:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={prompt.text}
                      onClick={() => handlePromptClick(prompt.text)}
                      className={cn(
                        'group flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 p-3 text-left backdrop-blur-sm transition-all duration-300',
                        'hover:border-primary/50 hover:bg-card hover:shadow-md hover:-translate-y-0.5',
                        'animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards'
                      )}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br transition-all duration-300 group-hover:scale-110',
                        prompt.gradient
                      )}>
                        <prompt.icon className={cn('h-4 w-4', prompt.iconColor)} />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{prompt.category.charAt(0).toUpperCase() + prompt.category.slice(1)}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{prompt.text}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Scroll Button */}
        {showScrollButton && (
          <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full shadow-lg border border-border/50 bg-background/90 backdrop-blur-md hover:bg-background pl-3 pr-4"
              onClick={scrollToBottom}
            >
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">New messages</span>
            </Button>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-border/40 bg-background/80 backdrop-blur-xl p-4 supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-card/50 p-2 shadow-sm ring-1 ring-inset ring-transparent transition-all focus-within:border-primary/30 focus-within:ring-primary/10 focus-within:bg-card">
            <div className="flex items-center gap-1 self-end pb-2 pl-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                 <Paperclip className="h-5 w-5" />
               </Button>
            </div>
            
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your campaigns, audiences, or creatives..."
              rows={1}
              className={cn(
                'flex-1 resize-none bg-transparent px-2 py-3.5 text-sm leading-relaxed text-foreground',
                'placeholder:text-muted-foreground/50',
                'focus:outline-none',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'max-h-[200px] min-h-[52px]'
              )}
              disabled={isTyping}
            />
            
            <div className="flex items-center gap-1 self-end pb-2 pr-2">
               <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                 <Mic className="h-5 w-5" />
               </Button>
               <div className="w-px h-5 bg-border/50 mx-1" />
               <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className={cn(
                  'h-9 w-9 rounded-full transition-all duration-300 shadow-sm',
                  inputValue.trim() && !isTyping
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/20'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] font-medium text-muted-foreground/50">
            Ryze AI combines real-time data with predictive models. Results may vary.
          </p>
        </div>
      </div>
    </div>
  );
}
