'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, PlusCircle } from 'lucide-react';
import { useActionState } from 'react';
import useSWR from 'swr';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import { removeTeamMember, inviteTeamMember, addChild, removeChild } from '@/app/(login)/actions';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = { error?: string; success?: string };

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const { data: currentUser } = useSWR<User>('/api/user', fetcher);
  const [removeState, removeAction, isRemovePending] = useActionState<ActionState, FormData>(removeTeamMember, {});

  if (!teamData?.teamMembers?.length) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No family members yet.</p>
        </CardContent>
      </Card>
    );
  }

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => user.name || user.email || 'Unknown User';

  const isOwner = currentUser?.role === 'owner';
  const canRemove = (memberUserId: number, memberRole: string) => {
    if (!isOwner) return false;
    // Owners can remove anyone except themselves
    if (memberUserId === currentUser?.id) return false;
    return true;
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Family Members</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {teamData.teamMembers.map((member, index) => (
            <li key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {getUserDisplayName(member.user).split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{getUserDisplayName(member.user)}</p>
                  <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                </div>
              </div>
              {canRemove(member.user.id, member.role) ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button type="submit" variant="outline" size="sm" disabled={isRemovePending}>
                    {isRemovePending ? 'Removing...' : 'Remove'}
                  </Button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {removeState?.error && <p className="text-red-500 mt-4">{removeState.error}</p>}
      </CardContent>
    </Card>
  );
}

function InviteFamilyMember() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const isOwner = user?.role === 'owner';
  const [inviteState, inviteAction, isInvitePending] = useActionState<ActionState, FormData>(inviteTeamMember, {});

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Invite Family Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction} className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter email" required disabled={!isOwner} />
          </div>
          <div>
            <Label>Role</Label>
            <RadioGroup defaultValue="adult" name="role" className="flex space-x-4" disabled={!isOwner}>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="adult" id="adult" />
                <Label htmlFor="adult">Adult</Label>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner">Owner</Label>
              </div>
            </RadioGroup>
          </div>
          {inviteState?.error && <p className="text-red-500">{inviteState.error}</p>}
          {inviteState?.success && <p className="text-green-500">{inviteState.success}</p>}
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isInvitePending || !isOwner}>
            {isInvitePending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Inviting...</>) : (<><PlusCircle className="mr-2 h-4 w-4" />Invite Member</>)}
          </Button>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <p className="text-sm text-muted-foreground">You must be a family owner to invite new members.</p>
        </CardFooter>
      )}
    </Card>
  );
}

function ChildrenList() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const [removeState, removeAction, isRemoving] = useActionState<ActionState, FormData>(removeChild, {});

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Children</CardTitle>
      </CardHeader>
      <CardContent>
        {!teamData?.children?.length ? (
          <p className="text-muted-foreground">No children added yet.</p>
        ) : (
          <ul className="space-y-3">
            {teamData.children.map((child) => (
              <li key={child.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-muted-foreground">Parent: {child.parent?.name || child.parent?.email}</p>
                </div>
                <form action={removeAction}>
                  <input type="hidden" name="childId" value={child.id} />
                  <Button type="submit" variant="outline" size="sm" disabled={isRemoving}>
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}
        {removeState?.error && <p className="text-red-500 mt-4">{removeState.error}</p>}
      </CardContent>
    </Card>
  );
}

function AddChildForm() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const isAdultOrOwner = user?.role === 'owner' || user?.role === 'adult';
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(addChild, {});
  const parentOptions = (teamData?.teamMembers ?? []).filter((m) => m.role === 'owner' || m.role === 'adult');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Child</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="child-name" className="mb-2">Child Name</Label>
            <Input id="child-name" name="name" placeholder="Enter child's name" required disabled={!isAdultOrOwner} />
          </div>
          <div>
            <Label htmlFor="parent-id" className="mb-2">Parent</Label>
            <select id="parent-id" name="parentId" className="w-full border rounded-md p-2" disabled={!isAdultOrOwner} required defaultValue={parentOptions[0]?.user.id}>
              {parentOptions.map((m) => (
                <option key={m.id} value={m.user.id}>
                  {(m.user.name || m.user.email) + (m.role === 'owner' ? ' (Owner)' : '')}
                </option>
              ))}
            </select>
          </div>
          {state?.error && <p className="text-red-500">{state.error}</p>}
          {state?.success && <p className="text-green-500">{state.success}</p>}
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={!isAdultOrOwner || isPending}>
            {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>) : ('Add Child')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ManageFamilyPage() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium mb-6">Manage Family</h1>
      <TeamMembers />
      <InviteFamilyMember />
      <ChildrenList />
      <AddChildForm />
    </section>
  );
}
