import type { ReactNode } from 'react'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  activeTabId: string
  onChange: (id: string) => void
}

export default function Tabs({ items, activeTabId, onChange }: TabsProps) {
  const activeTab = items.find((item) => item.id === activeTabId)

  return (
    <div className="tabs-container">
      <div className="tabs-header" role="tablist">
        {items.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={item.id === activeTabId}
            onClick={() => onChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="tabs-panel" role="tabpanel">
        {activeTab ? activeTab.content : null}
      </div>
    </div>
  )
}
