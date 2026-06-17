const VALID_STATUSES = ['Running', 'Maintenance', 'Breakdown', 'Offline'];

const validateCreateMachine = ({ machineId, name, department, manufacturer, installationDate, status }) => {
  const errors = [];

  if (!machineId || typeof machineId !== 'string' || !machineId.trim()) {
    errors.push({ field: 'machineId', message: 'Machine ID is required' });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!department || typeof department !== 'string' || !department.trim()) {
    errors.push({ field: 'department', message: 'Department is required' });
  }

  if (!manufacturer || typeof manufacturer !== 'string' || !manufacturer.trim()) {
    errors.push({ field: 'manufacturer', message: 'Manufacturer is required' });
  }

  if (!installationDate) {
    errors.push({ field: 'installationDate', message: 'Installation date is required' });
  } else if (isNaN(Date.parse(installationDate))) {
    errors.push({ field: 'installationDate', message: 'Installation date must be a valid date' });
  }

  if (status !== undefined && status !== null && status !== '') {
    if (!VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
  }

  return { errors };
};

const validateUpdateMachine = ({ machineId, name, department, manufacturer, installationDate, status }) => {
  const errors = [];

  if (machineId !== undefined && machineId !== null && machineId !== '') {
    if (typeof machineId !== 'string') {
      errors.push({ field: 'machineId', message: 'Machine ID must be a string' });
    }
  }

  if (name !== undefined && name !== null && name !== '') {
    if (typeof name !== 'string') {
      errors.push({ field: 'name', message: 'Name must be a string' });
    }
  }

  if (department !== undefined && department !== null && department !== '') {
    if (typeof department !== 'string') {
      errors.push({ field: 'department', message: 'Department must be a string' });
    }
  }

  if (manufacturer !== undefined && manufacturer !== null && manufacturer !== '') {
    if (typeof manufacturer !== 'string') {
      errors.push({ field: 'manufacturer', message: 'Manufacturer must be a string' });
    }
  }

  if (installationDate !== undefined && installationDate !== null && installationDate !== '') {
    if (isNaN(Date.parse(installationDate))) {
      errors.push({ field: 'installationDate', message: 'Installation date must be a valid date' });
    }
  }

  if (status !== undefined && status !== null && status !== '') {
    if (!VALID_STATUSES.includes(status)) {
      errors.push({ field: 'status', message: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
    }
  }

  return { errors };
};

module.exports = { validateCreateMachine, validateUpdateMachine };
