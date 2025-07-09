# ログイン コンポーネント設計書

## 概要
CareBase-staff ログインシステムのコンポーネント設計書です。Atomic Design パターンに従い、再利用可能でメンテナンス性の高いコンポーネント構造を定義します。

## 設計原則

### 1. Atomic Design パターン
- **Atoms (原子)**: 最小単位のUI要素
- **Molecules (分子)**: 複数のAtomを組み合わせた機能単位
- **Organisms (有機体)**: 複数のMoleculeを組み合わせた画面セクション
- **Templates**: レイアウト構造の定義
- **Pages**: 実際の画面実装

### 2. コンポーネント責務
- **単一責任の原則**: 各コンポーネントは単一の責任を持つ
- **Props interface**: 明確なProps型定義
- **State 管理**: 必要最小限のローカルstate
- **Error Boundary**: エラーハンドリングの実装

### 3. 型安全性
- **TypeScript**: 全コンポーネントでのTypeScript使用
- **Props validation**: 厳密なProps型チェック
- **Event handling**: 型安全なイベントハンドリング

## コンポーネント階層

```
app/(auth)/
├── login/
│   └── page.tsx                    # ログインページ (Page)

components/
├── 1_atoms/
│   ├── common/
│   │   ├── logo.tsx               # ロゴ
│   │   └── loading-spinner.tsx    # ローディングスピナー
│   ├── forms/
│   │   ├── input-field.tsx        # 入力フィールド
│   │   ├── password-field.tsx     # パスワードフィールド
│   │   └── submit-button.tsx      # 送信ボタン
│   └── navigation/
│       └── back-button.tsx        # 戻るボタン
├── 2_molecules/
│   ├── auth/
│   │   ├── login-form.tsx         # ログインフォーム
│   │   ├── staff-group-selector.tsx # グループ選択
│   │   ├── staff-team-selector.tsx  # チーム選択
│   │   └── staff-selector.tsx     # 職員選択
│   └── feedback/
│       └── message-alert.tsx      # メッセージアラート
├── 3_organisms/
│   └── auth/
│       ├── login-screen.tsx       # ログイン画面
│       └── staff-selection-screen.tsx # 職員選択画面
```

## 1. Atoms (原子)

### Logo コンポーネント
```typescript
// components/1_atoms/common/logo.tsx
import React from 'react';
import { Heart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Heart className={`${sizeClasses[size]} text-carebase-blue mr-2`} />
      <span className="text-2xl font-bold text-carebase-text-primary">
        CareBase
      </span>
    </div>
  );
};
```

### InputField コンポーネント
```typescript
// components/1_atoms/forms/input-field.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className={cn('space-y-1', className)}>
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-colors',
          'border-gray-300 focus:ring-carebase-blue',
          {
            'border-red-300 focus:ring-red-500': error,
            'bg-gray-50 cursor-not-allowed': disabled
          }
        )}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
```

### SubmitButton コンポーネント
```typescript
// components/1_atoms/forms/submit-button.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  onClick
}) => {
  const variantClasses = {
    primary: 'bg-carebase-blue hover:bg-carebase-blue-dark text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-carebase-blue text-carebase-blue hover:bg-carebase-blue hover:text-white'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-carebase-blue',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </Button>
  );
};
```

### LoadingSpinner コンポーネント
```typescript
// components/1_atoms/common/loading-spinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-carebase-blue',
        sizeClasses[size],
        className
      )}
    />
  );
};
```

## 2. Molecules (分子)

