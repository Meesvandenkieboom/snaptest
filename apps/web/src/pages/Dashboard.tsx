import { useQuery } from '@tanstack/react-query';
import { Users, Video, Briefcase, Server, TrendingUp } from 'lucide-react';
import { accountsApi, videosApi, jobsApi, proxiesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await accountsApi.getAll();
      return response.data;
    },
  });

  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: async () => {
      const response = await videosApi.getAll();
      return response.data;
    },
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const response = await jobsApi.getAll();
      return response.data;
    },
  });

  const { data: proxies } = useQuery({
    queryKey: ['proxies'],
    queryFn: async () => {
      const response = await proxiesApi.getAll();
      return response.data;
    },
  });

  const stats = [
    {
      name: 'Total Accounts',
      value: accounts?.length || 0,
      icon: Users,
      color: 'bg-blue-500',
      active: accounts?.filter((a) => a.status === 'ACTIVE').length || 0,
    },
    {
      name: 'Total Videos',
      value: videos?.length || 0,
      icon: Video,
      color: 'bg-purple-500',
      active: videos?.filter((v) => v.status === 'READY').length || 0,
    },
    {
      name: 'Total Jobs',
      value: jobs?.length || 0,
      icon: Briefcase,
      color: 'bg-green-500',
      active: jobs?.filter((j) => j.status === 'COMPLETED').length || 0,
    },
    {
      name: 'Total Proxies',
      value: proxies?.length || 0,
      icon: Server,
      color: 'bg-orange-500',
      active: proxies?.filter((p) => p.isActive).length || 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your Snapchat automation today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`rounded-md p-3 ${stat.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                          <TrendingUp className="h-4 w-4" />
                        </div>
                      </dd>
                      <dd className="mt-1 text-sm text-gray-500">
                        {stat.active} active
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 hover:bg-gray-50">
            <Users className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Add Account
            </span>
          </button>
          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 hover:bg-gray-50">
            <Video className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Upload Video
            </span>
          </button>
          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 hover:bg-gray-50">
            <Briefcase className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Create Job
            </span>
          </button>
          <button className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 hover:bg-gray-50">
            <Server className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Add Proxy
            </span>
          </button>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-gray-100 p-3">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
}
