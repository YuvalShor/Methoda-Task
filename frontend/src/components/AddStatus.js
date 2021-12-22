import React, { useState } from 'react';

const AddStatus = ({ addNewStatus }) => {
  const [newStatus, setNewStatus] = useState({
    name: '',
    labels: new Set(['final', 'orphan']),
  });

  const handleNewStatusFormChange = (e) => {
    setNewStatus({ ...newStatus, [e.target?.name]: e.target?.value });
  };

  const addStatus = (e) => {
    e.preventDefault();
    console.log('New Status');
    addNewStatus(newStatus, setNewStatus);
  };

  return (
    <div className='add-status'>
      <form>
        <input
          type='text'
          name='name'
          placeholder='New status name'
          onChange={handleNewStatusFormChange}
          value={newStatus.name}
        />
        <button className='button-add-status' onClick={addStatus}>
          Add new status
        </button>
      </form>
    </div>
  );
};

export default AddStatus;
