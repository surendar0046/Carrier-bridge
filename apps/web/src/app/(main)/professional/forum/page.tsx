'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Comment {
  id: number;
  author: string;
  avatar: string;
  role: string;
  company: string;
  body: string;
  time: string;
  votes: number;
  isAccepted?: boolean;
  userVoted?: 'up' | 'down' | null;
  reactions: { [emoji: string]: number };
  userReactions: string[];
}

interface Post {
  id: number;
  title: string;
  category: 'LeetCode Solutions' | 'System Design' | 'FAANG Interview Prep' | 'Career & Offer Advice' | 'Architecture';
  body: string;
  codeSnippet?: {
    language: string;
    code: string;
    timeComplexity: string;
    spaceComplexity: string;
  };
  author: string;
  avatar: string;
  role: string;
  company: string;
  verifiedPro: boolean;
  time: string;
  tags: string[];
  views: number;
  votes: number;
  userVoted?: 'up' | 'down' | null;
  connected?: boolean;
  skillEndorsements: number;
  userEndorsed?: boolean;
  bookmarked?: boolean;
  comments: Comment[];
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'LRU Cache Design & Implementation (Optimal O(1) Solution with HashMap + DoublyLinkedList)',
    category: 'LeetCode Solutions',
    body: `Here is a complete, production-grade implementation for LeetCode #146 (LRU Cache) frequently asked at Google, Meta, and Amazon.\n\n### Key Intuition:\n1. **Doubly Linked List** provides O(1) node removal and insertion at the head (Most Recently Used).\n2. **HashMap** maps key -> Node pointer for O(1) fast lookup.\n3. When capacity is reached, remove tail node (Least Recently Used) and delete from map.`,
    codeSnippet: {
      language: 'typescript',
      code: `class DLLNode {
  key: number;
  val: number;
  prev: DLLNode | null = null;
  next: DLLNode | null = null;
  constructor(key: number = 0, val: number = 0) {
    this.key = key;
    this.val = val;
  }
}

export class LRUCache {
  private capacity: number;
  private map: Map<number, DLLNode> = new Map();
  private head: DLLNode = new DLLNode();
  private tail: DLLNode = new DLLNode();

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key)!;
    this.moveToHead(node);
    return node.val;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.val = value;
      this.moveToHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        const lru = this.tail.prev!;
        this.removeNode(lru);
        this.map.delete(lru.key);
      }
      const newNode = new DLLNode(key, value);
      this.addNode(newNode);
      this.map.set(key, newNode);
    }
  }

  private addNode(node: DLLNode) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  private removeNode(node: DLLNode) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  private moveToHead(node: DLLNode) {
    this.removeNode(node);
    this.addNode(node);
  }
}`,
      timeComplexity: 'O(1) Get & Put',
      spaceComplexity: 'O(N) Capacity',
    },
    author: 'Dr. Meera Iyer',
    avatar: 'https://ui-avatars.com/api/?name=Meera+Iyer&background=2563eb&color=fff',
    role: 'Staff Engineer',
    company: 'Google',
    verifiedPro: true,
    time: '2 hours ago',
    tags: ['LeetCode 146', 'Data Structures', 'Google Interview', 'HashMap'],
    views: 1420,
    votes: 184,
    connected: false,
    skillEndorsements: 94,
    comments: [
      {
        id: 101,
        author: 'Arjun Mehta',
        avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=8b5cf6&color=fff',
        role: 'Senior SWE',
        company: 'Microsoft',
        body: 'Clean implementation! In high-concurrency Java or Go, you would also lock the doubly linked list operations using a RWMutex or ConcurrentHashMap with lock striping. Great post Meera!',
        time: '1 hour ago',
        votes: 42,
        isAccepted: true,
        reactions: { '👍': 12, '💡': 8, '🚀': 5 },
        userReactions: [],
      },
      {
        id: 102,
        author: 'Vikram Singh',
        avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff',
        role: 'Tech Lead',
        company: 'Amazon',
        body: 'Can confirm this exact question was asked in my L6 interview round at Amazon AWS! Dummy head & tail nodes prevent null pointer edge cases completely.',
        time: '45 mins ago',
        votes: 19,
        isAccepted: false,
        reactions: { '👍': 9, '❤️': 4 },
        userReactions: [],
      },
    ],
  },
  {
    id: 2,
    title: 'How We Scaled Real-Time Video Streaming to 5M Peak Concurrent Users (System Design Blueprint)',
    category: 'System Design',
    body: `Here is our proven architectural pattern for low-latency live video broadcasting using WebRTC mesh relays, HLS fallback, and Edge CDN distribution.\n\n### System Highlights:\n- **Media Ingestion**: RTMP/SRT streams ingested by NGINX RTMP cluster.\n- **Adaptive Bitrate**: Transcoded into 1080p, 720p, 480p HLS segments (2s duration).\n- **Redis Cluster**: Manages pub-sub signaling and active room state across 200 nodes.\n- **Edge Cache**: Cloudflare Workers dynamically route stream manifests.`,
    author: 'Kavya Nair',
    avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=ec4899&color=fff',
    role: 'Principal Architect',
    company: 'Netflix / Disney+',
    verifiedPro: true,
    time: '4 hours ago',
    tags: ['System Design', 'WebRTC', 'HLS', 'Streaming', 'Redis'],
    views: 2890,
    votes: 312,
    connected: true,
    skillEndorsements: 148,
    comments: [
      {
        id: 201,
        author: 'Rohit Sharma',
        avatar: 'https://ui-avatars.com/api/?name=Rohit+Sharma&background=f59e0b&color=fff',
        role: 'DevOps Lead',
        company: 'Hotstar',
        body: 'How did you handle WebSocket connection surges during big match events? Did you use AWS ELB or custom Envoy proxies?',
        time: '3 hours ago',
        votes: 15,
        reactions: { '💡': 6 },
        userReactions: [],
      },
    ],
  },
  {
    id: 3,
    title: 'FAANG Staff Engineer Offer Negotiation Strategy (Salary + RSU Breakdown)',
    category: 'Career & Offer Advice',
    body: `Negotiating senior compensation package ($150k - $300k+ base + stock grants) requires competing offers and leverage.\n\n1. **Never give a number first**: Let the recruiter anchor.\n2. **Leverage competing counter-offers**: Written offers accelerate recruiter turnarounds by 3x.\n3. **Request sign-on bonus to bridge equity vesting gaps**: Equity takes 4 years with 1-year cliff.`,
    author: 'Siddharth Varma',
    avatar: 'https://ui-avatars.com/api/?name=Siddharth+Varma&background=06b6d4&color=fff',
    role: 'Engineering Director',
    company: 'Uber',
    verifiedPro: true,
    time: '1 day ago',
    tags: ['Career', 'Salary', 'Negotiation', 'FAANG', 'Naukri Pro'],
    views: 4100,
    votes: 495,
    connected: false,
    skillEndorsements: 210,
    comments: [],
  },
];

