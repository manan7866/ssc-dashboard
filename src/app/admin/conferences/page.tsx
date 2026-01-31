'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getAdminConferences, createConference, updateConference, deleteConference } from '@/lib/api';

interface Conference {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  maxSubmissions: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminConferencesPage() {
  const { toast } = useToast();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingConference, setEditingConference] = useState<Conference | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'ACTIVE',
    maxSubmissions: 100
  });

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await getAdminConferences();
      setConferences(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load conferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingConference) {
        // Update existing conference
        await updateConference(editingConference.id, formData);
        toast({
          title: 'Success',
          description: 'Conference updated successfully!'
        });
      } else {
        // Create new conference
        await createConference(formData);
        toast({
          title: 'Success',
          description: 'Conference created successfully!'
        });
      }

      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        status: 'ACTIVE',
        maxSubmissions: 100
      });
      setEditingConference(null);
      fetchConferences();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save conference',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (conference: Conference) => {
    setEditingConference(conference);
    setFormData({
      name: conference.name,
      description: conference.description,
      startDate: conference.startDate.split('T')[0],
      endDate: conference.endDate.split('T')[0],
      location: conference.location,
      status: conference.status,
      maxSubmissions: conference.maxSubmissions
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this conference?')) {
      try {
        await deleteConference(id);
        toast({
          title: 'Success',
          description: 'Conference deleted successfully!'
        });
        fetchConferences();
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete conference',
          variant: 'destructive'
        });
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingConference(null);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      status: 'ACTIVE',
      maxSubmissions: 100
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conferences</CardTitle>
            </CardHeader>
            <CardContent>
              {conferences.length === 0 ? (
                <p className="text-center text-gray-500">No conferences found</p>
              ) : (
                <div className="space-y-4">
                  {conferences.map((conference) => (
                    <Card key={conference.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{conference.name}</h3>
                          <p className="text-sm text-gray-500">{conference.description}</p>
                          <p className="text-sm mt-1">
                            {new Date(conference.startDate).toLocaleDateString()} - {new Date(conference.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{conference.location}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            conference.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            conference.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {conference.status}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(conference)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(conference.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                {editingConference ? 'Edit Conference' : 'Create Conference'}
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({...formData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSubmissions">Max Submissions</Label>
                  <Input
                    id="maxSubmissions"
                    type="number"
                    min="1"
                    value={formData.maxSubmissions}
                    onChange={(e) => setFormData({...formData, maxSubmissions: parseInt(e.target.value) || 100})}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {editingConference && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="ml-auto">
                  {editingConference ? 'Update Conference' : 'Create Conference'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}