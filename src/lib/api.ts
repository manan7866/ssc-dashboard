// API utility functions for conference management

interface ConferenceData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
  maxSubmissions?: number;
}

interface UpdateConferenceData extends Partial<ConferenceData> {
  id: string;
}

// Conference API functions
export const getActiveConferences = async (): Promise<{ data: any[] }> => {
  try {
    const response = await fetch('/api/conferences/active');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from conferences API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching conferences:', error);
    throw error;
  }
};

export const getAdminConferences = async (): Promise<{ data: any[] }> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {};

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/conferences', {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from conferences API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching conferences:', error);
    throw error;
  }
};

export const createConference = async (data: ConferenceData): Promise<any> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/conferences', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from create conference API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error creating conference:', error);
    throw error;
  }
};

export const updateConference = async (id: string, data: ConferenceData): Promise<any> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`/api/conferences/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from update conference API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error updating conference:', error);
    throw error;
  }
};

export const deleteConference = async (id: string): Promise<any> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {};

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`/api/conferences/${id}`, {
      method: 'DELETE',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from delete conference API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error deleting conference:', error);
    throw error;
  }
};

// User submission functions
export const submitToConference = async (data: {
  conferenceId: string;
  title: string;
  abstract: string;
  authors?: string[];
  keywords?: string[];
  category: string;
}): Promise<any> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/conferences/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from submit to conference API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error submitting to conference:', error);
    throw error;
  }
};

export const getUserSubmissions = async (): Promise<{ data: any[] }> => {
  try {
    // Get the admin token from localStorage (if available) or NextAuth session
    let authToken = null;

    // First, try to get admin token from localStorage
    if (typeof window !== 'undefined') {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        authToken = adminToken;
      }
    }

    // If no admin token, try to get from NextAuth session
    if (!authToken) {
      try {
        const sessionResponse = await fetch('/api/auth/session');
        if (sessionResponse.ok) {
          const session = await sessionResponse.json();
          authToken = session?.accessToken;
        }
      } catch (sessionError) {
        console.warn('Could not retrieve session:', sessionError);
      }
    }

    const headers: Record<string, string> = {};

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/conferences/user/submissions', {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response from user submissions API:', text);
      throw new Error('Server error: Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    throw error;
  }
};