export default function ProfessionalForumPage() {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  
  // New Comment state
  const [commentText, setCommentText] = useState('');
  const [newPostModal, setNewPostModal] = useState(false);
  const [directMessageModal, setDirectMessageModal] = useState<Post | null>(null);
  const [dmMessage, setDmMessage] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Post Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Post['category']>('LeetCode Solutions');
  const [newBody, setNewBody] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newTimeComp, setNewTimeComp] = useState('O(N)');
  const [newSpaceComp, setNewSpaceComp] = useState('O(1)');
  const [newTags, setNewTags] = useState('LeetCode, System Design');

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  // Handlers for LinkedIn/Naukri Real-Time Actions
  const handleToggleConnect = (postId: number, authorName: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextState = !p.connected;
        showNotification(nextState ? `🤝 Connection request sent to ${authorName}!` : `Disconnected from ${authorName}`);
        return { ...p, connected: nextState };
      }
      return p;
    }));
  };

  const handleEndorseSkill = (postId: number, authorName: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextEndorsed = !p.userEndorsed;
        const delta = nextEndorsed ? 1 : -1;
        showNotification(nextEndorsed ? `🌟 Endorsed ${authorName} for System Design & Coding!` : `Removed endorsement for ${authorName}`);
        return {
          ...p,
          userEndorsed: nextEndorsed,
          skillEndorsements: p.skillEndorsements + delta,
        };
      }
      return p;
    }));
  };

  const handleBookmark = (postId: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextBk = !p.bookmarked;
        showNotification(nextBk ? '🔖 Post saved to your Professional Reading List' : 'Removed from Reading List');
        return { ...p, bookmarked: nextBk };
      }
      return p;
    }));
  };

  const handleVotePost = (postId: number, direction: 'up' | 'down') => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        let delta = 0;
        let nextVote: 'up' | 'down' | null = direction;

        if (p.userVoted === direction) {
          nextVote = null;
          delta = direction === 'up' ? -1 : 1;
        } else if (p.userVoted) {
          delta = direction === 'up' ? 2 : -2;
        } else {
          delta = direction === 'up' ? 1 : -1;
        }
        return { ...p, votes: p.votes + delta, userVoted: nextVote };
      }
      return p;
    }));
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPostId) return;
    const newCommentObj: Comment = {
      id: Date.now(),
      author: 'You (Verified Pro)',
      avatar: 'https://ui-avatars.com/api/?name=You+Pro&background=10b981&color=fff',
      role: 'Senior Engineer',
      company: 'Career Bridge Pro',
      body: commentText,
      time: 'Just now',
      votes: 1,
      userVoted: 'up',
      reactions: { '👍': 1 },
      userReactions: ['👍'],
    };

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPostId) {
        return { ...p, comments: [newCommentObj, ...p.comments] };
      }
      return p;
    }));

    setCommentText('');
    showNotification('💬 Comment posted in real-time!');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const createdPost: Post = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      body: newBody,
      codeSnippet: newCode.trim() ? {
        language: 'typescript',
        code: newCode,
        timeComplexity: newTimeComp,
        spaceComplexity: newSpaceComp,
      } : undefined,
      author: 'You (Verified Pro)',
      avatar: 'https://ui-avatars.com/api/?name=You+Pro&background=10b981&color=fff',
      role: 'Senior Architect',
      company: 'Tech Pro Inc.',
      verifiedPro: true,
      time: 'Just now',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
      views: 12,
      votes: 1,
      connected: false,
      skillEndorsements: 5,
      comments: [],
    };

    setPosts([createdPost, ...posts]);
    setNewPostModal(false);
    setNewTitle('');
    setNewBody('');
    setNewCode('');
    showNotification('🚀 Professional Discussion Post published!');
  };

  const handleSendDM = () => {
    if (!dmMessage.trim() || !directMessageModal) return;
    showNotification(`📩 Message sent to ${directMessageModal.author} on LinkedIn/Naukri Pro network!`);
    setDirectMessageModal(null);
    setDmMessage('');
  };

  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-xl">✨</span>
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-bold mb-3">
            <span>⚡ LeetCode Solutions & LinkedIn Pro Network</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            Pro Discussion Forum & Solutions
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Share optimal LeetCode solutions, system design architectures, and connect in real-time with verified industry professionals.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedPostId && (
            <button
              onClick={() => setSelectedPostId(null)}
              className="px-5 py-3 rounded-2xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-all border border-white/20">
              ← All Discussions
            </button>
          )}
          <button
            onClick={() => setNewPostModal(true)}
            className="px-6 py-3 rounded-2xl text-xs font-black text-white shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#6366f1)' }}>
            + Create Pro Discussion / Solution
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      {!selectedPostId && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 scrollbar-hide">
              {['All', 'LeetCode Solutions', 'System Design', 'FAANG Prep', 'Career & Offer Advice'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}>
                  {cat === 'LeetCode Solutions' ? '💻 LeetCode Solutions' : cat === 'System Design' ? '🏗️ System Design' : cat === 'FAANG Prep' ? '🔥 FAANG Prep' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search solutions, tags, authors..."
                className="w-full border border-slate-200 bg-white rounded-2xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>
        </div>
      )}

      {/* Post List View */}
      {!selectedPostId && (
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
              <span className="text-4xl">🔍</span>
              <p className="font-bold text-slate-600 mt-2">No discussion posts match your criteria</p>
              <p className="text-xs text-slate-400 mt-1">Be the first working professional to publish a solution!</p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div
                key={post.id}
                className="bg-white border border-slate-200 hover:border-indigo-300 rounded-3xl p-6 transition-all duration-300 hover:shadow-xl group space-y-4">
                {/* Author Bar & Real-Time LinkedIn Actions */}
                <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-indigo-500/20" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{post.author}</span>
                        {post.verifiedPro && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                            ✓ Verified Pro
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">{post.role} @ <span className="text-slate-800 font-bold">{post.company}</span> · {post.time}</p>
                    </div>
                  </div>

                  {/* Real-time Networking Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleConnect(post.id, post.author)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        post.connected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white'
                      }`}>
                      {post.connected ? '✓ Connected' : '🤝 Connect'}
                    </button>
                    <button
                      onClick={() => setDirectMessageModal(post)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1">
                      💬 DM
                    </button>
                    <button
                      onClick={() => handleEndorseSkill(post.id, post.author)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        post.userEndorsed
                          ? 'bg-amber-50 text-amber-700 border border-amber-300'
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-amber-50'
                      }`}>
                      🌟 Endorse ({post.skillEndorsements})
                    </button>
                  </div>
                </div>

                {/* Content Header & Title */}
                <div onClick={() => setSelectedPostId(post.id)} className="cursor-pointer space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {post.category}
                    </span>
                    {post.codeSnippet && (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                        ⏱️ {post.codeSnippet.timeComplexity} | 💾 {post.codeSnippet.spaceComplexity}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {post.body}
                  </p>
                </div>

                {/* LeetCode Code Snippet Preview */}
                {post.codeSnippet && (
                  <div className="bg-slate-950 rounded-2xl p-4 text-slate-200 font-mono text-xs overflow-x-auto relative border border-slate-800">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                      <span>{post.codeSnippet.language.toUpperCase()} Solution</span>
                      <span>LeetCode Verified Code</span>
                    </div>
                    <pre className="max-h-32 overflow-hidden opacity-90">{post.codeSnippet.code}</pre>
                    <button
                      onClick={() => setSelectedPostId(post.id)}
                      className="mt-2 text-[11px] font-bold text-indigo-400 hover:underline">
                      Show full code and discussion →
                    </button>
                  </div>
                )}

                {/* Footer Metrics & Actions */}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
                      <button
                        onClick={() => handleVotePost(post.id, 'up')}
                        className={`px-2 py-1 rounded-lg font-bold transition-all ${
                          post.userVoted === 'up' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 text-slate-600'
                        }`}>
                        ▲ {post.votes}
                      </button>
                      <button
                        onClick={() => handleVotePost(post.id, 'down')}
                        className={`px-2 py-1 rounded-lg font-bold transition-all ${
                          post.userVoted === 'down' ? 'bg-rose-600 text-white' : 'hover:bg-slate-200 text-slate-600'
                        }`}>
                        ▼
                      </button>
                    </div>
                    <button onClick={() => setSelectedPostId(post.id)} className="font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1">
                      💬 {post.comments.length} Answers / Comments
                    </button>
                    <span>👁️ {post.views} Views</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`p-2 rounded-xl text-xs transition-all ${
                        post.bookmarked ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}>
                      {post.bookmarked ? '🔖 Saved' : '🔖 Save'}
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('🔗 Post link copied to clipboard!');
                      }}
                      className="p-2 rounded-xl text-xs bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all">
                      🔄 Share / Repost
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail View for Selected Post */}
      {selectedPost && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-lg">
            {/* Top Info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <img src={selectedPost.avatar} alt={selectedPost.author} className="w-12 h-12 rounded-2xl object-cover ring-4 ring-indigo-500/20" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-base">{selectedPost.author}</h3>
                    {selectedPost.verifiedPro && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ✓ Verified Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold">{selectedPost.role} @ <span className="text-slate-800 font-bold">{selectedPost.company}</span> · {selectedPost.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleConnect(selectedPost.id, selectedPost.author)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedPost.connected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                  }`}>
                  {selectedPost.connected ? '✓ Connected' : '🤝 Connect on LinkedIn/Naukri'}
                </button>
                <button
                  onClick={() => setDirectMessageModal(selectedPost)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                  💬 DM Author
                </button>
              </div>
            </div>

            {/* Post Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedPost.category}
                </span>
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">{selectedPost.title}</h1>
            </div>

            {/* Body */}
            <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line border-t border-b border-slate-100 py-6">
              {selectedPost.body}
            </div>

            {/* Code Snippet Box */}
            {selectedPost.codeSnippet && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">LeetCode Solution Code</span>
                  <div className="flex gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Time: {selectedPost.codeSnippet.timeComplexity}
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                      Space: {selectedPost.codeSnippet.spaceComplexity}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-950 text-emerald-400 p-6 rounded-2xl font-mono text-xs border border-slate-800 shadow-inner overflow-x-auto">
                  <pre>{selectedPost.codeSnippet.code}</pre>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVotePost(selectedPost.id, 'up')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPost.userVoted === 'up' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                  }`}>
                  ▲ Upvote ({selectedPost.votes})
                </button>
                <button
                  onClick={() => handleEndorseSkill(selectedPost.id, selectedPost.author)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all">
                  🌟 Endorse ({selectedPost.skillEndorsements})
                </button>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showNotification('🔗 Link copied to share on LinkedIn/Naukri!');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all">
                🔄 Repost / Share
              </button>
            </div>
          </div>

          {/* Comment & Discussion Section (LeetCode style) */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>💬</span> Professional Answers & Comments ({selectedPost.comments.length})
            </h3>

            {/* Add Comment Box */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider">Add Your Solution / Expert Feedback</h4>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                rows={4}
                placeholder="Write your technical feedback or alternate solution approach..."
                className="w-full border border-slate-200 rounded-2xl p-4 text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-slate-400 font-semibold">💡 Markdown syntax & code blocks supported</span>
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="px-6 py-2.5 rounded-2xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md">
                  🚀 Post Answer
                </button>
              </div>
            </div>

            {/* Existing Comments */}
            <div className="space-y-4">
              {selectedPost.comments.map(cmt => (
                <div
                  key={cmt.id}
                  className={`bg-white border rounded-3xl p-6 space-y-3 transition-all ${
                    cmt.isAccepted ? 'border-emerald-300 ring-2 ring-emerald-500/20 bg-emerald-50/20' : 'border-slate-200'
                  }`}>
                  {cmt.isAccepted && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                      ✓ Top Voted Accepted Solution
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={cmt.avatar} alt={cmt.author} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{cmt.author}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{cmt.role} @ {cmt.company}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{cmt.time}</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">{cmt.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {newPostModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-900 text-lg">Create Pro Discussion / LeetCode Solution</h3>
              <button onClick={() => setNewPostModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Optimal System Design for High Concurrency Order Processing"
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 bg-white">
                    <option value="LeetCode Solutions">LeetCode Solutions</option>
                    <option value="System Design">System Design</option>
                    <option value="FAANG Interview Prep">FAANG Interview Prep</option>
                    <option value="Career & Offer Advice">Career & Offer Advice</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={e => setNewTags(e.target.value)}
                    placeholder="LeetCode 146, System Design, Java"
                    className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Post Description / Key Approach</label>
                <textarea
                  required
                  rows={4}
                  value={newBody}
                  onChange={e => setNewBody(e.target.value)}
                  placeholder="Explain your approach, trade-offs, and architecture..."
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Code Solution (Optional)</label>
                <textarea
                  rows={5}
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  placeholder="Paste your TypeScript / Python / Java code solution..."
                  className="w-full border border-slate-900 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl p-3 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={newTimeComp}
                    onChange={e => setNewTimeComp(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={newSpaceComp}
                    onChange={e => setNewSpaceComp(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setNewPostModal(false)} className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-700">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Message Modal */}
      {directMessageModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img src={directMessageModal.avatar} alt={directMessageModal.author} className="w-9 h-9 rounded-xl" />
                <div>
                  <h4 className="font-black text-slate-900 text-xs">{directMessageModal.author}</h4>
                  <p className="text-[10px] text-slate-500">{directMessageModal.role} @ {directMessageModal.company}</p>
                </div>
              </div>
              <button onClick={() => setDirectMessageModal(null)} className="text-slate-400 font-bold text-xs">✕</button>
            </div>
            <p className="text-xs text-slate-600">Send a direct message on the professional network regarding their discussion post.</p>
            <textarea
              rows={4}
              value={dmMessage}
              onChange={e => setDmMessage(e.target.value)}
              placeholder="Hi! I loved your solution on system design. I would love to connect..."
              className="w-full border border-slate-200 rounded-2xl p-3 text-xs outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDirectMessageModal(null)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600">Cancel</button>
              <button onClick={handleSendDM} className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 text-white shadow-md">Send Direct Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
