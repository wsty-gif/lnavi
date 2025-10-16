
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, Building2, Map, SlidersHorizontal, Tag } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger } from
"@/components/ui/collapsible";

const MAIN_CATEGORIES = [
"全て",
"飲食",
"美容",
"小売",
"医療・健康",
"教育",
"不動産",
"士業・コンサル",
"エンタメ",
"自治体・公共",
"その他"];


const DETAIL_CATEGORIES = {
  "飲食": ["ラーメン", "寿司", "焼肉", "イタリアン", "フレンチ", "中華料理", "カフェ", "居酒屋", "バー", "ファストフード", "その他飲食"],
  "美容": ["ヘアサロン", "ネイルサロン", "エステサロン", "まつげサロン", "リラクゼーション", "その他美容"],
  "小売": ["アパレル", "雑貨・インテリア", "書店", "コンビニ・スーパー", "その他小売"],
  "医療・健康": ["歯科", "整体・整骨院", "薬局", "クリニック", "フィットネス", "その他医療・健康"],
  "教育": ["英会話", "音楽教室", "学習塾", "スポーツ教室", "その他教育"],
  "不動産": ["不動産"],
  "士業・コンサル": ["士業・コンサル"],
  "エンタメ": ["映画館・劇場", "カラオケ", "ゲームセンター", "その他エンタメ"],
  "自治体・公共": ["自治体・公共"],
  "その他": ["その他"]
};

const PREFECTURES = [
"全て",
"北海道",
"青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
"茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
"新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
"三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
"鳥取県", "島根県", "岡山県", "広島県", "山口県",
"徳島県", "香川県", "愛媛県", "高知県",
"福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"];


const MAJOR_CITIES = [
{ name: "東京", prefecture: "東京都" },
{ name: "大阪", prefecture: "大阪府" },
{ name: "名古屋", prefecture: "愛知県" },
{ name: "福岡", prefecture: "福岡県" },
{ name: "札幌", prefecture: "北海道" },
{ name: "横浜", prefecture: "神奈川県" }];


