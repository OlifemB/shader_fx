import { useState } from 'react'

export default function Upload({ setImageUrl }: { setImageUrl: (url: string) => void }) {
  const [value, setValue] = useState('')

  const handleSubmit = () => {
    if (!value.trim()) return
    setImageUrl(value.trim())
  }

  return (
    <div className="px-3 py-1 flex gap-2">
      <input
        type="text"
        placeholder="Paste image URL..."
        value={value}
        onChange={e => setValue(e.target.value)}
        className="text-sm px-1 w-full"
      />
      <button
        onClick={handleSubmit}
        className="text-sm px-2 bg-black text-white"
      >
        Load
      </button>
    </div>
  )
}
