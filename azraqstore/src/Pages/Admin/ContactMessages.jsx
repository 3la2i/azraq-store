import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Send, Trash2, Search, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [replyEmail, setReplyEmail] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contactus/getContact');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      Swal.fire('Error', 'Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = async (id) => {
    try {
      await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Yes, delete it!'
      });

      await axios.delete(`http://localhost:5000/api/contactus/deleteContactById/${id}`);
      setMessages(messages.filter(message => message._id !== id));
      Swal.fire('Deleted!', 'Message has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting message:', error);
      Swal.fire('Error', 'Failed to delete message', 'error');
    }
  };

  const handleReply = async (message) => {
    setSelectedMessage(message);
    setReplyEmail(message.email);
    setReplyMessage(`Dear ${message.from},\n\nThank you for your message regarding "${message.subject}".\n\n`);
  };

  const handleSendReply = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/contactus/reply', {
        to: replyEmail,
        subject: `Re: ${selectedMessage.subject}`,
        message: replyMessage
      });

      console.log('Reply response:', response.data);
      Swal.fire('Success', 'Reply sent successfully', 'success');
      setSelectedMessage(null);
      setReplyEmail('');
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
      const errorMessage = error.response?.data?.details || error.response?.data?.error || 'Failed to send reply';
      Swal.fire({
        icon: 'error',
        title: 'Error Sending Reply',
        text: errorMessage,
        footer: 'Please check your email configuration'
      });
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
    return 0;
  });

  const filteredMessages = sortedMessages.filter(message => 
    message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['From', 'Email', 'Subject', 'Message', 'Date', 'Actions'].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(header.toLowerCase())}
                >
                  <div className="flex items-center">
                    {header}
                    {sortConfig.key === header.toLowerCase() && (
                      <ChevronDown className={`ml-1 h-4 w-4 ${sortConfig.direction === 'ascending' ? 'transform rotate-180' : ''}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <tr key={message._id}>
                <td className="px-6 py-4 whitespace-nowrap">{message.from}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{message.subject}</td>
                <td className="px-6 py-4">
                  <div className="max-w-xs overflow-hidden text-ellipsis">
                    {message.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(message.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleReply(message)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(message._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reply to Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">To:</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={replyEmail}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Message:</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows="6"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages; 