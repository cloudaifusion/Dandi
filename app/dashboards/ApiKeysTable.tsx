import React from 'react';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed?: string;
  usage?: number;
}

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  visibleKeyId: string | null;
  copiedKeyId: string | null;
  onView: (id: string | null) => void;
  onCopy: (key: string, id: string) => void;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
}

const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  apiKeys,
  visibleKeyId,
  copiedKeyId,
  onView,
  onCopy,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto mt-2">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Usage</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Key</th>
          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Options</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((key) => {
          const isVisible = visibleKeyId === key.id;
          return (
            <tr key={key.id} className="border-b last:border-0 border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-900 font-medium">{key.name}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{key.usage ?? 0}</td>
              <td className="px-4 py-2 text-sm font-mono">
                <span className="bg-gray-100 px-2 py-1 rounded select-all font-semibold tracking-wider">
                  {isVisible ? key.key : key.key.slice(0, 5) + "-" + "*".repeat(20)}
                </span>
              </td>
              <td className="px-4 py-2 text-sm flex items-center gap-4">
                {/* View */}
                <button className="hover:text-indigo-600" title={isVisible ? "Hide Key" : "Show Key"} onClick={() => onView(isVisible ? null : key.id)}>
                  {isVisible ? (
                    // Eye slashed icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <ellipse cx="12" cy="12" rx="9" ry="6" />
                      <circle cx="12" cy="12" r="2.5" />
                      <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
                    </svg>
                  ) : (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <ellipse cx="12" cy="12" rx="9" ry="6" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
                {/* Copy */}
                <button className="hover:text-indigo-600" title="Copy Key" onClick={() => onCopy(key.key, key.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="9" y="9" width="10" height="10" rx="2"/>
                    <rect x="5" y="5" width="10" height="10" rx="2"/>
                  </svg>
                </button>
                {/* Edit */}
                <button className="hover:text-indigo-600" title="Edit" onClick={() => onEdit(key)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 5.487a2.1 2.1 0 1 1 2.97 2.97l-9.193 9.193a2 2 0 0 1-.878.513l-3.387.97.97-3.387a2 2 0 0 1 .513-.878l9.193-9.193z"/>
                  </svg>
                </button>
                {/* Delete */}
                <button className="hover:text-red-600" title="Delete" onClick={() => onDelete(key.id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7.5h12M9.75 7.5V6a2.25 2.25 0 0 1 2.25-2.25h0A2.25 2.25 0 0 1 14.25 6v1.5m-7.5 0h12m-1.5 0v10.5A2.25 2.25 0 0 1 15 20.25H9A2.25 2.25 0 0 1 6.75 18V7.5m3 3v6m3-6v6"/>
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ApiKeysTable; 