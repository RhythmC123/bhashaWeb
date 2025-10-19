import React, { useEffect, useMemo, useState } from 'react'
import styles from '@/styles/Admin.module.css'
import AdminNav from '@/components/admin/AdminNav'
import SideBarAdmin from '@/components/admin/SideBarAdmin'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Search, MoreVertical, Eye, Edit2, Ban, Plus, UsersRound, UserPlus, Shield, ChevronLeft, ChevronRight, RefreshCw, Mail } from 'lucide-react'
import supabase from '@/lib/supabaseClient'
import { AdminProtectedRoute } from '@/components/ProtectedRoute'

const MOCK_CUSTOMERS = [
  { id: 'c_1', name: 'Arjun Mehta', email: 'arjun@example.com', registeredAt: '2024-12-01', status: 'Active' },
  { id: 'c_2', name: 'Priya Singh', email: 'priya@example.com', registeredAt: '2025-01-11', status: 'Active' },
  { id: 'c_3', name: 'Rahul Verma', email: 'rahul@example.com', registeredAt: '2025-02-05', status: 'Suspended' },
  { id: 'c_4', name: 'Neha Kapoor', email: 'neha@example.com', registeredAt: '2025-03-18', status: 'Active' },
  { id: 'c_5', name: 'Ishita Rao', email: 'ishita@example.com', registeredAt: '2025-04-22', status: 'Active' },
  { id: 'c_6', name: 'Dev Sharma', email: 'dev@example.com', registeredAt: '2025-05-30', status: 'Suspended' },
]

const MOCK_TEAM = [
  { id: 't_1', name: 'A. Kumar', email: 'akumar@bhasha.app', role: 'Admin', status: 'Active', lastActiveAt: '2025-10-10', avatar: '' },
  { id: 't_2', name: 'S. Kaur', email: 'skaur@bhasha.app', role: 'Instructor', status: 'Active', lastActiveAt: '2025-10-09', avatar: '' },
  { id: 't_3', name: 'R. Das', email: 'rdas@bhasha.app', role: 'Support', status: 'Active', lastActiveAt: '2025-10-07', avatar: '' },
  { id: 't_4', name: 'M. Iyer', email: 'miyer@bhasha.app', role: 'Instructor', status: 'Suspended', lastActiveAt: '2025-09-22', avatar: '' },
]

const MOCK_ROLES = [
  { id: 'r_admin', name: 'Admin', description: 'Full access to people, content and settings.' },
  { id: 'r_instructor', name: 'Instructor', description: 'Manage learners assigned to their courses and groups.' },
  { id: 'r_support', name: 'Support', description: 'View users and assist with account issues.' },
  { id: 'r_viewer', name: 'Viewer', description: 'Read-only access to people data.' },
]

