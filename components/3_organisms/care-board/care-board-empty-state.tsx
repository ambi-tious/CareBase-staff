interface CareBoardEmptyStateProps {
  description?: string;
}

export function CareBoardEmptyState({ description }: CareBoardEmptyStateProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="flex items-center justify-center p-16">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">利用者が登録されていません</h3>
          <p className="text-gray-500 mb-4">ケアボードに表示する利用者を追加してください。</p>
          <div className="text-sm text-gray-400">
            {description || '利用者の登録が完了すると、ここにケアスケジュールが表示されます。'}
          </div>
        </div>
      </div>
    </div>
  );
}
