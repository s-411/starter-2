'use client'

import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { useState } from 'react'
import {
  Home as HomeIcon,
  User,
  Settings,
  Search,
  Bell,
  Mail,
  Heart,
  Star,
  Trash2,
  Edit,
  Plus,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin
} from 'lucide-react'

export default function Home() {
  const [rating, setRating] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-border">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading mb-2">MM Design System</h1>
            <p className="text-muted-foreground">Your complete design system with light/dark mode</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Swatches */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Color System</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-mm-primary"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#00A1FE</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-mm-secondary"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#f2f661</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-background border border-border rounded-lg"></div>
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground">Adaptive</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-card border border-border rounded-lg"></div>
              <p className="text-sm font-medium">Card</p>
              <p className="text-xs text-muted-foreground">Elevated</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-muted rounded-lg"></div>
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Subtle</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="mb-2">Heading 1 - National2Condensed</h1>
              <p className="text-sm text-muted-foreground">2.5rem / 40px</p>
            </div>
            <div>
              <h2 className="mb-2">Heading 2 - National2Condensed</h2>
              <p className="text-sm text-muted-foreground">2rem / 32px</p>
            </div>
            <div>
              <h3 className="mb-2">Heading 3 - National2Condensed</h3>
              <p className="text-sm text-muted-foreground">1.5rem / 24px</p>
            </div>
            <div>
              <p className="mb-2">Body text - ESKlarheit. This is your default body font with excellent readability for long-form content.</p>
              <p className="text-sm text-muted-foreground">1rem / 16px</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-mm">
              Primary Button
            </button>
            <button className="btn-mm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              With Icon
            </button>
            <button className="btn-mm" disabled>
              Disabled
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="btn-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Notice the signature 100px border radius!</p>
        </section>

        {/* Form Inputs */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Form Inputs</h2>
          <div className="max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <input
                type="text"
                className="input-mm"
                placeholder="Enter your text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Dropdown</label>
              <select className="select-mm">
                <option>Choose an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <textarea
                className="input-mm min-h-[100px]"
                placeholder="Enter longer text..."
              />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-mm">
              <h3 className="text-xl font-heading mb-3">Standard Card</h3>
              <p className="text-muted-foreground mb-4">
                This is your standard card component with consistent padding, borders, and hover effects.
              </p>
              <button className="btn-mm">Action</button>
            </div>
            <div className="glass-card">
              <h3 className="text-xl font-heading mb-3">Glass Card</h3>
              <p className="text-muted-foreground mb-4">
                This card features a glassmorphism effect with backdrop blur for a modern aesthetic.
              </p>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </section>

        {/* Rating Tiles (Your Signature Component) */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Rating Tiles</h2>
          <p className="text-muted-foreground mb-6">Your signature hotness rating system</p>
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-2">
              {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5].map((r) => (
                <button
                  key={r}
                  className={`rating-tile ${rating === r ? 'selected' : ''}`}
                  onClick={() => setRating(r)}
                >
                  {r.toFixed(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[8.0, 8.5, 9.0, 9.5, 10.0].map((r) => (
                <button
                  key={r}
                  className={`rating-tile ${rating === r ? 'selected' : ''}`}
                  onClick={() => setRating(r)}
                >
                  {r.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
          {rating && (
            <p className="mt-4 text-sm">
              Selected rating: <span className="text-primary font-bold">{rating.toFixed(1)}</span>
            </p>
          )}
        </section>

        {/* Table */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Table</h2>
          <div className="overflow-x-auto">
            <table className="table-mm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td><span className="text-success">Active</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td><span className="text-success">Active</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Bob Johnson</td>
                  <td>bob@example.com</td>
                  <td><span className="text-muted-foreground">Inactive</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Utilities */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Utilities</h2>
          <div className="space-y-4">
            <div>
              <p className="text-error">This is an error message</p>
            </div>
            <div>
              <p className="text-success">This is a success message</p>
            </div>
            <div className="divider"></div>
            <div className="skeleton h-8 w-48 rounded"></div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Lucide Icons</h2>
          <p className="text-muted-foreground mb-6">Common icons from the Lucide library</p>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs text-center">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs text-center">User</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-xs text-center">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-xs text-center">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-6 h-6" />
              <span className="text-xs text-center">Bell</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Mail className="w-6 h-6" />
              <span className="text-xs text-center">Mail</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Heart className="w-6 h-6" />
              <span className="text-xs text-center">Heart</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Star className="w-6 h-6" />
              <span className="text-xs text-center">Star</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Trash2 className="w-6 h-6" />
              <span className="text-xs text-center">Trash</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Edit className="w-6 h-6" />
              <span className="text-xs text-center">Edit</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Plus className="w-6 h-6" />
              <span className="text-xs text-center">Plus</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Download className="w-6 h-6" />
              <span className="text-xs text-center">Download</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-xs text-center">Upload</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Check className="w-6 h-6" />
              <span className="text-xs text-center">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <X className="w-6 h-6" />
              <span className="text-xs text-center">X</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <AlertCircle className="w-6 h-6" />
              <span className="text-xs text-center">Alert</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Info className="w-6 h-6" />
              <span className="text-xs text-center">Info</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="w-6 h-6" />
              <span className="text-xs text-center">Right</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-xs text-center">Left</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Calendar className="w-6 h-6" />
              <span className="text-xs text-center">Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs text-center">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <MapPin className="w-6 h-6" />
              <span className="text-xs text-center">MapPin</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>MM Design System v2.0 - Built with Tailwind CSS 4 + shadcn/ui compatibility</p>
          <p className="mt-2">
            <span className="text-mm-primary">Primary: #00A1FE</span>
            {' • '}
            <span className="text-mm-secondary">Secondary: #f2f661</span>
          </p>
        </footer>

      </div>
    </div>
  )
}
