'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { date: '4/1', LINE: 3, HP: 2, 電話: 1 },
  { date: '4/2', LINE: 4, HP: 3, 電話: 2 },
  { date: '4/3', LINE: 2, HP: 1, 電話: 3 },
  { date: '4/4', LINE: 5, HP: 4, 電話: 2 },
  { date: '4/5', LINE: 3, HP: 2, 電話: 1 },
  { date: '4/6', LINE: 1, HP: 1, 電話: 0 },
  { date: '4/7', LINE: 2, HP: 3, 電話: 1 },
  { date: '4/8', LINE: 6, HP: 4, 電話: 3 },
  { date: '4/9', LINE: 4, HP: 5, 電話: 2 },
  { date: '4/10', LINE: 3, HP: 2, 電話: 4 },
  { date: '4/11', LINE: 5, HP: 3, 電話: 2 },
  { date: '4/12', LINE: 7, HP: 4, 電話: 3 },
  { date: '4/13', LINE: 5, HP: 4, 電話: 3 },
]

export function ChannelBarChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
        <Bar dataKey="LINE" fill="#22c55e" radius={[3, 3, 0, 0]} />
        <Bar dataKey="HP" fill="#3b82f6" radius={[3, 3, 0, 0]} />
        <Bar dataKey="電話" fill="#f97316" radius={[3, 3, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
