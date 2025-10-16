
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Gift, Check, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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
  // 詳細分類の色
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

export default function AccountCard({ account, index, isFavorite, onToggleFavorite, onAccountClick }) {
  const handleAddFriend = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://line.me/R/ti/p/${account.line_id}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}>
      <Link to={createPageUrl(`Detail?id=${account.id}`)} onClick={onAccountClick}>
        <Card className="h-full hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 bg-white overflow-hidden group cursor-pointer rounded-2xl">
          <div className="h-3 bg-gradient-to-r from-orange-400 to-red-400" />
          
          {account.image_url &&
          <div className="relative w-full h-48 overflow-hidden bg-gray-100">
              <img
              src={account.image_url}
              alt={account.account_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-yellow-100"><div class="text-6xl">🏪</div></div>';
              }} />
              
              {/* おすすめバッジ */}
              {account.is_recommended &&
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-lg font-black text-xs animate-pulse">
                  ⭐ 今月のイチ押し！
                </div>
            }

              <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(account.id);
              }}
              className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all shadow-lg ${
              isFavorite ?
              'bg-red-500 text-white scale-110' :
              'bg-white/90 text-gray-600 hover:bg-white hover:scale-110'}`
              }>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          }
          
          <CardContent className="p-4 space-y-3">
            {/* 店舗名 */}
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-900 line-clamp-1">
                {account.account_name}
              </h3>
              {account.is_verified &&
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              }
            </div>

            {/* カテゴリーバッジ - 小さく */}
            <div className="flex flex-wrap gap-1.5">
              {account.service_category_detail &&
              <Badge
                variant="outline"
                className={`${categoryColors[account.service_category_detail] || categoryColors[account.service_category_main]} border text-xs font-medium`}>
                  {account.service_category_detail}
                </Badge>
              }
              {account.prefecture &&
              <Badge variant="outline" className="border border-gray-300 text-gray-600 text-xs">
                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                  {account.prefecture}
                  {account.city && ` ${account.city}`}
                </Badge>
              }
            </div>

            {/* 店舗紹介文 - 小さく */}
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
              {account.description}
            </p>

            {/* LINE追加特典 - 大きく目立つ */}
            {account.line_benefits &&
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-lg shadow-md -mx-1">
                <div className="flex items-start gap-2">
                  <Gift className="w-6 h-6 text-white flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black text-white text-base mb-0.5">🎁 LINE追加特典</p>
                    <p className="text-white text-sm font-bold">{account.line_benefits}</p>
                  </div>
                </div>
              </div>
            }

            {/* LINEでできること - 小さく */}
            {account.line_features && account.line_features.length > 0 &&
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                <p className="text-xs font-bold text-green-900 mb-1">✨ LINEでできること</p>
                <div className="space-y-0.5">
                  {account.line_features.slice(0, 2).map((feature, idx) =>
                <div key={idx} className="flex items-start gap-1">
                      <Check className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-green-800 font-medium line-clamp-1">{feature}</span>
                    </div>
                )}
                </div>
              </div>
            }

            {/* 友だち追加ボタン - 大きく */}
            <Button
              onClick={handleAddFriend}
              className="w-full bg-[#00B900] hover:bg-[#00A000] text-white font-black py-5 text-base shadow-lg rounded-xl transition-all transform hover:scale-105">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.630.63H17.61v1.125h1.755c.349 0 .630.283.630.630 0 .344-.281.629-.630.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.630H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              {account.line_benefits ? '友だち追加して特典をGET！' : '友だち追加'}
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
