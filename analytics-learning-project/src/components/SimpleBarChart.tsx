'use client'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: DataPoint[]
  title: string
  maxValue?: number
}

export default function SimpleBarChart({ data, title, maxValue }: SimpleBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.value))
  
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const width = max > 0 ? (item.value / max) * 100 : 0
          const backgroundColor = item.color || '#3B82F6'
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="w-24 text-sm font-medium text-black truncate">
                {item.label}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div 
                  className="h-4 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${width}%`,
                    backgroundColor: backgroundColor
                  }}
                />
              </div>
              <div className="w-8 text-sm font-semibold text-black">
                {item.value}
              </div>
            </div>
          )
        })}
      </div>
      
      {data.length === 0 && (
        <p className="text-gray-700 text-center py-4">No data available</p>
      )}
    </div>
  )
}