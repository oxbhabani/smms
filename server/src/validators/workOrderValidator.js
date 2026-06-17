const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const validateCreateWorkOrder = ({ title, description, machine, priority, assignedTo }) => {
  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push({ field: 'title', message: 'Title is required' });
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push({ field: 'description', message: 'Description is required' });
  }

  if (!machine || typeof machine !== 'string' || !machine.trim()) {
    errors.push({ field: 'machine', message: 'Machine is required' });
  }

  if (priority !== undefined && priority !== null && priority !== '') {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push({ field: 'priority', message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
  }

  if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
    if (typeof assignedTo !== 'string') {
      errors.push({ field: 'assignedTo', message: 'Assigned to must be a string' });
    }
  }

  return { errors };
};

const validateUpdateWorkOrder = ({ title, description, machine, priority, assignedTo }) => {
  const errors = [];

  if (title !== undefined && title !== null && title !== '') {
    if (typeof title !== 'string') {
      errors.push({ field: 'title', message: 'Title must be a string' });
    }
  }

  if (description !== undefined && description !== null && description !== '') {
    if (typeof description !== 'string') {
      errors.push({ field: 'description', message: 'Description must be a string' });
    }
  }

  if (machine !== undefined && machine !== null && machine !== '') {
    if (typeof machine !== 'string') {
      errors.push({ field: 'machine', message: 'Machine must be a string' });
    }
  }

  if (priority !== undefined && priority !== null && priority !== '') {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push({ field: 'priority', message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}` });
    }
  }

  if (assignedTo !== undefined && assignedTo !== null && assignedTo !== '') {
    if (typeof assignedTo !== 'string') {
      errors.push({ field: 'assignedTo', message: 'Assigned to must be a string' });
    }
  }

  return { errors };
};

module.exports = { validateCreateWorkOrder, validateUpdateWorkOrder };
