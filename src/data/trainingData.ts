import { TrainingData } from '@/types'

export const trainingData: TrainingData[] = [
  {
    id: 'TD-001',
    questionPattern: 'レンタル料金はいくら',
    answerTemplate: '月額3,280円（税込）からご利用いただけます。設置費用は無料です。法人様向けには台数割引プランもございます。',
    category: '料金',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-002',
    questionPattern: 'フィルター交換したい',
    answerTemplate: '交換用フィルターは3,300円（税込）です。ご注文はマイページまたはお電話（0120-XXX-XXX）で承っております。交換頻度は6ヶ月に1回を推奨しています。',
    category: '部品',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-003',
    questionPattern: '水漏れしている',
    answerTemplate: '緊急対応いたします。まず電源をお切りいただき止水栓を閉めてください。機種名と製造番号をお知らせください。サービス担当者よりすぐにご連絡いたします。',
    category: '故障',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-004',
    questionPattern: '新規申込したい',
    answerTemplate: 'お申込みいただきありがとうございます。ご希望の機種・設置場所・ご利用人数をお聞かせください。最適なプランをご提案いたします。',
    category: 'レンタル',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-005',
    questionPattern: '解約したい',
    answerTemplate: '解約手続きについてご案内します。解約申請はお電話またはマイページから可能です。最低利用期間（1年）内の解約は解約金が発生する場合がございます。担当者よりご連絡いたします。',
    category: '料金',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-006',
    questionPattern: '設置場所を変更したい',
    answerTemplate: '設置場所の変更は無料で承ります。移動先にコンセント（100V）が必要です。ご希望の日程をお聞かせください。',
    category: '設置',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-007',
    questionPattern: 'ボトルの追加注文',
    answerTemplate: 'ボトルの追加注文を承ります。12Lボトル：1,500円（税込）です。ご希望の本数をお知らせください。',
    category: '部品',
    createdAt: '2024/03/01',
  },
  {
    id: 'TD-008',
    questionPattern: 'お湯が出ない',
    answerTemplate: '温水機能の不具合ですね。まず背面の電源スイッチを一度オフにして30秒後に再起動してください。それでも改善しない場合はサービス担当者をお手配いたします。',
    category: '故障',
    createdAt: '2024/03/01',
  },
]
