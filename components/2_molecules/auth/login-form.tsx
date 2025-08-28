'use client';

import { LoginButton } from '@/components/1_atoms/auth/LoginButton';
import { ErrorAlert } from '@/components/2_molecules/auth/ErrorAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { LoginCredentials, LoginResult } from '@/types/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Login form validation schema
const loginSchema = z.object({
  login_id: z.string().min(1, 'ログインIDを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<LoginResult>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  error = null,
  onClearError,
  className = '',
}) => {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login_id: '',
      password: '',
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  const onFormSubmit = handleSubmit(async (data) => {
    await onLogin(data);
  });

  // Clear API error when user starts typing
  const handleFieldChange = () => {
    if (error && onClearError) {
      onClearError();
    }
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-carebase-text-primary">ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onFormSubmit} className="flex flex-col gap-6">
            {/* ログインID */}
            <FormField
              control={control}
              name="login_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ログインID
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ログインIDを入力"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* パスワード */}
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    パスワード
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="パスワードを入力"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <ErrorAlert type="error" message={error} dismissible onDismiss={onClearError} />
            )}

            <LoginButton
              isLoading={isLoading}
              disabled={!isValid || isLoading}
              loadingText="ログイン中..."
              size="lg"
              fullWidth
            >
              ログイン
            </LoginButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
