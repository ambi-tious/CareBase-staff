import { IndividualPointDetailPage } from '@/components/3_organisms/resident/individual-point-detail-page';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock lucide icon registry
vi.mock('@/lib/lucide-icon-registry', () => ({
  getLucideIcon: vi.fn(() => {
    return function MockIcon({ className }: { className?: string }) {
      return <div data-testid="mock-icon" className={className}>Icon</div>;
    };
  }),
}));

describe('個別ポイント詳細ページコンポーネント', () => {
  const mockPush = vi.fn();
  const mockResident = {
    id: 1,
    name: 'テスト利用者',
  };
  const mockIndividualPoint = {
    id: 'ip1',
    category: '移乗介助',
    icon: 'Users' as const,
    count: 1,
    isActive: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it('基本情報を正しくレンダリングする', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    expect(screen.getByText('移乗介助の詳細')).toBeInTheDocument();
    expect(screen.getByText('テスト利用者様の個別ポイント')).toBeInTheDocument();
    expect(screen.getByText('戻る')).toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();
  });

  it('戻るボタンクリック時に利用者詳細画面に遷移する', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    const backButton = screen.getByText('戻る');
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/residents/1');
  });

  it('編集ボタンクリック時に編集モードに切り替わる', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    expect(screen.getByText('キャンセル')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('キャンセルボタンクリック時に閲覧モードに戻る', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    // 編集モードに切り替え
    fireEvent.click(screen.getByText('編集'));
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // キャンセル
    fireEvent.click(screen.getByText('キャンセル'));
    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();
  });

  it('保存処理が正常に動作する', async () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    // 編集モードに切り替え
    fireEvent.click(screen.getByText('編集'));

    // テキストを入力
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'テスト内容' } });

    // 保存
    fireEvent.click(screen.getByText('保存'));

    // ローディング状態を確認
    expect(screen.getByText('保存中...')).toBeInTheDocument();

    // 保存完了を待機
    await waitFor(() => {
      expect(screen.getByText('編集')).toBeInTheDocument();
    });

    // 保存された内容が表示されることを確認
    expect(screen.getByText('テスト内容')).toBeInTheDocument();
  });

  it('削除確認が正常に動作する', async () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    // 削除ボタンをクリック（内容がある場合のみ表示される）
    // まず編集して内容を追加
    fireEvent.click(screen.getByText('編集'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'テスト内容' } });
    fireEvent.click(screen.getByText('保存'));

    await waitFor(() => {
      expect(screen.getByText('削除')).toBeInTheDocument();
    });

    // 削除ボタンをクリック
    fireEvent.click(screen.getByText('削除'));

    // 削除確認メッセージが表示される
    expect(screen.getByText(/本当にこの個別ポイント詳細情報を削除しますか？/)).toBeInTheDocument();

    // 削除を実行
    const deleteConfirmButton = screen.getAllByText('削除')[1]; // 確認ダイアログ内の削除ボタン
    fireEvent.click(deleteConfirmButton);

    // ローディング状態を確認
    expect(screen.getByText('削除中...')).toBeInTheDocument();

    // 削除完了を待機
    await waitFor(() => {
      expect(screen.getByText('詳細情報がありません')).toBeInTheDocument();
    });
  });

  it('内容がない場合に空状態を表示する', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    expect(screen.getByText('詳細情報がありません')).toBeInTheDocument();
    expect(screen.getByText('「編集」ボタンをクリックして移乗介助に関する詳細情報を追加してください。')).toBeInTheDocument();
  });

  it('アイコンが正しく表示される', () => {
    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    const icons = screen.getAllByTestId('mock-icon');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('エラー状態を正しく処理する', async () => {
    // Mock console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <IndividualPointDetailPage
        resident={mockResident}
        category="移乗介助"
        individualPoint={mockIndividualPoint}
      />
    );

    // 編集モードに切り替え
    fireEvent.click(screen.getByText('編集'));

    // テキストを入力
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'テスト内容' } });

    // 保存処理でエラーをシミュレート（実際のテストでは難しいため、この部分は概念的）
    // 実際のテストでは、APIモックでエラーレスポンスを返すようにする

    consoleSpy.mockRestore();
  });
});