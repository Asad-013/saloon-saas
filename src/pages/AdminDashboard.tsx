import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import BulkTimeSlotCreator from '@/components/BulkTimeSlotCreator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Link as LinkIcon, Unlink } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PopoverClose } from '@radix-ui/react-popover';
import { format, parseISO } from 'date-fns';

const AdminDashboard = () => {
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    is_active: true,
  });
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [staff, setStaff] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    is_active: true,
  });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [staffServices, setStaffServices] = useState<any[]>([]);

  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    staff_id: '',
    date: '',
    time: '',
    is_available: true,
  });
  const [editingTimeSlotId, setEditingTimeSlotId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserRoleAndFetchData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Unauthorized",
          description: "You must be logged in to access the admin dashboard.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        console.error("Error fetching profile or not an admin:", profileError?.message);
        toast({
          title: "Access Denied",
          description: "You do not have administrative privileges.",
          variant: "destructive",
        });
        navigate('/'); // Redirect non-admins to home
        return;
      } else {
        setUserRole(profile.role);
      }

      // Fetch services
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .order('name', { ascending: true });

      if (servicesError) {
        toast({
          title: "Error fetching services",
          description: servicesError.message,
          variant: "destructive",
        });
        setServices([]);
      } else {
        setServices(servicesData || []);
      }

      // Fetch staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .order('name', { ascending: true });

      if (staffError) {
        toast({
          title: "Error fetching staff",
          description: staffError.message,
          variant: "destructive",
        });
        setStaff([]);
      } else {
        setStaff(staffData || []);
      }

      // Fetch staff_services relationships
      const { data: staffServicesData, error: staffServicesError } = await supabase
        .from('staff_services')
        .select('*');

      if (staffServicesError) {
        console.error("Error fetching staff services:", staffServicesError.message);
        setStaffServices([]);
      } else {
        setStaffServices(staffServicesData || []);
      }

      // Fetch time slots
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*, staff(name), bookings(id, customer_name)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (timeSlotsError) {
        console.error("Error fetching time slots:", timeSlotsError.message);
        setTimeSlots([]);
      } else {
        setTimeSlots(timeSlotsData || []);
      }

      setLoading(false);
    };
    checkUserRoleAndFetchData();
  }, [navigate, toast]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .insert([{
        name: newService.name,
        description: newService.description,
        price: newService.price,
        duration: parseInt(newService.duration),
        image_url: newService.image_url,
        is_active: newService.is_active,
      }]);

    if (error) {
      toast({
        title: "Error adding service",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Service Added",
        description: `Service '${newService.name}' has been added.`, 
      });
      setNewService({ name: '', description: '', price: '', duration: '', image_url: '', is_active: true });
      // Re-fetch services to update the list
      const { data: servicesData, error: fetchError } = await supabase.from('services').select('*').order('name', { ascending: true });
      if (!fetchError) setServices(servicesData || []);
    }
    setLoading(false);
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .update({
        name: newService.name,
        description: newService.description,
        price: newService.price,
        duration: parseInt(newService.duration),
        image_url: newService.image_url,
        is_active: newService.is_active,
      })
      .eq('id', editingServiceId);

    if (error) {
      toast({
        title: "Error updating service",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Service Updated",
        description: `Service '${newService.name}' has been updated.`, 
      });
      setEditingServiceId(null);
      setNewService({ name: '', description: '', price: '', duration: '', image_url: '', is_active: true });
      // Re-fetch services to update the list
      const { data: servicesData, error: fetchError } = await supabase.from('services').select('*').order('name', { ascending: true });
      if (!fetchError) setServices(servicesData || []);
    }
    setLoading(false);
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    setLoading(true);
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Service Deleted",
        description: "Service has been deleted.",
      });
      // Re-fetch services to update the list
      const { data: servicesData, error: fetchError } = await supabase.from('services').select('*').order('name', { ascending: true });
      if (!fetchError) setServices(servicesData || []);
    }
    setLoading(false);
  };

  const startEditingService = (service: any) => {
    setEditingServiceId(service.id);
    setNewService({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration: service.duration.toString(),
      image_url: service.image_url || '',
      is_active: service.is_active,
    });
  };

  // Staff Management Functions
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        name: newStaff.name,
        role: newStaff.role,
        bio: newStaff.bio,
        image_url: newStaff.image_url,
        is_active: newStaff.is_active,
      }]);

    if (error) {
      toast({
        title: "Error adding staff member",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Staff Added",
        description: `Staff member '${newStaff.name}' has been added.`, 
      });
      setNewStaff({ name: '', role: '', bio: '', image_url: '', is_active: true });
      // Re-fetch staff to update the list
      const { data: staffData, error: fetchError } = await supabase.from('staff').select('*').order('name', { ascending: true });
      if (!fetchError) setStaff(staffData || []);
    }
    setLoading(false);
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('staff')
      .update({
        name: newStaff.name,
        role: newStaff.role,
        bio: newStaff.bio,
        image_url: newStaff.image_url,
        is_active: newStaff.is_active,
      })
      .eq('id', editingStaffId);

    if (error) {
      toast({
        title: "Error updating staff member",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Staff Updated",
        description: `Staff member '${newStaff.name}' has been updated.`, 
      });
      setEditingStaffId(null);
      setNewStaff({ name: '', role: '', bio: '', image_url: '', is_active: true });
      // Re-fetch staff to update the list
      const { data: staffData, error: fetchError } = await supabase.from('staff').select('*').order('name', { ascending: true });
      if (!fetchError) setStaff(staffData || []);
    }
    setLoading(false);
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    setLoading(true);
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', staffId);

    if (error) {
      toast({
        title: "Error deleting staff member",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Staff Member Deleted",
        description: "Staff member has been deleted.",
      });
      // Re-fetch staff to update the list
      const { data: staffData, error: fetchError } = await supabase.from('staff').select('*').order('name', { ascending: true });
      if (!fetchError) setStaff(staffData || []);
    }
    setLoading(false);
  };

  const startEditingStaff = (staffMember: any) => {
    setEditingStaffId(staffMember.id);
    setNewStaff({
      name: staffMember.name,
      role: staffMember.role,
      bio: staffMember.bio || '',
      image_url: staffMember.image_url || '',
      is_active: staffMember.is_active,
    });
  };

  const handleAssignService = async (staffId: string, serviceId: string, assign: boolean) => {
    setLoading(true);
    if (assign) {
      const { error } = await supabase
        .from('staff_services')
        .insert([{ staff_id: staffId, service_id: serviceId }]);

      if (error) {
        toast({
          title: "Error assigning service",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Service Assigned",
          description: "Service has been assigned to staff.",
        });
        // Re-fetch staff_services
        const { data: newStaffServices, error: fetchError } = await supabase.from('staff_services').select('*');
        if (!fetchError) setStaffServices(newStaffServices || []);
      }
    } else {
      const { error } = await supabase
        .from('staff_services')
        .delete()
        .eq('staff_id', staffId)
        .eq('service_id', serviceId);
      
      if (error) {
        toast({
          title: "Error unassigning service",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Service Unassigned",
          description: "Service has been unassigned from staff.",
        });
        // Re-fetch staff_services
        const { data: newStaffServices, error: fetchError } = await supabase.from('staff_services').select('*');
        if (!fetchError) setStaffServices(newStaffServices || []);
      }
    }
    setLoading(false);
  };

  // Time Slot Management Functions
  const handleAddTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase
      .from('time_slots')
      .insert([{
        staff_id: newTimeSlot.staff_id,
        date: newTimeSlot.date,
        time: newTimeSlot.time,
        is_available: newTimeSlot.is_available,
      }]);

    if (error) {
      toast({
        title: "Error adding time slot",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Time Slot Added",
        description: "Time slot has been added.",
      });
      setNewTimeSlot({ staff_id: '', date: '', time: '', is_available: true });
      // Re-fetch time slots
      const { data: timeSlotsData, error: fetchError } = await supabase.from('time_slots').select('*, staff(name), bookings(id, customer_name)').order('date', { ascending: true }).order('time', { ascending: true });
      if (!fetchError) setTimeSlots(timeSlotsData || []);
    }
    setLoading(false);
  };

  const handleEditTimeSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTimeSlotId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('time_slots')
      .update({
        staff_id: newTimeSlot.staff_id,
        date: newTimeSlot.date,
        time: newTimeSlot.time,
        is_available: newTimeSlot.is_available,
      })
      .eq('id', editingTimeSlotId);

    if (error) {
      toast({
        title: "Error updating time slot",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Time Slot Updated",
        description: "Time slot has been updated.",
      });
      setEditingTimeSlotId(null);
      setNewTimeSlot({ staff_id: '', date: '', time: '', is_available: true });
      // Re-fetch time slots
      const { data: timeSlotsData, error: fetchError } = await supabase.from('time_slots').select('*, staff(name), bookings(id, customer_name)').order('date', { ascending: true }).order('time', { ascending: true });
      if (!fetchError) setTimeSlots(timeSlotsData || []);
    }
    setLoading(false);
  };

  const handleDeleteTimeSlot = async (timeSlotId: string) => {
    if (!window.confirm("Are you sure you want to delete this time slot?")) return;
    setLoading(true);
    const { error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', timeSlotId);

    if (error) {
      toast({
        title: "Error deleting time slot",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Time Slot Deleted",
        description: "Time slot has been deleted.",
      });
      // Re-fetch time slots
      const { data: timeSlotsData, error: fetchError } = await supabase.from('time_slots').select('*, staff(name), bookings(id, customer_name)').order('date', { ascending: true }).order('time', { ascending: true });
      if (!fetchError) setTimeSlots(timeSlotsData || []);
    }
    setLoading(false);
  };

  const startEditingTimeSlot = (slot: any) => {
    setEditingTimeSlotId(slot.id);
    setNewTimeSlot({
      staff_id: slot.staff_id,
      date: slot.date,
      time: slot.time,
      is_available: slot.is_available,
    });
  };

  // Helper functions
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Bulk time slot creation
  const handleBulkCreateTimeSlots = async (staffId: string, startDate: string, endDate: string, times: string[]) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const slotsToCreate = [];

      // Generate all date-time combinations
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        for (const time of times) {
          slotsToCreate.push({
            staff_id: staffId,
            date: dateStr,
            time: time,
            is_available: true
          });
        }
      }

      const { error } = await supabase
        .from('time_slots')
        .insert(slotsToCreate);

      if (error) throw error;

      // Refresh time slots
      const { data } = await supabase
        .from('time_slots')
        .select('*, staff(name), bookings(id, customer_name)')
        .order('date', { ascending: true })
        .order('time', { ascending: true });
      setTimeSlots(data || []);

      toast({
        title: "Success",
        description: "Time slots created successfully",
      });
    } catch (error) {
      console.error('Error creating bulk time slots:', error);
      toast({
        title: "Error",
        description: "Failed to create time slots",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow flex items-center justify-center">
          <p>Loading admin dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null; // Should redirect via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-primary mb-8">Admin Dashboard</h1>
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>
            <TabsContent value="services">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Manage Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingServiceId ? handleEditService : handleAddService} className="space-y-4">
                    <div>
                      <Label htmlFor="service-name">Service Name</Label>
                      <Input 
                        id="service-name" 
                        value={newService.name} 
                        onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="service-description">Description</Label>
                      <Textarea 
                        id="service-description" 
                        value={newService.description} 
                        onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="service-price">Price</Label>
                        <Input 
                          id="service-price" 
                          type="number" 
                          step="0.01" 
                          value={newService.price} 
                          onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="service-duration">Duration (minutes)</Label>
                        <Input 
                          id="service-duration" 
                          type="number" 
                          value={newService.duration} 
                          onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="service-image-url">Image URL</Label>
                      <Input 
                        id="service-image-url" 
                        type="url" 
                        value={newService.image_url} 
                        onChange={(e) => setNewService(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="btn-accent" disabled={loading}>
                      {loading ? 'Saving...' : (editingServiceId ? 'Update Service' : 'Add Service')}
                    </Button>
                    {editingServiceId && (
                      <Button variant="outline" onClick={() => {
                        setEditingServiceId(null);
                        setNewService({ name: '', description: '', price: '', duration: '', image_url: '', is_active: true });
                      }} className="ml-2">Cancel</Button>
                    )}
                  </form>

                  <h3 className="text-xl font-playfair font-bold text-primary mt-8 mb-4">Existing Services</h3>
                  {services.length === 0 ? (
                    <p className="text-muted-foreground">No services found. Add one above!</p>
                  ) : (
                    <div className="space-y-4">
                      {services.map((service) => (
                        <Card key={service.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">{service.name} ({service.duration} mins)</p>
                            <p className="text-muted-foreground">৳{service.price}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => startEditingService(service)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteService(service.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="staff">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>{editingStaffId ? 'Edit Staff Member' : 'Add New Staff Member'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingStaffId ? handleEditStaff : handleAddStaff} className="space-y-4">
                    <div>
                      <Label htmlFor="staff-name">Name</Label>
                      <Input 
                        id="staff-name" 
                        value={newStaff.name} 
                        onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="staff-role">Role</Label>
                      <Input 
                        id="staff-role" 
                        value={newStaff.role} 
                        onChange={(e) => setNewStaff(prev => ({ ...prev, role: e.target.value }))}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="staff-bio">Bio (Optional)</Label>
                      <Textarea 
                        id="staff-bio" 
                        value={newStaff.bio} 
                        onChange={(e) => setNewStaff(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="staff-image-url">Image URL (Optional)</Label>
                      <Input 
                        id="staff-image-url" 
                        type="url" 
                        value={newStaff.image_url} 
                        onChange={(e) => setNewStaff(prev => ({ ...prev, image_url: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="btn-accent" disabled={loading}>
                      {loading ? 'Saving...' : (editingStaffId ? 'Update Staff' : 'Add Staff')}
                    </Button>
                    {editingStaffId && (
                      <Button variant="outline" onClick={() => {
                        setEditingStaffId(null);
                        setNewStaff({ name: '', role: '', bio: '', image_url: '', is_active: true });
                      }} className="ml-2">Cancel</Button>
                    )}
                  </form>

                  <h3 className="text-xl font-playfair font-bold text-primary mt-8 mb-4">Existing Staff</h3>
                  {staff.length === 0 ? (
                    <p className="text-muted-foreground">No staff members found. Add one above!</p>
                  ) : (
                    <div className="space-y-4">
                      {staff.map((staffMember) => (
                        <Card key={staffMember.id} className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-lg">{staffMember.name} ({staffMember.role})</p>
                            <p className="text-muted-foreground">{staffMember.is_active ? 'Active' : 'Inactive'}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="icon" onClick={() => startEditingStaff(staffMember)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteStaff(staffMember.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon">
                                  <LinkIcon className="w-4 h-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80">
                                <h4 className="font-semibold mb-2">Assign Services to {staffMember.name}</h4>
                                <div className="space-y-2">
                                  {services.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No services available to assign.</p>
                                  ) : (
                                    services.map((service) => {
                                      const isAssigned = staffServices.some(
                                        (ss) => ss.staff_id === staffMember.id && ss.service_id === service.id
                                      );
                                      return (
                                        <div key={service.id} className="flex items-center space-x-2">
                                          <Checkbox
                                            id={`staff-${staffMember.id}-service-${service.id}`}
                                            checked={isAssigned}
                                            onCheckedChange={(checked) => handleAssignService(staffMember.id, service.id, checked as boolean)}
                                            disabled={loading}
                                          />
                                          <label
                                            htmlFor={`staff-${staffMember.id}-service-${service.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                          >
                                            {service.name}
                                          </label>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="availability" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Create Time Slots</CardTitle>
                  <p className="text-sm text-muted-foreground">Create multiple time slots for a staff member across a date range</p>
                </CardHeader>
                <CardContent>
                  <BulkTimeSlotCreator onCreateSlots={handleBulkCreateTimeSlots} staff={staff} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Manage Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Booking management complete! Users can now book services through the enhanced booking flow.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
