"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
} from "recharts";

import { calculateSubjectAverages , calculateTermAverages} from "@/lib/utils";



export function AreaClient({ data }: { data: any[] }) {

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart width={500} height={400} data={data}>
        <YAxis />
        <XAxis dataKey="name" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineClient({ data }: { data: any[] }) {
  const chartData = calculateSubjectAverages(data);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart width={500} height={300} data={chartData} margin={{ right: 30 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="average"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
export function BarClient({ data }: { data: any[] }) {
  const chartData = calculateTermAverages(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart width={500} height={400} data={chartData} margin={{ right: 30 }}>
        <YAxis domain={[0, 100]}  />
        <XAxis dataKey="termName" />
        <CartesianGrid vertical={false} strokeOpacity={0.2} />
        <Tooltip content={<CustomTooltip />} />
        <Bar type="monotone" dataKey="average" stroke="#8884d8" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};
