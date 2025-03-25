import React, { useContext, useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHome, faStar, faUsers, faUserEdit, faTachometerAlt, faChartBar, faTasks, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import AuthContext from '../utils/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({
    alertsCount: 0,
    ratingsCount: 0,
    tasksCount: 0,
    pendingTasksCount: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get latest alerts for household users
        const alertsRes = await axios.get('/api/alerts?limit=5');
        setAlerts(alertsRes.data.data);

        // Get tasks count for household members
        let tasksCount = 0;
        let pendingTasksCount = 0;
        
        if (user.role === 'household') {
          const tasksRes = await axios.get('/api/tasks');
          tasksCount = tasksRes.data.count;
          pendingTasksCount = tasksRes.data.data.filter(task => task.status !== 'completed').length;
        }
        
        // Get basic stats
        setStats({
          alertsCount: alertsRes.data.count,
          ratingsCount: 0, // This would come from a ratings endpoint
          tasksCount,
          pendingTasksCount
        });
        
        setLoading(false);
      } catch (err) {
        setError('Error loading dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1 className="welcome-title">Dashboard</h1>
        <p className="welcome-subtitle">Welcome back, {user?.name}! Here's an overview of your community activities.</p>
      </div>

      <Row>
        <Col md={8}>
          <Card className="alert-card mb-4">
            <Card.Header as="h5">
              <FontAwesomeIcon icon={faBell} className="me-2" />
              Latest Alerts
            </Card.Header>
            <Card.Body style={{padding: '1.25rem'}}>

              {alerts.length > 0 ? (
                <div>
                  {alerts.map((alert) => (
                    <Alert 
                      key={alert._id} 
                      variant={
                        alert.priority === 'high' || alert.priority === 'urgent' 
                          ? 'danger' 
                          : alert.priority === 'medium' 
                            ? 'warning' 
                            : 'info'
                      }
                      className={`alert-${alert.priority} mb-3`}
                    >
                      <Alert.Heading>{alert.title}</Alert.Heading>
                      <p>{alert.message}</p>
                      <div className="d-flex justify-content-between">
                        <small>
                          From: {alert.sender?.name || 'System'}
                        </small>
                        <small>
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </Alert>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No alerts to display</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Row>
            <Col sm={12}>
              <Card className="mb-4 dashboard-stat-card">
                <Card.Body>
                  <FontAwesomeIcon icon={faBell} className="icon" />
                  <h3 className="mb-0">{stats.alertsCount}</h3>
                  <p className="text-muted">Active Alerts</p>
                </Card.Body>
              </Card>
            </Col>
            
            {user?.role === 'household' && (
              <>
                <Col sm={12}>
                  <Card className="mb-4 dashboard-stat-card">
                    <Card.Body>
                      <FontAwesomeIcon icon={faStar} className="icon" />
                      <h3 className="mb-0">{stats.ratingsCount}</h3>
                      <p className="text-muted">My Ratings</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={12}>
                  <Card className="mb-4 dashboard-stat-card task-card">
                    <Card.Body>
                      <FontAwesomeIcon icon={faTasks} className="icon" />
                      <h3 className="mb-0">{stats.pendingTasksCount}</h3>
                      <p className="text-muted">Pending Tasks</p>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )}

            <Col sm={12}>
              <Card className="quick-actions-card mb-4">
                <Card.Body>
                  <h5>Quick Actions</h5>
                  <div>
                    <Link to="/profile" className="quick-action-link">
                      <FontAwesomeIcon icon={faUserEdit} className="icon" />
                      Update Profile
                    </Link>
                    
                    <Link to="/dashboard" className="quick-action-link">
                      <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                      Dashboard Overview
                    </Link>
                    
                    {user?.role === 'leader' && (
                      <>
                        <Link to="/alerts/create" className="quick-action-link">
                          <FontAwesomeIcon icon={faBell} className="icon" />
                          Create Alert
                        </Link>
                        
                        <Link to="/households" className="quick-action-link">
                          <FontAwesomeIcon icon={faHome} className="icon" />
                          Manage Households
                        </Link>
                        
                        <Link to="/ratings" className="quick-action-link">
                          <FontAwesomeIcon icon={faChartBar} className="icon" />
                          View Ratings
                        </Link>
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
