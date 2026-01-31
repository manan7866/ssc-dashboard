'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { submitToConference, getActiveConferences } from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

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

export default function ConferenceSubmissionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    conferenceId: '',
    title: '',
    abstract: '',
    authors: [''],
    keywords: [''],
    category: 'research'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conferencesResponse = await getActiveConferences();
        setConferences(conferencesResponse.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load data',
          variant: 'destructive'
        });
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleAuthorChange = (index: number, value: string) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData({...formData, authors: newAuthors});
  };

  const addAuthorField = () => {
    setFormData({...formData, authors: [...formData.authors, '']});
  };

  const removeAuthorField = (index: number) => {
    if (formData.authors.length > 1) {
      const newAuthors = formData.authors.filter((_, i) => i !== index);
      setFormData({...formData, authors: newAuthors});
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...formData.keywords];
    newKeywords[index] = value;
    setFormData({...formData, keywords: newKeywords});
  };

  const addKeywordField = () => {
    setFormData({...formData, keywords: [...formData.keywords, '']});
  };

  const removeKeywordField = (index: number) => {
    if (formData.keywords.length > 1) {
      const newKeywords = formData.keywords.filter((_, i) => i !== index);
      setFormData({...formData, keywords: newKeywords});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await submitToConference({
        conferenceId: formData.conferenceId,
        title: formData.title,
        abstract: formData.abstract,
        authors: formData.authors.filter(author => author.trim() !== ''),
        keywords: formData.keywords.filter(keyword => keyword.trim() !== ''),
        category: formData.category
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Submission created successfully!'
        });
        router.push('/user/conferences');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to submit to conference',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error occurred',
        variant: 'destructive'
      });
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Conference Submission</CardTitle>
          <CardDescription>
            Submit your paper or presentation to an upcoming conference.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={session?.user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={session?.user?.name || ''} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conferenceId">Conference</Label>
              <Select
                value={formData.conferenceId}
                onValueChange={(value) => setFormData({...formData, conferenceId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a conference" />
                </SelectTrigger>
                <SelectContent>
                  {conferences.map((conference) => (
                    <SelectItem key={conference.id} value={conference.id}>
                      {conference.name} ({new Date(conference.startDate).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter the title of your submission"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                placeholder="Enter the abstract of your submission"
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Authors</Label>
              <div className="space-y-2">
                {formData.authors.map((author, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={author}
                      onChange={(e) => handleAuthorChange(index, e.target.value)}
                      placeholder={`Author ${index + 1}`}
                    />
                    {formData.authors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAuthorField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAuthorField}
                >
                  Add Author
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <div className="space-y-2">
                {formData.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={keyword}
                      onChange={(e) => handleKeywordChange(index, e.target.value)}
                      placeholder={`Keyword ${index + 1}`}
                    />
                    {formData.keywords.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeywordField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addKeywordField}
                >
                  Add Keyword
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="research">Research Paper</SelectItem>
                  <SelectItem value="workshop">Workshop Proposal</SelectItem>
                  <SelectItem value="demo">Demo Session</SelectItem>
                  <SelectItem value="poster">Poster Presentation</SelectItem>
                  <SelectItem value="panel">Panel Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Submit to Conference</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}