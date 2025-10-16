import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AccountCard from "../components/search/AccountCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('line_account_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['allAccounts'],
    queryFn: () => base44.entities.LineAccount.list('-created_date'),
    initialData: [],
  });

  const handleToggleFavorite = (accountId) => {
    const newFavorites = favorites.filter(id => id !== accountId);
    setFavorites(newFavorites);
    localStorage.setItem('line_account_favorites', JSON.stringify(newFavorites));
  };

  const favoriteAccounts = accounts.filter(account => favorites.includes(account.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link to="{createPageUrl('Search')}">
            <Button variant="outline" className="mb-4 gap-2">
              <ArrowLeft className="w-4 h-4" />
              検索に戻る
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">お気に入り</h1>
              <p className="text-gray-600 mt-1">
                保存したLINE公式アカウント ({favoriteAccounts.length}件)
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-96 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : favoriteAccounts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              お気に入りがまだありません
            </h3>
            <p className="text-gray-500 mb-6">
              気になるアカウントをお気に入りに追加しましょう
            </p>
            <Link to={createPageUrl("Search")}>
              <Button className="bg-green-500 hover:bg-green-600">
                アカウントを探す
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteAccounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                index={index}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}