'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    icon: '/oai1.jpg',
    content: '',
    song: '/sunflowerfeelings.mp3',
    songTitle: 'Sunflower Feelings',
    songArtist: 'Kuzu Mellow',
    songCover: '/sunflowerfeelings.jpeg',
    colors: ['red', 'orange', 'indigo', 'purple', 'fuchsia', 'pink'],
    slug: ''
  });
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const router = useRouter();
  
  // Available songs for selection
  const availableSongs = [
    { 
      path: '/sunflowerfeelings.mp3', 
      title: 'Sunflower Feelings', 
      artist: 'Kuzu Mellow', 
      cover: '/sunflowerfeelings.jpeg' 
    },
    { 
      path: '/charcoalbaby.mp3', 
      title: 'Charcoal Baby', 
      artist: 'Blood Orange', 
      cover: '/charcoalbaby.jpg' 
    }
  ];

  // Available icons for selection
  const availableIcons = [
    '/oai1.jpg',
    '/oai2.jpeg',
    '/oai3.jpg',
    '/oai4.jpg',
    '/oai5.png',
    '/oai6.png',
    '/oai7.png',
    '/WEBP to JPG 1.jpg',
    '/WEBP to JPG 2.jpg',
    '/WEBP to JPG 3.jpg',
    '/WEBP to JPG 4.jpg',
    '/WEBP to JPG 5.jpg'
  ];
  
  // Available colors for gradients
  const availableColors = [
    'red', 'orange', 'yellow', 'green', 'teal', 'blue', 
    'indigo', 'purple', 'pink', 'rose', 'fuchsia', 'violet'
  ];
  
  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    setPreviewAudio(audio);
    
    // Cleanup function
    return () => {
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = '';
      }
    };
  }, [previewAudio]);
  
  useEffect(() => {
    // Check if authenticated in localStorage
    const auth = localStorage.getItem('blogAdminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchBlogPosts();
    } else {
      setLoading(false);
    }
  }, []);
  
  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/list');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setBlogPosts(data.posts || []);
      setLoading(false);
    } catch (err) {
      setError('Error fetching blog posts');
      setLoading(false);
      console.error('Error fetching blog posts:', err);
    }
  };
  
  const handleLogin = () => {
    if (password === 'vrkxygkn') {
      setIsAuthenticated(true);
      localStorage.setItem('blogAdminAuth', 'true');
      fetchBlogPosts();
    } else {
      setError('Invalid password');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('blogAdminAuth');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'song') {
      const selectedSong = availableSongs.find(song => song.path === value);
      if (selectedSong) {
        setNewPost({
          ...newPost,
          song: selectedSong.path,
          songTitle: selectedSong.title,
          songArtist: selectedSong.artist,
          songCover: selectedSong.cover
        });
        
        // Preview the song
        if (previewAudio) {
          previewAudio.pause();
          previewAudio.src = selectedSong.path;
          setIsPlaying(false);
        }
      }
    } else if (name === 'title') {
      setNewPost({
        ...newPost,
        [name]: value,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      });
    } else {
      setNewPost({
        ...newPost,
        [name]: value
      });
    }
  };
  
  const handleColorChange = (index: number, value: string) => {
    const updatedColors = [...newPost.colors];
    updatedColors[index] = value;
    setNewPost({
      ...newPost,
      colors: updatedColors
    });
  };
  
  const toggleAudioPreview = () => {
    if (!previewAudio) return;
    
    if (isPlaying) {
      previewAudio.pause();
    } else {
      previewAudio.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const createBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPost,
          slug: newPost.slug || newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog post');
      }
      
      await fetchBlogPosts();
      
      setNewPost({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        icon: '/oai1.jpg',
        content: '',
        song: '/sunflowerfeelings.mp3',
        songTitle: 'Sunflower Feelings',
        songArtist: 'Kuzu Mellow',
        songCover: '/sunflowerfeelings.jpeg',
        colors: ['red', 'orange', 'indigo', 'purple', 'fuchsia', 'pink'],
        slug: ''
      });
      
      setEditMode(false);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error creating blog post');
      setLoading(false);
      console.error('Error creating blog post:', err);
    }
  };
  
  const updateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/blog/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog post');
      }
      
      await fetchBlogPosts();
      
      setNewPost({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        icon: '/oai1.jpg',
        content: '',
        song: '/sunflowerfeelings.mp3',
        songTitle: 'Sunflower Feelings',
        songArtist: 'Kuzu Mellow',
        songCover: '/sunflowerfeelings.jpeg',
        colors: ['red', 'orange', 'indigo', 'purple', 'fuchsia', 'pink'],
        slug: ''
      });
      
      setEditMode(false);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error updating blog post');
      setLoading(false);
      console.error('Error updating blog post:', err);
    }
  };
  
  const deleteBlogPost = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/delete?slug=${slug}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete blog post');
      }
      
      await fetchBlogPosts();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error deleting blog post');
      setLoading(false);
      console.error('Error deleting blog post:', err);
    }
  };

  const editBlogPost = async (slug: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch blog post');
      }
      
      const post = await response.json();
      
      setNewPost({
        ...post,
        content: post.content || ''
      });
      
      setEditMode(true);
      setLoading(false);
      
      // Update audio preview
      if (previewAudio) {
        previewAudio.pause();
        previewAudio.src = post.song;
        setIsPlaying(false);
      }
      
      // Scroll to the form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Error fetching blog post for editing');
      setLoading(false);
      console.error('Error fetching blog post:', err);
    }
  };
  
  const cancelEdit = () => {
    setNewPost({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      icon: '/oai1.jpg',
      content: '',
      song: '/sunflowerfeelings.mp3',
      songTitle: 'Sunflower Feelings',
      songArtist: 'Kuzu Mellow',
      songCover: '/sunflowerfeelings.jpeg',
      colors: ['red', 'orange', 'indigo', 'purple', 'fuchsia', 'pink'],
      slug: ''
    });
    setEditMode(false);
    
    // Stop audio preview
    if (previewAudio) {
      previewAudio.pause();
      setIsPlaying(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              blog admin
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              enter password to access
            </p>
          </div>
          
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            
            <div>
              <button
                onClick={handleLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                login
              </button>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              back to home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">blog admin</h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/blog"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              view blog
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
            >
              logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              {editMode ? 'edit blog post' : 'create new blog post'}
            </h2>
            
            <form onSubmit={editMode ? updateBlogPost : createBlogPost} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={newPost.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    slug
                  </label>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    disabled={editMode}
                    value={newPost.slug}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm ${editMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will be used in the URL: /blog/{newPost.slug || 'example-slug'}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    value={newPost.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    subtitle / description
                  </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    required
                    value={newPost.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    cover icon
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {availableIcons.map((iconSrc) => (
                      <div 
                        key={iconSrc}
                        onClick={() => setNewPost({...newPost, icon: iconSrc})}
                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${newPost.icon === iconSrc ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200 dark:border-gray-700'} transition-all`}
                      >
                        <div className="relative aspect-square">
                          <Image 
                            src={iconSrc} 
                            alt="Cover icon" 
                            fill
                            className="object-cover"
                          />
                        </div>
                        {newPost.icon === iconSrc && (
                          <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Selected: {newPost.icon}
                  </p>
                </div>
                
                <div>
                  <label htmlFor="song" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    background song
                  </label>
                  <div className="mb-2">
                    <select
                      id="song"
                      name="song"
                      value={newPost.song}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                    >
                      {availableSongs.map((song) => (
                        <option key={song.path} value={song.path}>
                          {song.title} - {song.artist}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 relative rounded overflow-hidden shadow">
                      <Image 
                        src={newPost.songCover} 
                        alt={newPost.songTitle} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{newPost.songTitle}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{newPost.songArtist}</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleAudioPreview}
                      className="flex-shrink-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow"
                    >
                      {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  gradient colors
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {newPost.colors.map((color, index) => (
                    <div key={index}>
                      <select
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                      >
                        {availableColors.map((colorOption) => (
                          <option key={colorOption} value={colorOption}>
                            {colorOption}
                          </option>
                        ))}
                      </select>
                      <div className={`mt-1 h-2 w-full bg-${color}-500 rounded-full`}></div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 p-3 rounded-lg overflow-hidden">
                  <div className={`h-6 w-full bg-gradient-to-r from-${newPost.colors[0]}-400 via-${newPost.colors[1]}-300 to-${newPost.colors[2]}-300 rounded-t-lg`}></div>
                  <div className={`h-6 w-full bg-gradient-to-r from-${newPost.colors[2]}-300 via-${newPost.colors[3]}-400 to-${newPost.colors[4]}-300`}></div>
                  <div className={`h-6 w-full bg-gradient-to-r from-${newPost.colors[4]}-300 via-${newPost.colors[5]}-300 to-${newPost.colors[0]}-400 rounded-b-lg`}></div>
                </div>
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  blog content
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    required
                    value={newPost.content}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-700 rounded-md p-3 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter your blog post content. Use double line breaks for new paragraphs."
                  ></textarea>
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Write your blog content. Use double line breaks to create new paragraphs.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                {editMode && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'processing...' : editMode ? 'update post' : 'create post'}
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">manage blog posts</h2>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-400 text-sm mb-4">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">loading...</p>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">no blog posts found</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {blogPosts.map((post) => (
                      <tr key={post.slug}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => editBlogPost(post.slug)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                          >
                            edit
                          </button>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                          >
                            view
                          </Link>
                          <button
                            onClick={() => deleteBlogPost(post.slug)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 