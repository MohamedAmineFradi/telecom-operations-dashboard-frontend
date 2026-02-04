export default function KpiCard({
  title,
  value,
  trend,
  color
}: {
  title: string
  value: string
  trend?: string
  color?: string
}) {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return 'from-red-400 to-red-600'
      case 'yellow':
        return 'from-yellow-400 to-yellow-600'
      case 'orange':
        return 'from-orange-400 to-orange-600'
      case 'blue':
        return 'from-blue-400 to-blue-600'
      case 'green':
        return 'from-green-400 to-green-600'
      default:
        return 'from-slate-100 to-slate-300'
    }
  }

  const getTrendColor = () => {
    if (!trend) return 'text-slate-400'
    if (trend.startsWith('+')) return 'text-green-400'
    if (trend.startsWith('-')) return 'text-red-400'
    return 'text-slate-400'
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all hover:shadow-lg">
      <h3 className="text-sm font-medium text-slate-400 mb-2">{title}</h3>
      <div className={`text-3xl font-bold bg-gradient-to-r ${getColorClasses()} bg-clip-text text-transparent mb-2`}>
        {value}
      </div>
      {trend && (
        <div className={`text-sm font-medium ${getTrendColor()}`}>
          {trend}
        </div>
      )}
    </div>
  )
}
