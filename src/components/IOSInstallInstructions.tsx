import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ShareNetwork, Plus, X } from '@phosphor-icons/react'

interface IOSInstallInstructionsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IOSInstallInstructions({ open, onOpenChange }: IOSInstallInstructionsProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-center text-blue-900 font-semibold text-lg">
            📱 Install Paradise Restaurant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Tap the Share button
              </p>
              <div className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <ShareNetwork size={24} className="pwa-share-bounce" />
                  <span className="text-sm font-medium">Share</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Usually found at the bottom of Safari browser
              </p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Find "Add to Home Screen"
              </p>
              <div className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-center">
                <div className="flex items-center gap-2 text-blue-600">
                  <Plus size={20} className="pwa-plus-spin" />
                  <span className="text-sm font-medium">Add to Home Screen</span>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Scroll down in the share menu if needed
              </p>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-2">
                Tap "Add" to install
              </p>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-3 flex items-center justify-center">
                <span className="text-white font-medium text-sm">Add</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                The app will be added to your home screen! 🎉
              </p>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-2">✨ Benefits of Installing:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Fast, native iOS app experience</li>
              <li>• Works offline - view menu anywhere</li>
              <li>• Quick access from home screen</li>
              <li>• No App Store required</li>
            </ul>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8"
            >
              Got it! 👍
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}