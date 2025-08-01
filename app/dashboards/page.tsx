"use client";

import { useState, useEffect } from "react";
import Sidebar from './Sidebar';
import ApiKeyModal from './ApiKeyModal';
import ApiKeysTable from './ApiKeysTable';
import Notification from './Notification';
import { useApiKeys } from './useApiKeys';
import { useSession, signIn, signOut } from "next-auth/react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed?: string;
  usage?: number;
}

const PLAN = {
  name: "Dandi API",
  limit: 1000,
  used: 24,
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const {
    apiKeys,
    isModalOpen,
    setIsModalOpen,
    editingKey,
    formData,
    setFormData,
    visibleKeyId,
    setVisibleKeyId,
    copiedKeyId,
    notification,
    setNotification,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEditModal,
    openCreateModal,
    copyToClipboard,
  } = useApiKeys();

  const { data: session, status } = useSession();

  // Debug: log session data
  console.log('Dashboard session data:', session);
  console.log('Dashboard session user:', session?.user);
  console.log('Session user name:', session?.user?.name);
  console.log('Session user email:', session?.user?.email);
  console.log('Session user image:', session?.user?.image);
  console.log('Session status:', status);
  console.log('Is session loading?', status === 'loading');
  console.log('Is session authenticated?', status === 'authenticated');

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Monitor session changes
  useEffect(() => {
    console.log('Session changed:', session);
    console.log('Session user changed:', session?.user);
  }, [session]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md mt-20 flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Sign in Required</h1>
          <p className="mb-6 text-gray-700">You must be signed in to manage API Keys.</p>
          <button
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-base h-12 px-5 w-full md:w-[200px] bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Hamburger button (mobile only) */}
      {!isDesktop && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      {(isDesktop || sidebarOpen) && (
        <>
          {console.log('About to render sidebar with session:', session)}
          {console.log('About to render sidebar with user:', session?.user)}
          <Sidebar
            open={isDesktop ? true : sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            user={session?.user}
          />
        </>
      )}
      <div className={`flex-1 bg-gray-50 py-10 px-2 overflow-auto transition-all duration-200 ${collapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        {/* Header with sign in/out */}
        <div className="flex justify-end items-center mb-6">
          {session ? (
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img src={session.user.image} alt="User avatar" className="w-8 h-8 rounded-full border" />
              )}
              <span className="font-medium text-gray-900 text-sm">{session.user?.name}</span>
              <button
                className="ml-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : null}
        </div>
        <Notification
          message={notification}
          type={notification === 'API Key deleted' ? 'error' : 'success'}
          onClose={() => setNotification(null)}
        />
        {/* Plan Card */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl bg-white p-6 mb-8 border-4" style={{ borderImage: 'linear-gradient(90deg, #a259ff, #f24e1e, #ffc700) 1' }}>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-1">CURRENT PLAN</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{PLAN.name}</div>
                <div className="text-sm text-gray-600">API Limit</div>
                <div className="w-64 h-2 bg-gray-200 rounded mt-2 mb-1">
                  <div className="h-2 rounded bg-gray-400" style={{ width: `${(PLAN.used / PLAN.limit) * 100}%`, background: 'linear-gradient(90deg, #a259ff, #f24e1e, #ffc700)' }}></div>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#a259ff]"></span>
                  {PLAN.used} / {PLAN.limit} Requests
                </div>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200">Manage Plan</button>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-bold text-gray-900">API Keys</div>
                <div className="text-xs text-gray-500">The key is used to authenticate your requests to the <a href="#" className="underline">Research API</a>.</div>
              </div>
              <button
                onClick={openCreateModal}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#6c47ff] hover:bg-[#4b2fd6] text-white text-2xl shadow transition"
                title="Add API Key"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </button>
            </div>
            <ApiKeysTable
              apiKeys={apiKeys}
              visibleKeyId={visibleKeyId}
              copiedKeyId={copiedKeyId}
              onView={setVisibleKeyId}
              onCopy={copyToClipboard}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {/* Modal */}
        <ApiKeyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={editingKey ? handleUpdate : handleCreate}
          formData={formData}
          setFormData={setFormData}
          editingKey={!!editingKey}
        />
      </div>
    </div>
  );
} 