### MessageAlert コンポーネント
```typescript
// components/2_molecules/feedback/message-alert.tsx
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageAlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  className?: string;
  onClose?: () => void;
}

export const MessageAlert: React.FC<MessageAlertProps> = ({
  type,
  message,
  className = '',
  onClose
}) => {
  const alertConfig = {
    success: {
      icon: CheckCircle,
      className: 'border-green-200 bg-green-50 text-green-700',
      iconClassName: 'text-green-600'
    },
    error: {
      icon: AlertCircle,
      className: 'border-red-200 bg-red-50 text-red-700',
      iconClassName: 'text-red-600'
    },
    info: {
      icon: Info,
      className: 'border-blue-200 bg-blue-50 text-blue-700',
      iconClassName: 'text-blue-600'
    },
    warning: {
      icon: AlertCircle,
      className: 'border-yellow-200 bg-yellow-50 text-yellow-700',
      iconClassName: 'text-yellow-600'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <Alert className={cn(config.className, className)}>
      <Icon className={cn('h-4 w-4', config.iconClassName)} />
      <AlertDescription>
        {message}
      </AlertDescription>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          aria-label="閉じる"
        >
          ×
        </button>
      )}
    </Alert>
  );
};
```

### LoginForm コンポーネント
```typescript
// components/2_molecules/auth/login-form.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from '@/components/1_atoms/forms/input-field';
import { SubmitButton } from '@/components/1_atoms/forms/submit-button';
import { MessageAlert } from '@/components/2_molecules/feedback/message-alert';

interface LoginFormProps {
  onLogin: (credentials: { facilityId: string; password: string }) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
}

interface FormErrors {
  facilityId?: string;
  password?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  className = ''
}) => {
  const [facilityId, setFacilityId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!facilityId.trim()) {
      newErrors.facilityId = '施設IDを入力してください';
    }
    
    if (!password.trim()) {
      newErrors.password = 'パスワードを入力してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: '' });
    
    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: '入力内容に誤りがあります。',
      });
      return;
    }

    try {
      const success = await onLogin({ facilityId, password });
      if (success) {
        setMessage({
          type: 'success',
          text: 'ログインに成功しました。',
        });
      } else {
        setMessage({
          type: 'error',
          text: '施設IDまたはパスワードが正しくありません。',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'ログイン中にエラーが発生しました。もう一度お試しください。',
      });
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-carebase-text-primary">
          ログイン
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="facilityId"
            label="施設ID"
            value={facilityId}
            onChange={setFacilityId}
            placeholder="施設IDを入力"
            disabled={isLoading}
            error={errors.facilityId}
            required
          />
          
          <InputField
            id="password"
            label="パスワード"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="パスワードを入力"
            disabled={isLoading}
            error={errors.password}
            required
          />

          {message.type && (
            <MessageAlert
              type={message.type}
              message={message.text}
            />
          )}

          <SubmitButton
            type="submit"
            isLoading={isLoading}
            variant="primary"
            className="w-full"
          >
            ログイン
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
};
```

### StaffGroupSelector コンポーネント
```typescript
// components/2_molecules/auth/staff-group-selector.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { StaffGroup } from '@/types/staff';

interface StaffGroupSelectorProps {
  groups: StaffGroup[];
  selectedGroupId: string;
  onGroupSelect: (groupId: string) => void;
  className?: string;
}

export const StaffGroupSelector: React.FC<StaffGroupSelectorProps> = ({
  groups,
  selectedGroupId,
  onGroupSelect,
  className = ''
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-carebase-text-primary">
        グループを選択してください
      </h3>
      <div className="grid gap-3">
        {groups.map((group) => {
          const Icon = group.icon;
          const isSelected = selectedGroupId === group.id;
          
          return (
            <Card
              key={group.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                {
                  'ring-2 ring-carebase-blue bg-carebase-blue-light': isSelected,
                  'hover:border-carebase-blue': !isSelected
                }
              )}
              onClick={() => onGroupSelect(group.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isSelected ? 'bg-carebase-blue text-white' : 'bg-gray-100'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-carebase-text-primary">
                      {group.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {group.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {group.teams.length} チーム
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
```

## 3. Organisms (有機体)

