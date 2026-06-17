const VALID_MAINTENANCE_TYPES = ['Preventive', 'Predictive', 'Condition-Based', 'Corrective'];

const validateCreateSchedule = ({ machine, maintenanceType, frequencyDays, nextMaintenanceDate, notes }) => {
  const errors = [];

  if (!machine || typeof machine !== 'string' || !machine.trim()) {
    errors.push({ field: 'machine', message: 'Machine is required' });
  }

  if (!maintenanceType || typeof maintenanceType !== 'string' || !maintenanceType.trim()) {
    errors.push({ field: 'maintenanceType', message: 'Maintenance type is required' });
  } else if (!VALID_MAINTENANCE_TYPES.includes(maintenanceType)) {
    errors.push({ field: 'maintenanceType', message: `Maintenance type must be one of: ${VALID_MAINTENANCE_TYPES.join(', ')}` });
  }

  if (frequencyDays === undefined || frequencyDays === null) {
    errors.push({ field: 'frequencyDays', message: 'Frequency days is required' });
  } else if (typeof frequencyDays !== 'number' || !Number.isInteger(frequencyDays)) {
    errors.push({ field: 'frequencyDays', message: 'Frequency days must be a number' });
  } else if (frequencyDays < 1) {
    errors.push({ field: 'frequencyDays', message: 'Frequency days must be at least 1' });
  }

  if (!nextMaintenanceDate) {
    errors.push({ field: 'nextMaintenanceDate', message: 'Next maintenance date is required' });
  } else if (isNaN(Date.parse(nextMaintenanceDate))) {
    errors.push({ field: 'nextMaintenanceDate', message: 'Next maintenance date must be a valid date' });
  }

  if (notes !== undefined && notes !== null && notes !== '') {
    if (typeof notes !== 'string') {
      errors.push({ field: 'notes', message: 'Notes must be a string' });
    }
  }

  return { errors };
};

const validateUpdateSchedule = ({ machine, maintenanceType, frequencyDays, nextMaintenanceDate, notes }) => {
  const errors = [];

  if (machine !== undefined && machine !== null && machine !== '') {
    if (typeof machine !== 'string') {
      errors.push({ field: 'machine', message: 'Machine must be a string' });
    }
  }

  if (maintenanceType !== undefined && maintenanceType !== null && maintenanceType !== '') {
    if (!VALID_MAINTENANCE_TYPES.includes(maintenanceType)) {
      errors.push({ field: 'maintenanceType', message: `Maintenance type must be one of: ${VALID_MAINTENANCE_TYPES.join(', ')}` });
    }
  }

  if (frequencyDays !== undefined && frequencyDays !== null) {
    if (typeof frequencyDays !== 'number' || !Number.isInteger(frequencyDays)) {
      errors.push({ field: 'frequencyDays', message: 'Frequency days must be a number' });
    } else if (frequencyDays < 1) {
      errors.push({ field: 'frequencyDays', message: 'Frequency days must be at least 1' });
    }
  }

  if (nextMaintenanceDate !== undefined && nextMaintenanceDate !== null && nextMaintenanceDate !== '') {
    if (isNaN(Date.parse(nextMaintenanceDate))) {
      errors.push({ field: 'nextMaintenanceDate', message: 'Next maintenance date must be a valid date' });
    }
  }

  if (notes !== undefined && notes !== null && notes !== '') {
    if (typeof notes !== 'string') {
      errors.push({ field: 'notes', message: 'Notes must be a string' });
    }
  }

  return { errors };
};

module.exports = { validateCreateSchedule, validateUpdateSchedule };
