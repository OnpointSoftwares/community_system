import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faTag, faHome } from '@fortawesome/free-solid-svg-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AuthContext from '../utils/AuthContext';
import axios from 'axios';
import './TaskCreate.css';

const TaskCreate = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Validation schema using Yup
  const taskSchema = Yup.object().shape({
    title: Yup.string()
      .required('Task title is required')
      .max(100, 'Title cannot be more than 100 characters'),
    description: Yup.string()
      .required('Task description is required')
      .max(500, 'Description cannot be more than 500 characters'),
    assignedTo: Yup.string()
      .required('Please select a household'),
    dueDate: Yup.date()
      .required('Due date is required')
      .min(new Date(), 'Due date cannot be in the past'),
    priority: Yup.string()
      .required('Priority is required')
      .oneOf(['low', 'medium', 'high'], 'Invalid priority'),
    category: Yup.string()
      .required('Category is required')
      .oneOf(['cleanliness', 'security', 'community_participation', 'maintenance', 'other'], 'Invalid category')
  });

  // Initial form values
  const initialValues = {
    title: '',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'medium',
    category: 'other'
  };

  // Fetch households on component mount
  useEffect(() => {
    // Only leaders and admins can create tasks
    if (user?.role !== 'leader' && user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    const fetchHouseholds = async () => {
      try {
        setLoading(true);
        // If user is leader, fetch only their zone's households
        // If admin, fetch all households
        const response = await axios.get('/api/households');
        setHouseholds(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error loading households: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchHouseholds();
  }, [user, navigate]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setError(null);
      setLoading(true);

      // Format the due date to ISO string
      const formattedValues = {
        ...values,
        dueDate: new Date(values.dueDate).toISOString()
      };

      await axios.post('/api/tasks', formattedValues);
      
      setLoading(false);
      resetForm();
      navigate('/tasks');
    } catch (err) {
      setError('Error creating task: ' + (err.response?.data?.message || err.message));
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="task-create-container">
      <div className="page-header mb-4">
        <h1>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create New Task
        </h1>
        <p className="text-muted">Assign tasks to households in your community</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="task-form-card">
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={taskSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && errors.title}
                    placeholder="Enter task title"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.description && errors.description}
                    placeholder="Enter detailed task description"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faHome} className="me-2" />
                        Assign to Household
                      </Form.Label>
                      <Form.Select
                        name="assignedTo"
                        value={values.assignedTo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.assignedTo && errors.assignedTo}
                        disabled={loading || households.length === 0}
                      >
                        <option value="">Select a household</option>
                        {households.map(household => (
                          <option key={household._id} value={household._id}>
                            {household.name} ({household.address})
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.assignedTo}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Due Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="dueDate"
                        value={values.dueDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.dueDate && errors.dueDate}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.dueDate}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        name="priority"
                        value={values.priority}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.priority && errors.priority}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.priority}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        <FontAwesomeIcon icon={faTag} className="me-2" />
                        Category
                      </Form.Label>
                      <Form.Select
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.category && errors.category}
                      >
                        <option value="cleanliness">Cleanliness</option>
                        <option value="security">Security</option>
                        <option value="community_participation">Community Participation</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Other</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.category}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/tasks')}
                    disabled={isSubmitting || loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskCreate;
