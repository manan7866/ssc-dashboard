'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserSubmissions } from '@/lib/api';

interface Submission {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  category: string;
  status: string;
  conferenceId: string;
  conferenceName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserSubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await getUserSubmissions();
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Submissions</h1>
        <Button onClick={() => router.push('/user/conferences/submit')}>
          Submit to Conference
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">You have not made any submissions yet.</p>
            <Button
              className="mt-4"
              onClick={() => router.push('/user/conferences/submit')}
            >
              Submit to a Conference
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{submission.title}</CardTitle>
                  <Badge
                    variant={
                      submission.status === 'ACCEPTED' ? 'default' :
                      submission.status === 'REJECTED' ? 'destructive' :
                      submission.status === 'UNDER_REVIEW' ? 'secondary' :
                      'outline'
                    }
                  >
                    {submission.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Abstract</p>
                    <p className="mt-1">{submission.abstract.substring(0, 200)}{submission.abstract.length > 200 ? '...' : ''}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Authors</p>
                      <p className="mt-1">{submission.authors.join(', ')}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="mt-1 capitalize">{submission.category.replace('_', ' ')}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Keywords</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {submission.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</span>
                    <span>Updated: {new Date(submission.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}