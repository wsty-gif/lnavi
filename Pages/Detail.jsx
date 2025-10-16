
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Clock,
  Calendar,
  ExternalLink,
  Gift,
  Check,
  ArrowLeft,
  Heart,
  Share2,
  Tag,
  CheckCircle,
  Navigation
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DetailPage() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const accountId = urlParams.get('id');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: account, isLoading } = useQuery({
    queryKey: ['lineAccount', accountId],
    queryFn: async () => {
      const accounts = await base44.entities.LineAccount.list();
      return accounts.find(acc => acc.id === accountId);
    },
    enabled: !!accountId,
  });

  const { data: relatedAccounts } = useQuery({
    queryKey: ['relatedAccounts', account?.service_category_main, account?.prefecture], // Updated queryKey for main category
    queryFn: async () => {
      if (!account) return [];
      const accounts = await base44.entities.LineAccount.list('-created_date', 10);
      return accounts.filter(acc => 
        acc.id !== accountId && 
        (acc.service_category_main === account.service_category_main || acc.prefecture === account.prefecture) // Updated filter for main category
      ).slice(0, 3);
    },
    enabled: !!account,
    initialData: []
  });

  React.useEffect(() => {
    if (accountId) {
      const favorites = JSON.parse(localStorage.getItem('line_account_favorites') || '[]');
      setIsFavorite(favorites.includes(accountId));
    }
  }, [accountId]);

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('line_account_favorites') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== accountId)
      : [...favorites, accountId];
    
    localStorage.setItem('line_account_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: account.account_name,
          text: account.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('URLをコピーしました');
    }
  };

  const handleAddFriend = () => {
    window.open(`https://line.me/R/ti/p/${account.line_id}`, '_blank');
  };

  const handleGetDirections = () => {
    // 住所フィールドがあれば優先的に使用
    if (account.address) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(account.address)}`, '_blank');
    } else {
      // 住所がない場合は都道府県、市区町村、エリアから住所を構築
      const address = [account.prefecture, account.city, account.area].filter(Boolean).join(' ');
      if (address) {
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
      } else if (account.latitude && account.longitude) {
        // それもない場合は緯度経度を使用
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${account.latitude},${account.longitude}`, '_blank');
      }
    }
  };

  const categoryColors = {
    // 大分類の色
    "飲食": "bg-orange-100 text-orange-800 border-orange-200",
    "美容": "bg-pink-100 text-pink-800 border-pink-200",
    "小売": "bg-blue-100 text-blue-800 border-blue-200",
    "医療・健康": "bg-red-100 text-red-800 border-red-200",
    "教育": "bg-purple-100 text-purple-800 border-purple-200",
    "不動産": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "士業・コンサル": "bg-gray-100 text-gray-800 border-gray-200",
    "エンタメ": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "自治体・公共": "bg-green-100 text-green-800 border-green-200",
    "その他": "bg-slate-100 text-slate-800 border-slate-200",
    // 詳細分類の色（同じマッピング）
    "ラーメン": "bg-orange-100 text-orange-800 border-orange-200",
    "寿司": "bg-red-100 text-red-800 border-red-200",
    "焼肉": "bg-amber-100 text-amber-800 border-amber-200",
    "イタリアン": "bg-green-100 text-green-800 border-green-200",
    "フレンチ": "bg-purple-100 text-purple-800 border-purple-200",
    "中華料理": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "カフェ": "bg-brown-100 text-brown-800 border-brown-200",
    "居酒屋": "bg-orange-100 text-orange-800 border-orange-200",
    "バー": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "ファストフード": "bg-red-100 text-red-800 border-red-200",
    "その他飲食": "bg-gray-100 text-gray-800 border-gray-200",
    "ヘアサロン": "bg-pink-100 text-pink-800 border-pink-200",
    "ネイルサロン": "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
    "エステサロン": "bg-rose-100 text-rose-800 border-rose-200",
    "まつげサロン": "bg-pink-100 text-pink-800 border-pink-200",
    "リラクゼーション": "bg-teal-100 text-teal-800 border-teal-200",
    "その他美容": "bg-pink-100 text-pink-800 border-pink-200",
    "アパレル": "bg-blue-100 text-blue-800 border-blue-200",
    "雑貨・インテリア": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "書店": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "コンビニ・スーパー": "bg-green-100 text-green-800 border-green-200",
    "その他小売": "bg-slate-100 text-slate-800 border-slate-200",
    "歯科": "bg-blue-100 text-blue-800 border-blue-200",
    "整体・接骨院": "bg-emerald-100 text-emerald-800 border-emerald-200",
    "薬局": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "クリニック": "bg-red-100 text-red-800 border-red-200",
    "フィットネス": "bg-orange-100 text-orange-800 border-orange-200",
    "その他医療・健康": "bg-blue-100 text-blue-800 border-blue-200",
    "英会話": "bg-violet-100 text-violet-800 border-violet-200",
    "音楽教室": "bg-purple-100 text-purple-800 border-purple-200",
    "学習塾": "bg-indigo-100 text-indigo-800 border-indigo-200",
    "スポーツ教室": "bg-orange-100 text-orange-800 border-orange-200",
    "その他教育": "bg-purple-100 text-purple-800 border-purple-200",
    "映画館・劇場": "bg-purple-100 text-purple-800 border-purple-200",
    "カラオケ": "bg-pink-100 text-pink-800 border-pink-200",
    "ゲームセンター": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "その他エンタメ": "bg-amber-100 text-amber-800 border-amber-200"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="h-96 bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">アカウントが見つかりません</h2>
          <Link to={createPageUrl("Search")}>
            <Button>検索ページに戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = account.gallery_images && account.gallery_images.length > 0
    ? [account.image_url, ...account.gallery_images].filter(Boolean)
    : [account.image_url].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            戻る
          </Button>
          <div className="flex gap-2">
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={handleToggleFavorite}
              className={isFavorite ? "bg-red-500 hover:bg-red-600" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'お気に入り済み' : 'お気に入り'}
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              共有
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {allImages.length > 0 && (
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={account.account_name}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                    }}
                  />
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-white w-8'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                {allImages.length > 1 && (
                  <div className="p-4 bg-white">
                    <div className="flex gap-2 overflow-x-auto">
                      {allImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${account.account_name} ${index + 1}`}
                          className={`w-20 h-20 object-cover rounded cursor-pointer border-2 transition-all ${
                            index === currentImageIndex
                              ? 'border-green-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                          {account.account_name}
                        </h1>
                        {account.is_verified && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <p className="text-gray-600 font-mono bg-gray-50 px-3 py-1 rounded inline-block">
                        @{account.line_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge 
                      variant="outline" 
                      className={`${categoryColors[account.service_category_detail] || categoryColors[account.service_category_main]} border font-medium`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {account.service_category_detail}
                    </Badge>
                    {account.service_category_main && account.service_category_detail !== account.service_category_main && (
                      <Badge variant="outline" className="border-gray-300 text-gray-600">
                        {account.service_category_main}
                      </Badge>
                    )}
                    {account.prefecture && (
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        <MapPin className="w-3 h-3 mr-1" />
                        {account.prefecture}
                        {account.city && ` ${account.city}`}
                        {account.area && ` ${account.area}`}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{account.description}</p>

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  {account.phone_number && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">電話番号</p>
                        <a href={`tel:${account.phone_number}`} className="text-green-600 hover:underline">
                          {account.phone_number}
                        </a>
                      </div>
                    </div>
                  )}
                  {account.business_hours && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">営業時間</p>
                        <p className="font-medium">{account.business_hours}</p>
                      </div>
                    </div>
                  )}
                  {account.closed_days && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">定休日</p>
                        <p className="font-medium">{account.closed_days}</p>
                      </div>
                    </div>
                  )}
                  {account.website_url && (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">ウェブサイト</p>
                        <a
                          href={account.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                        >
                          サイトを見る
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Updated Map button logic */}
                {(account.address || account.prefecture || (account.latitude && account.longitude)) && (
                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleGetDirections}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Navigation className="w-4 h-4" />
                      ルート案内（Googleマップで開く）
                    </Button>
                  </div>
                )}

                {account.tags && account.tags.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">タグ</p>
                    <div className="flex flex-wrap gap-2">
                      {account.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <Button
                  onClick={handleAddFriend}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-6 text-lg"
                >
                  友だち追加
                </Button>

                {account.line_benefits && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Gift className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900 mb-2">LINE追加特典</p>
                        <p className="text-sm text-green-800">{account.line_benefits}</p>
                      </div>
                    </div>
                  </div>
                )}

                {account.line_features && account.line_features.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-900 mb-3">LINEでできること</p>
                    <div className="space-y-2">
                      {account.line_features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {relatedAccounts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">関連するアカウント</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedAccounts.map((related) => (
                <Link key={related.id} to={createPageUrl(`Detail?id=${related.id}`)}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {related.image_url && (
                      <img
                        src={related.image_url}
                        alt={related.account_name}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2">{related.account_name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                      <div className="mt-3 flex gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[related.service_category_detail] || categoryColors[related.service_category_main]} border text-xs`}
                        >
                          {related.service_category_detail}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
