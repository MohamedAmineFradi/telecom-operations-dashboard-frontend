export default function KpiCard({
  title,
  value,
  trend,
  color = 'blue'
}: {
  title: string
  value: string
  trend?: string
  color?: 'red' | 'yellow' | 'orange' | 'blue' | 'green' | 'slate'
}) {
  const gradients = {
    red: 'from-red-500/20 to-transparent border-red-500/20 shadow-red-900/10',
    yellow: 'from-yellow-500/20 to-transparent border-yellow-500/20 shadow-yellow-900/10',
    orange: 'from-orange-500/20 to-transparent border-orange-500/20 shadow-orange-900/10',
    blue: 'from-blue-500/20 to-transparent border-blue-500/20 shadow-blue-900/10',
    green: 'from-green-500/20 to-transparent border-green-500/20 shadow-green-900/10',
    slate: 'from-slate-500/20 to-transparent border-slate-500/20 shadow-slate-900/10',
  }

  const textColors = {
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    orange: 'text-orange-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    slate: 'text-slate-400',
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900/40 backdrop-blur-xl border-t border-r border-white/5 rounded-3xl p-6 transition-all duration-500 group hover:translate-y-[-4px] hover:shadow-2xl hover:border-white/10`}>
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradients[color].split(' ')[0]} to-transparent opacity-50`}></div>
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${gradients[color].split(' ')[0]} rounded-full blur-3xl opacity-20`}></div>

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center">
          {title}
          <span className={`ml-2 w-1.5 h-1.5 rounded-full ${textColors[color].replace('text', 'bg')} animate-pulse`}></span>
        </h3>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-black text-white tracking-tighter transition-transform group-hover:scale-105 duration-500">
            {value}
          </span>
          {trend && (
            <span className={`text-[10px] font-bold uppercase tracking-widest ${trend.includes('+') ? 'text-green-400' : trend.includes('-') ? 'text-red-400' : 'text-slate-500'
              }`}>
              {trend}
            </span>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradients[color].split(' ')[0]} to-transparent opacity-60 rounded-full`}
              style={{ width: '65%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
