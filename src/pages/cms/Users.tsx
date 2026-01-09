import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UserPlus, Trash2, AlertCircle, Shield, Copy, Check } from 'lucide-react';

interface CMSUserWithRole {
  user_id: string;
  email: string;
  role: 'admin' | 'editor';
  created_at: string;
}

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<CMSUserWithRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Add user form state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'editor'>('editor');
  const [tempPassword, setTempPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [copied, setCopied] = useState(false);

  // Delete user state
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [user]);

  const checkAdminAndLoadUsers = async () => {
    if (!user) return;

    try {
      // Check if current user is admin
      const { data: adminCheck } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });
      
      setIsAdmin(!!adminCheck);
      
      if (adminCheck) {
        await loadUsers();
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user emails via edge function
      const response = await supabase.functions.invoke('get-users', {
        body: { userIds: data.map(u => u.user_id) }
      });

      if (response.error) throw response.error;

      const usersWithEmails = data.map(u => ({
        ...u,
        email: response.data.users.find((e: any) => e.id === u.user_id)?.email || 'Unknown'
      }));

      setUsers(usersWithEmails as CMSUserWithRole[]);
    } catch (err) {
      console.error('Error loading users:', err);
      toast.error('Failed to load users');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleAddUser = async () => {
    if (!newEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsCreating(true);
    const password = generatePassword();

    try {
      const response = await supabase.functions.invoke('create-cms-user', {
        body: {
          email: newEmail.trim(),
          password,
          role: newRole
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create user');
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setTempPassword(password);
      setShowCredentials(true);
      toast.success('User created successfully');
      await loadUsers();
    } catch (err: any) {
      console.error('Error creating user:', err);
      toast.error(err.message || 'Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await supabase.functions.invoke('delete-cms-user', {
        body: { userId }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete user');
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      toast.success('User deleted successfully');
      setDeleteUserId(null);
      await loadUsers();
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const copyCredentials = () => {
    const text = `Email: ${newEmail}\nTemporary Password: ${tempPassword}\n\nPlease sign in and change your password immediately.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAddDialog = () => {
    setShowAddDialog(false);
    setNewEmail('');
    setNewRole('editor');
    setTempPassword('');
    setShowCredentials(false);
    setCopied(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Only administrators can manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-muted-foreground">Add and manage CMS users</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => open ? setShowAddDialog(true) : resetAddDialog()}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{showCredentials ? 'User Created' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {showCredentials 
                  ? 'Share these credentials securely with the new user.'
                  : 'Create a new CMS user with a temporary password.'
                }
              </DialogDescription>
            </DialogHeader>
            
            {showCredentials ? (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm">
                  <div><span className="text-muted-foreground">Email:</span> {newEmail}</div>
                  <div><span className="text-muted-foreground">Password:</span> {tempPassword}</div>
                </div>
                <p className="text-sm text-muted-foreground">
                  The user should change their password after first login.
                </p>
                <DialogFooter>
                  <Button variant="outline" onClick={copyCredentials}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy Credentials'}
                  </Button>
                  <Button onClick={resetAddDialog}>Done</Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={newRole} onValueChange={(v) => setNewRole(v as 'admin' | 'editor')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Admins can manage users. Editors can only manage content.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetAddDialog}>Cancel</Button>
                  <Button onClick={handleAddUser} disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="cms-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.user_id}>
                <TableCell className="font-medium">
                  {u.email}
                  {u.user_id === user?.id && (
                    <span className="text-xs text-muted-foreground ml-2">(you)</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {u.role === 'admin' && <Shield className="w-3 h-3 text-primary" />}
                    <span className="capitalize">{u.role}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(u.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Dialog open={deleteUserId === u.user_id} onOpenChange={(open) => !open && setDeleteUserId(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={u.user_id === user?.id}
                        onClick={() => setDeleteUserId(u.user_id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete {u.email}? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteUserId(null)}>Cancel</Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteUser(u.user_id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
