import React, { useState } from 'react';
import'../assets/styling/Writer.scss';
import { 
  Container, 
  Row, 
  Col, 
  Navbar, 
  Nav, 
  Card, 
  Button, 
  ProgressBar, 
  Badge,
  Dropdown,
  ListGroup,
  Form,
  Modal
} from 'react-bootstrap';
import { 
  PersonCircle, 
  JournalText, 
  BarChart, 
  Wallet, 
  Gear, 
  Bell, 
  Search,
  PencilSquare,
  Book,
  Clock,
  GraphUp,
  People,
  Envelope,
  Calendar,
  FileEarmarkText,
  CheckCircle,
  XCircle,
  ThreeDotsVertical
} from 'react-bootstrap-icons';

const WriterDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  
  const stats = {
    totalPosts: 24,
    published: 18,
    drafts: 6,
    followers: 1245,
    earnings: 2845.50,
    readingTime: 156
  };
  
  const recentPosts = [
    { id: 1, title: 'The Future of AI in Creative Writing', status: 'published', views: 2450, date: '2023-05-15' },
    { id: 2, title: '10 Tips for Overcoming Writer\'s Block', status: 'published', views: 1890, date: '2023-05-10' },
    { id: 3, title: 'Mastering the Art of Short Stories', status: 'draft', views: 0, date: '2023-05-18' },
  ];
  
  const notifications = [
    { id: 1, text: 'New comment on "The Future of AI"', time: '2 hours ago', read: false },
    { id: 2, text: 'Your post was featured in Tech Writing Weekly', time: '1 day ago', read: true },
    { id: 3, text: 'New follower: Sarah Johnson', time: '2 days ago', read: true },
  ];

  return (
    <div className="dashboard-container">
      <Navbar bg="light" expand="lg" className="dashboard-navbar">
        <Container fluid>
          <Navbar.Brand href="#home" className="fw-bold text-primary">
            <JournalText size={28} className="me-2" />
            WritePublish
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <div className="search-box me-3">
              <Form.Control 
                type="search" 
                placeholder="Search posts, readers..." 
                className="rounded-pill ps-4"
              />
              <Search className="search-icon" />
            </div>
            <Nav className="align-items-center">
              <Nav.Link className="position-relative">
                <Bell size={20} />
                <Badge pill bg="danger" className="notification-badge">3</Badge>
              </Nav.Link>
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="dropdown-user" className="d-flex align-items-center">
                  <PersonCircle size={28} className="me-2" />
                  <span className="d-none d-md-inline">Jane Writer</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/profile">Profile</Dropdown.Item>
                  <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </div>
        </Container>
      </Navbar>
      
     
      
      {/* New Post Modal */}
      <Modal show={showNewPostModal} onHide={() => setShowNewPostModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter post title" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={8} placeholder="Write your content here..." />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select>
                    <option>Select a category</option>
                    <option>Technology</option>
                    <option>Creative Writing</option>
                    <option>Business</option>
                    <option>Personal Development</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control type="text" placeholder="Add tags separated by commas" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox" 
                label="Publish immediately" 
                id="publish-immediately" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewPostModal(false)}>
            Save as Draft
          </Button>
          <Button variant="primary" onClick={() => setShowNewPostModal(false)}>
            Publish Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WriterDashboard;