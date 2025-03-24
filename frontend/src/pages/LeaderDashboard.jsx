import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faStar, faUsers, faChartLine, faTasks, faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../utils/AuthContext';
import axios from 'axios';

const LeaderDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    householdsCount: 0,
    alertsCount: 0,
    ratingsCount: 0,
    tasksCount: 0,
    completedTasksCount: 0,
    averageZoneRating: 0
  });
  const [zones, setZones] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderData = async () => {
      try {
        setLoading(true);
        
        // Get leader's zones
        const zonesRes = await axios.get(`/api/leaders/${user.id}/zones`);
        setZones(zonesRes.data.data);
        
        // Fetch recent tasks assigned by this leader
        const tasksRes = await axios.get('/api/tasks?limit=5');
        setRecentTasks(tasksRes.data.data || []);
        
        // This would normally call multiple endpoints to get required data
        // Calculate tasks statistics
        const completedTasks = tasksRes.data.data ? tasksRes.data.data.filter(task => task.status === 'completed') : [];
        
        // For now, we'll set some placeholder data
        setStats({
          householdsCount: 12,
          alertsCount: 5,
          ratingsCount: 23,
          tasksCount: tasksRes.data.count || 8,
          completedTasksCount: completedTasks.length || 3,
          averageZoneRating: 4.2
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error loading leader dashboard data');
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchLeaderData();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center py-5">Loading leader dashboard...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>Leader Dashboard</h1>
        <div className="d-flex gap-2 flex-wrap">
          <Button as={Link} to="/tasks/create" variant="success">
            <FontAwesomeIcon icon={faTasks} className="me-2" />
            Assign Task
          </Button>
          <Button as={Link} to="/alerts/create" variant="primary">
            <FontAwesomeIcon icon={faBell} className="me-2" />
            Create Alert
          </Button>
        </div>
      </div>
      
      <p className="lead mb-4">
        Welcome, Nyumba Kumi Leader {user?.name}!
      </p>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faHome} className="icon" />
              <h3 className="mb-0">{stats.householdsCount}</h3>
              <p className="text-muted">Households</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faBell} className="icon" />
              <h3 className="mb-0">{stats.alertsCount}</h3>
              <p className="text-muted">Active Alerts</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faStar} className="icon" />
              <h3 className="mb-0">{stats.ratingsCount}</h3>
              <p className="text-muted">Total Ratings</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faTasks} className="icon" />
              <h3 className="mb-0">{stats.tasksCount}</h3>
              <p className="text-muted">Active Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faCheck} className="icon" />
              <h3 className="mb-0">{stats.completedTasksCount}</h3>
              <p className="text-muted">Completed Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="dashboard-stat-card">
            <Card.Body>
              <FontAwesomeIcon icon={faChartLine} className="icon" />
              <h3 className="mb-0">{stats.averageZoneRating.toFixed(1)}</h3>
              <p className="text-muted">Avg. Zone Rating</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Zones */}
      <h4 className="mb-3">Your Zones</h4>
      {zones.length > 0 ? (
        <Row>
          {zones.map((zone) => (
            <Col md={6} key={zone._id}>
              <Card className="mb-4">
                <Card.Header as="h5">{zone.name}</Card.Header>
                <Card.Body>
                  <p><strong>Location:</strong> {zone.location}</p>
                  <p><strong>Households:</strong> {zone.households?.length || 0}</p>
                  <p>{zone.description}</p>
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/households?zone=${zone._id}`} variant="outline-primary" size="sm">
                      <FontAwesomeIcon icon={faUsers} className="me-2" />
                      View Households
                    </Button>
                    <Button as={Link} to={`/alerts/create?zone=${zone._id}`} variant="outline-warning" size="sm">
                      <FontAwesomeIcon icon={faBell} className="me-2" />
                      Send Alert
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="mb-4">
          <Card.Body className="text-center py-5">
            <p className="mb-3">You don't have any assigned zones yet.</p>
            <p>Please contact an administrator to assign you to a Nyumba Kumi zone.</p>
          </Card.Body>
        </Card>
      )}

      {/* Quick Actions */}
      <h4 className="mb-3">Quick Actions</h4>
      <Row>
        <Col md={3}>
          <Card className="mb-4 text-center p-3">
            <FontAwesomeIcon icon={faUsers} size="2x" className="mb-3 text-primary" />
            <h5>Manage Households</h5>
            <p className="mb-3">View and rate households in your zone</p>
            <Button as={Link} to="/households" variant="outline-primary" size="sm">
              View Households
            </Button>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center p-3">
            <FontAwesomeIcon icon={faTasks} size="2x" className="mb-3 text-success" />
            <h5>Task Management</h5>
            <p className="mb-3">Assign and manage household tasks</p>
            <Button as={Link} to="/tasks" variant="outline-success" size="sm">
              Manage Tasks
            </Button>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center p-3">
            <FontAwesomeIcon icon={faBell} size="2x" className="mb-3 text-warning" />
            <h5>Manage Alerts</h5>
            <p className="mb-3">Create and view community alerts</p>
            <Button as={Link} to="/alerts" variant="outline-warning" size="sm">
              View Alerts
            </Button>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center p-3">
            <FontAwesomeIcon icon={faStar} size="2x" className="mb-3 text-success" />
            <h5>Ratings</h5>
            <p className="mb-3">View and manage household ratings</p>
            <Button as={Link} to="/ratings" variant="outline-success" size="sm">
              View Ratings
            </Button>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center p-3">
            <FontAwesomeIcon icon={faChartLine} size="2x" className="mb-3 text-info" />
            <h5>Reports</h5>
            <p className="mb-3">View zone performance reports</p>
            <Button variant="outline-info" size="sm" disabled>
              Coming Soon
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeaderDashboard;
