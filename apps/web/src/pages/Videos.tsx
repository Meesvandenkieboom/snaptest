import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, Video as VideoIcon, Clock } from 'lucide-react';
import { videosApi } from '@/lib/api';
import { getStatusColor, formatFileSize, formatDuration } from '@/lib/utils';
import { VideoStatus } from '@/types';

export default function Videos() {
  const { data: videos, isLoading, error } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await videosApi.getAll();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-12 w-12 animate-spin text-gray-400" />
          <p className="mt-4 text-sm text-gray-500">Loading videos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-800">
          Failed to load videos. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your video library
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          <Plus className="h-5 w-5" />
          Upload Video
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-500">Total</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {videos?.length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-500">Ready</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {videos?.filter((v) => v.status === VideoStatus.READY).length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-500">Processing</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {videos?.filter((v) => v.status === VideoStatus.PROCESSING).length || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <p className="text-sm font-medium text-gray-500">Failed</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {videos?.filter((v) => v.status === VideoStatus.FAILED).length || 0}
          </p>
        </div>
      </div>

      {/* Video grid */}
      {videos && videos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="overflow-hidden rounded-lg bg-white shadow transition-shadow hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-200">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title || video.originalName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <VideoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black bg-opacity-75 px-2 py-1 text-xs text-white">
                    <Clock className="h-3 w-3" />
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold text-white ${getStatusColor(
                      video.status
                    )}`}
                  >
                    {video.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatFileSize(video.fileSize)}
                  </span>
                </div>
                <h3 className="truncate font-medium text-gray-900">
                  {video.title || video.originalName}
                </h3>
                {video.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {video.description}
                  </p>
                )}
                {video.tags && video.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="text-xs text-gray-400">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-xs text-gray-400">
                  Uploaded {new Date(video.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No videos yet
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Get started by uploading your first video.
          </p>
          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Plus className="h-5 w-5" />
            Upload Video
          </button>
        </div>
      )}
    </div>
  );
}