### LoginScreen コンポーネント
```typescript
// components/3_organisms/auth/login-screen.tsx
'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/1_atoms/common/logo';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (credentials: { facilityId: string; password: string }) => Promise<boolean>;
  onStaffSelection: () => void;
  className?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onStaffSelection,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: { facilityId: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await onLogin(credentials);
      if (result) {
        // ログイン成功時、少し待ってから職員選択画面へ
        setTimeout(() => {
          onStaffSelection();
        }, 1000);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-carebase-bg flex items-center justify-center p-4 ${className}`}>
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo size="lg" />
        </div>

        {/* Login Form */}
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />

        {/* Quick Access Button (for demo) */}
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onStaffSelection}
            className="text-xs text-gray-500 hover:text-carebase-blue"
          >
            <Users className="w-4 h-4 mr-1" />
            職員選択をスキップ
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
```

### StaffSelectionScreen コンポーネント
```typescript
// components/3_organisms/auth/staff-selection-screen.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { StaffGroupSelector } from '@/components/2_molecules/auth/staff-group-selector';
import { StaffTeamSelector } from '@/components/2_molecules/auth/staff-team-selector';
import { StaffSelector } from '@/components/2_molecules/auth/staff-selector';
import { MessageAlert } from '@/components/2_molecules/feedback/message-alert';
import { mockStaffGroups } from '@/mocks/staff-data';
import type { Staff } from '@/types/staff';

interface StaffSelectionScreenProps {
  onStaffSelected: (staff: Staff) => Promise<void>;
  onBack: () => void;
  className?: string;
}

