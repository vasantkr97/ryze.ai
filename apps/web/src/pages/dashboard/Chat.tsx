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
  MoreVertical,
  Mic,
  Paperclip,
  ArrowDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  },
  {
    icon: AlertCircle,
    text: 'Which campaigns are wasting spend?',
    category: 'analysis',
  },
  {
    icon: Target,
    text: 'What audiences should I target?',
    category: 'targeting',
  },
  {
    icon: Lightbulb,
    text: 'Give me creative ideas for my ads',
    category: 'creative',
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/90">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Ryze AI Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Your intelligent advertising copilot
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4"
      >
        <div className="mx-auto max-w-3xl space-y-6 px-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  message.role === 'assistant'
                    ? 'bg-primary/90'
                    : 'bg-slate-600'
                )}
              >
                {message.role === 'assistant' ? (
                  <Bot className="h-4 w-4 text-white" />
                ) : (
                  <User className="h-4 w-4 text-primary-foreground" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  'group relative max-w-[80%] space-y-2',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3',
                    message.role === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'prose prose-sm max-w-none',
                      message.role === 'user' && 'prose-invert'
                    )}
                  >
                    {message.content.split('\n').map((line, i) => {
                      // Handle bold text
                      const processedLine = line.replace(
                        /\*\*(.*?)\*\*/g,
                        '<strong>$1</strong>'
                      );
                      return (
                        <p
                          key={i}
                          className={cn(
                            'mb-1 last:mb-0',
                            line.startsWith('-') && 'ml-4'
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
                    'flex items-center gap-2 text-xs text-muted-foreground',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <span>{formatTime(message.timestamp)}</span>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => navigator.clipboard.writeText(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-6 w-6',
                          message.feedback === 'positive' && 'text-green-500'
                        )}
                        onClick={() => handleFeedback(message.id, 'positive')}
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          'h-6 w-6',
                          message.feedback === 'negative' && 'text-red-500'
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

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/90">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2">
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full shadow-lg"
            onClick={scrollToBottom}
          >
            <ArrowDown className="mr-1 h-4 w-4" />
            Scroll to bottom
          </Button>
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="border-t py-4">
          <div className="mx-auto max-w-3xl px-4">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Suggested questions
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="flex items-center gap-3 rounded-lg border bg-card p-3 text-left transition-all hover:border-primary hover:bg-muted/50"
                >
                  <div className="rounded-lg bg-primary/10 p-2">
                    <prompt.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your campaigns..."
                className="min-h-[48px] resize-none rounded-xl border-2 pr-24 focus-visible:ring-1"
                disabled={isTyping}
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              className="h-12 w-12 rounded-xl"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Ryze AI has access to your campaign data. Responses are generated based on your actual performance metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
