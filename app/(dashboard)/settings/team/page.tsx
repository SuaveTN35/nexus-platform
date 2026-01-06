'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { SelectOption } from '@/components/ui/Select';

interface TeamMember {
  id: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  isActive: boolean;
  joinedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  };
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';
  expiresAt: string;
  createdAt: string;
}

const roleOptions: SelectOption[] = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'ADMIN', label: 'Admin' },
];

const roleColors: Record<string, string> = {
  OWNER: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  MEMBER: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
};

const inviteStatusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ACCEPTED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  EXPIRED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400',
  REVOKED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [inviteError, setInviteError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members);
        setInvites(data.invites);
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (res.ok) {
        await fetchTeamData();
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteRole('MEMBER');
      } else {
        const error = await res.json();
        setInviteError(error.error || 'Failed to send invite');
      }
    } catch (error) {
      setInviteError('Failed to send invite');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    if (!confirm('Are you sure you want to revoke this invite?')) return;

    try {
      const res = await fetch(`/api/team/invite/${inviteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error('Failed to revoke invite:', error);
    }
  };

  const handleResendInvite = async (inviteId: string) => {
    try {
      const res = await fetch(`/api/team/invite/${inviteId}/resend`, {
        method: 'POST',
      });
      if (res.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error('Failed to resend invite:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/team/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        await fetchTeamData();
      }
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null, email: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = (member: TeamMember) => {
    if (member.user.firstName || member.user.lastName) {
      return `${member.user.firstName || ''} ${member.user.lastName || ''}`.trim();
    }
    return member.user.email;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your team members and invitations</p>
        </div>
        <Button variant="primary" onClick={() => setShowInviteModal(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Invite Member
        </Button>
      </div>

      <div className="space-y-6">
        {/* Team Members */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Team Members ({members.length})
          </h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {member.user.avatar ? (
                      <img
                        src={member.user.avatar}
                        alt={getDisplayName(member)}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <span className="text-white font-medium">
                        {getInitials(member.user.firstName, member.user.lastName, member.user.email)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getDisplayName(member)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                  {member.role !== 'OWNER' && (
                    <div className="flex items-center gap-2">
                      <select
                        value={member.role}
                        onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                      </select>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMember(member.id)}>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No team members yet. Invite someone to get started!
              </p>
            )}
          </div>
        </Card>

        {/* Pending Invitations */}
        <Card padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Pending Invitations ({invites.filter(i => i.status === 'PENDING').length})
          </h2>
          <div className="space-y-3">
            {invites.filter(i => i.status === 'PENDING').map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{invite.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invited {new Date(invite.createdAt).toLocaleDateString()} · Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[invite.role]}`}>
                    {invite.role}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${inviteStatusColors[invite.status]}`}>
                    {invite.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleResendInvite(invite.id)}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(invite.id)}>
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {invites.filter(i => i.status === 'PENDING').length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No pending invitations
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invite Team Member</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              {inviteError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {inviteError}
                </div>
              )}
              <Input
                label="Email Address"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                required
              />
              <Select
                label="Role"
                options={roleOptions}
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                helperText="Admins can manage team members and settings"
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || !inviteEmail}
                >
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