export const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({
  onStaffSelected,
  onBack,
  className = ''
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedGroup = mockStaffGroups.find(g => g.id === selectedGroupId);
  const selectedTeam = selectedGroup?.teams.find(t => t.id === selectedTeamId);
  const selectedStaff = selectedTeam?.staff.find(s => s.id === selectedStaffId);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeamId(teamId);
    setSelectedStaffId('');
    setError('');
  };

  const handleStaffSelect = (staffId: string) => {
    setSelectedStaffId(staffId);
    setError('');
  };

  const handleConfirm = async () => {
    if (!selectedStaff) {
      setError('スタッフが選択されていません。');
      return;
    }

    if (!selectedStaff.isActive) {
      setError('選択されたスタッフは現在利用できません。');
      return;
    }

    setIsLoading(true);
    try {
      await onStaffSelected(selectedStaff);
    } catch (error) {
      setError('スタッフ選択中にエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedGroupId('');
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
  };

  const getCurrentStep = () => {
    if (!selectedGroupId) return 1;
    if (!selectedTeamId) return 2;
    if (!selectedStaffId) return 3;
    return 4;
  };

  const currentStep = getCurrentStep();

  return (
    <div className={`max-w-2xl w-full mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-carebase-text-primary">
              スタッフ選択
            </h2>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              戻る
            </Button>
          </div>
          
          {/* Step Indicator */}
          <div className="flex items-center space-x-4 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-carebase-blue text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className="ml-2">
                  <h3 className={`text-sm font-medium ${
                    step <= currentStep 
                      ? 'text-carebase-text-primary' 
                      : 'text-gray-500'
                  }`}>
                    {step === 1 && 'グループ選択'}
                    {step === 2 && 'チーム選択'}
                    {step === 3 && 'スタッフ選択'}
                  </h3>
                </div>
                {step < 3 && (
                  <div className="w-6 h-0.5 bg-gray-200 ml-4" />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <MessageAlert
              type="error"
              message={error}
              className="mb-4"
              onClose={() => setError('')}
            />
          )}
          
          <div className="space-y-6">
            {/* Step 1: Group Selection */}
            {currentStep >= 1 && (
              <StaffGroupSelector
                groups={mockStaffGroups}
                selectedGroupId={selectedGroupId}
                onGroupSelect={handleGroupSelect}
              />
            )}

            {/* Step 2: Team Selection */}
            {currentStep >= 2 && selectedGroup && (
              <StaffTeamSelector
                teams={selectedGroup.teams}
                selectedTeamId={selectedTeamId}
                onTeamSelect={handleTeamSelect}
              />
            )}

            {/* Step 3: Staff Selection */}
            {currentStep >= 3 && selectedTeam && (
              <StaffSelector
                staff={selectedTeam.staff}
                selectedStaffId={selectedStaffId}
                onStaffSelect={handleStaffSelect}
              />
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && selectedStaff && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-carebase-text-primary mb-2">
                    選択完了
                  </h3>
                  <p className="text-gray-600">以下のスタッフでログインします：</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Card className="border-2 border-carebase-blue bg-carebase-blue-light">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold text-carebase-text-primary">
                          {selectedStaff.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {selectedStaff.furigana}
                        </p>
                        <p className="text-sm font-medium text-carebase-blue">
                          {selectedStaff.role}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {selectedGroup.name} - {selectedTeam.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleReset} 
              disabled={currentStep === 1}
            >
              リセット
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={currentStep !== 4}
              isLoading={isLoading}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              この スタッフでログイン
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

## 4. Pages (ページ)

### Login Page
```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/3_organisms/auth/login-screen';
import { StaffSelectionScreen } from '@/components/3_organisms/auth/staff-selection-screen';
import type { Staff } from '@/types/staff';

type AuthMode = 'login' | 'staff-selection';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const router = useRouter();

  const handleLogin = async (credentials: {
    facilityId: string;
    password: string;
  }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication
    if (credentials.facilityId === 'admin' && credentials.password === 'password') {
      return true;
    }

    return false;
  };

  const handleStaffSelected = async (staff: Staff): Promise<void> => {
    // Simulate staff selection processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would authenticate with the selected staff's credentials
    console.log('Selected staff:', staff);
    
    // Store staff info in localStorage or context
    localStorage.setItem('selectedStaff', JSON.stringify(staff));
    
    // Navigate to main application
    router.push('/');
  };

  const handleStaffSelection = (): void => {
    setAuthMode('staff-selection');
  };

  const handleBackToLogin = (): void => {
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen">
      {authMode === 'login' ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onStaffSelection={handleStaffSelection} 
        />
      ) : (
        <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
          <StaffSelectionScreen 
            onStaffSelected={handleStaffSelected} 
            onBack={handleBackToLogin} 
          />
        </div>
      )}
    </div>
  );
}
```

## 5. 型定義

### Staff Types
```typescript
// types/staff.ts
export interface Staff {
  id: string;
  name: string;
  furigana: string;
  role: string;
  employeeId: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface StaffTeam {
  id: string;
  name: string;
  description: string;
  icon: any; // LucideIcon
  staff: Staff[];
}

export interface StaffGroup {
  id: string;
  name: string;
  description: string;
  icon: any; // LucideIcon
  teams: StaffTeam[];
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: Staff | null;
  facilityId: string | null;
  selectedGroup: StaffGroup | null;
  selectedTeam: StaffTeam | null;
}
```

### Form Types
```typescript
// types/forms.ts
export interface LoginCredentials {
  facilityId: string;
  password: string;
}

export interface StaffSelection {
  groupId: string;
  teamId: string;
  staffId: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface MessageState {
  type: 'success' | 'error' | 'info' | 'warning' | null;
  text: string;
}
```

## 6. スタイリング

### Tailwind CSS カスタムカラー
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'carebase-blue': '#0ea5e9',
        'carebase-blue-dark': '#0284c7',
        'carebase-blue-light': '#e0f2fe',
        'carebase-bg': '#f8fafc',
        'carebase-text-primary': '#1e293b',
        'carebase-text-secondary': '#64748b'
      }
    }
  }
}
```

### カスタムCSS
```css
/* styles/globals.css */
.carebase-focus {
  @apply focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:ring-offset-2;
}

.carebase-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md carebase-focus;
}

.carebase-button {
  @apply inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium carebase-focus;
}

.carebase-button-primary {
  @apply carebase-button text-white bg-carebase-blue hover:bg-carebase-blue-dark;
}

.carebase-card {
  @apply bg-white overflow-hidden shadow rounded-lg;
}
```

## 7. テスト

### コンポーネントテスト例
```typescript
// __tests__/components/2_molecules/login-form.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/2_molecules/auth/login-form';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
  });

  it('renders all form elements', () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    expect(screen.getByLabelText('施設ID')).toBeInTheDocument();
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm onLogin={mockOnLogin} />);
    
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    await waitFor(() => {
      expect(screen.getByText('施設IDを入力してください')).toBeInTheDocument();
      expect(screen.getByText('パスワードを入力してください')).toBeInTheDocument();
    });
  });

  it('submits form with correct data', async () => {
    mockOnLogin.mockResolvedValue(true);
    render(<LoginForm onLogin={mockOnLogin} />);
    
    fireEvent.change(screen.getByLabelText('施設ID'), { 
      target: { value: 'facility123' } 
    });
    fireEvent.change(screen.getByLabelText('パスワード'), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        facilityId: 'facility123',
        password: 'password123'
      });
    });
  });
});
```

## 8. パフォーマンス最適化

### React.memo の使用
```typescript
// components/2_molecules/auth/staff-group-selector.tsx
import React from 'react';

const StaffGroupSelector = React.memo<StaffGroupSelectorProps>(({
  groups,
  selectedGroupId,
  onGroupSelect,
  className = ''
}) => {
  // コンポーネント実装
});

export { StaffGroupSelector };
```

### useMemo と useCallback の使用
```typescript
// components/3_organisms/auth/staff-selection-screen.tsx
import React, { useMemo, useCallback } from 'react';

export const StaffSelectionScreen: React.FC<StaffSelectionScreenProps> = ({
  onStaffSelected,
  onBack,
  className = ''
}) => {
  // 重い計算の最適化
  const availableGroups = useMemo(() => {
    return mockStaffGroups.filter(group => 
      group.teams.some(team => 
        team.staff.some(staff => staff.isActive)
      )
    );
  }, []);

  // コールバック関数の最適化
  const handleGroupSelect = useCallback((groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedTeamId('');
    setSelectedStaffId('');
    setError('');
  }, []);

  // 残りの実装
};
```

## 9. アクセシビリティ

### WAI-ARIA 対応
```typescript
// components/1_atoms/forms/input-field.tsx
<input
  id={id}
  type={type}
  value={value}
  onChange={(e) => onChange(e.target.value)}
  aria-describedby={error ? `${id}-error` : undefined}
  aria-invalid={error ? 'true' : 'false'}
  aria-required={required}
  role="textbox"
/>
```

### キーボードナビゲーション
```typescript
// components/2_molecules/auth/staff-group-selector.tsx
<Card
  key={group.id}
  tabIndex={0}
  role="button"
  aria-label={`${group.name}を選択`}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onGroupSelect(group.id);
    }
  }}
  onClick={() => onGroupSelect(group.id)}
>
```

## 10. 国際化対応

### i18n 準備
```typescript
// types/i18n.ts
export interface LoginMessages {
  title: string;
  facilityId: string;
  password: string;
  login: string;
  errors: {
    required: string;
    invalidCredentials: string;
    serverError: string;
  };
}

// hooks/useI18n.ts
export const useI18n = () => {
  const messages: LoginMessages = {
    title: 'ログイン',
    facilityId: '施設ID',
    password: 'パスワード',
    login: 'ログイン',
    errors: {
      required: 'この項目は必須です',
      invalidCredentials: '認証情報が正しくありません',
      serverError: 'サーバーエラーが発生しました'
    }
  };

  return { messages };
};
```

## まとめ

このコンポーネント設計により、以下の利点が得られます：

- **再利用性**: Atomic Design パターンによる高い再利用性
- **保守性**: 単一責任の原則による保守のしやすさ
- **型安全性**: TypeScript による厳密な型チェック
- **テスト容易性**: 単体テストが書きやすい構造
- **パフォーマンス**: React.memo、useMemo等による最適化
- **アクセシビリティ**: WAI-ARIA対応とキーボードナビゲーション
- **拡張性**: 将来的な機能追加に対応しやすい構造

この設計により、ログインシステムの実装・保守・拡張が効率的に行えます。