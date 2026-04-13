import { InquiryCategory } from '@/types'

interface ResponsePattern {
  keywords: string[]
  response: string
}

const responsePatterns: ResponsePattern[] = [
  {
    keywords: ['料金', '月額', 'いくら', '費用', '価格', '値段'],
    response: '料金についてご案内いたします。\n\n【基本プラン】\n・月額3,280円（税込）\n・初期費用・設置費用：無料\n・最低利用期間：1年\n\n法人様向けには5台以上で月額2,980円/台の割引プランもございます。\n\nご不明な点はお気軽にお知らせください。',
  },
  {
    keywords: ['フィルター', 'filter', '交換', 'パーツ', '部品'],
    response: 'フィルターについてご案内いたします。\n\n【フィルター情報】\n・交換推奨頻度：6ヶ月に1回\n・交換用フィルター：3,300円（税込）/本\n・送料：550円（税込）\n\nご使用中の機種をお知らせいただければ、対応フィルターの型番をご案内できます。\n\nご注文はこのチャット、マイページ、またはお電話（0120-XXX-XXX）で承っております。',
  },
  {
    keywords: ['水漏れ', '漏れ', 'リーク'],
    response: '水漏れのご報告、大変失礼いたしました。緊急対応いたします。\n\n【まず行っていただくこと】\n1. 電源をオフにしてください\n2. 本体後部の止水栓を閉めてください\n3. タオルで周囲を拭いてください\n\n機種名・製造番号（本体側面のシール）をお知らせいただければ、サービス担当者をすぐにお手配いたします。\n\n修理費用はレンタル契約の場合、無料となります。',
  },
  {
    keywords: ['お湯', '温水', '熱い', 'ヒーター'],
    response: '温水機能の不具合についてご案内いたします。\n\n【まずお試しください】\n1. 背面の電源スイッチを一度オフにする\n2. 30秒待つ\n3. 電源を再度オンにする\n4. 約10分待ってお湯が出るか確認する\n\nチャイルドロックが有効になっている場合は、本体上部のロックボタンを長押し（3秒）で解除できます。\n\nそれでも改善しない場合はサービス担当者をお手配いたします。本日中にご連絡いたします。',
  },
  {
    keywords: ['解約', 'やめ', 'キャンセル', '退会'],
    response: '解約についてのお問い合わせですね。担当者よりご連絡いたします。\n\n【解約の流れ】\n1. 解約申請（お電話またはマイページ）\n2. 契約内容・解約金の確認\n3. 機器回収日程の調整\n4. 回収・解約完了\n\n最低利用期間（1年）内の解約は解約金が発生する場合があります。\n詳細は担当者より本日中にご説明いたします。\n\n引越し先での再契約もご検討いただければ幸いです。',
  },
  {
    keywords: ['設置', 'インストール', '移動', '引越', '配送'],
    response: '設置・配送についてご案内いたします。\n\n【設置について】\n・据え置き型：工事不要（設置時間：約30分）\n・ビルトイン型：設置工事必要（約2時間）\n・設置費用：無料\n\n【設置場所の条件】\n・コンセント（100V）から1m以内\n・直射日光が当たらない場所\n・平らで安定した床\n\n設置変更も無料で承っております。ご希望の日程をお知らせください。',
  },
  {
    keywords: ['申込', '申し込み', 'レンタル', '契約', '導入', '始め'],
    response: '新規お申込みのご検討、ありがとうございます！\n\n【おすすめプラン】\n■ スタンダード（1〜4名向け）\n月額3,280円（税込）\n\n■ コンパクト（1〜2名向け）\n月額2,980円（税込）\n幅28cm × 奥行34cm × 高さ80cm\n\n■ プレミアム（5名以上向け）\n月額4,480円（税込）\n\n30日間無料トライアルもございます！\n\nご希望の設置場所・ご利用人数をお知らせいただければ最適なプランをご提案できます。',
  },
  {
    keywords: ['故障', '壊れ', '動かない', '不具合', '修理'],
    response: '機器の不具合についてのお問い合わせですね。\n\n症状をお聞かせください：\n・水が出ない\n・お湯が出ない\n・水漏れがある\n・異音がする\n・電源が入らない\n\nレンタル契約のお客様は修理費無料です。\n\n症状の詳細と機種名（本体側面のシール）をお知らせいただければ、迅速に対応いたします。',
  },
]

const defaultResponse = 'お問い合わせありがとうございます。\n\n内容を確認しております。担当者よりご連絡いたします。\n\n緊急の場合はお電話（0120-XXX-XXX）にてご連絡ください。\n受付時間：平日 9:00〜18:00'

export function generateAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  for (const pattern of responsePatterns) {
    if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return pattern.response
    }
  }

  return defaultResponse
}

export function getCategoryFromMessage(message: string): InquiryCategory {
  const lowerMessage = message.toLowerCase()

  if (['料金', '月額', 'いくら', '費用', '解約', '契約', '請求'].some(k => lowerMessage.includes(k))) {
    return 'Silica Pure'
  }
  if (['フィルター', '交換', 'パーツ', '部品', 'ボトル'].some(k => lowerMessage.includes(k))) {
    return 'Water Pure'
  }
  if (['水漏れ', '故障', '壊れ', '修理', 'お湯', '動かない', '不具合'].some(k => lowerMessage.includes(k))) {
    return 'Pitcher Pure'
  }
  if (['申込', 'レンタル', '導入', '始め', '見積'].some(k => lowerMessage.includes(k))) {
    return 'Water Pure Pro'
  }
  if (['設置', '移動', '引越', '配送'].some(k => lowerMessage.includes(k))) {
    return '小型海水淡水化装置'
  }

  return 'その他'
}

export function getConfidenceScore(category: InquiryCategory): number {
  const scores: Record<InquiryCategory, number> = {
    'Water Pure Pro': Math.floor(Math.random() * 15) + 80,
    'Water Pure': Math.floor(Math.random() * 15) + 82,
    'Pitcher Pure': Math.floor(Math.random() * 20) + 40,
    'Silica Pure': Math.floor(Math.random() * 15) + 75,
    '小型海水淡水化装置': Math.floor(Math.random() * 15) + 78,
    '循環式手洗いユニット': Math.floor(Math.random() * 15) + 76,
    '採用・エントリー': Math.floor(Math.random() * 10) + 85,
    'その他': Math.floor(Math.random() * 20) + 30,
  }
  return scores[category]
}

export function getRecommendedAction(category: InquiryCategory): string {
  const actions: Record<InquiryCategory, string> = {
    'Water Pure Pro': '製品カタログ・導入事例の送付を推奨。法人案件は営業担当への引継ぎを推奨',
    'Water Pure': '製品スペック確認 → 設置環境ヒアリング → 見積作成案内',
    'Pitcher Pure': '製品詳細・フィルター交換周期の案内。購入希望はECサイトへ誘導',
    'Silica Pure': '健康効果資料の送付 → 法人一括導入の場合は専任担当アサイン',
    '小型海水淡水化装置': '設置環境（電源・スペース・水源）のヒアリング → 技術担当へエスカレーション',
    '循環式手洗いユニット': '設置場所・利用人数のヒアリング → 防水仕様確認 → 現地調査の手配',
    '採用・エントリー': '人事担当への転送。希望職種・経歴の確認後、選考フロー案内',
    'その他': '内容をヒアリングし、適切な部署へ振り分け（エスカレーション推奨）',
  }
  return actions[category]
}
