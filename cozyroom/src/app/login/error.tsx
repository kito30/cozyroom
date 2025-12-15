'use client'

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Server Unavailable</h2>
        <p className="text-gray-600 mb-4">
          We&apos;re having trouble connecting to our servers. Please try again later.
        </p>
        <button
          onClick={reset}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  )
}