export default function SearchForm({ filters, setFilters, onSearch, allAccounts }) {
  const [showFilters, setShowFilters] = React.useState(false);

  // 大分類に基づいて詳細カテゴリを取得
  const availableDetailCategories = useMemo(() => {
    if (!filters.category_main || filters.category_main === "全て") {
      return ["全て"];
    }
    return ["全て", ...DETAIL_CATEGORIES[filters.category_main]];
  }, [filters.category_main]);

  // 選択された都道府県に基づいて市区町村のリストを動的に生成
  const availableCities = useMemo(() => {
    if (!filters.prefecture || filters.prefecture === "全て") {
      const cities = new Set();
      allAccounts.forEach((account) => {
        if (account.city) cities.add(account.city);
      });
      return ["全て", ...Array.from(cities).sort()];
    }

    const cities = new Set();
    allAccounts.
    filter((account) => account.prefecture === filters.prefecture).
    forEach((account) => {
      if (account.city) cities.add(account.city);
    });
    return ["全て", ...Array.from(cities).sort()];
  }, [filters.prefecture, allAccounts]);

  // 選択された市区町村に基づいて繁華街/エリアのリストを動的に生成
  const availableAreas = useMemo(() => {
    if (!filters.city || filters.city === "全て") {
      const areas = new Set();
      allAccounts.
      filter((account) => {
        if (filters.prefecture && filters.prefecture !== "全て") {
          return account.prefecture === filters.prefecture && account.area;
        }
        return account.area;
      }).
      forEach((account) => {
        if (account.area) areas.add(account.area);
      });
      return ["全て", ...Array.from(areas).sort()];
    }

    const areas = new Set();
    allAccounts.
    filter((account) => account.city === filters.city).
    forEach((account) => {
      if (account.area) areas.add(account.area);
    });
    return ["全て", ...Array.from(areas).sort()];
  }, [filters.prefecture, filters.city, allAccounts]);

  const handleMainCategoryChange = (value) => {
    setFilters({
      ...filters,
      category_main: value,
      category_detail: "全て"
    });
  };

  const handlePrefectureChange = (value) => {
    setFilters({
      ...filters,
      prefecture: value,
      city: "全て",
      area: "全て"
    });
  };

  const handleCityChange = (value) => {
    setFilters({
      ...filters,
      city: value,
      area: "全て"
    });
  };

  const handleMajorCityClick = (prefecture) => {
    handlePrefectureChange(prefecture);
  };

  return (
    <Card className="border-2 border-orange-200 shadow-2xl bg-white rounded-2xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-gray-900 mb-2 text-sm font-black md:text-3xl">初回割引、ポイント還元、限定クーポン…
 友だちだけの特典がいっぱい
            </h2>
            <p className="text-gray-600 font-medium">エリアとサービスから検索できます</p>
          </div>

          {/* 主要都市クイックアクセス */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-xl">
            <p className="text-sm font-bold text-gray-700 mb-3 text-center">主要都市から探す</p>
            <div className="flex flex-wrap justify-center gap-2">
              {MAJOR_CITIES.map((city) => <Button key={city.name}
              onClick={() => handleMajorCityClick(city.prefecture)}
              variant="outline"
              className="bg-white hover:bg-orange-500 hover:text-white border-2 border-orange-300 font-bold transition-all">
                  {city.name}
                </Button>
              )}
            </div>
          </div>

          {/* 地域とサービスを左右に分割 */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* 左半分：地域選択 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">都道府県</Label>
                <Select
                  value={filters.prefecture}
                  onValueChange={handlePrefectureChange}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 h-12 text-base font-medium">
                    <SelectValue placeholder="都道府県を選択" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PREFECTURES.map((pref) =>
                    <SelectItem key={pref} value={pref} className="text-base">
                        {pref}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">市区町村</Label>
                <Select
                  value={filters.city}
                  onValueChange={handleCityChange}
                  disabled={!filters.prefecture || filters.prefecture === "全て"}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 h-12 text-base font-medium">
                    <SelectValue placeholder="市区町村を選択" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableCities.map((city) =>
                    <SelectItem key={city} value={city} className="text-base">
                        {city}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">エリア</Label>
                <Select
                  value={filters.area}
                  onValueChange={(value) => setFilters({ ...filters, area: value })}
                  disabled={!filters.city || filters.city === "全て"}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 h-12 text-base font-medium">
                    <SelectValue placeholder="エリアを選択" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableAreas.map((area) =>
                    <SelectItem key={area} value={area} className="text-base">
                        {area}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 右半分：サービスカテゴリー選択 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">サービスカテゴリー</Label>
                <Select
                  value={filters.category_main}
                  onValueChange={handleMainCategoryChange}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 h-12 text-base font-medium">
                    <SelectValue placeholder="カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAIN_CATEGORIES.map((category) =>
                    <SelectItem key={category} value={category} className="text-base">
                        {category}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-gray-700">
                  詳細カテゴリー
                </Label>
                <Select
                  value={filters.category_detail}
                  onValueChange={(value) => setFilters({ ...filters, category_detail: value })}
                  disabled={!filters.category_main || filters.category_main === "全て"}>
                  <SelectTrigger className="bg-white border-2 border-gray-300 h-12 text-base font-medium">
                    <SelectValue placeholder="詳細カテゴリーを選択" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {availableDetailCategories.map((category) =>
                    <SelectItem key={category} value={category} className="text-base">
                        {category}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* キーワード検索 */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-gray-700">
              🔍 キーワード検索
            </Label>
            <Input
              placeholder="アカウント名やキーワードで検索"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="bg-white border-2 border-gray-300 h-12 text-base" />

          </div>

          <Collapsible open={showFilters} onOpenChange={setShowFilters}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:bg-gray-50 font-bold h-12">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                {showFilters ? 'こだわり条件を閉じる' : 'こだわり条件で絞り込む'}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg space-y-3 border-2 border-orange-200">
                <p className="font-bold text-gray-800 mb-3">こだわり条件</p>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="can_reserve"
                    checked={filters.can_reserve_online || false}
                    onChange={(e) =>
                    setFilters({ ...filters, can_reserve_online: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="can_reserve"
                    className="text-base font-medium cursor-pointer">
                    📅 LINEから予約可能
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="has_coupon"
                    checked={filters.has_coupon || false}
                    onChange={(e) =>
                    setFilters({ ...filters, has_coupon: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="has_coupon"
                    className="text-base font-medium cursor-pointer">
                    🎁 クーポン・特典あり
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="can_view_menu"
                    checked={filters.can_view_menu || false}
                    onChange={(e) =>
                    setFilters({ ...filters, can_view_menu: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="can_view_menu"
                    className="text-base font-medium cursor-pointer">
                    📋 LINEでメニュー確認可能
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="can_wait"
                    checked={filters.can_wait_online || false}
                    onChange={(e) =>
                    setFilters({ ...filters, can_wait_online: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="can_wait"
                    className="text-base font-medium cursor-pointer">
                    ⏱️ LINEで順番待ち登録可能
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="can_contact"
                    checked={filters.can_contact_online || false}
                    onChange={(e) =>
                    setFilters({ ...filters, can_contact_online: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="can_contact"
                    className="text-base font-medium cursor-pointer">
                    💬 LINEでお問い合わせ可能
                  </Label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="has_points"
                    checked={filters.has_points || false}
                    onChange={(e) =>
                    setFilters({ ...filters, has_points: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded border-2 border-gray-300" />
                  <Label
                    htmlFor="has_points"
                    className="text-base font-medium cursor-pointer">
                    ⭐ LINEでポイントがたまる
                  </Label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button
            onClick={onSearch}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black py-7 text-xl shadow-xl rounded-xl transition-all transform hover:scale-105">
            <Search className="w-6 h-6 mr-2" />
            この条件で検索する
          </Button>
        </div>
      </CardContent>
    </Card>);

}