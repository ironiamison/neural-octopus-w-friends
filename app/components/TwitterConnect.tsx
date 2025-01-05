import { useAuthStore } from '../utils/auth'
import { FaTwitter } from 'react-icons/fa'

export default function TwitterConnect() {
  const { user, isLoading, error, connectTwitter, disconnectTwitter } = useAuthStore()

  const handleConnect = async () => {
    try {
      await connectTwitter()
    } catch (error) {
      console.error('Failed to connect Twitter:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectTwitter()
    } catch (error) {
      console.error('Failed to disconnect Twitter:', error)
    }
  }

  if (isLoading) {
    return (
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-gray-500 rounded-lg opacity-50 cursor-not-allowed"
        disabled
      >
        <FaTwitter className="w-5 h-5" />
        Connecting...
      </button>
    )
  }

  if (user?.twitterId) {
    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
      >
        <FaTwitter className="w-5 h-5" />
        Disconnect Twitter
      </button>
    )
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-blue-400 rounded-lg hover:bg-blue-500 transition-colors"
    >
      <FaTwitter className="w-5 h-5" />
      Connect Twitter
    </button>
  )
} 