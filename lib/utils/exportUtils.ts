/**
 * Export utilities for charts and data
 */

export interface ExportOptions {
  filename?: string
  format: 'csv' | 'json' | 'png'
}

/**
 * Export data to CSV format
 */
export function exportToCSV(
  data: Record<string, any>[],
  filename: string = 'export.csv'
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  downloadFile(csvContent, filename, 'text/csv')
}

/**
 * Export data to JSON format
 */
export function exportToJSON(
  data: any,
  filename: string = 'export.json'
): void {
  const jsonContent = JSON.stringify(data, null, 2)
  downloadFile(jsonContent, filename, 'application/json')
}

/**
 * Export SVG element to PNG
 */
export async function exportSVGToPNG(
  svgElement: SVGElement,
  filename: string = 'chart.png',
  scale: number = 2
): Promise<void> {
  try {
    // Get SVG dimensions
    const svgGraphics = svgElement as SVGGraphicsElement
    const bbox = svgGraphics.getBBox()
    const width = bbox.width
    const height = bbox.height

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width * scale
    canvas.height = height * scale
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get canvas context')
    }

    // Scale context for high-res export
    ctx.scale(scale, scale)

    // Serialize SVG
    const svgString = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    // Load SVG as image
    const img = new Image()
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        URL.revokeObjectURL(url)
        
        // Convert to PNG and download
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = filename
            link.href = pngUrl
            link.click()
            URL.revokeObjectURL(pngUrl)
            resolve()
          } else {
            reject(new Error('Failed to create blob'))
          }
        }, 'image/png')
      }
      
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load SVG'))
      }
      
      img.src = url
    })
  } catch (error) {
    console.error('Error exporting to PNG:', error)
    throw error
  }
}

/**
 * Export chart container to PNG (includes HTML/CSS)
 */
export async function exportChartToPNG(
  element: HTMLElement,
  filename: string = 'chart.png',
  options: {
    backgroundColor?: string
    scale?: number
  } = {}
): Promise<void> {
  const { backgroundColor = '#ffffff', scale = 2 } = options

  try {
    // Use html2canvas if available
    if (typeof window !== 'undefined' && 'html2canvas' in window) {
      const html2canvas = (window as any).html2canvas
      const canvas = await html2canvas(element, {
        scale,
        backgroundColor,
        logging: false
      })
      
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = filename
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } else {
      console.warn('html2canvas not available. Install with: npm install html2canvas')
      // Fallback: try to find SVG and export that
      const svg = element.querySelector('svg')
      if (svg) {
        await exportSVGToPNG(svg, filename, scale)
      } else {
        throw new Error('No SVG found and html2canvas not available')
      }
    }
  } catch (error) {
    console.error('Error exporting chart to PNG:', error)
    throw error
  }
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  
  // Clean up
  URL.revokeObjectURL(url)
}

/**
 * Format timestamp for export
 */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().replace('T', ' ').substring(0, 19)
}

/**
 * Prepare time series data for CSV export
 */
export function prepareTimeSeriesForExport(
  data: Array<{ timestamp: string; [key: string]: any }>
): Array<Record<string, any>> {
  return data.map(item => ({
    ...item,
    timestamp: formatTimestamp(item.timestamp)
  }))
}