export default function PeopleManagementPage() {
  const [activeTab, setActiveTab] = useState('customers')
  const [customerQuery, setCustomerQuery] = useState('')
  const [teamQuery, setTeamQuery] = useState('')
  const [customerPage, setCustomerPage] = useState(1)
  const [teamPage, setTeamPage] = useState(1)
  const [pageSize] = useState(5)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(new Set())
  const [selectedTeamIds, setSelectedTeamIds] = useState(new Set())
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [showInviteMember, setShowInviteMember] = useState(false)
  const [memberDetailId, setMemberDetailId] = useState(null)
  const [subscribers, setSubscribers] = useState([])
  const [subscribersLoading, setSubscribersLoading] = useState(true)

  const fetchSubscribers = async () => {
    setSubscribersLoading(true)
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setSubscribers(data)
    }
    setSubscribersLoading(false)
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const subscribersAsCustomers = useMemo(() => {
    return subscribers.map((s) => ({
      id: `sub_${s.id}`,
      name: s.name || '—',
      email: s.email,
      registeredAt: new Date(s.created_at).toLocaleString(),
      status: 'Active',
    }))
  }, [subscribers])

  const filteredCustomers = useMemo(() => {
    const q = customerQuery.trim().toLowerCase()
    const base = subscribersAsCustomers.length ? subscribersAsCustomers : MOCK_CUSTOMERS
    if (!q) return base
    return base.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    )
  }, [customerQuery, subscribersAsCustomers])

  const filteredTeam = useMemo(() => {
    const q = teamQuery.trim().toLowerCase()
    if (!q) return MOCK_TEAM
    return MOCK_TEAM.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.role.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    )
  }, [teamQuery])

  const customerPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize))
  const teamPages = Math.max(1, Math.ceil(filteredTeam.length / pageSize))
  const pagedCustomers = filteredCustomers.slice((customerPage - 1) * pageSize, customerPage * pageSize)
  const pagedTeam = filteredTeam.slice((teamPage - 1) * pageSize, teamPage * pageSize)

  const toggleSelectAll = (type, allIds, selectedSet, setter) => {
    const allSelected = allIds.every(id => selectedSet.has(id))
    if (allSelected) {
      setter(new Set())
    } else {
      setter(new Set(allIds))
    }
  }

  const toggleSelectOne = (id, selectedSet, setter) => {
    const next = new Set(selectedSet)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setter(next)
  }

  return (
    <AdminProtectedRoute>
      <div className={styles.container}>
        <AdminNav />
        <div className={styles.contentWrapper}>
          <SideBarAdmin selectedSection={'dashboard'} setSelectedSection={() => {}} />
          
          <div className="flex-1 p-8 h-vh-100">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-100">People Management</h1>
              <p className="text-sm text-gray-400">Manage customers, team, and access roles</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowAddCustomer(true)} className="bg-orange-600 hover:bg-orange-500">
                <Plus className="mr-2" /> Add Customer
              </Button>
              <Button variant="secondary" onClick={() => setShowInviteMember(true)} className="bg-zinc-800 text-gray-100 hover:bg-zinc-700">
                <UserPlus className="mr-2" /> Invite Team Member
              </Button>
            </div>
          </header>

          <div className="mb-4 flex w-full gap-2 overflow-x-auto">
            <Button variant={activeTab === 'customers' ? 'default' : 'ghost'}
              className={activeTab === 'customers' ? 'bg-orange-600 hover:bg-orange-500' : 'text-gray-300'}
              onClick={() => setActiveTab('customers')}>
              <UsersRound className="mr-2" /> Customers
            </Button>
            <Button variant={activeTab === 'team' ? 'default' : 'ghost'}
              className={activeTab === 'team' ? 'bg-orange-600 hover:bg-orange-500' : 'text-gray-300'}
              onClick={() => setActiveTab('team')}>
              <Shield className="mr-2" /> Team
            </Button>
            <Button variant={activeTab === 'roles' ? 'default' : 'ghost'}
              className={activeTab === 'roles' ? 'bg-orange-600 hover:bg-orange-500' : 'text-gray-300'}
              onClick={() => setActiveTab('roles')}>
              Roles & Access
            </Button>
            <Button variant={activeTab === 'activity' ? 'default' : 'ghost'}
              className={activeTab === 'activity' ? 'bg-orange-600 hover:bg-orange-500' : 'text-gray-300'}
              onClick={() => setActiveTab('activity')}>
              Audit Activity
            </Button>
          </div>

          {activeTab === 'customers' && (
            <Card className="bg-[#1e1e1e] border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-100 text-lg">Customers</CardTitle>
                <CardDescription className="text-gray-400">Search, filter, and manage customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-2 top-2.5 text-gray-400" />
                    <Input
                      value={customerQuery}
                      onChange={(e) => { setCustomerQuery(e.target.value); setCustomerPage(1) }}
                      placeholder="Search by name, email, or status"
                      className="pl-8"
                      aria-label="Search customers"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-800" onClick={fetchSubscribers}>
                      <RefreshCw className="mr-2" /> Refresh
                    </Button>
                    <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">Export</Button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            aria-label="Select all customers"
                            checked={pagedCustomers.every(c => selectedCustomerIds.has(c.id)) && pagedCustomers.length > 0}
                            onChange={() => toggleSelectAll('customers', pagedCustomers.map(c => c.id), selectedCustomerIds, setSelectedCustomerIds)}
                          />
                        </th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Registered</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribersLoading && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td>
                        </tr>
                      )}
                      {pagedCustomers.map((c) => (
                        <tr key={c.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                          <td className="px-4 py-3 align-middle">
                            <input
                              type="checkbox"
                              aria-label={`Select ${c.name}`}
                              checked={selectedCustomerIds.has(c.id)}
                              onChange={() => toggleSelectOne(c.id, selectedCustomerIds, setSelectedCustomerIds)}
                            />
                          </td>
                          <td className="px-4 py-3 align-middle text-gray-200">{c.name}</td>
                          <td className="px-4 py-3 align-middle text-gray-400">{c.email}</td>
                          <td className="px-4 py-3 align-middle text-gray-400">{c.registeredAt}</td>
                          <td className="px-4 py-3 align-middle">
                            <span className={
                              c.status === 'Active'
                                ? 'rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-1 text-xs'
                                : 'rounded-full bg-red-500/15 text-red-400 px-2 py-1 text-xs'
                            }>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                                <Eye />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                                <Edit2 />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                <Ban />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-200">
                                <MoreVertical />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {pagedCustomers.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No customers found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Selected: {selectedCustomerIds.size}</span>
                    <Button variant="outline" className="h-8 border-zinc-700 text-gray-300 hover:bg-zinc-800">Change Status</Button>
                    <Button variant="outline" className="h-8 border-zinc-700 text-gray-300 hover:bg-zinc-800">Disable</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                      disabled={customerPage === 1}
                      onClick={() => setCustomerPage(p => Math.max(1, p - 1))}>
                      <ChevronLeft className="mr-2" /> Prev
                    </Button>
                    <span className="text-sm text-gray-400">Page {customerPage} of {customerPages}</span>
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                      disabled={customerPage >= customerPages}
                      onClick={() => setCustomerPage(p => Math.min(customerPages, p + 1))}>
                      Next <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card className="bg-[#1e1e1e] border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-100 text-lg">Team</CardTitle>
                <CardDescription className="text-gray-400">Manage team members, roles, and statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-2 top-2.5 text-gray-400" />
                    <Input
                      value={teamQuery}
                      onChange={(e) => { setTeamQuery(e.target.value); setTeamPage(1) }}
                      placeholder="Search by name, email, role, status"
                      className="pl-8"
                      aria-label="Search team"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
                      <RefreshCw className="mr-2" /> Refresh
                    </Button>
                  </div>
                </div>

                <div className="w-full overflow-x-auto rounded-lg border border-zinc-800">
                  <table className="w-full text-sm">
                    <thead className="bg-zinc-900/50 text-gray-300">
                      <tr>
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            aria-label="Select all team"
                            checked={pagedTeam.every(t => selectedTeamIds.has(t.id)) && pagedTeam.length > 0}
                            onChange={() => toggleSelectAll('team', pagedTeam.map(t => t.id), selectedTeamIds, setSelectedTeamIds)}
                          />
                        </th>
                        <th className="px-4 py-3 text-left">Member</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Last Active</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedTeam.map((t) => (
                        <tr key={t.id} className="border-t border-zinc-800 hover:bg-zinc-900/40">
                          <td className="px-4 py-3 align-middle">
                            <input
                              type="checkbox"
                              aria-label={`Select ${t.name}`}
                              checked={selectedTeamIds.has(t.id)}
                              onChange={() => toggleSelectOne(t.id, selectedTeamIds, setSelectedTeamIds)}
                            />
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-gray-300">
                                {t.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <button className="text-gray-200 hover:underline" onClick={() => setMemberDetailId(t.id)}>{t.name}</button>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle text-gray-400">{t.email}</td>
                          <td className="px-4 py-3 align-middle text-gray-300">{t.role}</td>
                          <td className="px-4 py-3 align-middle">
                            <span className={
                              t.status === 'Active'
                                ? 'rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-1 text-xs'
                                : 'rounded-full bg-red-500/15 text-red-400 px-2 py-1 text-xs'
                            }>
                              {t.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-middle text-gray-400">{t.lastActiveAt}</td>
                          <td className="px-4 py-3 align-middle">
                            <div className="flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white" onClick={() => setMemberDetailId(t.id)}>
                                <Eye />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                                <Edit2 />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                                <Ban />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-200">
                                <MoreVertical />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {pagedTeam.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-400">No team members found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Selected: {selectedTeamIds.size}</span>
                    <Button variant="outline" className="h-8 border-zinc-700 text-gray-300 hover:bg-zinc-800">Edit Role</Button>
                    <Button variant="outline" className="h-8 border-zinc-700 text-gray-300 hover:bg-zinc-800">Disable</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                      disabled={teamPage === 1}
                      onClick={() => setTeamPage(p => Math.max(1, p - 1))}>
                      <ChevronLeft className="mr-2" /> Prev
                    </Button>
                    <span className="text-sm text-gray-400">Page {teamPage} of {teamPages}</span>
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800"
                      disabled={teamPage >= teamPages}
                      onClick={() => setTeamPage(p => Math.min(teamPages, p + 1))}>
                      Next <ChevronRight className="ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'roles' && (
            <Card className="bg-[#1e1e1e] border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-100 text-lg">Roles & Access</CardTitle>
                <CardDescription className="text-gray-400">Assign roles and view access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {MOCK_ROLES.map(role => (
                    <div key={role.id} className="rounded-lg border border-zinc-800 p-4">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-gray-200 font-medium">{role.name}</div>
                        <Switch aria-label={`Toggle ${role.name} availability`} />
                      </div>
                      <p className="text-sm text-gray-400">{role.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg border border-zinc-800 p-4">
                  <div className="mb-3 text-sm text-gray-300">Assign role to selected team members</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {MOCK_ROLES.map(role => (
                      <Button key={role.id} variant="outline" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
                        {role.name}
                      </Button>
                    ))}
                    <Button className="bg-orange-600 hover:bg-orange-500">Apply</Button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">Selected: {selectedTeamIds.size} members</div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card className="bg-[#1e1e1e] border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-100 text-lg">Audit Activity</CardTitle>
                <CardDescription className="text-gray-400">Log of changes to roles and access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-zinc-800 p-4 text-gray-400 text-sm">
                  No recent changes. Activity will appear here when roles or access are updated.
                </div>
              </CardContent>
            </Card>
          )}

          {memberDetailId && (
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMemberDetailId(null)} />
              <div className="absolute right-0 top-0 h-full w-full bg-[#1e1e1e] shadow-xl md:w-[440px]">
                <div className="flex items-center justify-between border-b border-zinc-800 p-4">
                  <div>
                    <div className="text-gray-100 font-semibold">Team Member</div>
                    <div className="text-sm text-gray-400">Profile and access</div>
                  </div>
                  <Button variant="ghost" className="text-gray-400" onClick={() => setMemberDetailId(null)}>Close</Button>
                </div>
                <div className="p-4 space-y-4">
                  {MOCK_TEAM.filter(t => t.id === memberDetailId).map((t) => (
                    <div key={t.id}>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-gray-300 text-lg">
                          {t.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-gray-100 font-medium">{t.name}</div>
                          <div className="text-sm text-gray-400">{t.email}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Role</div>
                          <div className="text-gray-200">{t.role}</div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Status</div>
                          <div className="text-gray-200">{t.status}</div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Last Active</div>
                          <div className="text-gray-200">{t.lastActiveAt}</div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Actions</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-500"><Edit2 className="mr-2" /> Edit Role</Button>
                            <Button size="sm" variant="secondary" className="bg-zinc-800 text-gray-100 hover:bg-zinc-700"><Mail className="mr-2" /> Send Reset</Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300"><Ban className="mr-2" /> Disable</Button>
                          </div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Managed Groups/Courses</div>
                          <div className="mt-1 text-gray-300">—</div>
                        </div>
                        <div className="rounded-lg border border-zinc-800 p-3">
                          <div className="text-sm text-gray-400">Recent Activity</div>
                          <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-gray-400">
                            <li>No recent activity</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showAddCustomer && (
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddCustomer(false)} />
              <div className="absolute left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4">
                <div className="mb-2 text-lg font-semibold text-gray-100">Add Customer</div>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="c_name" className="text-gray-300">Name</Label>
                    <Input id="c_name" placeholder="Full name" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="c_email" className="text-gray-300">Email</Label>
                    <Input id="c_email" type="email" placeholder="name@company.com" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" className="text-gray-300" onClick={(e) => { e.preventDefault(); setShowAddCustomer(false) }}>Cancel</Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-500">Create</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showInviteMember && (
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-40">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowInviteMember(false)} />
              <div className="absolute left-1/2 top-1/2 w-[95%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-[#1e1e1e] p-4">
                <div className="mb-2 text-lg font-semibold text-gray-100">Invite Team Member</div>
                <form className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="t_email" className="text-gray-300">Email</Label>
                    <Input id="t_email" type="email" placeholder="member@bhasha.app" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="t_role" className="text-gray-300">Role</Label>
                    <Input id="t_role" placeholder="Admin / Instructor / Support" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" className="text-gray-300" onClick={(e) => { e.preventDefault(); setShowInviteMember(false) }}>Cancel</Button>
                    <Button type="submit" className="bg-orange-600 hover:bg-orange-500">Send Invite</Button>
                  </div>
                </form>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}


