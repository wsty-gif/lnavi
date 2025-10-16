
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AccountCard from "./AccountCard";

export default function SearchResults({ accounts, isLoading, hasSearched, favorites, onToggleFavorite, onAccountClick }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) =>
        <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse" />
        )}
      </div>);

  }

  if (!hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
          <span className="text-3xl">
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          検索を開始してください
        </h3>
        <p className="text-gray-500">
          上の検索フォームから地域やサービスを選択して検索できます
        </p>
      </div>);
  }

  if (accounts.length === 0) {
    return (
      <Alert className="border-2 border-orange-300 bg-orange-50 rounded-xl">
        <AlertCircle className="h-5 w-5 text-orange-600" />
        <AlertDescription className="text-orange-900 font-medium text-base">
          条件に一致するLINE公式アカウントが見つかりませんでした。
          検索条件を変更してもう一度お試しください。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <AccountCard
            key={account.id}
            account={account}
            index={index}
            isFavorite={favorites.includes(account.id)}
            onToggleFavorite={onToggleFavorite}
            onAccountClick={onAccountClick}
          />
        ))}
      </div>
    </div>
  );
}
